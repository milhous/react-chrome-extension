export const WORKER_KEEP_ALIVE_INTERVAL = 1000;

// 环境类型
export enum ENVIRONMENT_TYPE {
  POPUP = 0,
  NOTIFICATION,
  FULLSCREEN,
  BACKGROUND,
}

// 页面类型
export const PAGE_TYPE = {
  POPUP: 'popup',
  HOME: 'home',
  NOTIFICATION: 'notification',
};

// 消息类型
export const MESSAGE_TYPE = {
  WORKER_KEEP_ALIVE_MESSAGE: 'WORKER_KEEP_ALIVE_MESSAGE',
  ACK_KEEP_ALIVE_MESSAGE: 'ACK_KEEP_ALIVE_MESSAGE',
  UPDATE_STORE_DATA: 'UPDATE_STORE_DATA',
  ONBOARDING_COMPLETE: 'ONBOARDING_COMPLETE',
  CREATE_ACCOUNT: 'CREATE_ACCOUNT',
  LOCK: 'LOCK',
  UNLOCK: 'UNLOCK',
};

/**
 * 动画状态
 * @property OUT 隐藏
 * @property IN 显示
 * @property ING 隐藏进行中
 */
export enum ANIMATION_STATE {
  OUT,
  IN,
  ING,
}
