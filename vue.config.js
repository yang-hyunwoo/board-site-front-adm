const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave : false,
  devServer: {
    port: 4100,
    allowedHosts: ['.iamport.kr'],
    proxy: {
      '/api' : {
        target : 'http://localhost:8081',
        changeOrigin: true,
        logLevel: 'debug',
        '^/api' : '/api'
      },
      '/api/adm' : {
        target : 'http://localhost:8081',
        changeOrigin: true,
        logLevel: 'debug',
        '^/api/adm' : '/api/adm'
      },
    }
  },

})
