import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';

import WidgetMaximize from '@widget/maximize';

import App from '../App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <BrowserRouter basename="popup">
    <main className="relative h-[600px] w-[375px] overflow-auto">
      <App page="popup" />
      <WidgetMaximize />
    </main>
  </BrowserRouter>,
);
