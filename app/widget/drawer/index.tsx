import {useState, useEffect, useRef} from 'react';
import classnames from 'classnames';

import Assets from '@assets/index';
import {ANIMATION_STATE} from '@libs/constants/app';
import WidgetPortal from '@widget/portal';

import {IWidgetDrawerProps} from './types';
import './index.scss';

/**
 * 获取动画状态
 * @param {boolean} open 是否开启
 * @returns
 */
const getAnimationState = (open: boolean): number => {
  return open ? ANIMATION_STATE.IN : ANIMATION_STATE.OUT;
};

/**
 * 方向
 * @property LEFT 左
 * @property RIGHT 右
 * @property TOP 上
 * @property BOTTOM 下
 */
export const WidgetDrawerAnchorType = {
  LEFT: 'left',
  RIGHT: 'right',
  TOP: 'top',
  BOTTOM: 'bottom',
};

export default function WidgetDrawer(props: IWidgetDrawerProps) {
  const {children, className = '', anchor = WidgetDrawerAnchorType.RIGHT, open, onClose} = props;
  const ref = useRef<HTMLDivElement>(null);

  const [animationState, setAnimationState] = useState<number>(ANIMATION_STATE.OUT);

  useEffect(() => {
    const state = getAnimationState(open);

    setAnimationState(state);
  }, [open]);

  // 监听动画状态
  const onAnimationend = () => {
    if (ref.current?.classList.contains('ing')) {
      !!onClose && onClose(false);
    }
  };

  // 更新Side状态
  const onUpdateSideState = (state: number) => {
    setAnimationState(state);
  };

  useEffect(() => {
    ref.current && ref.current.addEventListener('animationend', onAnimationend);

    return () => {
      ref.current && ref.current.removeEventListener('animationend', onAnimationend);
    };
  }, []);

  return (
    <WidgetPortal selector="widgetDrawer" nodeRef={ref}>
      <div
        className={classnames('widget-drawer', className, anchor, ANIMATION_STATE[animationState].toLowerCase())}
        ref={ref}>
        <div className="widget-drawer_mask" onClick={() => onUpdateSideState(ANIMATION_STATE.ING)}></div>
        <div className="widget-drawer_content">
          <button className="widget-drawer_close" onClick={() => onUpdateSideState(ANIMATION_STATE.ING)}>
            <Assets.IconX />
          </button>
          {children}
        </div>
      </div>
    </WidgetPortal>
  );
}
