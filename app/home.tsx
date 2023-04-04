import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <BrowserRouter>
    <main className="group/home relative min-h-full w-full">
      <App page="home" />
    </main>
  </BrowserRouter>,
);
