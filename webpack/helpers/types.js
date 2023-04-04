/**
 * 命令类型
 * @property START 启动（单个项目）
 * @property BUILD 构建
 * @property I18N 多语言
 */
export const CommandType = {
  START: 'start',
  BUILD: 'build',
  I18N: 'i18n',
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
export const ExportModeType = {
  NULL: 0,
  FULL: 1,
  EMPTY: 2,
};
