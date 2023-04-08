import {IAppState, IAppAction, ACTIONS_TYPE} from './types';

// 初始化状态
export const initialState: IAppState = {
  password: '',
};

// BatchQueryBalance reducer
export const reducer = (state: IAppState, action: IAppAction): any => {
  switch (action.type) {
    case ACTIONS_TYPE.CREATE_ACCOUNT: {
      const {password} = action.payload;

      console.log('password', password);

      return {
        ...state,
        password,
      };
    }
    case ACTIONS_TYPE.UNLOCK: {
      const {password} = action.payload;

      return {
        ...state,
        password,
      };
    }
    default:
      throw new Error('Unexpected action');
  }
};
