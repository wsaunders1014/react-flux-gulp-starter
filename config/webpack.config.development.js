const merge = require('webpack-merge');
const webpack = require('webpack');
const config = require('./webpack.config.base');
const path = require('path');

const GLOBALS = {
    'process.env': {
        'NODE_ENV': JSON.stringify('development'),
    },
    __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'true')),
};

module.exports = merge(config, {
    cache: true,
    devtool: 'cheap-module-eval-source-map',
    entry: {
        client: [
            'webpack-hot-middleware/client',
            // 'react-hot-loader/patch',
            'client',
        ],
        vendor: [
            'classnames',
            'debug',
            'fluxible',
            'fluxible-action-utils',
            'fluxible-addons-react',
            'fluxible-plugin-fetchr',
            'preact',
            'preact-compat',
            'react-router',
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin(GLOBALS),
    ],
    module: {
        loaders: [
            // Sass
            {
                test: /\.scss$/,
                include: [
                    path.resolve(__dirname, '../src/sass'),
                ],
                loaders: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        query: {
                            localIdentName: '[name]_[local]_[hash:base64:3]',
                        },
                    },
                    'postcss-loader', {
                        loader: 'sass-loader',
                        query: {
                            outputStyle: 'expanded',
                        },
                    },
                ],
            },
            // Sass + CSS Modules
            // {
            //   test: /\.scss$/,
            //   include: /src\/client\/assets\/javascripts/,
            //   loaders: [
            //     'style',
            //     {
            //       loader: 'css',
            //       query: {
            //         modules: true,
            //         importLoaders: 1,
            //         localIdentName: '[path][name]__[local]--[hash:base64:5]'
            //       }
            //     },
            //     'postcss',
            //     { loader: 'sass', query: { outputStyle: 'expanded' } }
            //   ]
            // },
            // CSS
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader!postcss-loader',
            },
        ],
    },
});
