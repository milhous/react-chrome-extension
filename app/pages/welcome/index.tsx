import {useSelector} from 'react-redux';

import Assets from '@assets/index';
import {ENVIRONMENT_TYPE} from '@libs/constants/app';
import {IAppStoreState, IAppState} from '@store/types';

import WidgetMaximize from '@widget/maximize';

import Unlock from './components/Unlock';
import CreateAccount from './components/CreateAccount';

export default function PageWelcome() {
  const {isInitialized, isTabOpen, env} = useSelector<IAppStoreState>(state => {
    return {isInitialized: state.app.isInitialized, isTabOpen: state.app.isTabOpen, env: state.app.env};
  }) as Partial<IAppState>;
  const isPopup = env === ENVIRONMENT_TYPE[ENVIRONMENT_TYPE.POPUP];

  return (
    <section className="app-page app-page_welcome !fixed inset-0 flex flex-col items-center pt-[50px]">
      <img className="aspect-square w-[120px]" src={Assets.IconLogo} />
      <dl className="mt-[30px] text-center">
        <dt className="text-[36px] font-bold leading-[45px] text-midnight-blue">
          Welcome to
          <br />
          Milhous
        </dt>
        <dd className="mt-2.5 px-[48px] text-[15px] leading-6 text-dark-gray">管理您的所有加密资产！它简单易操作！</dd>
      </dl>
      {isInitialized && <Unlock />}
      {!isInitialized && <CreateAccount />}
      {!isTabOpen && isPopup && <WidgetMaximize />}
      {/* <span className="mt-4 cursor-pointer text-dark-gray">忘记密码了？</span> */}
    </section>
  );
}
