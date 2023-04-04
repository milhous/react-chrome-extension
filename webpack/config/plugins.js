import WebpackBar from 'webpackbar';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import {createRequire} from 'module';

import {resolvePath} from '../helpers/utils.js';

const require = createRequire(import.meta.url);

/**
 * 插件
 * @param {IDevConfig} devConfig 开发配置
 * @param {IBasicConfig} basicConfig 基础配置
 */
export default function plugins(devConfig, basicConfig) {
  const configFile = resolvePath('./tsconfig.json');

  console.log('basicConfig.public', basicConfig.public);

  const plugins = [
    new WebpackBar({
      color: 'green',
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
    new ForkTsCheckerWebpackPlugin({
      async: devConfig.isDev, // true dev环境下部分错误验证通过
      typescript: {
        configFile,
        profile: false,
        typescriptPath: 'typescript',
      },
    }),
    new ImageMinimizerPlugin({
      minimizer: {
        implementation: ImageMinimizerPlugin.imageminMinify,
        options: {
          // Lossless optimization with custom option
          // Feel free to experiment with options for better result for you
          plugins: [
            [require.resolve('imagemin-gifsicle'), {interlaced: true}],
            [require.resolve('imagemin-mozjpeg'), {quality: 80, progressive: true}],
            [require.resolve('imagemin-optipng'), {optimizationLevel: 5}],
          ],
        },
      },
      generator: [
        {
          // You can apply generator using `?as=webp`, you can use any name and provide more options
          // 过滤apng, 解决apng压缩后损坏不显示
          preset: 'apng',
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            // 不填写插件名称，则会默认压缩，填写非png插件，则不会处理apng
            plugins: [[require.resolve('imagemin-gifsicle')]],
          },
        },
      ],
    }),
    new HtmlWebpackPlugin({
      title: basicConfig.name,
      template: basicConfig.public + '/index.html',
    }),
  ];

  if (devConfig.isDev) {
    // 是否开启热更新
    plugins.push(
      new ReactRefreshWebpackPlugin({
        exclude: [/node_modules/],
      }),
    );
  } else {
    plugins.push(new CleanWebpackPlugin());

    plugins.push(
      new MiniCssExtractPlugin({
        ignoreOrder: true,
        filename: `static/css/[name].[contenthash:8].css`,
        chunkFilename: `static/css/[name].[contenthash:8].chunk.css`,
      }),
    );
  }

  return {
    plugins,
  };
}
