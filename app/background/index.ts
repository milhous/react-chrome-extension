import browser, {Runtime} from 'webextension-polyfill';
import PortStream from 'extension-port-stream';
import endOfStream from 'end-of-stream';

import {ENVIRONMENT_TYPE, MESSAGE_TYPE} from '@libs/constants/app';
import appManager from '@libs/appManager';

let isClientOpen = false;
let popupIsOpen = false;
const notificationIsOpen = false;
const openMetamaskTabsIDs = {};

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
    const appState = appManager.getState();

    remotePort.postMessage({type: MESSAGE_TYPE.UPDATE_STORE_DATA, payload: appState});
  };

  appManager.on('update', onUpdate);

  remotePort.onMessage.addListener(async msg => {
    console.log('background receive msg', msg);

    switch (msg.type) {
      case MESSAGE_TYPE.WORKER_KEEP_ALIVE_MESSAGE:
        appManager.connectRemote(true);

        break;

      case MESSAGE_TYPE.ONBOARDING_COMPLETE: {
        await appManager.onboardingComplete();

        break;
      }
      case MESSAGE_TYPE.CREATE_ACCOUNT: {
        await appManager.createAccount(msg.payload.password);

        break;
      }
      case MESSAGE_TYPE.REMOVE_ACCOUNT: {
        await appManager.removeAccount(msg.payload.address);

        break;
      }
      case MESSAGE_TYPE.LOCK: {
        await appManager.lock();

        break;
      }
      case MESSAGE_TYPE.UNLOCK: {
        await appManager.unlock(msg.payload.password);

        break;
      }
    }
  });

  if (processName === ENVIRONMENT_TYPE[ENVIRONMENT_TYPE.POPUP]) {
    popupIsOpen = true;

    endOfStream(portStream, () => {
      popupIsOpen = false;
      isClientOpen = false;

      appManager.off('update', onUpdate);

      console.log(processName, 'is closed');
    });
  }

  if (processName === ENVIRONMENT_TYPE[ENVIRONMENT_TYPE.FULLSCREEN]) {
    const tabId = remotePort.sender.tab.id;
    openMetamaskTabsIDs[tabId] = true;

    endOfStream(portStream, () => {
      delete openMetamaskTabsIDs[tabId];
      isClientOpen = false;

      appManager.off('update', onUpdate);

      console.log(processName, 'is closed');
    });
  }
}

browser.runtime.onConnect.addListener(async remotePort => {
  // Queue up connection attempts here, waiting until after initialization
  // await isInitialized;
  // This is set in `setupController`, which is called as part of initialization
  await appManager.init(remotePort.name);

  connectRemote(remotePort);

  console.log('browser.runtime.onConnect', remotePort.name);
});

// On first install, open a new tab with MetaMask
browser.runtime.onInstalled.addListener(({reason}) => {
  console.log('browser.runtime.onInstalled', reason);
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
