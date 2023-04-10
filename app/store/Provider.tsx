import React from 'react';
import {Provider} from 'react-redux';

import store from './index';

// APP Provider
export function AppProvider({children}: {children: React.ReactNode}): JSX.Element {
  return <Provider store={store}>{children}</Provider>;
}
