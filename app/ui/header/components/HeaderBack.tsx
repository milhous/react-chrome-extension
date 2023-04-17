import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

import Assets from '@assets/index';

// header - menu
export default function HeaderMenu() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isBack, setBackState] = useState<boolean>(false);

  useEffect(() => {
    setBackState(!!location.state && !!location.state.from);

    console.log(location);
  }, [location]);

  // 显示
  const handleBack = () => {
    navigate(-1);
  };

  if (isBack) {
    return (
      <button onClick={handleBack}>
        <Assets.IconChevronLeft />
      </button>
    );
  } else {
    return <div></div>;
  }
}
