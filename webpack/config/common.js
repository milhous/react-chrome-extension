import * as url from 'url';

import {resolveAppPath} from '../helpers/utils.js';
import {IDevConfig, IBasicConfig} from '../helpers/store.js';

const __filename = url.fileURLToPath(import.meta.url);

/**
 * 通用
 * @param {IDevConfig} devConfig 开发配置
 * @param {IBasicConfig} basicConfig 基础配置
 */
export default function common(devConfig, basicConfig) {
  let devtool = false;
  let filename = 'static/js/[name].[fullhash:8].js';
  let chunkFilename = 'static/js/[name].[contenthash:8].js';
  let assetModuleFilename = 'static/assets/[name].[contenthash:8][ext][query]';

  if (devConfig.isDev) {
    devtool = 'source-map';
    filename = 'static/js/[name].js';
    chunkFilename = 'static/js/[name].chunk.js';
    assetModuleFilename = 'static/assets/[name].[ext][query]';
  }

  return {
    // 解决 HMR for federated modules ChunkLoadError: Loading hot update chunk
    entry: basicConfig.src + '/index',
    devtool,
    mode: devConfig.mode,
    target: 'web',
    output: {
      path: basicConfig.dist,
      uniqueName: basicConfig.name,
      filename,
      chunkFilename,
      assetModuleFilename,
      publicPath: devConfig.publicPath,
      environment: {
        arrowFunction: false,
        bigIntLiteral: false,
        const: false,
        destructuring: false,
        forOf: false,
        dynamicImport: false,
        module: false,
      },
      // 防止window is undefined的错误.
      globalObject: 'this',
      pathinfo: false, //在打包数千个模块的项目中，这会导致造成垃圾回收性能压力
      clean: true,
    },
    cache: {
      version: `${basicConfig.name}-${devConfig.mode}`,
      type: 'filesystem',
      cacheDirectory: basicConfig.cache,
      // 缓存依赖，当缓存依赖修改时，缓存失效
      buildDependencies: {
        // 将你的配置添加依赖，更改配置时，使得缓存失效
        config: [__filename],
      },
    },
    experiments: {
      topLevelAwait: true,
      backCompat: true,
    },
    resolve: {
      modules: ['node_modules'],
      extensions: [
        '.js',
        '.jsx',
        '.mjs',
        '.ts',
        '.tsx',
        '.css',
        '.less',
        '.scss',
        '.sass',
        '.json',
        '.wasm',
        '.vue',
        '.svg',
        '.svga',
      ],
      alias: {
        '@widget': resolveAppPath('../widget/src'),
        '@libs': resolveAppPath('../libs/src'),
        '@style': resolveAppPath('../style/src'),
      },
    },
  };
}
