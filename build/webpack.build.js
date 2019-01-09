const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const { resolve } = require('./util')

module.exports = merge(baseConfig, {
    mode: 'production',
    output: {
        path: resolve('../dist'),
        filename: 'index.js',
        library: 'utils',
        libraryTarget: 'umd'
    }
})