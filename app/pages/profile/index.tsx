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

import './index.scss';

const qrCodeOpts = {
  margin: 0,
};

export default function PageProfile() {
  const {isUnlocked, address, mnemonicWords, privateKey} = useSelector<IAppStoreState>(state => {
    return {
      isUnlocked: state.app.isUnlocked,
      address: state.app.address,
      mnemonicWords: state.app.mnemonicWords,
      privateKey: state.app.privateKey,
    };
  }) as Partial<IAppState>;
  const [qrcode, setQrcode] = useState<string>('');

  useEffect(() => {
    if (!!address) {
      QRCode.toDataURL(address, qrCodeOpts).then(url => {
        setQrcode(url);
      });
    }
  }, [address]);

  return (
    <section className="app-page page-profile">
      <UIHeader title="账户详情" />
      <div className="app-section">
        <div className="app-card">
          <div className="mx-auto box-border h-[120px] w-[120px] rounded-xl bg-white p-3 shadow">
            <img className="block h-full w-full" src={qrcode} />
          </div>
        </div>
      </div>
      <UINavigation />
    </section>
  );
}
