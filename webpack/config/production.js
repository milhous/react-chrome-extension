import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

// 生产
export default function minimizer() {
  const minimizer = [];

  minimizer.push(
    // js压缩
    new TerserPlugin({
      exclude: /node_modules/,
      // extractComments 选项暂不支持，所有注释将默认被删除，会在将来得到修复。
      extractComments: false,
      minify: TerserPlugin.swcMinify,
      terserOptions: {
        format: {
          comments: false,
        },
      },
    }),
    // css压缩
    new CssMinimizerPlugin({
      parallel: true,
      minimizerOptions: {
        preset: [
          'default',
          {
            discardComments: {removeAll: true},
          },
        ],
      },
    }),
  );

  return {
    performance: {
      hints: 'warning',
      maxEntrypointSize: 512000,
      maxAssetSize: 614400,
    },
    optimization: {
      chunkIds: 'deterministic', // deterministic 在不同的编译中不变的短数字 id。有益于长期缓存。在生产模式中会默认开启。
      minimize: true,
      minimizer,
      splitChunks: {
        cacheGroups: {
          svg: {
            //提取出来的文件命名
            name: 'svg',
            // 表示提取入口文件的公共部分
            chunks: 'async',
            //表示提取公共部分最少的文件数
            minChunks: 2,
            minSize: 256000,
            maxSize: 512000,
            enforce: true,
            reuseExistingChunk: true,
            test: module => {
              const result = module.resource && module.resource.endsWith('.svg');

              return result;
            },
            priority: -10,
          },
          widget: {
            //提取出来的文件命名
            name: 'widget',
            // 表示提取入口文件的公共部分
            chunks: 'async',
            //表示提取公共部分最少的文件数
            minChunks: 2,
            minSize: 256000,
            maxSize: 512000,
            enforce: true,
            reuseExistingChunk: true,
            test: /[\\/]widget[\\/]/,
            priority: -5,
          },
        },
      },
    },
  };
}
