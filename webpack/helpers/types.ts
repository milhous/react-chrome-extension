/**
 * 命令类型
 * @property INIT 初始化
 * @property LAUNCH 启动（多个应用）
 * @property START 启动（单个项目）
 * @property BUILD 构建
 * @property I18N 多语言
 * @property INFO 信息（应用）
 */
export const CommandType = {
  INIT: 'init',
  LAUNCH: 'launch',
  START: 'start',
  BUILD: 'build',
  I18N: 'i18n',
  INFO: 'info',
};

/**
 * 模式类型
 * @property DEVELOPMENT 开发
 * @property PRODUCTION 生产
 * @property NONE 不使用任何默认优化选项
 */
export const ModeType = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  NONE: 'none',
};

/**
 * 导出模式类型
 * @property NULL 无
 * @property FULL 全量
 * @property EMPTY 空项
 */
export enum ExportModeType {
  NULL = 0,
  FULL,
  EMPTY,
}
