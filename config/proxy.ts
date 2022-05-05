/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * -------------------------------
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/api/': {
      target: 'http://10.0.105.7:11806',
      // target: 'http://10.1.8.94:33001',
      // target: 'http://20.0.6.253:33001',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
    // '/apis/': {
    //   target: 'http://20.0.6.253:33001',
    //   changeOrigin: true,
    //   pathRewrite: { '^/apis': '' },
    // },
    '/message/': {
      target: 'http://10.0.105.7:11806',
      changeOrigin: true,
      pathRewrite: { '^/message': '' },
    },
  },
  test: {
    '/api/': {
      target: 'http://192.168.0.70:33001',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
