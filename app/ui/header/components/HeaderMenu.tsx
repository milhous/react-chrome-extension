import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {NavLink, useMatch, useNavigate} from 'react-router-dom';
import Jazzicon, {jsNumberForAddress} from 'react-jazzicon';

import Assets from '@assets/index';
import {MESSAGE_TYPE, ENVIRONMENT_TYPE} from '@libs/constants/app';
import ROUTES from '@libs/constants/routes';
import messageManager from '@libs/messageManager';
import extension from '@libs/extension';
import {getThumbAccount} from '@libs/utils';
import {IAppStoreState, IAppState} from '@store/types';
import WidgetDrawer, {WidgetDrawerAnchorType} from '@widget/drawer';
import './HeaderMenu.scss';

// Jazzicon
const JazzIcon = ({address}: {address: string}) => {
  return (
    <dl className="ui-header-menu_jazzicon">
      <dt>
        <Jazzicon diameter={60} seed={jsNumberForAddress(address)} />
      </dt>
      <dd>{getThumbAccount(address)}</dd>
    </dl>
  );
};

// 展开视图
const ExpandView = () => {
  const handleMaximize = evt => {
    evt.preventDefault();

    extension.openExtensionInBrowser('');
  };

  return (
    <li onClick={handleMaximize}>
      <Assets.IconMaximize />
      展开视图
    </li>
  );
};

/**
 * 移除账户
 * @param {string} address 当前账户地址
 */
const RemoveAccount = ({address}: {address: string}) => {
  const handleRemove = () => {
    messageManager.sendMessage({
      type: MESSAGE_TYPE.REMOVE_ACCOUNT,
      payload: {
        address,
      },
    });
  };

  return (
    <li className={address === '' ? '!hidden' : ''} onClick={handleRemove}>
      <Assets.IconTrash />
      删除账户
    </li>
  );
};

// 注销
const SignOut = () => {
  const handleLogout = () => {
    messageManager.sendMessage({
      type: MESSAGE_TYPE.LOCK,
    });
  };

  return (
    <li onClick={handleLogout}>
      <Assets.IconLogout />
      注销
    </li>
  );
};

// header - menu
export default function HeaderMenu() {
  const navigate = useNavigate();
  const match = useMatch(ROUTES.SETTINGS);
  const {
    isUnlocked,
    isTabOpen,
    env,
    address = '',
  } = useSelector<IAppStoreState>(state => {
    return {
      isUnlocked: state.app.isUnlocked,
      isTabOpen: state.app.isTabOpen,
      env: state.app.env,
      address: state.app.address,
    };
  }) as Partial<IAppState>;
  const isPopup = env === ENVIRONMENT_TYPE[ENVIRONMENT_TYPE.POPUP];

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  // 显示
  const handleDrawer = (state: boolean) => {
    setDrawerOpen(state);
  };

  useEffect(() => {
    if (!isUnlocked) {
      navigate(ROUTES.WELCOME, {replace: true});
    }
  }, [isUnlocked]);

  useEffect(() => {
    // 当没有账户时，除了设置，都跳转至钱包页
    if (address === '' && !match) {
      navigate(ROUTES.WALLET, {replace: true});
    }
  }, [address]);

  return (
    <div className="flex items-center justify-center">
      <button className="app-btn_icon" onClick={() => handleDrawer(true)}>
        <Assets.IconAlignRight />
      </button>
      <WidgetDrawer
        className="ui-header-menu"
        anchor={WidgetDrawerAnchorType.RIGHT}
        open={drawerOpen}
        onClose={handleDrawer}>
        <div className="ui-header-menu_content space-y-10">
          <JazzIcon address={address} />
          <ul className="h-full">
            <li>
              <NavLink to={ROUTES.WALLET} replace className={({isActive}) => (isActive ? 'active' : '')}>
                <Assets.IconHome />
                钱包
              </NavLink>
            </li>
            <li>
              <Assets.IconPlusCircle />
              Deposit
            </li>
            <li>
              <Assets.IconArrowLeftCircle /> Withdraw
            </li>
            <li>
              <Assets.IconArrowRightCircle />
              Send
            </li>
            <li>
              <Assets.IconShuffle />
              Exchange
            </li>
            <li>
              <NavLink to={ROUTES.PROFILE} className={({isActive}) => (isActive ? 'active' : '')}>
                <Assets.IconUser />
                账户详情
              </NavLink>
            </li>
            {!isTabOpen && isPopup && <ExpandView />}
            <RemoveAccount address={address} />
            <li>
              <NavLink to={ROUTES.SETTINGS} className={({isActive}) => (isActive ? 'active' : '')}>
                <Assets.IconSettings />
                设置
              </NavLink>
            </li>
          </ul>
          <ul>
            <SignOut />
          </ul>
        </div>
      </WidgetDrawer>
    </div>
  );
}
