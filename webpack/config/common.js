import * as url from 'url';
import {createRequire} from 'module';

import {resolvePath} from '../helpers/utils.js';

const __filename = url.fileURLToPath(import.meta.url);
const require = createRequire(import.meta.url);

/**
 * 通用
 * @param {IDevConfig} devConfig 开发配置
 * @param {IBasicConfig} basicConfig 基础配置
 */
export default function common(devConfig, basicConfig) {
  // let filename = 'static/js/[name].[fullhash:8].js';
  let devtool = false;
  let filename = 'static/js/[name].js';
  let assetModuleFilename = 'static/assets/[name].[contenthash:8][ext][query]';
  let publicPath = devConfig.publicPath;
  let entry = basicConfig.pages.reduce((e, p) => ({...e, [p]: `${basicConfig.src}/${p}/index`}), {});

  if (devConfig.isDev) {
    devtool = 'cheap-module-source-map';
    filename = 'static/js/[name].js';
    assetModuleFilename = 'static/assets/[name].[ext][query]';

    // 解决热更新报错, publicPath 改为 '/'
    publicPath = '/';

    for (var entryName in entry) {
      if (devConfig.notHotReload.indexOf(entryName) === -1) {
        entry[entryName] = [
          'webpack/hot/dev-server',
          `webpack-dev-server/client?hot=true&hostname=localhost&port=${basicConfig.port}`,
        ].concat(entry[entryName]);
      }
    }
  }

  return {
    // 解决 HMR for federated modules ChunkLoadError: Loading hot update chunk
    entry,
    devtool,
    mode: devConfig.mode,
    target: 'web',
    output: {
      path: basicConfig.dist,
      uniqueName: basicConfig.name,
      filename,
      assetModuleFilename,
      publicPath,
      environment: {
        arrowFunction: false,
        bigIntLiteral: false,
        const: false,
        destructuring: false,
        forOf: false,
        dynamicImport: false,
        module: false,
      },
      clean: true,
    },
    // cache: {
    //   version: `${basicConfig.name}-${devConfig.mode}`,
    //   type: 'filesystem',
    //   cacheDirectory: basicConfig.cache,
    //   // 缓存依赖，当缓存依赖修改时，缓存失效
    //   buildDependencies: {
    //     // 将你的配置添加依赖，更改配置时，使得缓存失效
    //     config: [__filename],
    //   },
    // },
    experiments: {
      topLevelAwait: true,
      backCompat: true,
    },
    resolve: {
      modules: ['node_modules'],
      extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx', '.css', '.scss', '.sass', '.json', '.wasm', '.svg', '.svga'],
      alias: {
        '@assets': resolvePath('./app/assets'),
        '@store': resolvePath('./app/store'),
        '@libs': resolvePath('./app/libs'),
        '@pages': resolvePath('./app/pages'),
        '@ui': resolvePath('./app/ui'),
        '@widget': resolvePath('./app/widget'),
      },
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        buffer: require.resolve('buffer/'),
        events: require.resolve('events/'),
        util: require.resolve('util/'),
        assert: require.resolve('assert/'),
        string_decoder: require.resolve('string_decoder/'),
        stream: require.resolve('stream-browserify'),
        process: require.resolve('process/browser'),
      },
    },
  };
}
