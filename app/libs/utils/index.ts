import {memoize} from 'lodash';
import {ENVIRONMENT_TYPE, PAGE_TYPE} from '../constants/app';

const getEnvironmentTypeMemo = memoize(url => {
  const parsedUrl = new URL(url);

  if (parsedUrl.pathname.startsWith(`/${PAGE_TYPE.POPUP}`)) {
    return ENVIRONMENT_TYPE.POPUP;
  } else if (parsedUrl.pathname.startsWith(`/${PAGE_TYPE.HOME}`)) {
    return ENVIRONMENT_TYPE.FULLSCREEN;
  } else if (parsedUrl.pathname.startsWith(`/${PAGE_TYPE.NOTIFICATION}`)) {
    return ENVIRONMENT_TYPE.NOTIFICATION;
  }

  return ENVIRONMENT_TYPE.BACKGROUND;
});

export const getEnvironmentType = (url = window.location.href) => getEnvironmentTypeMemo(url);
