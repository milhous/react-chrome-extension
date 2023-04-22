import {useEffect, useState} from 'react';
import classnames from 'classnames';
import QRCode from 'qrcode';

import {IWidgetQRCodeProps} from './types';

const qrCodeOpts = {
  margin: 0,
};

/**
 * Widget - QRCode
 * @param {IWidgetQRCodeProps} props
 * @returns
 */
export default function WidgetQRCode(props: IWidgetQRCodeProps) {
  const {className = '', sizes = '160', text = ''} = props;
  const [qrcode, setQrcode] = useState<string>('');

  useEffect(() => {
    if (!!text) {
      QRCode.toDataURL(text, qrCodeOpts).then(url => {
        setQrcode(url);
      });
    }
  }, [text]);

  return (
    <div
      style={{width: `${sizes}px`, height: `${sizes}px`, minWidth: `${sizes}px`, minHeight: `${sizes}px`}}
      className={classnames('mx-auto box-border rounded-xl bg-white p-3 shadow', className)}>
      <img className="block h-full w-full" src={qrcode} />
    </div>
  );
}
