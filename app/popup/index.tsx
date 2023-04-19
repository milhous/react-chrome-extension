import ReactDOM from 'react-dom/client';
import {MemoryRouter} from 'react-router-dom';

import {ENVIRONMENT_TYPE, MESSAGE_TYPE} from '@libs/constants/app';
import messageManager from '@libs/messageManager';
import store from '@store/index';
import {update} from '@store/reducer';

import App from '../App';

messageManager.init(ENVIRONMENT_TYPE.POPUP, msg => {
  if (MESSAGE_TYPE.UPDATE_STORE_DATA === msg.type) {
    store.dispatch(update(msg.payload));
  }
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <MemoryRouter initialEntries={['/popup']}>
    <main className="app-popup relative h-[600px] w-[375px] overflow-auto">
      <App />
    </main>
  </MemoryRouter>,
);
