import {StrictMode, Suspense} from 'react';
import {Route, Routes, Navigate} from 'react-router-dom';

import ROUTES from '@libs/constants/routes';

import Home from '@pages/home';
import OnboardingSecureWallet from '@pages/onboarding/SecureWallet';

import './App.scss';

function App(props: {page: string}) {
  const path = `/${props.page}`;

  console.log(path);

  return (
    <StrictMode>
      <div className="app">
        <Suspense fallback={<p>loading...</p>}>
          <Routes>
            <Route index path="/" element={<Home />} />
            <Route path="secure_wallet" element={<OnboardingSecureWallet />} />
            <Route path="*" element={<Navigate replace to="/" />} />
          </Routes>
        </Suspense>
      </div>
    </StrictMode>
  );
}

export default App;
