import {useState, useEffect, Dispatch, SetStateAction} from 'react';

import {IUIModalData} from '../types';
import {MODAL_TYPE, CUSTOM_EVENT_TYPE} from '../libs/constants';

/**
 * hook - 弹层
 * @param {number} targetType 当前弹层类型
 */
export const useModal = (
  targetType: number,
): {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  payload: Record<string, any>;
} => {
  // 是否显示
  const [visible, setVisible] = useState<boolean>(false);
  // 是否显示
  const [payload, setPayload] = useState<Record<string, any>>({});

  // 显示
  const onShow = ({detail}: any) => {
    const {type, payload = {}} = detail as IUIModalData;

    if (targetType === type) {
      setVisible(true);
      setPayload(payload);
    }
  };

  // 关闭
  const onClose = ({detail}: any) => {
    const {type, isAll = false} = detail as IUIModalData;

    if (isAll || targetType === type || MODAL_TYPE.NONE === type) {
      setVisible(false);
    }
  };

  useEffect(() => {
    globalThis.addEventListener(CUSTOM_EVENT_TYPE.MODAL_SHOW, onShow);
    globalThis.addEventListener(CUSTOM_EVENT_TYPE.MODAL_CLOSE, onClose);

    return () => {
      globalThis.removeEventListener(CUSTOM_EVENT_TYPE.MODAL_SHOW, onShow);
      globalThis.removeEventListener(CUSTOM_EVENT_TYPE.MODAL_CLOSE, onClose);
    };
  }, []);

  return {
    visible,
    payload,
    setVisible,
  };
};
