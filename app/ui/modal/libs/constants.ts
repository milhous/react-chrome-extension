/**
 * 弹层类型
 * @property NONE 无
 * @property ACCOUNT_PRIVATE_KEY 私钥
 * @property ACCOUNT_MNEMONIC_WORDS 助记词
 * @property WALLET_CONNECT 连接钱包
 * @property WALLET_ACCOUNT 钱包账户
 * @property SWITCH_CHAIN 切换链
 */
export enum MODAL_TYPE {
  NONE,
  ACCOUNT_PRIVATE_KEY,
  ACCOUNT_MNEMONIC_WORDS,
  WALLET_CONNECT,
  WALLET_ACCOUNT,
  SWITCH_CHAIN,
}

/**
 * 自定义事件类型
 * @property MODAL_SHOW 弹层显示
 * @property MODAL_CLOSE 弹层关闭
 */
export const CUSTOM_EVENT_TYPE = {
  MODAL_SHOW: 'CUSTOM_EVENT_TYPE_MODAL_SHOW',
  MODAL_CLOSE: 'CUSTOM_EVENT_TYPE_MODAL_CLOSE',
};
