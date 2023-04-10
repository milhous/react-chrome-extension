import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';

import {ENVIRONMENT_TYPE, MESSAGE_TYPE} from '@libs/constants/app';
import messageManager from '@libs/messageManager';
import store from '@store/index';
import {update} from '@store/reducer';
import WidgetMaximize from '@widget/maximize';

import App from '../App';

messageManager.init(ENVIRONMENT_TYPE.POPUP, msg => {
  if (MESSAGE_TYPE.UPDATE_STORE_DATA === msg.type) {
    store.dispatch(update(msg.payload));
  }
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <BrowserRouter basename="popup">
    <main className="app-popup relative h-[600px] w-[375px] overflow-auto">
      <App envType={ENVIRONMENT_TYPE.POPUP} />
      <WidgetMaximize />
    </main>
  </BrowserRouter>,
);
