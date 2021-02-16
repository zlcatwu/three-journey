const { merge } = require('webpack-merge');
const commonConfiguration = require('./webpack.common.js');
const path = require('path');

module.exports = merge(
    commonConfiguration,
    {
        mode: 'development',
        devServer: {
            contentBase: path.resolve(__dirname, '../dist'),
            publicPath: '/three-journey/'
        }
    }
)
