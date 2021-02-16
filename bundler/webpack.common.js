const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const fs = require('fs');

const pages = fs.readdirSync(path.resolve(__dirname, '../src/pages'))
    .filter(dir => !dir.includes('.'))

const getEntry = (pages) => {
    let result = {};
    pages.forEach(page => {
        result[page] = path.resolve(__dirname, '../src/pages', page, 'main.js')
    });

    return result;
};

module.exports = {
    entry: getEntry(pages),
    output: {
        filename: '[name]/[name].js',
        path: path.resolve(__dirname, '../dist/')
    },
    devtool: 'source-map',
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, '../public') }
            ]
        }),
        new HtmlWebpackPlugin({
            filename: '[name]/[name].html',
            template: path.resolve(__dirname, '../src/pages/index.html'),
            minify: true,
            title: ''
        }),
        new MiniCSSExtractPlugin({
            filename: '[name]/[name].css'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.(jpg|png|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'public/images/'
                        }
                    }
                ]
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'public/fonts/'
                        }
                    }
                ]
            }
        ]
    }
}
