const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('./webpack.config.base');

const GLOBALS = {
    'process.env': {
        'NODE_ENV': JSON.stringify('production'),
    },
    __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false')),
};

module.exports = merge(config, {
    // devtool: 'cheap-module-source-map',
    entry: {
        client: 'client',
        vendor: [
            'classnames',
            'debug',
            'fluxible',
            'fluxible-action-utils',
            'fluxible-addons-react',
            'fluxible-plugin-fetchr',
            'react',
            'react-dom',
            'react-router',
        ],
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: path.join(__dirname, '../src/images'),
            to: 'images',
        }]),
        // Avoid publishing files when compilation fails
        // new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin(GLOBALS),
        new webpack.optimize.UglifyJsPlugin({
            // compress: {
            //     warnings: true,
            //     'screw_ie8': true,
            // },
            // output: {
            //     comments: false,
            // },
            sourceMap: false,
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),
        new ExtractTextPlugin({
            filename: 'css/app.css',
            allChunks: true,
        }),
    ],
    module: {
        noParse: /\.min\.js$/,
        loaders: [
            // Sass
            {
                test: /\.scss$/,
                include: [
                    path.resolve(__dirname, '../src/sass'),
                ],
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: [{
                        loader: 'css-loader',
                        query: {
                            sourceMap: false,
                        },
                    },
                    'postcss-loader', {
                        loader: 'sass-loader',
                        query: {
                            outputStyle: 'compressed',
                        },
                    },
                    ],
                }),
            },
            // Sass + CSS Modules
            // {
            //   test: /\.scss$/,
            //   include: /src\/client\/assets\/javascripts/,
            //   loader: ExtractTextPlugin.extract({
            //     fallbackLoader: 'style',
            //     loader: [
            //       {
            //         loader: 'css',
            //         query: {
            //           modules: true,
            //           importLoaders: 1,
            //           localIdentName: '[path][name]__[local]--[hash:base64:5]'
            //         }
            //       },
            //       'postcss',
            //       { loader: 'sass', query: { outputStyle: 'compressed' } }
            //     ]
            //   })
            // },
            // CSS
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: ['css-loader', 'postcss-loader'],
                }),
            },
        ],
    },
});
