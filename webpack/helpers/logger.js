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
const LoggerColorType = {
  WHITE: 'white',
  GREEN: 'green',
  YELLOW: 'yellow',
  RED: 'red',
};

// 日志
class Logger {
  constructor() {}

  static instance;

  static getInstance() {
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
  show(msg, type) {
    console.log(chalk[type].bold(msg));
  }

  /**
   * 默认
   * @param {string} msg 消息
   */
  default(msg) {
    const color = LoggerColorType.WHITE;

    this.show(`${msg}`, color);
  }

  /**
   * 信息
   * @param {string} msg 消息
   */
  info(msg) {
    const colorType = LoggerColorType.GREEN;

    this.show(`${msg}`, colorType);
  }

  /**
   * 警告
   * @param {string} msg 消息
   */
  warn(msg) {
    const colorType = LoggerColorType.YELLOW;

    this.show(`${msg}`, colorType);
  }

  /**
   * 错误
   * @param {string} msg 消息
   */
  error(msg) {
    const colorType = LoggerColorType.RED;

    this.show(`${msg}`, colorType);
  }
}

// 定义全局变量
const logger = Logger.getInstance();

export default logger;
