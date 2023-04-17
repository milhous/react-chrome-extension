import classnames from 'classnames';

import Assets from '@assets/index';

import {IUIHeaderProps} from './types';
import HeaderBack from './components/HeaderBack';
import HeaderMenu from './components/HeaderMenu';

export default function UIHeader(props: IUIHeaderProps) {
  const {className = '', title = 'Milhous'} = props;

  return (
    <header className={classnames('sticky top-0', className)}>
      <section className="box-border flex h-12 items-center justify-between px-5">
        <HeaderBack />
        <h1 className="text-[20px]">{title}</h1>
        <HeaderMenu />
      </section>
    </header>
  );
}
