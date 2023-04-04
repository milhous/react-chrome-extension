import {merge} from 'webpack-merge';

import store from '../helpers/store.js';

// 通用
import getCommonConfig from './common.js';
// 样式
import getStylesConfig from './styles.js';
// 文件
import getFilesConfig from './files.js';
// 脚本
import getScrpitsConfig from './scrpits.js';
// 插件
import getPluginConfig from './plugins.js';
// 开发
import getDevelopmentConfig from './development.js';
// 生成
import getProductionConfig from './production.js';

// webpack 配置
export default async () => {
  const basicConfig = store.getBasicConfig();
  const devConfig = store.getDevConfig();

  const commonConfig = getCommonConfig(devConfig, basicConfig);
  const stylesConfig = getStylesConfig(devConfig.isDev);
  const filesConfig = getFilesConfig(devConfig.isDev, devConfig.browserslist);
  const scrpitsConfig = getScrpitsConfig(devConfig.isDev, devConfig.browserslist);
  const pluginsConfig = getPluginConfig(devConfig, basicConfig);
  const developmentConfig = getDevelopmentConfig(basicConfig.port, basicConfig.dist);
  const productionConfig = getProductionConfig();

  const config = merge(
    commonConfig,
    stylesConfig,
    filesConfig,
    scrpitsConfig,
    pluginsConfig,
    devConfig.isDev ? developmentConfig : productionConfig,
  );

  return config;
};
