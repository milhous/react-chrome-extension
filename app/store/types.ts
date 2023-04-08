import React from 'react';

/**
 * 声明 - APP 状态
 * @property {string} password 密码
 */
export interface IAppState {
  password: string;
}

/**
 * 声明 - Action
 * @param {string} tpye 类型
 * @param {string} payload 数据
 */
export interface IAppAction {
  type: string;
  payload: Partial<IAppState>;
}

/**
 * 声明 - APP Context Props
 * @param {IWalletState} state 状态
 * @param {function} dispatch 分发函数
 */
export interface IAppContextProps {
  state: IAppState;
  dispatch: React.Dispatch<IAppAction>;
}

/**
 * ACTIONS 类型
 * @property CREATE_ACCOUNT 创建账户
 * @property UNLOCK 解锁
 */
export const ACTIONS_TYPE = {
  CREATE_ACCOUNT: 'CREATE_ACCOUNT',
  UNLOCK: 'UNLOCK',
};
