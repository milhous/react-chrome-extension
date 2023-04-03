import {createRequire} from 'module';

const require = createRequire(import.meta.url);

/**
 * 模块
 * @param {boolean} isDev 是否是开发环境
 * @param {Array<string>} browserslist 目标浏览器版本范围
 */
export default function scrpits(isDev, browserslist) {
  return {
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: require.resolve('swc-loader'),
            options: {
              // This makes swc-loader invoke swc synchronously.
              sync: true,
              env: {
                targets: browserslist.join(','),
              },
              jsc: {
                externalHelpers: false,
                loose: true,
                parser: {syntax: 'typescript', tsx: true, decorators: true, dynamicImport: true},
                transform: {
                  legacyDecorator: true,
                  decoratorMetadata: true,
                  react: {
                    runtime: 'automatic',
                    development: isDev,
                    refresh: isDev,
                  },
                },
              },
            },
          },
        },
      ],
    },
  };
}
