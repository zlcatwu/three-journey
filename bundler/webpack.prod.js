const { merge } = require('webpack-merge');
const commonConfiguration = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = merge(
    commonConfiguration,
    {
        mode: 'production',
        plugins: [
            new CleanWebpackPlugin()
        ],
        output: {
            path: path.resolve(__dirname, '../docs/')
        }
    }
)
