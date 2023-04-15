import webpack from 'webpack';

import logger from '../helpers/logger.js';
import store from '../helpers/store.js';
import getWebpackConfig from '../config/index.js';

// 启动
async function runServer() {
  store.init({
    env: 'prod',
    mode: 'production',
    pages: ['popup', 'home', 'background'],
  });

  const webpackConfig = await getWebpackConfig();

  logger.info(`\n=== App compiled with start.===\n`);

  webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.error(err.stack || err);

      return;
    }

    if (!!stats) {
      console.log(
        stats.toString({
          colors: true,
          all: false,
          assets: true,
        }),
      );

      if (stats.hasWarnings()) {
        logger.warn(`\n=== App compiled with warnings.===\n`);

        logger.warn(
          stats.toString({
            all: false,
            colors: true,
            warnings: true,
          }),
        );
      }

      if (stats.hasErrors()) {
        logger.error(`\n=== App failed to compile.===\n`);

        logger.error(
          stats.toString({
            all: false,
            colors: true,
            errors: true,
          }),
        );

        process.exit(1);
      } else {
        logger.info(`\n=== App compiled successfully.===\n`);
      }
    }
  });
}

runServer();
