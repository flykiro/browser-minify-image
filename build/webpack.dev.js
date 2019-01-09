const baseConfig = require('./webpack.base')
const { HotModuleReplacementPlugin } = require('webpack')
const merge = require('webpack-merge')
const HTMLPlugin = require('html-webpack-plugin')

console.log(process.env.npm_package_config_port)

module.exports = merge(baseConfig, {
    mode: 'development',
    devServer: {
        hot: true
    },
    plugins: [
        new HTMLPlugin(),
        new HotModuleReplacementPlugin()
    ]
})