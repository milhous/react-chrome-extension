import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';

import {ENVIRONMENT_TYPE, MESSAGE_TYPE} from '@libs/constants/app';
import messageManager from '@libs/messageManager';
import store from '@store/index';
import {update} from '@store/reducer';

import App from '../App';

import './index.scss';

messageManager.init(ENVIRONMENT_TYPE.FULLSCREEN, msg => {
  if (MESSAGE_TYPE.UPDATE_STORE_DATA === msg.type) {
    store.dispatch(update(msg.payload));
  }
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <BrowserRouter basename="home">
    <main className="app-home relative h-full w-full overflow-auto">
      <App envType={ENVIRONMENT_TYPE.FULLSCREEN} />
    </main>
  </BrowserRouter>,
);
