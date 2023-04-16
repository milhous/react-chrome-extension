import browser, {Runtime} from 'webextension-polyfill';
import PortStream from 'extension-port-stream';
import endOfStream from 'end-of-stream';
import EventEmitter from 'events';

import {ENVIRONMENT_TYPE, MESSAGE_TYPE} from '@libs/constants/app';
import keyringMananger from '@libs/keyringMananger';
import * as encryptorUtils from '@libs/browserPassworder';
import LocalStore from '@libs/localStore';
import {IAppState} from '@store/types';
import {initialState, update} from '@store/reducer';

const event = new EventEmitter();
const localStore = new LocalStore();

let isClientOpen = false;
let popupIsOpen = false;
const notificationIsOpen = false;
const openMetamaskTabsIDs = {};

/**
 * APP 初始状态
 * @type {IAppState}
 */
let appState: IAppState = initialState;

const onStoreUpdate = () => {
  if (localStore.isSupported) {
    const state = keyringMananger.getState();

    localStore.set(state);
  }

  console.log('keyringMananger update');
};

// 初始化
async function initialize() {
  const store = (await localStore.get()) as any;
  const initState = !!store && store.hasOwnProperty('data') ? store.data : {};

  keyringMananger.init({
    initState,
    encryptor: encryptorUtils,
  });

  keyringMananger.on('update', onStoreUpdate);

  const isInitialized = keyringMananger.isInitialized();

  appState = {
    ...appState,
    isLaunch: true,
    isInitialized,
  };
}

/**
 * 创建账号
 * @param {string} password - 账户密码
 * @returns
 */
async function createAccount(password: string) {
  await keyringMananger.createNewVaultAndKeychain(password);

  const accounts = await keyringMananger.getAccounts();

  if (!Array.isArray(accounts) || accounts.length === 0) {
    return;
  }

  const address = accounts[0];
  const privateKey = await keyringMananger.exportAccount(address, password);
  const mnemonic = await keyringMananger.verifySeedPhrase();
  const mnemonicWords = Buffer.from(mnemonic).toString('utf8');
  const isInitialized = keyringMananger.isInitialized();
  const isUnlocked = keyringMananger.isUnlocked();

  return {
    isInitialized,
    isUnlocked,
    address,
    mnemonicWords,
    privateKey,
  };
}

// 锁住
async function lock() {
  await keyringMananger.setLocked();

  const isUnlocked = keyringMananger.isUnlocked();

  return {
    isUnlocked,
    address: '',
    mnemonicWords: '',
    privateKey: '',
  };
}

// 解锁
async function unlock(password: string) {
  await keyringMananger.submitPassword(password);

  const accounts = await keyringMananger.getAccounts();

  if (!Array.isArray(accounts) || accounts.length === 0) {
    return;
  }

  const address = accounts[0];
  const privateKey = await keyringMananger.exportAccount(address, password);
  const mnemonic = await keyringMananger.verifySeedPhrase();
  const mnemonicWords = Buffer.from(mnemonic).toString('utf8');
  const isUnlocked = keyringMananger.isUnlocked();

  return {
    isUnlocked,
    address,
    mnemonicWords,
    privateKey,
  };
}

/**
 * Connects a Port to the MetaMask controller via a multiplexed duplex stream.
 * This method identifies trusted (MetaMask) interfaces, and connects them differently from untrusted (web pages).
 *
 * @param {Port} remotePort - The port provided by a new context.
 */
function connectRemote(remotePort: Runtime.Port) {
  const processName = remotePort.name;
  const portStream = new PortStream(remotePort);

  isClientOpen = true;

  const onUpdate = () => {
    remotePort.postMessage({type: MESSAGE_TYPE.UPDATE_STORE_DATA, payload: appState});
  };

  event.on('update', onUpdate);

  remotePort.onMessage.addListener(async msg => {
    console.log('background receive msg', msg);

    if (msg.type === MESSAGE_TYPE.WORKER_KEEP_ALIVE_MESSAGE) {
      remotePort.postMessage({type: MESSAGE_TYPE.ACK_KEEP_ALIVE_MESSAGE});
    } else {
      switch (msg.type) {
        case MESSAGE_TYPE.CREATE_ACCOUNT: {
          const state = await createAccount(msg.payload.password);

          appState = {
            ...appState,
            ...state,
          };

          break;
        }
        case MESSAGE_TYPE.LOCK: {
          const state = await lock();

          appState = {
            ...appState,
            ...state,
          };

          break;
        }
        case MESSAGE_TYPE.UNLOCK: {
          const state = await unlock(msg.payload.password);

          appState = {
            ...appState,
            ...state,
          };

          break;
        }
      }
    }

    console.log(msg.type, appState);

    event.emit('update');
  });

  if (processName === ENVIRONMENT_TYPE[ENVIRONMENT_TYPE.POPUP]) {
    popupIsOpen = true;

    endOfStream(portStream, () => {
      popupIsOpen = false;
      isClientOpen = false;

      event.off('update', onUpdate);

      keyringMananger.off('update', onStoreUpdate);

      console.log(processName, 'is closed');
    });
  }

  if (processName === ENVIRONMENT_TYPE[ENVIRONMENT_TYPE.FULLSCREEN]) {
    const tabId = remotePort.sender.tab.id;
    openMetamaskTabsIDs[tabId] = true;

    endOfStream(portStream, () => {
      delete openMetamaskTabsIDs[tabId];
      isClientOpen = false;

      event.off('update', onUpdate);

      keyringMananger.off('update', onStoreUpdate);

      console.log(processName, 'is closed');
    });
  }

  onUpdate();
}

browser.runtime.onConnect.addListener(async remotePort => {
  // Queue up connection attempts here, waiting until after initialization
  // await isInitialized;
  // This is set in `setupController`, which is called as part of initialization
  await initialize();

  connectRemote(remotePort);

  console.log('browser.runtime.onConnect', remotePort.name);
});

// On first install, open a new tab with MetaMask
browser.runtime.onInstalled.addListener(({reason}) => {
  console.log('browser.runtime.onInstalled', reason, appState);
});

// 监听消息事件
browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // 处理从扩展程序或页面发送的消息
  console.log('browser.runtime.onMessage', message, sender, sendResponse);
});

// 监听通知点击事件
browser.notifications.onClicked.addListener(function (notificationId) {
  // 处理用户点击通知的操作
  console.log('browser.notifications.onClicked', notificationId);
});

// 监听浏览器窗口关闭事件
browser.windows.onRemoved.addListener(function (windowId) {
  // 处理浏览器窗口关闭的操作
  console.log('browser.windows.onRemoved', windowId);
});
