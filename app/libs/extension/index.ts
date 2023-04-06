import browser from 'webextension-polyfill';
import {ENVIRONMENT_TYPE, PAGE_TYPE} from '../constants/app';
import {getEnvironmentType} from '../utils';

class Extension {
  constructor() {}

  static instance;

  static getInstance() {
    if (!Extension.instance) {
      Extension.instance = new Extension();
    }

    return Extension.instance;
  }

  reload() {
    browser.runtime.reload();
  }

  // 打开标签页
  async openTab(options) {
    const newTab = await browser.tabs.create(options);
    return newTab;
  }

  // 获取插件url
  getExtensionURL(route = null, queryString = null) {
    let extensionURL = browser.runtime.getURL(`${PAGE_TYPE.HOME}/index.html`);

    if (route) {
      extensionURL += `#${route}`;
    }

    if (queryString) {
      extensionURL += `?${queryString}`;
    }

    return extensionURL;
  }

  // 浏览器中打开插件
  openExtensionInBrowser(route = null, queryString = null, keepWindowOpen = false) {
    const extensionURL = this.getExtensionURL(route, queryString);

    this.openTab({url: extensionURL});

    if (getEnvironmentType() !== ENVIRONMENT_TYPE.BACKGROUND && !keepWindowOpen) {
      window.close();
    }
  }
}

// 定义全局变量
const extension = Extension.getInstance();

export default extension;
