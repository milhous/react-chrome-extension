/**
 * 声明 - Portal
 * @param {string} classname 类名
 * @param {boolean} isActive 是否激活
 * @param {boolean} disableMaskClick 是否禁用蒙层点击
 * @param {function} onShow 显示回调
 * @param {function} onClose 关闭回调
 * @param {React.ReactNode | React.ReactNode[]} children 子元素
 */
export interface IWidgetPortalProps {
  children: React.ReactNode;
  selector: string;
  nodeRef?: MutableRefObject<any | undefined>;
}
