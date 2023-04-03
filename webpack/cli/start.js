import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import logger from '../helpers/logger.js';
import store from '../helpers/store.js';
import getWebpackConfig from '../webpack/index.js';

// 启动（单个项目）
export default async (args) => {
  await store.init(args);

  const basicConfig = store.getBasicConfig();
  const name = basicConfig.name;
  const devConfig = store.getDevConfig();
  const webpackConfig = await getWebpackConfig();
  const compiler = webpack(webpackConfig);

  logger.info(`\n=== Package <${name}> Service is starting.===\n`);

  const server = new WebpackDevServer(webpackConfig.devServer, compiler);

  server.startCallback(() => {
    logger.info(`\n=== Package <${name}> Starting server on https:${devConfig.publicPath} ===\n`);
  });
};
