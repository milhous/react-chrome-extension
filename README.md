## Packages

#### zxcvbn

是一个受密码破解器启发的密码强度估算器。通过模式匹配和保守估计，它根据美国人口普查数据中的 30k 个常见密码、常见名字和姓氏、维基百科上流行的英语单词以及美国电视和电影等其他常见模式来识别并加权考虑日期、重复（aaa）、序列（abcd）、键盘模式（qwertyuiop）和 l33t speak 等。

#### @metamask/eth-keyring-controller

一个用于管理以太坊账户组的模块，称为“Keyrings”，最初是为 MetaMask 的多账户类型功能定义的。

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
