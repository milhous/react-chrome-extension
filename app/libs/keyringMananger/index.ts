import EventEmitter from 'events';
import browser from 'webextension-polyfill';
import {KeyringController, keyringBuilderFactory} from '@metamask/eth-keyring-controller';
import {MetaMaskKeyring as QRHardwareKeyring} from '@keystonehq/metamask-airgapped-keyring';
import {KeyringType} from '@libs/constants/keyring';
import {Mutex} from 'await-semaphore';

/**
 * 声明 - 初始化 Keyring 管理器
 * @property {object} initState - 初始化状态
 * @property {object} encryptor - 加密器
 * @property {boolean} isManifestV3 - 是否是 manifest v3
 */
interface IKeyringManangerInitParams {
  initState?: any;
  encryptor?: any;
  isManifestV3?: boolean;
}

interface IKeyringMananger {
  init(params?: IKeyringManangerInitParams): void;
  createNewVaultAndKeychain(password: string): Promise<any>;
  createNewVaultAndRestore(password: string, encodedSeedPhrase: string): Promise<any>;
  verifyPassword(password: string): Promise<void>;
  verifySeedPhrase(): Promise<number[]>;
  verifyAccounts(createdAccounts: string[], seedPhrase: Buffer): Promise<void>;
  exportAccount(address: string, password: string): Promise<string>;
  submitPassword(password: string): Promise<object>;
  isUnlocked(): boolean;
  setLocked(): Promise<void>;
  getPrimaryKeyringMnemonic(): any;
  getPrimaryKey(): Promise<string>;
  getAccounts(): Promise<string[]>;
  getState(): any;
  getMemState(): any;
  isInitialized(): boolean;
  on(eventName: string | symbol, listener: (...args: any[]) => void);
  off(eventName: string | symbol, listener: () => void);
}

// Keyring 管理器
class KeyringMananger extends EventEmitter {
  private _isManifestV3 = true;
  private _createVaultMutex = new Mutex();
  private _keyringController: KeyringController;
  private _isInitialized = false;

  constructor() {
    super();
  }

  static instance;

  static getInstance() {
    if (!KeyringMananger.instance) {
      KeyringMananger.instance = new KeyringMananger();
    }

    return KeyringMananger.instance;
  }

  /**
   * 初始化 Keyring 管理器
   * @param {object} initState - 初始化状态
   * @param {object} encryptor - 加密器
   * @param {boolean} isManifestV3 - 是否是 manifest v3
   */
  public init({initState = {}, encryptor = undefined, isManifestV3 = true}: IKeyringManangerInitParams = {}) {
    const additionalKeyrings = [keyringBuilderFactory(QRHardwareKeyring)];

    this._isManifestV3 = isManifestV3;

    this._keyringController = new KeyringController({
      keyringBuilders: additionalKeyrings,
      initState,
      encryptor: encryptor,
      cacheEncryptionKey: this._isManifestV3,
    });

    this._keyringController.memStore.subscribe(state => this._onKeyringControllerUpdate(state));

    this._keyringController.on('lock', () => this._onLock());
    this._keyringController.on('unlock', () => this._onUnlock());
  }

  //=============================================================================
  // EXPOSED TO THE UI SUBSYSTEM
  //=============================================================================

  /**
   * The metamask-state of the various controllers, made available to the UI
   *
   * @returns {object} status
   */
  getState(): any {
    const state = this._keyringController.store.getState();

    return state;
  }

  getMemState(): any {
    const state = this._keyringController.memStore.getState();

    return state;
  }

  isInitialized(): boolean {
    let isInitialized = false;

    if (!!this._keyringController && !!this._keyringController.store) {
      const {vault} = this.getState();

      isInitialized = Boolean(vault);
    }

    return isInitialized;
  }

