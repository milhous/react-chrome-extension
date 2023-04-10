## Metamask 私钥相关

#### 主要 Package

- webextension-polyfill

- @metamask/eth-keyring-controller

- @keystonehq/metamask-airgapped-keyring

- obj-multiplex

- pump

#### 存储流程

1. background.js localstore 传递给 metamask-controller.js

```js
const localStore = inTest ? new ReadOnlyNetworkStore() : new LocalStore();

export function setupController(initState, initLangCode, overrides) {
  //
  // MetaMask Controller
  //

  controller = new MetamaskController({
    ...
    localStore,
    ...
  });
}

```

2. metamask-controller.js localStore 赋值给 this.localStoreApiWrapper

```js
// instance of a class that wraps the extension's storage local API.
this.localStoreApiWrapper = opts.localStore;
```

3. metamask-controller.js setupControllerConnection 定义数据监听

```js
// set up postStream transport
outStream.on(
  "data",
  createMetaRPCHandler(api, outStream, this.store, this.localStoreApiWrapper)
);
```

4. createMetaRPCHandler.js 中，每当执行控制器方法的时候，如果方法名不是 getState，就会获取控制器状态，并保存到 localStore 中。

```js
try {
  result = await api[data.method](...data.params);
} catch (err) {
  error = err;
} finally {
  if (isManifestV3 && store && data.method !== "getState") {
    localStoreApiWrapper.set(store.getState());
  }
}
```

#### 初始流程

在 background.js 中每次打开插件建立通信连接时执行 initialize，从 browser.storage.local 中获取初始化数据并同步保存，初始化相关控制器，

```js
export async function loadStateFromPersistence() {
  // migrations
  const migrator = new Migrator({ migrations });
  migrator.on("error", console.warn);

  // read from disk
  // first from preferred, async API:
  versionedData =
    (await localStore.get()) || migrator.generateInitialState(firstTimeState);

  // check if somehow state is empty
  // this should never happen but new error reporting suggests that it has
  // for a small number of users
  // https://github.com/metamask/metamask-extension/issues/3919
  if (versionedData && !versionedData.data) {
    // unable to recover, clear state
    versionedData = migrator.generateInitialState(firstTimeState);
    sentry.captureMessage("MetaMask - Empty vault found - unable to recover");
  }

  // report migration errors to sentry
  migrator.on("error", (err) => {
    // get vault structure without secrets
    const vaultStructure = getObjStructure(versionedData);
    sentry.captureException(err, {
      // "extra" key is required by Sentry
      extra: { vaultStructure },
    });
  });

  // migrate data
  versionedData = await migrator.migrateData(versionedData);
  if (!versionedData) {
    throw new Error("MetaMask - migrator returned undefined");
  }
  // this initializes the meta/version data as a class variable to be used for future writes
  localStore.setMetadata(versionedData.meta);

  // write to disk
  localStore.set(versionedData.data);

  // return just the data
  return versionedData.data;
}
```

#### 创建流程

1. 在 metamask-controller.js 中执行 createNewVaultAndKeychain，完成后触发 \_onKeyringControllerUpdate，保存 loginToken 和 loginSalt。

2. 利用临时保存的 loginToken 和 loginSalt，可以执行 submitEncryptionKey 实现登录

metamask-controller.js 代码片段：

```js
async _onKeyringControllerUpdate(state) {
  const {
    keyrings,
    encryptionKey: loginToken,
    encryptionSalt: loginSalt,
  } = state;
  const addresses = keyrings.reduce(
    (acc, { accounts }) => acc.concat(accounts),
    [],
  );

  if (isManifestV3) {
    await browser.storage.session.set({ loginToken, loginSalt });
  }

  if (!addresses.length) {
    return;
  }

  // Ensure preferences + identities controller know about all addresses
  this.preferencesController.syncAddresses(addresses);
  this.accountTracker.syncWithAddresses(addresses);
}

async submitEncryptionKey() {
  try {
    const { loginToken, loginSalt } = await browser.storage.session.get([
      'loginToken',
      'loginSalt',
    ]);
    if (loginToken && loginSalt) {
      const { vault } = this.keyringController.store.getState();

      const jsonVault = JSON.parse(vault);

      if (jsonVault.salt !== loginSalt) {
        console.warn(
          'submitEncryptionKey: Stored salt and vault salt do not match',
        );
        await this.clearLoginArtifacts();
        return;
      }

      await this.keyringController.submitEncryptionKey(loginToken, loginSalt);
    }
  } catch (e) {
    // If somehow this login token doesn't work properly,
    // remove it and the user will get shown back to the unlock screen
    await this.clearLoginArtifacts();
    throw e;
  }
}
```

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

