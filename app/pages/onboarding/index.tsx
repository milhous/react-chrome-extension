import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import classnames from 'classnames';

import Assets from '@assets/index';
import {ENVIRONMENT_TYPE, MESSAGE_TYPE} from '@libs/constants/app';
import ROUTES from '@libs/constants/routes';
import messageManager from '@libs/messageManager';
import WidgetSpinner from '@widget/spinner';
import WidgetMaximize from '@widget/maximize';
import {IAppStoreState, IAppState} from '@store/types';

const stepInfo = [
  {
    title: '欢迎来到 Milhous',
    desc: '管理您的所有加密资产！简单易用！',
    img: Assets.picOnboardingDesktop,
  },
  {
    title: '整洁漂亮的加密货币投资组合！',
    desc: '持有BTC、ETH、XRP和许多其他基于ERC-20的代币。',
    img: Assets.picOnboardingIdea,
  },
  {
    title: '接收和向朋友发送钱款！',
    desc: '将加密货币发送给您的朋友，并附上个人消息。',
    img: Assets.picOnboardingSocial,
  },
  {
    title: '您的安全是我们的首要任务',
    desc: '我们一流的安全功能将完全保护您的安全。',
    img: Assets.picOnboardingMobile,
  },
];

const StepDot = (props: {index: number; curIndex: number}) => {
  const {index, curIndex} = props;

  return (
    <li
      className={classnames('h-2.5 w-2.5 rounded-full', index === curIndex ? 'bg-primary-blue' : 'bg-light-gray')}></li>
  );
};

export default function PageOnboarding() {
  const navigate = useNavigate();
  const {isOnboarding, env} = useSelector<IAppStoreState>(state => {
    return {isOnboarding: state.app.isOnboarding, env: state.app.env};
  }) as Partial<IAppState>;
  const isPopup = env === ENVIRONMENT_TYPE[ENVIRONMENT_TYPE.POPUP];

  const [stepIndex, setStepIndex] = useState<number>(0);

  const handleNext = () => {
    if (stepIndex + 1 < stepInfo.length) {
      setStepIndex(stepIndex + 1);
    }
  };

  const handleSkip = () => {
    setStepIndex(stepInfo.length - 1);
  };

  const handleComplete = () => {
    messageManager.sendMessage({
      type: MESSAGE_TYPE.ONBOARDING_COMPLETE,
    });
  };

  useEffect(() => {
    if (!isOnboarding) {
      navigate(ROUTES.WELCOME);
    }
  }, [isOnboarding]);

  return (
    <section className="app-page app-page_onboarding flex flex-col">
      <div className="flex h-[326px] min-h-[326px] w-full items-center justify-center">
        <img src={stepInfo[stepIndex].img} />
      </div>
      <div className="relative box-border flex h-full flex-col items-center justify-around rounded-t-[20px] bg-white pb-1 pt-6 shadow">
        <ul className="absolute inset-x-0 top-0 flex h-6 items-center justify-center space-x-2.5">
          {stepInfo.map((item, index) => {
            return <StepDot key={index} curIndex={stepIndex} index={index} />;
          })}
        </ul>
        <dl className="h-[128px] px-6 text-center">
          <dt className="text-[30px] font-bold leading-[40px] text-midnight-blue">{stepInfo[stepIndex].title}</dt>
          <dd className="mt-2.5 text-[15px] leading-6 text-dark-gray">{stepInfo[stepIndex].desc}</dd>
        </dl>
        <ul>
          <li>
            {stepIndex < stepInfo.length - 1 ? (
              <button className="app-btn_outline" onClick={handleNext}>
                下一步
              </button>
            ) : (
              <button className="app-btn_primary" onClick={handleComplete}>
                让我们开始吧
              </button>
            )}
          </li>
          <li className="h-6 text-center">
            {stepIndex < stepInfo.length - 1 && (
              <button className="mt-1.5 text-[15px] leading-6 text-dark-gray" onClick={handleSkip}>
                跳过
              </button>
            )}
          </li>
        </ul>
      </div>
      {isPopup && <WidgetMaximize />}
    </section>
  );
}
