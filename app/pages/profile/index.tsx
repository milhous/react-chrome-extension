import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import QRCode from 'qrcode';

import Assets from '@assets/index';
import {MESSAGE_TYPE} from '@libs/constants/app';
import ROUTES from '@libs/constants/routes';
import messageManager from '@libs/messageManager';
import {IAppStoreState, IAppState} from '@store/types';
import UIHeader from '@ui/header';
import UINavigation from '@ui/navigation';
import {showModal, MODAL_TYPE} from '@ui/modal';
import WidgetQRCode from '@widget/qrcode';

import './index.scss';

export default function PageProfile() {
  const address = useSelector<IAppStoreState>(state => {
    return state.app.address;
  }) as string;

  const handlePrivateKey = () => {
    showModal(MODAL_TYPE.ACCOUNT_PRIVATE_KEY, {address});
  };

  const handleMnemonicWords = () => {
    showModal(MODAL_TYPE.ACCOUNT_MNEMONIC_WORDS, {address});
  };

  return (
    <section className="app-page page-profile">
      <UIHeader title="账户详情" />
      <div className="app-section">
        <div className="app-card space-y-5">
          <WidgetQRCode text={address} />
          <p className="break-all text-center">{address}</p>
          <button className="app-btn_outline" onClick={handlePrivateKey}>
            导出私钥
          </button>
          <button className="app-btn_outline" onClick={handleMnemonicWords}>
            显示助记词
          </button>
        </div>
      </div>
      <UINavigation />
    </section>
  );
}
