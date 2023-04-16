import browser, {Runtime} from 'webextension-polyfill';
import PortStream from 'extension-port-stream';

import {ENVIRONMENT_TYPE} from '@libs/constants/app';

type IMessageManagerCallback = (msg: any) => void;

interface IMessageManager {
  init(portname: ENVIRONMENT_TYPE, cb?: IMessageManagerCallback): void;
  sendMessage(msg: object): void;
}

// 消息管理
class MessageManager {
  private _portname: string;
  private _port: Runtime.Port;
  private _stream: any;
  private _cb: IMessageManagerCallback;

  constructor() {}

  static instance;

  static getInstance() {
    if (!MessageManager.instance) {
      MessageManager.instance = new MessageManager();
    }

    return MessageManager.instance;
  }

  /**
   * 初始化
   * @param portname
   */
  public init(portname: ENVIRONMENT_TYPE, cb?: IMessageManagerCallback) {
    this._portname = ENVIRONMENT_TYPE[portname];
    this._port = browser.runtime.connect({name: this._portname});
    this._stream = new PortStream(this._port);

    this._port.onMessage.addListener(this._receiveMsg.bind(this));
    this._port.onDisconnect.addListener(this._receiveMsg);

    if (typeof cb === 'function') {
      this._cb = cb;
    }
  }

  /**
   * 发送消息
   * @param {object} msg 消息
   */
  public sendMessage(msg: object) {
    if (!this._port) {
      return;
    }

    console.log(`client ${this._portname} sendMessage`, msg);

    this._port.postMessage(msg);
  }

  // 断开连接
  public disconnect() {}

  /**
   * 接收消息
   * @param {object} msg 消息
   */
  private _receiveMsg(msg: object) {
    console.log(`client ${this._portname} receive msg`, msg);

    if (typeof this._cb === 'function') {
      this._cb(msg);
    }
  }
}

// 定义全局变量
const messageManager: IMessageManager = MessageManager.getInstance();

export default messageManager;
