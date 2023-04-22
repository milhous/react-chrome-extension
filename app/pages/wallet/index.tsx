import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';

import Assets from '@assets/index';
import {MESSAGE_TYPE} from '@libs/constants/app';
import ROUTES from '@libs/constants/routes';
import messageManager from '@libs/messageManager';
import {IAppStoreState, IAppState} from '@store/types';
import UIHeader from '@ui/header';
import UINavigation from '@ui/navigation';

import './index.scss';

// 地址
// 0x126b8528ea6966f0089554fed347d7038139185e
// 助记词
// fan social become leave used beach trumpet behind basket state invest august
// 私钥
// b44e9ac3828d3d441ecca7750d3ad1d48646ea47b23aca9fdb04697cf1339c3c

const WalletItem = (props: {title: string | undefined; desc: string | undefined}) => {
  const {title = '', desc = ''} = props;

  return (
    <dl className="text-base">
      <dt className="text-gray">{title}</dt>
      <dd className="mt-1 break-words text-midnight-blue">{desc}</dd>
    </dl>
  );
};

const Account = () => {
  const handleAddAccount = () => {
    messageManager.sendMessage({
      type: MESSAGE_TYPE.ADD_ACCOUNT,
    });
  };

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4">
      <button className="app-btn_primary" onClick={handleAddAccount}>
        创建账户
      </button>
      <button className="app-btn_outline">导入账户</button>
    </div>
  );
};

export default function PageWallet() {
  const navigate = useNavigate();
  const {isUnlocked, address} = useSelector<IAppStoreState>(state => {
    return {
      isUnlocked: state.app.isUnlocked,
      address: state.app.address,
      mnemonicWords: state.app.mnemonicWords,
      privateKey: state.app.privateKey,
    };
  }) as Partial<IAppState>;

  useEffect(() => {
    if (!isUnlocked) {
      navigate(ROUTES.WELCOME, {
        replace: true,
      });
    }
  }, [isUnlocked]);

  return (
    <section className="app-page page-wallet">
      <UIHeader />
      <div className="app-section">
        <div className="app-card">{address === '' && <Account />}</div>
      </div>
      <UINavigation />
    </section>
  );
}
