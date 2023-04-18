import {useState} from 'react';
import {useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
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
  const {env, address = ''} = useSelector<IAppStoreState>(state => {
    return {env: state.app.env, address: state.app.address};
  }) as Partial<IAppState>;
  const isPopup = env === ENVIRONMENT_TYPE[ENVIRONMENT_TYPE.POPUP];

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  // 显示
  const handleDrawer = (state: boolean) => {
    setDrawerOpen(state);
  };

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
              <Link to={ROUTES.WALLET} replace>
                <Assets.IconHome />
                钱包
              </Link>
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
              <Assets.IconUser />
              Profile
            </li>
            {isPopup && <ExpandView />}
            <li>
              <Link to={ROUTES.SETTINGS}>
                <Assets.IconSettings />
                设置
              </Link>
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
