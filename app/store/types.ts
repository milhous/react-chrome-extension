import React from 'react';
import store from './index';

/**
 * 声明 - APP 状态
 * @property {boolean} isLaunch 是否启动
 * @property {boolean} isConnected 是否通讯已连接
 * @property {boolean} isOnboarding 是否进入培训
 * @property {boolean} isFirstTime 是否首次进入
 * @property {boolean} isInitialized 第一个保险库是否已经创建
 * @property {boolean} isUnlocked 保险库当前是否已解密并且账户可供选择
 * @property {string} env 运行环境
 * @property {string} address 保险库当前账户的地址
 * @property {string} mnemonicWords 保险库当前账户的助记词
 * @property {string} privateKey 保险库当前账户的私钥
 */
export interface IAppState {
  isLaunch: boolean;
  isConnected: boolean;
  isOnboarding: boolean;
  isFirstTime: boolean;
  isInitialized: boolean;
  isUnlocked: boolean;
  env: string;
  address: string;
  mnemonicWords: string;
  privateKey: string;
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

export type IAppStoreState = ReturnType<typeof store.getState>;

export type IAppStoreDispatch = typeof store.dispatch;
