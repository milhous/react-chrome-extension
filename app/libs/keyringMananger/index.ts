import {KeyringController, keyringBuilderFactory} from '@metamask/eth-keyring-controller';
import {MetaMaskKeyring as QRHardwareKeyring} from '@keystonehq/metamask-airgapped-keyring';
import {KeyringType} from '@libs/constants/keyring';
import {Mutex} from 'await-semaphore';

interface IKeyringMananger {
  createNewVaultAndKeychain(password: string): Promise<any>;
  verifyPassword(password: string): Promise<void>;
  verifySeedPhrase(): Promise<number[]>;
  verifyAccounts(createdAccounts: string[], seedPhrase: Buffer): Promise<void>;
  getPrimaryKeyringMnemonic(): any;
}

// Keyring 管理器
class KeyringMananger {
  private _isManifestV3 = true;
  private _createVaultMutex = new Mutex();
  private _keyringController: KeyringController;

  constructor() {
    this._init();
  }

  static instance;

  static getInstance() {
    if (!KeyringMananger.instance) {
      KeyringMananger.instance = new KeyringMananger();
    }

    return KeyringMananger.instance;
  }

  private _init() {
    const additionalKeyrings = [keyringBuilderFactory(QRHardwareKeyring)];
    const encryptor = undefined;
    const initState = {};

    this._keyringController = new KeyringController({
      keyringBuilders: additionalKeyrings,
      initState: undefined, // initState?.KeyringController,
      encryptor: encryptor || undefined,
      cacheEncryptionKey: this._isManifestV3,
    });

    this._keyringController.memStore.subscribe(state => this._onKeyringControllerUpdate(state));

    this._keyringController.on('lock', () => this._onLock());
    this._keyringController.on('unlock', () => this._onUnlock());
  }

  //=============================================================================
  // VAULT / KEYRING RELATED METHODS
  //=============================================================================

  /**
   * Creates a new Vault and create a new keychain.
   *
   * A vault, or KeyringController, is a controller that contains
   * many different account strategies, currently called Keyrings.
   * Creating it new means wiping all previous keyrings.
   *
   * A keychain, or keyring, controls many accounts with a single backup and signing strategy.
   * For example, a mnemonic phrase can generate many accounts, and is a keyring.
   *
   * @param {string} password
   * @returns {object} vault
   */
  public async createNewVaultAndKeychain(password: string) {
    const releaseLock = await this._createVaultMutex.acquire();

    try {
      let vault;
      const accounts = await this._keyringController.getAccounts();
      if (accounts.length > 0) {
        vault = await this._keyringController.fullUpdate();
      } else {
        vault = await this._keyringController.createNewVaultAndKeychain(password);
        const addresses = await this._keyringController.getAccounts();
        // this.preferencesController.setAddresses(addresses);
        // this.selectFirstIdentity();
      }

      return vault;
    } finally {
      releaseLock();
    }
  }

  /**
   * Submits a user's password to check its validity.
   *
   * @param {string} password - The user's password
   */
  async verifyPassword(password: string): Promise<void> {
    await this._keyringController.verifyPassword(password);
  }

  /**
   * Verifies the validity of the current vault's seed phrase.
   *
   * Validity: seed phrase restores the accounts belonging to the current vault.
   *
   * Called when the first account is created and on unlocking the vault.
   *
   * @returns {Promise<number[]>} The seed phrase to be confirmed by the user,
   * encoded as an array of UTF-8 bytes.
   */
  public async verifySeedPhrase(): Promise<number[]> {
    const [primaryKeyring] = this._keyringController.getKeyringsByType(KeyringType.hdKeyTree);

    if (!primaryKeyring) {
      throw new Error('MetamaskController - No HD Key Tree found');
    }

    const serialized = await primaryKeyring.serialize();
    const seedPhraseAsBuffer = Buffer.from(serialized.mnemonic);

    const accounts = await primaryKeyring.getAccounts();

    if (accounts.length < 1) {
      throw new Error('MetamaskController - No accounts found');
    }
    try {
      await this.verifyAccounts(accounts, seedPhraseAsBuffer);

      return Array.from(seedPhraseAsBuffer.values());
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  }

  /**
   * Verifies if the seed words can restore the accounts.
   *
   * Key notes:
   * - The seed words can recreate the primary keyring and the accounts belonging to it.
   * - The created accounts in the primary keyring are always the same.
   * - The keyring always creates the accounts in the same sequence.
   *
   * @param {Array} createdAccounts - The accounts to restore
   * @param {Buffer} seedPhrase - The seed words to verify, encoded as a Buffer
   * @returns {Promise<void>}
   */
  public async verifyAccounts(createdAccounts: string[], seedPhrase: Buffer): Promise<void> {
    if (!createdAccounts || createdAccounts.length < 1) {
      throw new Error('No created accounts defined.');
    }

    const keyringController = new KeyringController({});
    const keyringBuilder = keyringController.getKeyringBuilderForType(KeyringType.hdKeyTree);
    const keyring = keyringBuilder();
    const opts = {
      mnemonic: seedPhrase,
      numberOfAccounts: createdAccounts.length,
    };

    await keyring.deserialize(opts);
    const restoredAccounts = await keyring.getAccounts();

    if (restoredAccounts.length !== createdAccounts.length) {
      // this should not happen...
      throw new Error('Wrong number of accounts');
    }

    for (let i = 0; i < restoredAccounts.length; i++) {
      if (restoredAccounts[i].toLowerCase() !== createdAccounts[i].toLowerCase()) {
        throw new Error(`Not identical accounts! Original: ${createdAccounts[i]}, Restored: ${restoredAccounts[i]}`);
      }
    }
  }

  /**
   * Gets the mnemonic of the user's primary keyring.
   */
  public getPrimaryKeyringMnemonic(): any {
    const [keyring] = this._keyringController.getKeyringsByType(KeyringType.hdKeyTree);

    if (!keyring.mnemonic) {
      throw new Error('Primary keyring mnemonic unavailable.');
    }

    return keyring.mnemonic;
  }

  /**
   * Handle a KeyringController update
   *
   * @param {object} state - the KC state
   * @returns {Promise<void>}
   * @private
   */
  private async _onKeyringControllerUpdate(state) {
    const {keyrings, encryptionKey: loginToken, encryptionSalt: loginSalt} = state;
    const addresses = keyrings.reduce((acc, {accounts}) => acc.concat(accounts), []);

    console.log('subscribe state', state, addresses);

    // if (this._isManifestV3) {
    //   await browser.storage.session.set({loginToken, loginSalt});
    // }

    // if (!addresses.length) {
    //   return;
    // }

    // // Ensure preferences + identities controller know about all addresses
    // this.preferencesController.syncAddresses(addresses);
    // this.accountTracker.syncWithAddresses(addresses);
  }

  private _onLock() {
    console.log('lock');
  }

  private _onUnlock() {
    console.log('unlock');
  }
}

// 定义全局变量
const keyringMananger: IKeyringMananger = KeyringMananger.getInstance();

export default keyringMananger;
