/**
 * 开发
 * @param {number} port 端口号
 * @param {string} dist 应用源码生成目录
 */
export default function development(port, dist) {
  return {
    devServer: {
      static: dist,
      // 解决 HMR for federated modules ChunkLoadError: Loading hot update chunk
      liveReload: false,
      hot: true,
      host: '0.0.0.0',
      port,
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
  };
}
