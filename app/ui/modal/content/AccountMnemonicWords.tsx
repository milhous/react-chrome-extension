import {useEffect, useState, useDeferredValue} from 'react';
import {useSelector} from 'react-redux';
import {useForm, SubmitHandler} from 'react-hook-form';
import classnames from 'classnames';

import Assets from '@assets/index';
import {MESSAGE_TYPE} from '@libs/constants/app';
import {INPUT_TYPE, PASSWORD_MIN_LENGTH} from '@libs/constants/form';
import {copyText} from '@libs/utils';
import messageManager from '@libs/messageManager';
import {IAppStoreState} from '@store/types';
import WidgetModal from '@widget/modal';
import WidgetQRCode from '@widget/qrcode';
import * as toast from '@widget/toastify';

import {MODAL_TYPE} from '../libs/constants';
import {useModal} from '../hooks';

interface IFormInput {
  password: string;
}

const MnemonicWordsWarning = () => {
  return <p>警告：确保没有人在看您的屏幕。任何拥有您助记词的人对您的钱包和资金的完整访问权限。</p>;
};

const MnemonicWordsResult = (props: {mnemonicWords: string; onClose: () => void}) => {
  const {mnemonicWords, onClose} = props;

  const handleCopy = async () => {
    await copyText(mnemonicWords);

    toast.success('复制成功');
  };

  return (
    <div className="mt-4 space-y-4">
      <dl className="cursor-pointer text-base" onClick={handleCopy}>
        <dt className="text-gray">这是您的助记词（点击以复制）</dt>
        <dd className="mt-1 break-all text-midnight-blue">{mnemonicWords}</dd>
      </dl>
      <WidgetQRCode text={mnemonicWords} />
      <MnemonicWordsWarning />
      <button className="app-btn_primary" onClick={onClose}>
        完成
      </button>
    </div>
  );
};

const MnemonicWordsForm = (props: {onClose: () => void}) => {
  const {onClose} = props;
  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
    clearErrors,
  } = useForm<IFormInput>();

  const [inputTypeFocus, setInputTypeFocus] = useState<number>(INPUT_TYPE.NONE);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const deferredPassword = useDeferredValue(watch('password'));

  const onSubmit: SubmitHandler<IFormInput> = data => {
    messageManager.sendMessage({
      type: MESSAGE_TYPE.GET_MNEMONIC_PHRASE,
      payload: {
        password: deferredPassword,
      },
    });
  };

  const handlePasswordVisible = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-4 space-y-4">
          <div>
            <div
              className={classnames('app-form_input', inputTypeFocus === INPUT_TYPE.PASSWORD ? 'app-form_focus' : '')}>
              <input
                type={passwordVisible ? 'text' : 'password'}
                placeholder={`密码`}
                autoComplete="new-password"
                onFocus={() => {
                  setInputTypeFocus(INPUT_TYPE.PASSWORD);

                  clearErrors();
                }}
                {...register('password', {
                  onBlur: () => {
                    setInputTypeFocus(INPUT_TYPE.NONE);
                  },
                  minLength: PASSWORD_MIN_LENGTH,
                  required: true,
                })}
              />
              {passwordVisible ? (
                <Assets.IconEye onClick={() => handlePasswordVisible()} />
              ) : (
                <Assets.IconEyeOff onClick={() => handlePasswordVisible()} />
              )}
            </div>
            <p className="app-form_info">
              {errors?.password?.type === 'required' && '输入您的密码'}
              {errors?.password?.type === 'minLength' && '密码长度不足'}
            </p>
          </div>
          <MnemonicWordsWarning />
          <ul className="flex items-center justify-center space-x-4">
            <li>
              <button className="app-btn_outline !w-[140px]" type="button" onClick={onClose}>
                取消
              </button>
            </li>
            <li>
              <button className="app-btn_primary !w-[140px]" type="submit">
                确认
              </button>
            </li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default function UIModalAccountMnemonicWords() {
  const {visible, setVisible, payload} = useModal(MODAL_TYPE.ACCOUNT_MNEMONIC_WORDS);
  const mnemonicWords = useSelector<IAppStoreState>(state => {
    return state.app.mnemonicWords;
  }) as string;

  // 关闭
  const handleClose = () => {
    setVisible(false);

    messageManager.sendMessage({
      type: MESSAGE_TYPE.CLEAR_PRIVATE_DATA,
    });
  };

  return (
    <WidgetModal className="ui-modal" isActive={visible}>
      <div className="modal-content modal-account-mnemonicWords">
        <h3 className="modal-content_title">显示助记词</h3>
        <div className="modal-content_box">
          <dl className="text-base">
            <dt className="text-gray">Milhous 是非托管钱包。</dt>
            <dd className="mt-1 break-all text-midnight-blue">这意味着您是自己的助记词（SRP） 的所有者。</dd>
          </dl>
          {mnemonicWords === '' ? (
            <MnemonicWordsForm onClose={handleClose} />
          ) : (
            <MnemonicWordsResult mnemonicWords={mnemonicWords} onClose={handleClose} />
          )}
        </div>
        <button className="app-btn_icon modal-btn_close" onClick={handleClose}>
          <Assets.IconX />
        </button>
      </div>
    </WidgetModal>
  );
}
