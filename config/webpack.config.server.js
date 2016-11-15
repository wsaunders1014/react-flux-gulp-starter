const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const GLOBALS = {
    'process.env': {
        'NODE_ENV': JSON.stringify('production'),
    },
    __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false')),
};

module.exports = merge({}, {
    resolve: {
        modules: [
            path.join(__dirname, '../src/javascript'),
            path.join(__dirname, '../src/images'),
            path.join(__dirname, '../src/sass'),
            path.join(__dirname, '../src/fonts'),
            path.join(__dirname, '../src/assets'),
            'node_modules',
        ],
        alias: {
            react: 'preact-compat',
            'react-dom': 'preact-compat',
        },
        extensions: ['.js', '.jsx', '.json', '.scss'],
    },

    module: {
        noParse: /(\.min\.js|node_modules)$/,
        loaders: [
      // JavaScript / ES6
            {
                test: /\.(js|jsx)?$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, '../src/javascript'),
                loader: 'babel-loader',
                query: {
                    presets: [
                        'react',
                        'node6',
                        'stage-0',
                    ],
                },
            },
            // Sass
            {
                test: /\.scss$/,
                include: [
                    path.resolve(__dirname, '../src/sass'),
                ],
                loaders: [
                    {
                        loader: 'css-loader/locals',
                        query: {
                            localIdentName: '[name]_[local]_[hash:base64:3]',
                            sourceMap: false,
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
        ],
    },

    output: {
        path: path.resolve(__dirname, '../build/server'),
        filename: 'server.js',
        libraryTarget: 'commonjs2',
    },
    devtool: 'sourcemap',
    target: 'node',
    entry: {
        app: 'server',
    },
    externals: [nodeExternals()],
    plugins: [
        // new webpack.BannerPlugin('require("source-map-support").install();',
        //                { raw: true, entryOnly: false }),
        // new CopyWebpackPlugin([{
        //     from: path.join(__dirname, '../src/images'),
        //     to: 'images',
        // }]),
        // Avoid publishing files when compilation fails
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin(GLOBALS),
        new webpack.LoaderOptionsPlugin({
            minimize: false,
            debug: false,
        }),
    ],
});
