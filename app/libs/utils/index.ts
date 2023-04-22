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

/**
 * 获取略写地址
 * @param {string} address 钱包地址
 * @returns
 */
export function getThumbAccount(account: string): string {
  let res = '';

  if (typeof account === 'string') {
    res = `${account.slice(0, 5)}...${account.slice(-4)}`;
  }

  return res;
}

/**
 * 复制文案
 * @param {string} text 文案
 */
export async function copyText(text = ''): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Copied to clipboard');
  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}
