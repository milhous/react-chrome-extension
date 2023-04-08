// import browser from 'webextension-polyfill';
// import PortStream from 'extension-port-stream';
// import endOfStream from 'end-of-stream';

// import './static/js/webextension-polyfill.js';
import './static/js/background.js';

// import {WORKER_KEEP_ALIVE_MESSAGE} from './libs/constants/app';

// browser.runtime.onConnect.addListener(async (...args) => {
//   // Queue up connection attempts here, waiting until after initialization
//   // await isInitialized;
//   // This is set in `setupController`, which is called as part of initialization
//   // connectRemote(...args);

//   console.log('browser.runtime.onConnect');
// });

// // On first install, open a new tab with MetaMask
// browser.runtime.onInstalled.addListener(({reason}) => {
//   if (reason === 'install') {
//     // addAppInstalledEvent();
//     // platform.openExtensionInBrowser();
//   }

//   console.log('browser.runtime.onInstalled', reason);
// });

// // 监听消息事件
// browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//   // 处理从扩展程序或页面发送的消息
//   console.log('browser.runtime.onMessage', message, sender, sendResponse);
// });

// // 监听通知点击事件
// browser.notifications.onClicked.addListener(function (notificationId) {
//   // 处理用户点击通知的操作
//   console.log('browser.notifications.onClicked', notificationId);
// });

// // 监听浏览器窗口关闭事件
// browser.windows.onRemoved.addListener(function (windowId) {
//   // 处理浏览器窗口关闭的操作
//   console.log('browser.windows.onRemoved', windowId);
// });

// let scriptsLoadInitiated = false;

// function importAllScripts() {
//   // Bail if we've already imported scripts
//   if (scriptsLoadInitiated) {
//     return;
//   }
//   scriptsLoadInitiated = true;
//   const files = ['webextension-polyfill', 'extension-port-stream'];

//   const startImportScriptsTime = Date.now();

//   // Import all required resources
//   // importScripts(...files);

//   for (let filename of files) {
//     importScripts(`./static/js/${filename}.js`);
//   }

//   const endImportScriptsTime = Date.now();

//   // for performance metrics/reference
//   console.log(`SCRIPTS IMPORT COMPLETE in Seconds: ${(endImportScriptsTime - startImportScriptsTime) / 1000}`);

//   console.log('browser', browser);
// }

self.addEventListener('install', event => {
  console.log(1111, globalThis.init);

  // importAllScripts();
  // event.waitUntil(
  //   (async () => {
  //     const response = await fetch('./static/js/browser-polyfill.min.js');
  //     const code = await response.text();
  //     eval(code);
  //   })(),
  // );
});
