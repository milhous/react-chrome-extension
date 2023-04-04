import {resolvePath} from './utils.js';
import {ModeType} from './types.js';

// 配置
class Store {
  // 版本号
  VERSION = '1.0.0';

  // 环境变量
  _env = '';
  // 构建模式
  _mode = '';
  // 是否是开发环境
  _isDev = false;
  // 是否需要分析
  _analyze = false;
  // browserslist
  _browserslist = ['>0.2%', 'not dead', 'not op_mini all'];
  // 公共路径
  _publicPath = 'auto';

  // 应用名称
  _appName = 'Milhous';
  // 应用端口号
  _appPort = 3001;
  // 应用源码地址 绝对路径
  _appSrc = '';
  // 应用源码生成目录 绝对路径
  _appDist = '';
  // 应用静态文件目录 绝对路径
  _appPublic = '';
  // 应用缓存目录 绝对路径
  _appCache = '';

  constructor() {}

  static instance;

  static getInstance() {
    if (!Store.instance) {
      Store.instance = new Store();
    }

    return Store.instance;
  }

  /**
   * 获取基础配置
   * @returns {IBasicConfig}
   */
  getBasicConfig() {
    return {
      name: this._appName,
      port: this._appPort,
      src: this._appSrc,
      dist: this._appDist,
      public: this._appPublic,
      cache: this._appCache,
    };
  }

  // 获取开发配置
  getDevConfig() {
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

  // 初始化
  init(env, mode, analyze) {
    this._setAppPath();

    this._setDevConfig(env, mode, analyze);
  }

  /**
   * 设置开发配置
   * @param {string} env 环境变量
   * @param {string} mode 构建模式
   * @param {boolean} analyze 生成分析报告
   */
  _setDevConfig(env, mode, analyze = false) {
    this._env = env;
    this._mode = mode;
    this._analyze = analyze;
    this._isDev = mode === ModeType.DEVELOPMENT;

    if (this._isDev) {
      this._browserslist = ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version'];

      this._publicPath = `//localhost:${this._appPort}/`;
    }
  }

  // 设置App路径
  _setAppPath() {
    this._appSrc = resolvePath('./app');
    this._appDist = resolvePath('./dist');
    this._appCache = resolvePath('./.cache/webpack');
    this._appPublic = resolvePath('./webpack/public');
  }
}

// 定义全局变量
const store = Store.getInstance();

export default store;
