import {useNavigate} from 'react-router-dom';

import Assets from '@assets/index';
import {ENVIRONMENT_TYPE} from '@libs/constants/app';
import {getEnvironmentType} from '@libs/utils';
import extension from '@libs/extension';

export default function WidgetMaximize() {
  const navigate = useNavigate();

  const handleMaximize = evt => {
    evt.preventDefault();

    getEnvironmentType() === ENVIRONMENT_TYPE.POPUP ? extension.openExtensionInBrowser('') : navigate('/home');
  };

  return (
    <button className="absolute right-[30px] top-[30px]" onClick={handleMaximize}>
      <Assets.IconMaximize className="text-primary-blue" />
    </button>
  );
}