import chalk from 'chalk';

// 解决chalk设置样式没有生效
chalk.level = 1;

/**
 * 类型 -日志颜色
 * @property WHITE 白色
 * @property GREEN 绿色
 * @property YELLOW 黄色
 * @property RED 红色
 */
enum LoggerColorType {
  'WHITE' = 0,
  'GREEN',
  'YELLOW',
  'RED',
}

/**
 * 声明 - 日志
 * @method show 显示
 * @method default 默认
 * @method info 信息
 * @method warn 警告
 * @method error 错误
 */
interface ILogger {
  show(msg: string, type: number): void;
  default(msg: string): void;
  info(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
}

// 日志
class Logger {
  constructor() {}

  static instance: ILogger;

  static getInstance(): ILogger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }

    return Logger.instance;
  }

  /**
   * 显示
   * @param {string} msg 消息
   * @param {number} type 类型
   */
  public show(msg: string, type: number): void {
    const color = LoggerColorType[type].toLowerCase();

    console.log(chalk[color].bold(msg));
  }

  /**
   * 默认
   * @param {string} msg 消息
   */
  public default(msg: string): void {
    const colorType = LoggerColorType.WHITE;

    this.show(msg, colorType);
  }

  /**
   * 信息
   * @param {string} msg 消息
   */
  public info(msg: string): void {
    const colorType = LoggerColorType.GREEN;

    this.show(msg, colorType);
  }

  /**
   * 警告
   * @param {string} msg 消息
   */
  public warn(msg: string): void {
    const colorType = LoggerColorType.YELLOW;

    this.show(`${msg}`, colorType);
  }

  /**
   * 错误
   * @param {string} msg 消息
   */
  public error(msg: string): void {
    const colorType = LoggerColorType.RED;

    this.show(`${msg}`, colorType);
  }
}

// 定义全局变量
const logger: ILogger = Logger.getInstance();

export default logger;
