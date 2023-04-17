/**
 * 声明 - 抽屉
 * @property {React.ReactNode} children 子节点
 * @property {string} className 类名
 * @property {string} anchor 方向
 * @property {boolean} open 是否开启
 * @property {function} onClose 关闭回调函数
 */
export interface IWidgetDrawerProps {
  children: React.ReactNode;
  className?: string;
  anchor: string;
  open: boolean;
  onClose: (state: boolean) => void;
}
