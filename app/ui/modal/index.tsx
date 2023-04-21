import {Suspense, lazy} from 'react';

import {IUIModalData} from './types';
import {CUSTOM_EVENT_TYPE, MODAL_TYPE} from './libs/constants';

import './index.scss';

// 账户 - 私钥
const UIModalAccountPrivateKey = lazy(() => import('./content/AccountPrivateKey'));

/**
 * 显示弹层
 * @param {number} type 类型
 * @param {string} data 数据
 */
const showModal = (type: number, payload?: Record<string, any>): void => {
  const detail: IUIModalData = {
    type,
    payload,
  };

  globalThis.dispatchEvent(new CustomEvent(CUSTOM_EVENT_TYPE.MODAL_SHOW, {detail}));
};

/**
 * 关闭弹层
 * @param {number} type 类型
 * @param {boolean} isAll 是否关闭所有
 */
const closeModal = (type: number, isAll = false): void => {
  const detail: IUIModalData = {
    type,
    isAll,
  };

  globalThis.dispatchEvent(new CustomEvent(CUSTOM_EVENT_TYPE.MODAL_CLOSE, {detail}));
};

export {MODAL_TYPE, showModal, closeModal};

const UIModal = () => {
  return (
    <Suspense>
      <UIModalAccountPrivateKey />
    </Suspense>
  );
};

export default UIModal;
