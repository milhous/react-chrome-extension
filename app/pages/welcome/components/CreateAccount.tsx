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
  confirmPassword: string;
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
  CONFIRM_PASSWORD,
}

// 检测密码是否有效
const checkValid = (password: string, confirmPassword: string) => {
  if (!password || !confirmPassword || password !== confirmPassword) {
    return false;
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return false;
  }
  return true;
};

// 获取密码强度文案
const getPasswordStrengthLabel = (password = '') => {
  const isTooShort = password.length > 0 && password.length < PASSWORD_MIN_LENGTH;
  const isCheck = password.length >= PASSWORD_MIN_LENGTH;
  let text = '';

  if (isTooShort) {
    text = '密码长度不足';
  } else if (isCheck) {
    const {score} = zxcvbn(password);

    if (score >= 4) {
      text = '密码强度：强';
    } else if (score === 3) {
      text = '密码强度：一般';
    } else {
      text = '密码强度：弱';
    }
  }

  return text;
};

// 创建密码
export default function CreateAccount() {
  const navigate = useNavigate();
  const isUnlocked = useSelector<IAppStoreState>(state => {
    return state.app.isUnlocked;
  });
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: {errors},
  } = useForm<IFormInput>();

  const [inputTypeFocus, setInputTypeFocus] = useState<number>(InputType.NONE);
  const [passwordStrength, setPasswordStrength] = useState<string>('');
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const deferredPassword = useDeferredValue(watch('password'));
  const deferredConfirmPassword = useDeferredValue(watch('confirmPassword'));

  const isValid = useMemo(() => {
    return checkValid(deferredPassword, deferredConfirmPassword);
  }, [deferredPassword, deferredConfirmPassword]);

  const onSubmit: SubmitHandler<IFormInput> = data => {
    if (!isValid) {
      return;
    }

    messageManager.sendMessage({
      type: MESSAGE_TYPE.CREATE_ACCOUNT,
      payload: {
        password: deferredPassword,
      },
    });
  };

  const handlePasswordVisible = (type: string) => {
    switch (type) {
      case 'password':
        setPasswordVisible(!passwordVisible);

        break;
      case 'confirmPassword':
        setConfirmPasswordVisible(!confirmPasswordVisible);

        break;
    }
  };

  useEffect(() => {
    const text = getPasswordStrengthLabel(deferredPassword);

    setPasswordStrength(text);
  }, [deferredPassword]);

  useEffect(() => {
    let text = '';

    if (!!deferredPassword && !!deferredConfirmPassword && deferredPassword !== deferredConfirmPassword) {
      text = '密码不匹配';
    }

    setConfirmPasswordError(text);
  }, [deferredPassword, deferredConfirmPassword]);

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
          <div className={classnames('app-form_input', inputTypeFocus === InputType.PASSWORD ? 'app-form_focus' : '')}>
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder={`新密码（至少 8 个字符）`}
              autoComplete="new-password"
              onFocus={() => {
                setInputTypeFocus(InputType.PASSWORD);
              }}
              {...register('password', {
                onBlur: () => {
                  setInputTypeFocus(InputType.NONE);
                },
                minLength: PASSWORD_MIN_LENGTH,
                maxLength: PASSWORD_MAX_LENGTH,
              })}
            />
            {passwordVisible ? (
              <Assets.IconEye onClick={() => handlePasswordVisible('password')} />
            ) : (
              <Assets.IconEyeOff onClick={() => handlePasswordVisible('password')} />
            )}
          </div>
          <p className="app-form_info">{passwordStrength}</p>
        </div>
        <div>
          <div
            className={classnames(
              'app-form_input',
              inputTypeFocus === InputType.CONFIRM_PASSWORD ? 'app-form_focus' : '',
            )}>
            <input
              type={confirmPasswordVisible ? 'text' : 'password'}
              placeholder="确认密码"
              autoComplete="new-password"
              onFocus={() => {
                setInputTypeFocus(InputType.CONFIRM_PASSWORD);
              }}
              {...register('confirmPassword', {
                onBlur: () => {
                  setInputTypeFocus(InputType.NONE);
                },
                maxLength: 20,
              })}
            />
            {confirmPasswordVisible ? (
              <Assets.IconEye onClick={() => handlePasswordVisible('confirmPassword')} />
            ) : (
              <Assets.IconEyeOff onClick={() => handlePasswordVisible('confirmPassword')} />
            )}
          </div>
          <p className="app-form_info">{confirmPasswordError}</p>
        </div>
        <button className="app-btn_primary" type="submit">
          创建账户
        </button>
      </div>
    </form>
  );
}
