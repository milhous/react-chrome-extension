import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import QRCode from 'qrcode';

import Assets from '@assets/index';
import {MESSAGE_TYPE} from '@libs/constants/app';
import ROUTES from '@libs/constants/routes';
import messageManager from '@libs/messageManager';
import {IAppStoreState, IAppState} from '@store/types';

import './index.scss';

const qrCodeOpts = {
  margin: 0,
};

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

export default function PageWallet() {
  const navigate = useNavigate();
  const {isUnlocked, address, mnemonicWords, privateKey} = useSelector<IAppStoreState>(state => {
    return {
      isUnlocked: state.app.isUnlocked,
      address: state.app.address,
      mnemonicWords: state.app.mnemonicWords,
      privateKey: state.app.privateKey,
    };
  }) as Partial<IAppState>;
  const [qrcode, setQrcode] = useState<string>('');

  const handleLogout = () => {
    messageManager.sendMessage({
      type: MESSAGE_TYPE.LOCK,
    });
  };

  useEffect(() => {
    if (!isUnlocked) {
      navigate(ROUTES.WELCOME);
    }
  }, [isUnlocked]);

  useEffect(() => {
    if (!!address) {
      QRCode.toDataURL(address, qrCodeOpts).then(url => {
        setQrcode(url);
      });
    }
  }, [address]);

  return (
    <section className="app-page page-wallet">
      <div className="app-section">
        <div className="page-wallet_card box-border space-y-4 rounded-3xl bg-white p-6 shadow">
          <WalletItem title="地址" desc={address} />
          <div className="mx-auto box-border h-[120px] w-[120px] rounded-xl bg-white p-3 shadow">
            <img className="block h-full w-full" src={qrcode} />
          </div>
          <WalletItem title="助记词" desc={mnemonicWords} />
          <WalletItem title="私钥" desc={privateKey} />
          <button className="app-btn_outline !mt-[20px]" onClick={handleLogout}>
            注销
          </button>
        </div>
      </div>
    </section>
  );
}
