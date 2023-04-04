import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import logger from '../helpers/logger.js';
import store from '../helpers/store.js';
import getWebpackConfig from '../config/index.js';

// 启动
async function runServer() {
  store.init('dev', 'development', ['popup', 'home']);

  const devConfig = store.getDevConfig();
  const webpackConfig = await getWebpackConfig();
  const compiler = webpack(webpackConfig);

  logger.info(`\n=== App Service is starting.===\n`);

  const server = new WebpackDevServer(webpackConfig.devServer, compiler);

  server.startCallback(() => {
    logger.info(`\n=== Starting server on https:${devConfig.publicPath} ===\n`);
  });
}

runServer();
