const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack:{resolve: {fallback: { "path": false}}},
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      // Or, for multiple preload files:
      preload: { preload: 'src/preload.js'}
    }
  }
})
