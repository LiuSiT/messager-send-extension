const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack:{resolve: {fallback: { "path": false}}},
  chainWebpack: config => {
    config
        .plugin('html')
        .tap(args => {
          args[0].title= 'messenger消息发射器'
          return args
        })
  },
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      // Or, for multiple preload files:
      preload: { preload: 'src/preload.js'}
    }
  }
})
