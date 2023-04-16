## 参考 [metamask-extension](https://github.com/MetaMask/metamask-extension) 学习开发 Chrome Extension

[下载地址](https://github.com/milhous/react-chrome-extension/releases/tag/1.0.0)

[小白学 Extensions - 使用 React 创建 Chrome Extension](https://www.milhous.me/blog/c9500b18-2f22-542a-9c15-a97a049e3b7c/)

## Chrome Extension Roadmap

- ✅ Supported

- 🏗️ Work in Progress

#### 基础

| Feature | Supported |
| ------- | :-------: |
| 脚手架  |    ✅     |
| 热更新  |    ✅     |
| 多语言  |    🏗️     |

#### 功能

| Feature    | Supported |
| ---------- | :-------: |
| 初始加载   |    ✅     |
| 首次欢迎   |    🏗️     |
| 创建账户   |    ✅     |
| 删除账户   |    🏗️     |
| 私钥导入   |    🏗️     |
| 助记词导入 |    🏗️     |
| 注销       |    ✅     |
| 解锁       |    ✅     |
| 区块链交互 |    🏗️     |
| 侧栏菜单   |    🏗️     |

## Notes

1. Chrome 插件的最大高度 600 px

2. Chrome 插件的内存限制是 2GB

3. seed phrase buffer 转 seed words

```js
const serialized = await primaryKeyring.serialize();
const seedPhraseAsBuffer = Buffer.from(serialized.mnemonic);
const revealSeedWords = Buffer.from(seedPhraseAsBuffer).toString("utf8");
```

4. mv3 background 仅支持 Service Workers

在 manifest.json 中设置 "type": "module" 时，可以在 Service Worker 中使用 import 来引入 JavaScript 模块。但是没有设置 "type": "module"，则不能使用 import 语句，而必须使用 importScripts 方法来引入 JavaScript 文件。

```json
{
  ...
  "background": {
    "service_worker": "app.js",
    "type": "module"
  },
  ...
}
```

通过在 app.js 中引入打包后的 background.js 文件来使用其中的模块和功能。

```
import './static/js/background.js';
```

通过使用 globalThis，我们可以在 Service Worker 中访问全局对象和变量。globalThis 提供了一个标准化的方法来访问全局对象，不受环境的影响。在浏览器中，globalThis 指向 window 对象，在 Web Worker 中，globalThis 指向 self 对象。

```js
// example
globalThis.myGlobalVariable = "hello";
```

```js
// service workers
console.log(globalThis.myGlobalVariable); // logs "hello"
```

## Errors

#### 1. Refused to compile or instantiate WebAssembly module because neither 'wasm-eval' nor 'unsafe-eval' is an allowed source of script in the following Content Security Policy directive: "script-src 'self'"

manifest.json 新增 content_security_policy

```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'; frame-ancestors 'none';"
  }
}
```

#### 2. Buffer is not defined && Process is not defined

package.json 安装 buffer 和 process

```js
yarn add buffer process
```

webpack 新增 ProvidePlugin 配置

```js
{
  ...

  new webpack.ProvidePlugin({
    process: 'process/browser',
    Buffer: ['buffer', 'Buffer'],
  }),

  ...
}

```

#### 3. Service worker window.crypto is not defined

1. 下载 @metamask/browser-passworder 源码，并且移除源码中的 window。

2. 使用改造后的源码，替换 keyringMananger encryptor。

```js
// On first install, open a new tab with MetaMask
browser.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === "install" || reason === "update") {
    keyringMananger.init({
      encryptor: encryptorUtils,
    });
  }

  console.log("browser.runtime.onInstalled", reason);
});
```
