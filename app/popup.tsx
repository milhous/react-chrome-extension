import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';

import WidgetMaximize from '@widget/maximize';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <BrowserRouter>
    <main className="relative h-full min-h-[600px] w-full min-w-[384px] ">
      <App page="popup" />
      <WidgetMaximize />
    </main>
  </BrowserRouter>,
);
