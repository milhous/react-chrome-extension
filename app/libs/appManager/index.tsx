import EventEmitter from 'events';

import keyringMananger from '@libs/keyringMananger';
import * as encryptorUtils from '@libs/browserPassworder';
import LocalStore from '@libs/localStore';
import {IAppState} from '@store/types';
import {initialState} from '@store/reducer';

/**
 * 声明 - App管理
 * @method init 初始化
 * @method connectRemote 连接远程
 * @method onboardingComplete 完成培训
 * @method createAccount 创建账户
 * @method createAccount 新增账户
 * @method removeAccount 移除账户
 * @method lock 锁定账户
 * @method unlock 解锁账户
 * @method getMnemonicWords 获取助记词
 * @method getPrivateKey 获取私钥
 * @method getState 获取状态
 * @method clearPrivateInfo 清理私有信息（私钥 & 助记词）
 */
interface IAppManager extends EventEmitter {
  init(env: string): Promise<void>;
  connectRemote(isConnected: boolean): void;
  onboardingComplete(): Promise<void>;
  createAccount(password: string): Promise<void>;
  addAccount(): Promise<void>;
  removeAccount(address: string): Promise<void>;
  lock(): Promise<void>;
  unlock(password: string): Promise<void>;
  getMnemonicWords(): Promise<void>;
  getPrivateKey(address: string, password: string): Promise<void>;
  getState(): IAppState;
  clearPrivateInfo(): void;
}

const localStore = new LocalStore();

// App管理
class AppManager extends EventEmitter {
  private _state: IAppState = initialState;

  constructor() {
    super();

    keyringMananger.on('update', this._onKeyringsUpdate);
  }

  static instance: IAppManager;

  static getInstance() {
    if (!AppManager.instance) {
      AppManager.instance = new AppManager();
    }

    return AppManager.instance;
  }

  /**
   * 初始化
   * @param {string} env 环境
   */
  async init(env: string): Promise<void> {
    const store = (await localStore.get()) as any;
    const initState = !!store && store.hasOwnProperty('keyrings') ? store.keyrings : {};

    console.log('initialize', store);

    keyringMananger.init({
      initState,
      encryptor: encryptorUtils,
    });

    const isInitialized = keyringMananger.isInitialized();
    const isOnboarding = !!store && store.hasOwnProperty('isOnboarding') ? store.isOnboarding : true;
    const accounts = await keyringMananger.getAccounts();

    this._updateState({
      isLaunch: true,
      isOnboarding,
      isInitialized,
      env,
      accounts,
    });
  }

  /**
   * 连接远程
   * @param {boolean} isConnected 是否连接
   */
  connectRemote(isConnected: boolean): void {
    this._updateState({
      isConnected,
    });
  }

  // 完成培训
  async onboardingComplete(): Promise<void> {
    await localStore.set({isOnboarding: false});

    this._updateState({
      isOnboarding: false,
    });
  }

  /**
   * 创建账户
   * @param {string} password 账户密码
   */
  async createAccount(password: string): Promise<void> {
    await keyringMananger.createNewVaultAndKeychain(password);

    const accounts = await keyringMananger.getAccounts();

    if (accounts.length === 0) {
      return;
    }

    const address = accounts[0];
    const isInitialized = keyringMananger.isInitialized();
    const isUnlocked = keyringMananger.isUnlocked();

    this._updateState({
      isInitialized,
      isUnlocked,
      address,
      accounts,
    });
  }

  // 新增账户
  async addAccount(): Promise<void> {
    // 解决删除账户后重新打开时，密码不存在的问题
    await keyringMananger.submitEncryptionKey();

    const accounts = await keyringMananger.addNewAccount();
    const address = accounts.length ? accounts[0] : '';

    this._updateState({
      address,
      accounts,
    });
  }

  /**
   * 移除账户
   * @param {string} address 地址
   */
  async removeAccount(address: string): Promise<void> {
    // 解决删除账户后重新打开时，密码不存在的问题
    await keyringMananger.submitEncryptionKey();

    await keyringMananger.removeAccount(address);

    const accounts = await keyringMananger.getAccounts();

    const isUnlocked = keyringMananger.isUnlocked();

    this._updateState({
      isUnlocked,
      address: '',
      accounts,
    });
  }

  // 锁定账户
  async lock(): Promise<void> {
    await keyringMananger.setLocked();

    const accounts = [];
    const address = '';
    const isUnlocked = keyringMananger.isUnlocked();

    this._updateState({
      isUnlocked,
      address,
      accounts,
    });
  }

  /**
   * 解锁账户
   * @param {string} password 账户密码
   */
  async unlock(password: string): Promise<void> {
    await keyringMananger.submitPassword(password);

    // 解决删除账户后重新打开时，密码不存在的问题
    await keyringMananger.submitEncryptionKey();

    const accounts = await keyringMananger.getAccounts();
    const address = accounts.length ? accounts[0] : '';
    const isUnlocked = keyringMananger.isUnlocked();

    this._updateState({
      isUnlocked,
      address,
      accounts,
    });
  }

  // 获取助记词
  async getMnemonicWords(): Promise<void> {
    const mnemonic = await keyringMananger.verifySeedPhrase();
    const mnemonicWords = Buffer.from(mnemonic).toString('utf8');

    this._updateState({
      mnemonicWords,
    });
  }

  /**
   * 获取私钥
   * @param {string} address 地址
   * @param {string} password 密码
   * @returns {string}
   */
  async getPrivateKey(address: string, password: string): Promise<void> {
    const privateKey = await keyringMananger.exportAccount(address, password);

    this._updateState({
      privateKey,
    });
  }

  /**
   * 获取状态
   * @returns {IAppState}
   */
  getState(): IAppState {
    return this._state;
  }

  // 清理私有信息（私钥 & 助记词）
  clearPrivateInfo(): void {
    this._updateState({
      privateKey: '',
      mnemonicWords: '',
    });
  }

  // 更新状态
  private _updateState(state: Partial<IAppState>) {
    const {mnemonicWords = '', privateKey = ''} = state;

    this._state = {
      ...this._state,
      ...state,
      mnemonicWords,
      privateKey,
    };

    this.emit('update');
  }

  private _onKeyringsUpdate() {
    if (localStore.isSupported) {
      const state = keyringMananger.getState();

      localStore.set({keyrings: state});
    }
  }
}

// 定义全局变量
const appManager: IAppManager = AppManager.getInstance();

export default appManager;
