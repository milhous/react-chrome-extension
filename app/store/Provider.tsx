import React, {createContext, useReducer, useContext, useMemo} from 'react';

import {IAppContextProps} from './types';
import {reducer, initialState} from './reducer';

const CountContext = createContext({} as IAppContextProps);

// APP Provider
export function AppProvider({children}: {children: React.ReactNode}): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);
  const contextValue = useMemo(() => {
    return {state, dispatch};
  }, [state, dispatch]);

  return <CountContext.Provider value={contextValue}>{children}</CountContext.Provider>;
}

// APP Hook
export const useAppState = () => {
  const contextValue = useContext(CountContext);

  return contextValue;
};
