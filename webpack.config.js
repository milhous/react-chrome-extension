import * as url from 'url';
import path from 'path';
import WebpackBar from 'webpackbar';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import HTMLPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import {createRequire} from 'module';

const require = createRequire(import.meta.url);

const __dirname = url.fileURLToPath(new URL('.', import.meta.url).toString());

function getHtmlPlugins(chunks) {
  return chunks.map(
    chunk =>
      new HTMLPlugin({
        title: 'React extension',
        filename: `${chunk}.html`,
        chunks: [chunk],
      }),
  );
}

export default () => {
  const isDev = false;
  const configFile = './tsconfig.json';
  const browserslist = [
    'last 1 chrome version',
    'last 1 firefox version',
    'last 1 safari version',
    'last 1 ie version',
  ];

  return {
    entry: {
      index: './app/index.tsx',
    },
    mode: 'production',
    devServer: {
      static: './dist/chrome/',
      // 解决 HMR for federated modules ChunkLoadError: Loading hot update chunk
      liveReload: false,
      hot: true,
      host: '0.0.0.0',
      port: 3000,
      compress: true,
      historyApiFallback: true,
      open: false,
      allowedHosts: ['all'],
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      },
      client: {
        overlay: true,
      },
    },
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
        {
          exclude: /node_modules/,
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          exclude: /node_modules/,
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            'style-loader',
            // Translates CSS into CommonJS
            'css-loader',
            // postcss-loader
            'postcss-loader',
            // Compiles Sass to CSS
            'sass-loader',
          ],
        },
      ],
    },
    plugins: [
      new WebpackBar({
        color: 'green',
      }),
      new CleanWebpackPlugin(),
      new ForkTsCheckerWebpackPlugin({
        async: isDev, // true dev环境下部分错误验证通过
        typescript: {
          configFile,
          profile: false,
          typescriptPath: 'typescript',
        },
      }),
      new CopyPlugin({
        patterns: [
          {
            from: 'manifest.json',
            to: './manifest.json',
            globOptions: {
              ignore: ['**/.DS_Store'],
            },
            noErrorOnMissing: true,
          },
        ],
      }),
      ...getHtmlPlugins(['index']),
      new ReactRefreshWebpackPlugin({
        exclude: [/node_modules/],
      }),
    ],
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
      path: path.join(__dirname, 'dist/chrome'),
      filename: '[name].js',
    },
  };
};
