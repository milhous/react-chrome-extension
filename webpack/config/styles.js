import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import {createRequire} from 'module';

const require = createRequire(import.meta.url);

// 正则表达式
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.s[ac]ss$/;
const sassModuleRegex = /\.module\.s[ac]ss$/;

// 获取 style-loader 配置
const getStyleLoaderConfig = (isDev = true) => {
  return isDev
    ? {
        loader: require.resolve('style-loader'),
        options: {},
      }
    : {
        loader: MiniCssExtractPlugin.loader,
        options: {},
      };
};

// 获取 css-loader 配置
const getCssLoaderConfig = (isDev = true, isModules = false) => {
  const localIdentName = isDev ? '[path][name]-[local]-[hash:base64:5]' : '[local]-[hash:base64:5]';

  return {
    loader: require.resolve('css-loader'),
    options: {
      modules: isModules ? {localIdentName} : isModules,
    },
  };
};

/**
 * 样式
 * @param {boolean} isDev 是否是开发环境
 */
export default function styles(isDev) {
  return {
    module: {
      rules: [
        // css
        {
          test: cssRegex,
          exclude: cssModuleRegex,
          use: [getStyleLoaderConfig(isDev), getCssLoaderConfig(isDev), 'postcss-loader'],
        },
        // css module
        {
          test: cssModuleRegex,
          use: [getStyleLoaderConfig(isDev), getCssLoaderConfig(isDev, true), 'postcss-loader'],
        },
        // sass
        {
          test: sassRegex,
          exclude: sassModuleRegex,
          use: [
            getStyleLoaderConfig(isDev),
            getCssLoaderConfig(isDev),
            // postcss-loader
            'postcss-loader',
            // Compiles Sass to CSS
            'sass-loader',
          ],
        },
        // sass module
        {
          test: sassModuleRegex,
          use: [
            getStyleLoaderConfig(isDev),
            getCssLoaderConfig(isDev, true),
            // postcss-loader
            'postcss-loader',
            // Compiles Sass to CSS
            'sass-loader',
          ],
        },
      ],
    },
  };
}
