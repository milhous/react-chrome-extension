/**
 * 声明 - 弹层
 * @param {string} classname 类名
 * @param {boolean} isActive 是否激活
 * @param {boolean} disableMaskClick 是否禁用蒙层点击
 * @param {function} onShow 显示回调
 * @param {function} onClose 关闭回调
 * @param {React.ReactNode | React.ReactNode[]} children 子元素
 */
export interface IWidgetModalProps {
  className?: string;
  isActive: boolean;
  disableMaskClick?: boolean;
  onShow?: () => void;
  onClose?: () => void;
  children?: React.ReactNode | React.ReactNode[];
}
