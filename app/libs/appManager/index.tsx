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
 * @method createAccount 创建账号
 * @method removeAccount 移除账号
 * @method lock 锁定账号
 * @method unlock 解锁账号
 * @method getState 获取状态
 */
interface IAppManager extends EventEmitter {
  init(env: string): Promise<void>;
  connectRemote(isConnected: boolean): void;
  onboardingComplete(): Promise<void>;
  createAccount(password: string): Promise<void>;
  removeAccount(address: string): Promise<void>;
  lock(): Promise<void>;
  unlock(password: string): Promise<void>;
  getState(): IAppState;
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
      accounts: ['11'],
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
   * 创建账号
   * @param {string} password 账号密码
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

  /**
   * 移除账号
   * @param {string} address 地址
   */
  async removeAccount(address: string): Promise<void> {
    await keyringMananger.removeAccount(address);

    const accounts = await keyringMananger.getAccounts();

    const isUnlocked = keyringMananger.isUnlocked();

    this._updateState({
      isUnlocked,
      address: '',
      accounts,
    });
  }

  // 锁定账号
  async lock(): Promise<void> {
    await keyringMananger.setLocked();

    const address = '';
    const isUnlocked = keyringMananger.isUnlocked();

    const accounts = await keyringMananger.getAccounts();

    this._updateState({
      isUnlocked,
      address,
      accounts,
    });
  }

  /**
   * 解锁账号
   * @param {string} password 账号密码
   */
  async unlock(password: string): Promise<void> {
    await keyringMananger.submitPassword(password);

    const accounts = await keyringMananger.getAccounts();

    if (accounts.length === 0) {
      return;
    }

    const address = accounts[0];
    const isUnlocked = keyringMananger.isUnlocked();

    this._updateState({
      isUnlocked,
      address,
      accounts,
    });
  }

  // 获取助记词
  async getMnemonicWords(): Promise<string> {
    const mnemonic = await keyringMananger.verifySeedPhrase();
    const mnemonicWords = Buffer.from(mnemonic).toString('utf8');

    return mnemonicWords;
  }

  /**
   * 获取私钥
   * @param {string} address 地址
   * @param {string} password 密码
   * @returns {string}
   */
  async getPrivateKey(address: string, password: string): Promise<string> {
    const privateKey = await keyringMananger.exportAccount(address, password);

    return privateKey;
  }

  /**
   * 获取状态
   * @returns {IAppState}
   */
  getState(): IAppState {
    return this._state;
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
