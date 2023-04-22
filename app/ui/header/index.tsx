import classnames from 'classnames';

import {IUIHeaderProps} from './types';
import HeaderBack from './components/HeaderBack';
import HeaderMenu from './components/HeaderMenu';

import './index.scss';

export default function UIHeader(props: IUIHeaderProps) {
  const {className = '', title = 'Milhous'} = props;

  return (
    <header className={classnames('ui-header', className)}>
      <section>
        <HeaderBack />
        <h1>{title}</h1>
        <HeaderMenu />
      </section>
    </header>
  );
}
