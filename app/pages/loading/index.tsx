import {useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';

import Assets from '@assets/index';
import {ENVIRONMENT_TYPE, MESSAGE_TYPE, WORKER_KEEP_ALIVE_INTERVAL} from '@libs/constants/app';
import ROUTES from '@libs/constants/routes';
import messageManager from '@libs/messageManager';
import {IAppStoreState, IAppState} from '@store/types';
import WidgetSpinner from '@widget/spinner';
import WidgetMaximize from '@widget/maximize';

export default function PageLoading() {
  const navigate = useNavigate();
  const {isLaunch, isConnected, isOnboarding, isUnlocked, env} = useSelector<IAppStoreState>(state => {
    return {
      isLaunch: state.app.isLaunch,
      isConnected: state.app.isConnected,
      isOnboarding: state.app.isOnboarding,
      isUnlocked: state.app.isUnlocked,
      env: state.app.env,
    };
  }) as Partial<IAppState>;
  const isPopup = env === ENVIRONMENT_TYPE[ENVIRONMENT_TYPE.POPUP];
  const timer = useRef<NodeJS.Timer>();

  useEffect(() => {
    timer.current = setInterval(() => {
      messageManager.sendMessage({type: MESSAGE_TYPE.WORKER_KEEP_ALIVE_MESSAGE});
    }, WORKER_KEEP_ALIVE_INTERVAL);

    return () => {
      clearInterval(timer.current);
    };
  }, []);

  useEffect(() => {
    if (isConnected) {
      clearInterval(timer.current);
    }
  }, [isConnected]);

  useEffect(() => {
    let to = '';

    if (isLaunch) {
      if (isOnboarding) {
        to = ROUTES.ONBOARDING;
      } else {
        if (isUnlocked) {
          to = ROUTES.WALLET;
        } else {
          to = ROUTES.WELCOME;
        }
      }
    }

    if (to !== '') {
      navigate(to, {
        replace: true,
      });
    }
  }, [isLaunch, isOnboarding, isUnlocked]);

  return (
    <section className="app-page app-page_loading !fixed inset-0 flex flex-col items-center justify-center bg-white">
      <img className="aspect-square w-20" src={Assets.IconLogo} />
      <p className="mb-12 mt-5 text-[19px] leading-6 text-midnight-blue">Welcome to Milhous</p>
      <div>
        <WidgetSpinner />
      </div>
      {isPopup && <WidgetMaximize />}
    </section>
  );
}
