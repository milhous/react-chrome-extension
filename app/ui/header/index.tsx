import classnames from 'classnames';

import {IUIHeaderProps} from './types';
import HeaderBack from './components/HeaderBack';
import HeaderMenu from './components/HeaderMenu';

export default function UIHeader(props: IUIHeaderProps) {
  const {className = '', title = 'Milhous'} = props;

  return (
    <header className={classnames('ui-header sticky top-0 z-10 w-full', className)}>
      <section className="box-border flex h-12 min-h-[48px] items-center justify-between px-5">
        <HeaderBack />
        <h1 className="text-[18px]">{title}</h1>
        <HeaderMenu />
      </section>
    </header>
  );
}
