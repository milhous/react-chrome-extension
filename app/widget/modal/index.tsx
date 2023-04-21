import React, {useState, useEffect, useRef} from 'react';
import classnames from 'classnames';
import {CSSTransition} from 'react-transition-group';

import WidgetPortal from '@widget/portal';

import {IWidgetModalProps} from './types';
import './index.scss';

// Widget - Modal
const WidgetModal = (props: IWidgetModalProps): JSX.Element => {
  const {className = '', isActive, disableMaskClick = true, onShow, onClose, children} = props;
  const nodeRef = useRef(null);

  const [isIn, setInState] = useState<boolean>(isActive);

  useEffect(() => {
    setInState(isActive);
  }, [isActive]);

  // 关闭
  const handleClose = (evt: any) => {
    evt.stopPropagation();

    if (disableMaskClick) {
      return;
    }

    setInState(false);
  };

  return (
    <WidgetPortal selector="widgetModal">
      <CSSTransition
        in={isIn}
        timeout={300}
        classNames="widget-modal"
        unmountOnExit
        onEnter={() => !!onShow && onShow()}
        onExited={() => !!onClose && onClose()}
        nodeRef={nodeRef}>
        <div className={classnames('widget-modal', className)} ref={nodeRef}>
          <div className="widget-modal_mask" onClick={handleClose}></div>
          <div className="widget-modal_container">{children}</div>
        </div>
      </CSSTransition>
    </WidgetPortal>
  );
};

export default WidgetModal;
