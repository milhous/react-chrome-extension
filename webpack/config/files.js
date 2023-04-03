import svgToMiniDataURI from 'mini-svg-data-uri';
import {createRequire} from 'module';

const require = createRequire(import.meta.url);

/**
 * 文件
 * @param {boolean} isDev 是否是开发环境
 * @param {Array<string>} browserslist 目标浏览器版本范围
 */
export default function files(isDev, browserslist) {
  return {
    module: {
      rules: [
        // svg url
        {
          test: /\.svg$/i,
          type: 'asset',
          resourceQuery: /url/, // *.svg?url
          generator: {
            dataUrl(content) {
              content = content.toString();
              return svgToMiniDataURI(content);
            },
          },
          use: [
            {
              loader: require.resolve('svgo-loader'),
              options: {
                plugins: [
                  {
                    name: 'preset-default',
                    params: {
                      overrides: {
                        removeViewBox: false,
                      },
                    },
                  },
                  'prefixIds',
                ],
              },
            },
          ],
        },
        // svg inline
        {
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          resourceQuery: {not: [/url/]}, // exclude react component if *.svg?url
          use: [
            {
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
                  // 缺少 parser 配置会导致编译失败
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
            {
              loader: require.resolve('@svgr/webpack'),
              options: {
                svgo: true,
                svgoConfig: {
                  plugins: [
                    {
                      name: 'preset-default',
                      params: {
                        overrides: {
                          removeViewBox: false,
                        },
                      },
                    },
                    'prefixIds',
                  ],
                },
                babel: false,
              },
            },
          ],
        },
        // 图片
        {
          test: /\.(png|jpe?g|gif|webp|ico)$/i,
          type: 'asset/resource',
        },
        // 字体
        {
          test: /\.(|otf|ttf|eot|woff|woff2)$/i,
          type: 'asset/resource',
        },
        // svga
        {
          test: /\.(svga)$/i,
          type: 'asset/resource',
        },
      ],
    },
  };
}