## Packages

#### PortStream

PortStream 是一个第三方库，它的作用是将 Chrome 扩展程序 API 中的 Port 对象转换为 Node.js 流（stream）的形式，从而方便在 background.js 中对数据流进行处理。

具体来说，PortStream 库提供了一个函数 createPortStream(port)，用于将 Port 对象转换为 Node.js 流。这个流可以用于在 background.js 中接收和发送数据，同时也可以在其他 Node.js 模块中使用标准的流 API 进行数据处理。

使用 PortStream 库可以让扩展程序的开发更加灵活和方便。例如，可以使用标准的流 API 对数据进行处理，而无需编写大量的代码来处理消息传递。

下面是一个简单的示例，展示如何在 background.js 中使用 PortStream 库将 Port 对象转换为流并进行数据处理：

```js
const port = chrome.runtime.connect({ name: "popup" });

const portStream = createPortStream(port);

portStream.on("data", function (data) {
  console.log("Received data:", data);
});

portStream.write({ greeting: "hello" });
```

在上面的示例中，首先使用 chrome.runtime.connect()方法建立一个连接，并将返回的 Port 对象传递给 createPortStream()函数。这个函数会返回一个 Readable 流，用于接收从连接另一端发送过来的数据。

接下来，使用标准的流 API 监听 data 事件，并在事件回调函数中处理接收到的数据。同时，使用 write()方法将数据发送给连接另一端。

需要注意的是，PortStream 库需要使用 Node.js 运行时环境，因此无法在普通的网页中使用。它只能用于扩展程序中，或者用于将扩展程序的数据流与 Node.js 模块进行集成。

#### end-of-stream

end-of-stream 是一个第三方 Node.js 库，它提供了一组方法用于检测和处理数据流的结束（end）事件。这个库主要用于处理 Node.js 中的数据流，但也可以在扩展程序的 background.js 中使用。

在数据流中，end 事件通常表示已经读取完所有的数据，或者发送完所有的数据，因此可以在这个事件发生时进行一些清理工作，例如关闭文件、数据库连接等。在 Node.js 中，数据流通常是异步的，因此需要使用回调函数来处理 end 事件。

end-of-stream 库提供了几个方便的方法来检测和处理数据流的结束事件。下面是一些常用的方法：

- eos(stream, callback)：在数据流结束时调用回调函数。

- eos.stream(stream)：返回一个可读流，当数据流结束时将自动触发 end 事件。

- eos.writable(writable, callback)：在可写流结束时调用回调函数。

- eos.duplex(stream, callback)：在双向数据流（duplex stream）结束时调用回调函数。

下面是一个简单的示例，展示如何在 background.js 中使用 end-of-stream 库检测数据流的结束事件：

```js
// background.js

const eos = require("end-of-stream");

// 创建连接
const port = chrome.runtime.connect({ name: "my-port" });

// 处理连接请求
chrome.runtime.onConnect.addListener((port) => {
  console.log("Connected to port:", port.name);

  // 监听端口接收到的消息
  port.onMessage.addListener((message) => {
    console.log("Received message:", message);
  });

  // 监听端口关闭事件
  eos(port, (err) => {
    if (err) {
      console.error("Error closing port:", err);
    } else {
      console.log("Port closed successfully.");
    }
  });
});
```

