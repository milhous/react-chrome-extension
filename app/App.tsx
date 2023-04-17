import {StrictMode, Suspense, useEffect} from 'react';
import {Route, Routes, Navigate} from 'react-router-dom';

import {MESSAGE_TYPE} from '@libs/constants/app';
import ROUTES from '@libs/constants/routes';
import messageManager from '@libs/messageManager';

import PageLoading from '@pages/loading';
import PageOnboarding from '@pages/onboarding';
import PageWelcome from '@pages/welcome';
import PageWallet from '@pages/wallet';
import PageSettings from '@pages/settings';

import {AppProvider} from '@store/Provider';

import './App.scss';

function App(props: {envType: number}) {
  useEffect(() => {
    messageManager.sendMessage({type: MESSAGE_TYPE.UPDATE_STORE_DATA});
  }, []);

  return (
    <StrictMode>
      <AppProvider>
        <div className="app">
          <Suspense fallback={<p>loading...</p>}>
            <Routes>
              <Route path={ROUTES.LOADING} element={<PageLoading />} />
              <Route path={ROUTES.ONBOARDING} element={<PageOnboarding />} />
              <Route path={ROUTES.WELCOME} element={<PageWelcome />} />
              <Route path={ROUTES.WALLET} element={<PageWallet />} />
              <Route path={ROUTES.SETTINGS} element={<PageSettings />} />
              <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
          </Suspense>
        </div>
      </AppProvider>
    </StrictMode>
  );
}

export default App;
