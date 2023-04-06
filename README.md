## Notes

1. 插件最大高度 600 px

2. seed phrase buffer 转 seed words

```js
const serialized = await primaryKeyring.serialize();
const seedPhraseAsBuffer = Buffer.from(serialized.mnemonic);
const revealSeedWords = Buffer.from(seedPhraseAsBuffer).toString("utf8");
```

## Packages

#### zxcvbn

是一个受密码破解器启发的密码强度估算器。通过模式匹配和保守估计，它根据美国人口普查数据中的 30k 个常见密码、常见名字和姓氏、维基百科上流行的英语单词以及美国电视和电影等其他常见模式来识别并加权考虑日期、重复（aaa）、序列（abcd）、键盘模式（qwertyuiop）和 l33t speak 等。

#### @metamask/eth-keyring-controller

@metamask/eth-keyring-controller 是一个 JavaScript 库，用于管理以太坊私钥。它是 MetaMask 中的一个核心组件。

提供了以下功能

1. 私钥管理：可以创建、导入和删除以太坊私钥。

2. 派生路径管理：可以配置派生路径，以便在使用 HD 钱包时生成多个地址。

3. 签名管理：可以对交易进行签名，并支持多种签名算法和格式。

4. 安全管理：可以使用密码保护私钥，并提供密码管理和错误处理功能。

5. 状态管理：可以检查和管理与私钥相关的状态，如账户余额和交易历史。

使用 @metamask/eth-keyring-controller，您可以在自己的应用程序中实现类似于 MetaMask 的钱包功能，从而为用户提供管理以太坊私钥的功能。

#### @keystonehq/metamask-airgapped-keyring

@keystonehq/metamask-airgapped-keyring 是一个 MetaMask 钱包插件，其作用是提供一种在空气隔离的设备上生成和管理以太坊私钥的方式，以增强安全性。

使用 @keystonehq/metamask-airgapped-keyring，用户可以使用离线设备（例如未连接到网络的计算机、平板电脑或智能手机）生成以太坊私钥。然后，用户可以将这些私钥导入到在线设备上的 MetaMask 钱包中，以便在以太坊网络上进行交易或其他操作。

@keystonehq/metamask-airgapped-keyring 的主要优点是提供更高的安全性，因为生成和管理私钥的离线设备不易受到网络攻击或恶意软件的攻击。此外，该插件还提供了方便的用户界面，使用户可以轻松地生成、导出和管理私钥。

#### await-semaphore

await-semaphore 是一个 JavaScript 库，它提供了一种机制来控制并发异步代码的执行。具体来说，await-semaphore 实现了一种信号量机制，使得我们可以限制同时执行的异步操作的数量。

当我们需要执行多个异步操作，并且这些操作之间有一定的依赖关系或者需要保证某些操作的执行顺序时，await-semaphore 就可以发挥作用了。通过限制同时执行的异步操作的数量，await-semaphore 可以帮助我们避免并发冲突和资源竞争等问题，从而提高代码的可靠性和性能。

使用 await-semaphore 可以很方便地实现一些常见的并发控制模式，比如限制同时执行的 HTTP 请求的数量、限制同时执行的数据库查询的数量、限制同时执行的文件读写操作的数量等等。

## Knowledge

#### BIP39、BIP44、BIP32 协议

- BIP39：助记词生成协议

  BIP39 是一种用于生成助记词的协议。助记词是一串由单词组成的短语，通常由 12、15、18、21 或 24 个单词组成。通过助记词，用户可以方便地备份和恢复他们的加密货币钱包。BIP39 规定了一组单词列表，用于生成助记词，并规定了一种从助记词派生种子值的算法，该种子值可用于生成密钥对和地址。

- BIP44：地址和密钥派生协议

  BIP44 是一种用于地址和密钥派生的协议。它基于 BIP32 的分层确定性钱包（HD Wallet）协议，规定了一组派生路径，用于从根密钥派生一组相关的地址和密钥。BIP44 定义了五个层级，分别是 m / purpose' / coin_type' / account' / change / address_index，其中 m 表示根密钥，purpose' 表示派生路径的目的，coin_type' 表示加密货币类型，account' 表示账户编号，change 表示内部和外部地址之间的转换，address_index 表示地址索引。

- BIP32：分层确定性钱包协议

  BIP32 是一种分层确定性钱包（HD Wallet）协议，规定了一种从主密钥派生子密钥的算法，从而实现了密钥的分层管理和备份。通过 BIP32，用户可以从一个主密钥派生出一组相关的子密钥，每个子密钥又可以派生出更多的子密钥，从而构建出一个密钥树。BIP32 规定了一组硬化（hardened）派生和非硬化（non-hardened）派生的方式，其中硬化派生可以避免子密钥泄漏主密钥的风险。

[BIP39、BIP44、BIP32 协议](https://fpchen.readthedocs.io/zh/latest/note/BlockChain/wallet/BIP39-BIP32-BIP44.html#)

## Flow

ui/pages/onboarding-flow/onboarding-flow.js

createNewVaultAndGetSeedPhrase ->

ui/store/actions.js

createNewVaultAndGetSeedPhrase -> createNewVault -> createNewVaultAndKeychain ->

app/scripts/metamask-controller.js

createNewVaultAndKeychain ->

ui/store/actions.js

verifySeedPhrase -> submitRequestToBackground verifySeedPhrase

ui/store/action-queue/index.ts

submitRequestToBackground generateActionId

app/scripts/metamask-controller.js

createNewVaultAndKeychain -> keyringController.createNewVaultAndKeychain ->

@metamask/eth-keyring-controller

KeyringController -> persistAllKeyrings -> this.memStore.updateState ->

app/scripts/metamask-controller.js

this.keyringController.memStore.subscribe -> \_onKeyringControllerUpdate

background.js

initState -> loadStateFromPersistence

## Errors

#### Refused to compile or instantiate WebAssembly module because neither 'wasm-eval' nor 'unsafe-eval' is an allowed source of script in the following Content Security Policy directive: "script-src 'self'"

manifest.json 新增 content_security_policy

```json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'; frame-ancestors 'none';"
  }
}
```

#### Buffer is not defined && Process is not defined

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
