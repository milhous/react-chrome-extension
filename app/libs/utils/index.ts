import {memoize} from 'lodash';
import {ENVIRONMENT_TYPE, PAGE_TYPE} from '../constants/app';

const getEnvironmentTypeMemo = memoize(url => {
  const parsedUrl = new URL(url);
  if (parsedUrl.pathname === `/${PAGE_TYPE.POPUP}.html`) {
    return ENVIRONMENT_TYPE.POPUP;
  } else if (['/home.html'].includes(parsedUrl.pathname)) {
    return ENVIRONMENT_TYPE.FULLSCREEN;
  } else if (parsedUrl.pathname === `/${PAGE_TYPE.NOTIFICATION}.html`) {
    return ENVIRONMENT_TYPE.NOTIFICATION;
  }
  return ENVIRONMENT_TYPE.BACKGROUND;
});

export const getEnvironmentType = (url = window.location.href) => getEnvironmentTypeMemo(url);
