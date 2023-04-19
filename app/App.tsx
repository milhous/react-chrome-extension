import {StrictMode, Suspense} from 'react';
import {Route, Routes, Navigate} from 'react-router-dom';

import ROUTES from '@libs/constants/routes';
import {AppProvider} from '@store/Provider';
import PageLoading from '@pages/loading';
import PageOnboarding from '@pages/onboarding';
import PageWelcome from '@pages/welcome';
import PageWallet from '@pages/wallet';
import PageProfile from '@pages/profile';
import PageSettings from '@pages/settings';

import './App.scss';

function App() {
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
              <Route path={ROUTES.PROFILE} element={<PageProfile />} />
              <Route path={ROUTES.SETTINGS} element={<PageSettings />} />
              <Route path="*" element={<Navigate replace to={ROUTES.LOADING} />} />
            </Routes>
          </Suspense>
        </div>
      </AppProvider>
    </StrictMode>
  );
}

export default App;
