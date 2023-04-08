import {StrictMode, Suspense} from 'react';
import {Route, Routes, Navigate} from 'react-router-dom';

import ROUTES from '@libs/constants/routes';

import PageWelcome from '@pages/welcome';
import PageWallet from '@pages/wallet';

import {AppProvider} from '@store/Provider';

import './App.scss';

function App(props: {page: string}) {
  const path = `/${props.page}`;

  console.log(path);

  return (
    <StrictMode>
      <AppProvider>
        <div className="app">
          <Suspense fallback={<p>loading...</p>}>
            <Routes>
              <Route index path="/" element={<PageWelcome />} />
              <Route index path={ROUTES.WALLET} element={<PageWallet />} />
              <Route path="*" element={<Navigate replace to="/" />} />
            </Routes>
          </Suspense>
        </div>
      </AppProvider>
    </StrictMode>
  );
}

export default App;
