import React from 'react';
import ReactDOM from 'react-dom/client';
import * as toastify from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Assets from '@assets/index';

import './index.scss';

interface IContentProps {
  children?: React.ReactNode | React.ReactNode[];
}

// 默认配置
const defaultOptions = {
  position: 'top-center',
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  pauseOnFocusLoss: false,
  draggable: true,
  progress: undefined,
  className: 'widget-toastify',
  containerId: 'Toastify',
  closeButton: <Assets.IconX className="widget-toastify_close" />,
};

let isInit = false;

// 初始化
const init = (): void => {
  if (isInit) {
    return;
  }

  isInit = true;

  const div = document.createElement('div');
  div.id = 'widgetToastify';
  document.body.appendChild(div);

  const root = ReactDOM.createRoot(div as HTMLElement);

  root.render(<toastify.ToastContainer containerId="Toastify" />);
};

// 内容
const Content = (props: IContentProps): JSX.Element => {
  return <div className="widget-toastify_content">{props.children}</div>;
};

// 信息
export const info = (str: any, options: any = {}): toastify.Id => {
  const opts = {...defaultOptions, ...options};

  init();

  const toastId = toastify.toast(
    <Content>
      <Assets.IconAlertCircle />
      <p>{str}</p>
    </Content>,
    opts,
  );

  return toastId;
};

// 失败
export const error = (str: any, options: any = {}): toastify.Id => {
  const opts = {...defaultOptions, ...options};

  opts.className = opts.className + ' widget-toastify_error';

  init();

  const toastId = toastify.toast(
    <Content>
      <Assets.IconXCircle className="!text-red" />
      <p>{str}</p>
    </Content>,
    opts,
  );

  return toastId;
};

// 成功
export const success = (str: any, options: any = {}): toastify.Id => {
  const opts = {...defaultOptions, ...options};

  opts.className = opts.className + ' widget-toastify_success';

  init();

  const toastId = toastify.toast(
    <Content>
      <Assets.IconCheckCircle className="!text-green" />
      <p>{str}</p>
    </Content>,
    opts,
  );

  return toastId;
};

export const dismissToast = (toastId: toastify.Id) => {
  if (!!toastId) {
    toastify.toast.dismiss(toastId);
  } else {
    toastify.toast.dismiss();
  }
};
