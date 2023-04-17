import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';

import Assets from '@assets/index';
import {ENVIRONMENT_TYPE} from '@libs/constants/app';
import ROUTES from '@libs/constants/routes';
import WidgetSpinner from '@widget/spinner';
import WidgetMaximize from '@widget/maximize';
import {IAppStoreState, IAppState} from '@store/types';

export default function PageLoading() {
  const navigate = useNavigate();
  const {isLaunch, isOnboarding, isUnlocked, env} = useSelector<IAppStoreState>(state => {
    return {
      isLaunch: state.app.isLaunch,
      isOnboarding: state.app.isOnboarding,
      isUnlocked: state.app.isUnlocked,
      env: state.app.env,
    };
  }) as Partial<IAppState>;
  const isPopup = env === ENVIRONMENT_TYPE[ENVIRONMENT_TYPE.POPUP];

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
    <section className="app-page app-page_loading flex flex-col items-center justify-center bg-white">
      <img className="aspect-square w-20" src={Assets.IconLogo} />
      <p className="mb-12 mt-5 text-[19px] leading-6 text-midnight-blue">Welcome to Milhous</p>
      <div>
        <WidgetSpinner />
      </div>
      {isPopup && <WidgetMaximize />}
    </section>
  );
}
