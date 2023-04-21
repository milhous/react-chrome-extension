import {useEffect, useState, useDeferredValue} from 'react';
import {useSelector} from 'react-redux';
import {useForm, SubmitHandler} from 'react-hook-form';
import classnames from 'classnames';

import Assets from '@assets/index';
import {MESSAGE_TYPE} from '@libs/constants/app';
import {INPUT_TYPE, PASSWORD_MIN_LENGTH} from '@libs/constants/form';
import messageManager from '@libs/messageManager';
import {IAppStoreState} from '@store/types';
import WidgetModal from '@widget/modal';

import {MODAL_TYPE} from '../libs/constants';
import {useModal} from '../hooks';

interface IFormInput {
  password: string;
}

const PrivateKeyResult = (props: {privateKey: string; onClose: () => void}) => {
  const {privateKey, onClose} = props;

  return (
    <div className="mt-8 space-y-5">
      <dl>
        <dt>这是您的私钥（点击以复制）</dt>
        <dd className="break-all">{privateKey}</dd>
      </dl>
      <p>警告：切勿泄露此密钥。任何拥有您私钥的人都可以窃取您账户中持有的任何资产。</p>
      <button className="app-btn_primary" onClick={onClose}>
        完成
      </button>
    </div>
  );
};

const PrivateKeyForm = (props: {address: string; onClose: () => void}) => {
  const {address, onClose} = props;
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
      type: MESSAGE_TYPE.GET_PRIVATE_KEY,
      payload: {
        password: deferredPassword,
        address,
      },
    });
  };

  const handlePasswordVisible = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-8 space-y-5">
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
          <p>警告：切勿泄露此密钥。任何拥有您私钥的人都可以窃取您账户中持有的任何资产。</p>
          <ul>
            <li>
              <button className="app-btn_outline" type="button" onClick={onClose}>
                取消
              </button>
            </li>
            <li>
              <button className="app-btn_primary" type="submit">
                确认
              </button>
            </li>
          </ul>
        </div>
      </form>
    </div>
  );
};

export default function UIModalAccountPrivateKey() {
  const {visible, setVisible, payload} = useModal(MODAL_TYPE.ACCOUNT_PRIVATE_KEY);
  const privateKey = useSelector<IAppStoreState>(state => {
    return state.app.privateKey;
  }) as string;

  // 关闭
  const handleClose = () => {
    setVisible(false);

    messageManager.sendMessage({
      type: MESSAGE_TYPE.CLEAR_PRIVATE_DATA,
      payload: {
        password: '12345678',
      },
    });
  };

  return (
    <WidgetModal className="ui-modal" isActive={visible}>
      <div className="modal-content modal-account-privateKey">
        <h3 className="modal-content_title">显示私钥</h3>
        <div className="modal-content_box">
          <dl>
            <dt>Account 1</dt>
            <dd>{payload.address}</dd>
          </dl>
          {privateKey === '' ? (
            <PrivateKeyForm address={payload.address} onClose={handleClose} />
          ) : (
            <PrivateKeyResult privateKey={privateKey} onClose={handleClose} />
          )}
        </div>
        <button className="app-btn_icon modal-btn_close" onClick={handleClose}>
          <Assets.IconX />
        </button>
      </div>
    </WidgetModal>
  );
}
