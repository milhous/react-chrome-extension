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
  const classSizes = `h-[${sizes}px] w-[${sizes}px] min-h-[${sizes}px] min-w-[${sizes}px]`;

  useEffect(() => {
    if (!!text) {
      QRCode.toDataURL(text, qrCodeOpts).then(url => {
        setQrcode(url);
      });
    }
  }, [text]);

  return (
    <div className={classnames('mx-auto box-border rounded-xl bg-white p-3 shadow', classSizes, className)}>
      <img className="block h-full w-full" src={qrcode} />
    </div>
  );
}