在上面的示例中，我们首先使用 require('end-of-stream')语句加载 end-of-stream 库。然后，在连接建立成功后，我们使用 eos()方法来监听端口的结束事件，并在事件发生时调用回调函数。在回调函数中，我们可以执行一些清理工作或输出一些日志信息。

需要注意的是，end-of-stream 库只能用于 Node.js 运行时环境中，因此无法在普通的网页中使用。它只能用于扩展程序中，或者用于将扩展程序的数据流与 Node.js 模块进行集成。

#### zxcvbn

是一个受密码破解器启发的密码强度估算器。通过模式匹配和保守估计，它根据美国人口普查数据中的 30k 个常见密码、常见名字和姓氏、维基百科上流行的英语单词以及美国电视和电影等其他常见模式来识别并加权考虑日期、重复（aaa）、序列（abcd）、键盘模式（qwertyuiop）和 l33t speak 等。

#### webextension-polyfill

webextension-polyfill 是一个 JavaScript 库，可以在浏览器中使用 WebExtensions API。WebExtensions API 是一组在多个浏览器中使用的浏览器扩展开发 API。webextension-polyfill 的作用是使开发人员可以在使用 WebExtensions API 的同时，不必担心它们在不同浏览器中的差异。

通过在代码中使用 webextension-polyfill，可以在不同的浏览器（如 Chrome，Firefox 和 Opera）中使用相同的代码，同时仍然可以访问浏览器特定的功能。webextension-polyfill 实际上是一个将 WebExtensions API 转换为浏览器原生 API 的适配器，因此可以让开发人员使用一个 API 来编写跨浏览器的扩展程序。

#### @metamask/eth-keyring-controller

@metamask/eth-keyring-controller 是一个 JavaScript 库，用于管理以太坊私钥。它是 MetaMask 中的一个核心组件。

提供了以下功能：

1. 私钥管理：可以创建、导入和删除以太坊私钥。

2. 派生路径管理：可以配置派生路径，以便在使用 HD 钱包时生成多个地址。

3. 签名管理：可以对交易进行签名，并支持多种签名算法和格式。

4. 安全管理：可以使用密码保护私钥，并提供密码管理和错误处理功能。

5. 状态管理：可以检查和管理与私钥相关的状态，如账户余额和交易历史。

使用 @metamask/eth-keyring-controller，您可以在自己的应用程序中实现类似于 MetaMask 的钱包功能，从而为用户提供管理以太坊私钥的功能。

#### @metamask/base-controlle

@metamask/base-controller 是 MetaMask 钱包中的一个 JavaScript 模块，用于处理应用程序的主要业务逻辑和与以太坊网络的交互。

该模块提供了一个抽象的基础控制器类 BaseController，其他的控制器都继承自这个基类。BaseController 提供了一些通用的方法和属性，如 networkStore 和 preferencesController 等，这些方法和属性在其他控制器中都可以被访问和使用。

主要负责以下几个方面的工作：

1. 管理以太坊网络的连接状态和版本信息，例如 networkStore 对象就提供了一个 API，用于获取当前网络的信息和切换网络。

2. 处理用户的账户信息和交易，例如 keyringController 对象就提供了一个 API，用于创建和管理账户和处理交易。

3. 提供了一些公共的工具方法和事件处理机制，例如 BaseController 类中就提供了一些事件和钩子函数，用于处理一些共性逻辑，如初始化、销毁等。

总之，@metamask/base-controller 模块是 MetaMask 钱包中的一个核心模块，提供了基础的控制器类和公共方法，方便其他模块进行开发和扩展。

#### @keystonehq/metamask-airgapped-keyring

@keystonehq/metamask-airgapped-keyring 是一个 MetaMask 钱包插件，其作用是提供一种在空气隔离的设备上生成和管理以太坊私钥的方式，以增强安全性。

使用 @keystonehq/metamask-airgapped-keyring，用户可以使用离线设备（例如未连接到网络的计算机、平板电脑或智能手机）生成以太坊私钥。然后，用户可以将这些私钥导入到在线设备上的 MetaMask 钱包中，以便在以太坊网络上进行交易或其他操作。