  /**
   * Locks MetaMask
   */
  async setLocked(): Promise<void> {
    // const [trezorKeyring] = this.keyringController.getKeyringsByType(KeyringType.trezor);
    // if (trezorKeyring) {
    //   trezorKeyring.dispose();
    // }

    // const [ledgerKeyring] = this.keyringController.getKeyringsByType(KeyringType.ledger);
    // ledgerKeyring?.destroy?.();

    await this.clearLoginArtifacts();

    await this._keyringController.setLocked();
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
   * Create a new Vault and restore an existent keyring.
   *
   * @param {string} password
   * @param {string} encodedSeedPhrase - The seed phrase, encoded as an array
   * of UTF-8 bytes.
   */
  async createNewVaultAndRestore(password: string, encodedSeedPhrase: string) {
    const releaseLock = await this._createVaultMutex.acquire();

    try {
      const seedPhraseAsBuffer = Buffer.from(encodedSeedPhrase);

      // create new vault
      const vault = await this._keyringController.createNewVaultAndRestore(password, seedPhraseAsBuffer);
      const [primaryKeyring] = this._keyringController.getKeyringsByType(KeyringType.hdKeyTree);

      if (!primaryKeyring) {
        throw new Error('MetamaskController - No HD Key Tree found');
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
   * Export Account
   * @param {string} address - 地址
   * @param {string} password - 密码
   */
  public async exportAccount(address: string, password: string): Promise<string> {
    await this.verifyPassword(password);

    return this._keyringController.exportAccount(address, password);
  }

  /**
   * Submits the user's password and attempts to unlock the vault.
   * Also synchronizes the preferencesController, to ensure its schema
   * is up to date with known accounts once the vault is decrypted.
   *
   * @param {string} password - The user's password
   * @returns {Promise<object>} The keyringController update.
   */
  async submitPassword(password: string): Promise<object> {
    await this._keyringController.submitPassword(password);

    // try {
    //   await this.blockTracker.checkForLatestBlock();
    // } catch (error) {
    //   log.error('Error while unlocking extension.', error);
    // }

    // This must be set as soon as possible to communicate to the
    // keyring's iframe and have the setting initialized properly
    // Optimistically called to not block MetaMask login due to
    // Ledger Keyring GitHub downtime
    // const transportPreference = this.preferencesController.getLedgerTransportPreference();

    // this.setLedgerTransportPreference(transportPreference);

    return this._keyringController.fullUpdate();
  }

  /**
   * @returns {boolean} Whether the extension is unlocked.
   */
  public isUnlocked(): boolean {
    return this._keyringController.memStore.getState().isUnlocked;
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
   * Gets Primary Key
   * @returns {string}
   */
  public async getPrimaryKeyringImported(): Promise<string> {
    const [keyring] = this._keyringController.getKeyringsByType(KeyringType.imported);

    if (!keyring) {
      throw new Error('Primary keyring is does not exist');
    }

    const pubAddressHexArr = await keyring.getAccounts();
    const privKeyHex = await keyring.exportAccount(pubAddressHexArr[0]);

    return privKeyHex;
  }

  /**
   * Get Accounts
   */
  public async getAccounts(): Promise<string[]> {
    const accounts = await this._keyringController.getAccounts();

    return accounts;
  }

  /**
   * Submits a user's encryption key to log the user in via login token
   */
  async submitEncryptionKey() {
    // try {
    //   const {loginToken, loginSalt} = await browser.storage.session.get(['loginToken', 'loginSalt']);
    //   if (loginToken && loginSalt) {
    //     const {vault} = this.keyringController.store.getState();
    //     const jsonVault = JSON.parse(vault);
    //     if (jsonVault.salt !== loginSalt) {
    //       console.warn('submitEncryptionKey: Stored salt and vault salt do not match');
    //       await this.clearLoginArtifacts();
    //       return;
    //     }
    //     await this._keyringController.submitEncryptionKey(loginToken, loginSalt);
    //   }
    // } catch (e) {
    //   // If somehow this login token doesn't work properly,
    //   // remove it and the user will get shown back to the unlock screen
    //   await this.clearLoginArtifacts();
    //   throw e;
    // }
  }

  async clearLoginArtifacts() {
    await browser.storage.session.remove(['loginToken', 'loginSalt']);
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
    const {vault} = this.getState();

    this._isInitialized = Boolean(vault);

    if (this._isManifestV3) {
      await browser.storage.session.set({loginToken, loginSalt});
    }

    this.emit('update');

    console.log('subscribe state', state);

    // if (!addresses.length) {
    //   return;
    // }

    // // Ensure preferences + identities controller know about all addresses
    // this.preferencesController.syncAddresses(addresses);
    // this.accountTracker.syncWithAddresses(addresses);
  }

  private _onLock() {
    // this.notifyAllConnections({
    //   method: NOTIFICATION_NAMES.unlockStateChanged,
    //   params: {
    //     isUnlocked: false,
    //   },
    // });

    // In the current implementation, this handler is triggered by a
    // KeyringController event. Other controllers subscribe to the 'lock'
    // event of the MetaMaskController itself.
    this.emit('lock');

    console.log('lock');
  }

  private _onUnlock() {
    // this.notifyAllConnections(async (origin) => {
    //   return {
    //     method: NOTIFICATION_NAMES.unlockStateChanged,
    //     params: {
    //       isUnlocked: true,
    //       accounts: await this.getPermittedAccounts(origin),
    //     },
    //   };
    // });

    // this.unMarkPasswordForgotten();

    // In the current implementation, this handler is triggered by a
    // KeyringController event. Other controllers subscribe to the 'unlock'
    // event of the MetaMaskController itself.
    this.emit('unlock');

    console.log('unlock');
  }
}

// 定义全局变量
const keyringMananger: IKeyringMananger = KeyringMananger.getInstance();

export default keyringMananger;
