import keyringMananger from '@libs/keyringMananger';
import {useEffect} from 'react';

export default function OnboardingSecureWallet() {
  useEffect(() => {
    (async () => {
      const data = await keyringMananger.createNewVaultAndKeychain('12345678');

      console.log(data);

      const mnemonic = await keyringMananger.verifySeedPhrase();

      console.log(mnemonic);

      const words = Buffer.from(mnemonic).toString('utf8');

      console.log(words);
    })();
  }, []);

  return <div>账户</div>;
}
