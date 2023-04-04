import * as url from 'url';
import path from 'path';
import fs from 'fs-extra';

export const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = url.fileURLToPath(new URL('.', import.meta.url).toString());

export const resolvePath = appPath => path.resolve(process.cwd(), appPath);

/**
 * 读取json文件
 * @param filePath 文件路径
 */
export const readJson = filePath => fs.readJSONSync(resolvePath(filePath));
