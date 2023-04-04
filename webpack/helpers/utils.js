import * as url from 'url';
import path from 'path';
import fs from 'fs-extra';

// 日志
import logger from './logger.js';

export const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = url.fileURLToPath(new URL('.', import.meta.url).toString());

// 路径或路径片段的序列解析为命令行绝对路径
export const resolveCliPath = (cliPath) => path.resolve(__dirname, '../../', cliPath);

// 当前应用路径
export const appDir = fs.realpathSync(process.cwd());
// 路径或路径片段的序列解析为应用绝对路径
export const resolveAppPath = (appPath) => path.resolve(appDir, appPath);
// 检测应用路径是否存在
export const existsAppPath = (appPath) => fs.pathExists(resolveAppPath(appPath));
// 读取应用json文件
export const readAppJson = (appPath) => fs.readJson(resolveAppPath(appPath));

export const resolvePath = (appPath) => path.resolve(process.cwd(), appPath);

/**
 * 获取目录信息
 * @param {string} dirPath 目录路径
 */
export const readDirInfo = async (dirPath) => {
  const reg = new RegExp(/\.DS_Store|node_modules$/);
  const path = resolveCliPath('../' + dirPath);
  const isExist = await fs.pathExists(path);

  if (!isExist) {
    return [];
  }

  let dirInfo = await fs.readdir(resolveCliPath('../' + dirPath));

  dirInfo = dirInfo.filter((item) => {
    return !reg.test(item);
  });

  return dirInfo;
};

/**
 * 读取json文件
 * @param filePath 文件路径
 */
export const readJson = (filePath) => fs.readJson(resolveCliPath('../' + filePath));

/**
 * 复制文件夹
 * @param {string} src 源路径
 * @param {string} dist 目标路径
 */
export const copyFolder = async (src, dist) => {
  const isSrcExist = await fs.pathExists(src);

  if (!isSrcExist) {
    return;
  }

  const isDestExist = await fs.pathExists(dist);

  if (isDestExist) {
    await fs.emptyDir(dist);
  } else {
    await fs.ensureDir(dist);
  }

  await fs.copy(src, dist);
};
