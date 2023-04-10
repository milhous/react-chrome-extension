'use client';

import {useDeferredValue, useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {useForm, SubmitHandler} from 'react-hook-form';
import zxcvbn from 'zxcvbn';
import classnames from 'classnames';

import Assets from '@assets/index';
import {MESSAGE_TYPE} from '@libs/constants/app';
import ROUTES from '@libs/constants/routes';
import {PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH} from '@libs/constants/form';
import messageManager from '@libs/messageManager';
import {IAppStoreState} from '@store/types';

interface IFormInput {
  password: string;
}

/**
 * 输入框类型
 * NONE 无
 * PASSWORD 密码
 * CONFIRM_PASSWORD 确认密码
 */
enum InputType {
  NONE,
  PASSWORD,
}

// 解锁
export default function Unlock() {
  const navigate = useNavigate();
  const isUnlocked = useSelector<IAppStoreState>(state => {
    return state.app.isUnlocked;
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: {errors},
    clearErrors,
  } = useForm<IFormInput>();

  const [inputTypeFocus, setInputTypeFocus] = useState<number>(InputType.NONE);
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const deferredPassword = useDeferredValue(watch('password'));

  const onSubmit: SubmitHandler<IFormInput> = data => {
    messageManager.sendMessage({
      type: MESSAGE_TYPE.UNLOCK,
      payload: {
        password: deferredPassword,
      },
    });
  };

  const handlePasswordVisible = () => {
    setPasswordVisible(!passwordVisible);
  };

  useEffect(() => {
    if (isUnlocked) {
      navigate(ROUTES.WALLET);
    }
  }, [isUnlocked]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-8 w-[330px] space-y-5">
        <div>
          <div className={classnames('app-form_input', inputTypeFocus === InputType.PASSWORD ? 'app-form_focus' : '')}>
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder={`密码`}
              autoComplete="new-password"
              onFocus={() => {
                setInputTypeFocus(InputType.PASSWORD);

                clearErrors();
              }}
              {...register('password', {
                onBlur: () => {
                  setInputTypeFocus(InputType.NONE);
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
        <button className="app-btn_primary" type="submit">
          解锁
        </button>
      </div>
    </form>
  );
}
