import {configureStore} from '@reduxjs/toolkit';
import appReducer from './reducer';

const store = configureStore({
  reducer: {
    app: appReducer,
  },
});

// store.subscribe(() => console.log(store.getState()));

export default store;
