'use client';

import {useEffect, useState} from 'react';
import {useForm, SubmitHandler} from 'react-hook-form';
import zxcvbn from 'zxcvbn';
import classnames from 'classnames';

import {PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH} from '@libs/constants/form';
import Assets from '@assets/index';

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

// 判断密码是否有效
const isValid = (password: string, confirmPassword: string) => {
  if (!password || !confirmPassword || password !== confirmPassword) {
    return false;
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    return false;
  }
  return true;
};

// 获取密码强度文案
const getPasswordStrengthLabel = (password: string) => {
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

// 创建钱包
export default function CreateWallet() {
  const {
    register,
    handleSubmit,
    setError,
    formState: {errors},
  } = useForm<IFormInput>();
  const [inputTypeFocus, setInputTypeFocus] = useState<number>(InputType.NONE);
  const [passwordStrength, setPasswordStrength] = useState<string>('');
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const onSubmit: SubmitHandler<IFormInput> = data => console.log(data);

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

  const handlePasswordChange = evt => {
    const passwordInput = evt.target.value;
    const text = getPasswordStrengthLabel(passwordInput);

    setPasswordStrength(text);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-8 w-[330px] space-y-5">
        <div>
          <div className={classnames('app-form_input', inputTypeFocus === InputType.PASSWORD ? 'app-form_focus' : '')}>
            <input
              type={passwordVisible ? 'text' : 'password'}
              placeholder={`新密码（至少 8 个字符）`}
              onFocus={() => {
                setInputTypeFocus(InputType.PASSWORD);
              }}
              {...register('password', {
                onChange: handlePasswordChange,
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
          <p className="app-form_info">{errors.confirmPassword && '密码不匹配'}</p>
        </div>
        <button className="app-btn_primary" type="submit">
          创建钱包
        </button>
      </div>
    </form>
  );
}
