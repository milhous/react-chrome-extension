/**
 * 声明 - 二维码
 * @param {string} classname 类名
 * @param {string} sizes 尺寸（默认 160，正方形）
 * @param {string} text 文案内容
 */
export interface IWidgetQRCodeProps {
  className?: string;
  sizes?: string;
  text: string;
}
