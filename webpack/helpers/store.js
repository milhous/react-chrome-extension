import {resolveAppPath, existsAppPath, resolveCliPath} from './utils.js';
import {ModeType} from './types.js';

/**
 * 声明 - 配置
 * @property VERSION 版本号
 * @method getBasicConfig 获取基础配置
 * @method getDevConfig 获取开发配置
 * @method getModuleFederationConfig 获取 Module federation 配置
 * @method init 初始化
 */
interface IStore {
  VERSION: string;

  getBasicConfig(): IBasicConfig;
  getDevConfig(): IDevConfig;
  getModuleFederationConfig(): IModuleFederationConfig;

  init(config: any): Promise<void>;
}

/**
 * 声明 - 基础配置
 * @property name 应用名称
 * @property port 应用名称
 * @property src 应用源码地址
 * @property dist 应用源码生成目录
 * @property public 应用静态文件目录
 * @property cache 应用缓存目录
 */
export interface IBasicConfig {
  name: string;
  port: number;
  src: string;
  dist: string;
  public: string;
  cache: string;
}

/**
 * 声明 - 开发配置
 * @property version 版本
 * @property env 环境变量
 * @property mode 构建模式
 * @property analyze 生成分析报告
 * @property isDev 是否是开发环境
 * @property browserslist 目标浏览器版本范围
 * @property publicPath 公共路径
 */
export interface IDevConfig {
  version: string;
  env: string;
  mode: string;
  analyze: boolean;
  isDev: boolean;
  browserslist: string[];
  publicPath: string;
}

/**
 * 声明 - Module Federation 配置
 * @property remotes 引用的远程资源包的名称与模块名称
 * @property exposes 暴露的模块
 * @property shared 共享的模块
 */
export interface IModuleFederationConfig {
  remotes: IStoreMFRemotes;
  exposes: IStoreMFExposes;
  shared: IStoreMFShared;
}

// 声明 - Module Federation Shared
interface IStoreMFRemotes {
  [propName: string]: string;
}

// 声明 - Module Federation Exposes
interface IStoreMFExposes {
  [propName: string]: string;
}

// 声明 - Module Federation Shared
interface IStoreMFShared {
  [propName: string]: string;
}

// 配置
class Store implements IStore {
  // 版本号
  public VERSION = '1.0.0';

  // 环境变量
  private _env = '';
  // 构建模式
  private _mode = '';
  // 是否是开发环境
  private _isDev = false;
  // 是否需要分析
  private _analyze = false;
  // browserslist
  private _browserslist: string[] = ['last 1 version', '> 1%', 'maintained node versions', 'not dead'];
  // 公共路径
  private _publicPath = 'auto';

  // 应用名称
  private _appName = 'bitgame';
  // 应用端口号
  private _appPort = 3001;
  // 应用源码地址 绝对路径
  private _appSrc = '';
  // 应用源码生成目录 绝对路径
  private _appDist = '';
  // 应用静态文件目录 绝对路径
  private _appPublic = '';
  // 应用缓存目录 绝对路径
  private _appCache = '';
  // Module federation Remotes
  private _appRemotes: IStoreMFRemotes = {};
  // Module federation Exposes
  private _appExposes: IStoreMFExposes = {};
  // Module federation Shared
  private _appShared: IStoreMFShared = {};

  constructor() {}

  static instance: IStore;

  static getInstance(): IStore {
    if (!Store.instance) {
      Store.instance = new Store();
    }

    return Store.instance;
  }

  /**
   * 获取基础配置
   * @returns {IBasicConfig}
   */
  public getBasicConfig(): IBasicConfig {
    return {
      name: this._appName,
      port: this._appPort,
      src: this._appSrc,
      dist: this._appDist,
      public: this._appPublic,
      cache: this._appCache,
    };
  }

  /**
   * 获取开发配置
   * @returns {IDevConfig}
   */
  public getDevConfig(): IDevConfig {
    return {
      version: this.VERSION,
      env: this._env,
      mode: this._mode,
      analyze: this._analyze,
      isDev: this._isDev,
      browserslist: this._browserslist,
      publicPath: this._publicPath,
    };
  }

  /**
   * 获取 Module federation 配置
   * @returns {IModuleFederationConfig}
   */
  public getModuleFederationConfig(): IModuleFederationConfig {
    return {
      remotes: this._appRemotes,
      exposes: this._appExposes,
      shared: this._appShared,
    };
  }

  // 初始化
  public async init(args: any): Promise<void> {
    await this._getAppConfig();

    this._setAppPath();

    this._setDevConfig(args.env, args.mode, args.analyze);
  }

  /**
   * 设置开发配置
   * @param {string} env 环境变量
   * @param {string} mode 构建模式
   * @param {boolean} analyze 生成分析报告
   */
  private _setDevConfig(env: string, mode: string, analyze: boolean): void {
    this._env = env;
    this._mode = mode;
    this._analyze = analyze;
    this._isDev = mode === ModeType.DEVELOPMENT;

    if (this._isDev) {
      this._browserslist = [
        'last 1 chrome version',
        'last 1 firefox version',
        'last 1 safari version',
        'last 1 ie version',
      ];

      this._publicPath = `//www.local.devbitgame.com:${this._appPort}/`;
    }
  }

  // 获取App配置
  private async _getAppConfig(): Promise<void> {
    const appConfigPath = resolveAppPath('./app.config.js');
    const isExist = await existsAppPath('./app.config.js');

    if (isExist) {
      const module = await import(appConfigPath);
      const config = module.default();

      this._appName = config.name;
      this._appPort = config.port;

      this._appRemotes = config.remotes;
      this._appExposes = config.exposes;
      this._appShared = config.shared;
    }
  }

  // 设置App路径
  private _setAppPath(): void {
    this._appSrc = resolveAppPath('./src');
    this._appDist = resolveAppPath('./dist');
    this._appCache = resolveAppPath('./.cache/webpack');
    this._appPublic = resolveCliPath('./public');
  }
}

// 定义全局变量
const store: IStore = Store.getInstance();

export default store;
