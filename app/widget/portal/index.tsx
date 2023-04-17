import {useRef, useEffect, useState} from 'react';
import {createPortal} from 'react-dom';
import {IWidgetPortalProps} from './types';

// 获取容器
const getContainer = (selector: string): any => {
  let container = document.querySelector('#' + selector);

  if (!container) {
    container = document.createElement('div');
    container.id = selector;
    document.body.appendChild(container);
  }

  return container;
};

// Widget - Portal
export default function WidgetPortal({children, selector, nodeRef}: IWidgetPortalProps) {
  const ref = useRef<Element>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = getContainer(selector);

    if (!!nodeRef) {
      nodeRef.current = ref.current;
    }

    setMounted(true);
  }, [selector]);

  return mounted && ref.current ? createPortal(children, ref.current) : null;
}