@keystonehq/metamask-airgapped-keyring 的主要优点是提供更高的安全性，因为生成和管理私钥的离线设备不易受到网络攻击或恶意软件的攻击。此外，该插件还提供了方便的用户界面，使用户可以轻松地生成、导出和管理私钥。

#### await-semaphore

await-semaphore 是一个 JavaScript 库，它提供了一种机制来控制并发异步代码的执行。具体来说，await-semaphore 实现了一种信号量机制，使得我们可以限制同时执行的异步操作的数量。

当我们需要执行多个异步操作，并且这些操作之间有一定的依赖关系或者需要保证某些操作的执行顺序时，await-semaphore 就可以发挥作用了。通过限制同时执行的异步操作的数量，await-semaphore 可以帮助我们避免并发冲突和资源竞争等问题，从而提高代码的可靠性和性能。

使用 await-semaphore 可以很方便地实现一些常见的并发控制模式，比如限制同时执行的 HTTP 请求的数量、限制同时执行的数据库查询的数量、限制同时执行的文件读写操作的数量等等。

#### obj-multiplex

obj-multiplex 是一个 Node.js 模块，提供了将多个 Node.js 可读流（Readable stream）和可写流（Writable stream）进行复用的能力。它可以将多个数据流（例如通过网络传输的数据）进行多路复用，并且保证各自之间互不干扰，这对于并行传输多个数据流非常有用。obj-multiplex 的实现依赖于 Node.js 的 stream.Duplex 类，因此它也支持双向通信。在实际应用中，obj-multiplex 主要用于多个模块之间的通信，例如在 Electron 应用程序中，obj-multiplex 可以用于主进程与渲染进程之间的通信。

#### pump

pump 是一个 Node.js 模块，它提供了一个方便的方法将两个数据流串联在一起，同时在这两个数据流之间正确地处理错误和关闭事件。

具体来说，pump 可以将一个可读流和一个可写流连接在一起，将可读流的数据传输到可写流中。它还会自动处理错误事件和关闭事件，确保在任何时候都不会出现内存泄漏或错误的行为。

使用 pump 可以简化数据流处理的代码，避免手动处理各种事件和错误。

## Knowledge

#### BIP39、BIP44、BIP32 协议

- BIP39：助记词生成协议

  BIP39 是一种用于生成助记词的协议。助记词是一串由单词组成的短语，通常由 12、15、18、21 或 24 个单词组成。通过助记词，用户可以方便地备份和恢复他们的加密货币钱包。BIP39 规定了一组单词列表，用于生成助记词，并规定了一种从助记词派生种子值的算法，该种子值可用于生成密钥对和地址。

- BIP44：地址和密钥派生协议

  BIP44 是一种用于地址和密钥派生的协议。它基于 BIP32 的分层确定性钱包（HD Wallet）协议，规定了一组派生路径，用于从根密钥派生一组相关的地址和密钥。BIP44 定义了五个层级，分别是 m / purpose' / coin_type' / account' / change / address_index，其中 m 表示根密钥，purpose' 表示派生路径的目的，coin_type' 表示加密货币类型，account' 表示账户编号，change 表示内部和外部地址之间的转换，address_index 表示地址索引。

- BIP32：分层确定性钱包协议

  BIP32 是一种分层确定性钱包（HD Wallet）协议，规定了一种从主密钥派生子密钥的算法，从而实现了密钥的分层管理和备份。通过 BIP32，用户可以从一个主密钥派生出一组相关的子密钥，每个子密钥又可以派生出更多的子密钥，从而构建出一个密钥树。BIP32 规定了一组硬化（hardened）派生和非硬化（non-hardened）派生的方式，其中硬化派生可以避免子密钥泄漏主密钥的风险。

[BIP39、BIP44、BIP32 协议](https://fpchen.readthedocs.io/zh/latest/note/BlockChain/wallet/BIP39-BIP32-BIP44.html#)

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
