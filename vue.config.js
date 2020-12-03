// Vue.config.js 配置选项

module.exports = {
  devServer: {
    https: false,
    hotOnly: false,
    proxy: {
      '/api': {
        target: 'http://10.97.190.152:50002',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api': ''
        }
      }
    }, // string | Object
    before: app => {}
  },
  lintOnSave: false
}
