import {StrictMode, Suspense} from 'react';
import {Route, Routes, Navigate} from 'react-router-dom';

import './App.scss';

import Home from './pages/home';
import Login from './pages/login';

function App(props: {page: string}) {
  const path = `/${props.page}.html`;

  return (
    <StrictMode>
      <div className="app">
        <Suspense fallback={<p>loading...</p>}>
          <Routes>
            <Route path={path} element={<Home />}>
              <Route path="*" element={<Navigate replace to="/" />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
    </StrictMode>
  );
}

export default App;
