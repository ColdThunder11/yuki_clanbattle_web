// vue.config.js

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */


module.exports = {
  chainWebpack: (config) => {
  },
  configureWebpack: (config) => {
  },
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:28385',
        ws: true,
        changeOrigin: true
      }
    }
  }
}