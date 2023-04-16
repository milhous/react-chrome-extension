/**
 * 开发
 * @param {number} port 端口号
 * @param {string} dist 应用源码生成目录
 */
export default function development(port, dist) {
  return {
    devServer: {
      https: false,
      static: {
        directory: dist,
      },
      // 解决 HMR for federated modules ChunkLoadError: Loading hot update chunk
      hot: true,
      liveReload: false,
      host: 'localhost',
      port,
      compress: true,
      historyApiFallback: true,
      open: false,
      allowedHosts: 'all',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      },
      devMiddleware: {
        publicPath: `http://localhost:${port}/`,
        writeToDisk: true,
      },
      client: {
        webSocketTransport: 'sockjs',
        overlay: false,
      },
      webSocketServer: 'sockjs',
    },
  };
}
