import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import Assets from '@assets/index';
import keyringMananger from '@libs/keyringMananger';
import {ACTIONS_TYPE} from '@store/types';
import {useAppState} from '@store/Provider';

// 地址
// 0x126b8528ea6966f0089554fed347d7038139185e
// 助记词
// fan social become leave used beach trumpet behind basket state invest august
// 私钥
// b44e9ac3828d3d441ecca7750d3ad1d48646ea47b23aca9fdb04697cf1339c3c

const WalletItem = (props: {title: string; desc: string}) => {
  const {title, desc} = props;

  return (
    <dl className="text-base">
      <dt className="text-gray">{title}</dt>
      <dd className="mt-1 break-words text-[20px] text-midnight-blue">{desc}</dd>
    </dl>
  );
};

export default function PageWallet() {
  const navigate = useNavigate();
  const {state, dispatch} = useAppState();
  const {password} = state;

  const [address, setAddress] = useState<string>('');
  const [mnemonicWords, setMnemonicWords] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>('');

  const test_words = 'fan social become leave used beach trumpet behind basket state invest august';

  useEffect(() => {
    if (password === '') {
      navigate('/', {
        replace: true,
      });

      return;
    }

    (async () => {
      await keyringMananger.createNewVaultAndKeychain(password);

      const accounts = await keyringMananger.getAccounts();

      if (accounts.length) {
        setAddress(accounts[0]);
      }

      console.log(accounts);

      const mnemonic = await keyringMananger.verifySeedPhrase();

      console.log(mnemonic);

      const words = Buffer.from(mnemonic).toString('utf8');

      setMnemonicWords(words);

      console.log(words);

      const key = await keyringMananger.exportAccount(accounts[0], password);

      setPrivateKey(key);

      console.log(key);

      //   await keyringMananger.createNewVaultAndRestore(password, test_words);

      //   const accounts2 = await keyringMananger.getAccounts();

      //   console.log(accounts2);

      //   const mnemonic2 = await keyringMananger.verifySeedPhrase();

      //   console.log(mnemonic2);

      //   const words2 = Buffer.from(mnemonic).toString('utf8');

      //   setMnemonicWords(words2);

      //   console.log(words2);
    })();
  }, [password]);

  const handleLogout = () => {
    dispatch({
      type: ACTIONS_TYPE.UNLOCK,
      payload: {
        password: '',
      },
    });
  };

  return (
    <section className="app-page">
      <div className="app-section">
        <div className="box-border space-y-5 rounded-3xl bg-white p-6 shadow">
          <WalletItem title="地址" desc={address} />
          <WalletItem title="助记词" desc={mnemonicWords} />
          <WalletItem title="私钥" desc={privateKey} />
          <button className="app-btn_outline" onClick={handleLogout}>
            注销
          </button>
        </div>
      </div>
    </section>
  );
}
