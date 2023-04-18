import {useEffect, useState} from 'react';
import {useNavigate, useMatch} from 'react-router-dom';

import Assets from '@assets/index';
import ROUTES from '@libs/constants/routes';

// header - menu
export default function HeaderMenu() {
  const navigate = useNavigate();
  const match = useMatch(ROUTES.WALLET);

  const [isBack, setBackState] = useState<boolean>(false);

  useEffect(() => {
    setBackState(!match);
  }, [match]);

  // 显示
  const handleBack = () => {
    navigate(-1);
  };

  if (isBack) {
    return (
      <button className="app-btn_icon" onClick={handleBack}>
        <Assets.IconChevronLeft />
      </button>
    );
  } else {
    return <img className="aspect-square w-[30px]" src={Assets.IconLogo} />;
  }
}
