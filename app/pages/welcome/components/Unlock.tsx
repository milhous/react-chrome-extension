import {useDeferredValue, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {useForm, SubmitHandler} from 'react-hook-form';
import classnames from 'classnames';

import Assets from '@assets/index';
import {MESSAGE_TYPE} from '@libs/constants/app';
import ROUTES from '@libs/constants/routes';
import {PASSWORD_MIN_LENGTH, INPUT_TYPE} from '@libs/constants/form';
import messageManager from '@libs/messageManager';
import {IAppStoreState} from '@store/types';

interface IFormInput {
  password: string;
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

  const [inputTypeFocus, setInputTypeFocus] = useState<number>(INPUT_TYPE.NONE);
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
      navigate(ROUTES.WALLET, {
        replace: true,
      });
    }
  }, [isUnlocked]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-8 w-[330px] space-y-5">
        <div>
          <div className={classnames('app-form_input', inputTypeFocus === INPUT_TYPE.PASSWORD ? 'app-form_focus' : '')}>
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
        <button className="app-btn_primary" type="submit">
          解锁
        </button>
      </div>
    </form>
  );
}
