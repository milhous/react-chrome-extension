import IconHourglass from './assets/icon-hourglass.svg';

import './index.scss';

export default function WidgetSpinner() {
  return (
    <div className="widget-spinner">
      <IconHourglass />
      <i className="widget-spinner_top"></i>
      <i className="widget-spinner_bottom"></i>
    </div>
  );
}
