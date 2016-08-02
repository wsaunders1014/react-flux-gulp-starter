const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extend = require('extend');

// es6 transpilation
const babelLoader = {
    test: /(\.js|\.jsx)$/,
    exclude: /node_modules/,
    loaders: ['babel'],
}

// hot loader for dev
const hotLoader = Object.assign({}, babelLoader, {
    loaders: ['react-hot'].concat(babelLoader.loaders)
});

// transforms asset urls to hashes, and copies files to asset directory
const urlLoader = {
    test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.woff2$|\.ttf$/,
    loader: 'url?limit=8192'
};

// same as url loader, but doesn't copy files to assets folder
const serverUrlLoader = Object.assign({}, urlLoader, {
    loader: `${urlLoader.loader}&emitFile=false`,
});

// css loader - local module naming convention
const cssLoaderConfig =
    `css-loader?sourceMap&-import&localIdentName=[name]_[local]_[hash:base64:3]&root=.`;

// dev style loader
const styleLoader = {
    test: /\.scss$/,
    loaders: [
        'style-loader?sourceMap',
        cssLoaderConfig,
        'sass-loader?sourceMap',
    ],
};


// production style loader - extracts css into external file
const extractTextLoader = {
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract('style-loader?', `${cssLoaderConfig}!sass-loader?`),
};


// server-side style loader- only extracts class names, not css content
const serverStyleLoader = {
    test: /\.scss$/,
    loaders: [
        cssLoaderConfig.replace('css-loader', 'css-loader/locals'),
        'sass-loader',
    ],
};

const config = {
    context: path.resolve(__dirname),

    resolve: {
        root: path.resolve(__dirname, 'src'),
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.jsx', '.json'],
        alias: {
            sass: 'sass',
            images: 'images',
            './images': 'images',
        }
    },

    plugins: [],

    debug: true,
    cache: true,

    stats: {
        assets: true, //add assets information
        assetsSort: true, //(string) sort the assets by that fiel
        cached: false, //add also information about cached (not built) modules
        children: false, //add children information
        chunkModules: false, //add built modules information to chunk information
        chunkOrigins: false, //add the origins of chunks and chunk merging info
        chunks: false, //add chunk information
        chunksSort: false, //(string) sort the chunks by that field
        colors: true,
        errorDetails: true, //add details to errors (like resolving log)
        errors: true,
        hash: false, //add the hash of the compilation
        modules: false, //add built modules information
        modulesSort: true, //(string) sort the modules by that field
        publicPath: false,
        reasons: false, //add information about the reasons why modules are included
        source: false, //add the source code of modules
        timings: true, //add timing information
        version: true, //add webpack version information
        warnings: false,
    },
};

export const clientDevConfig = extend(true, {}, config, {
    entry: {
        client: [
            'webpack-dev-server/client?http://0.0.0.0:8080/',
            'webpack/hot/only-dev-server',
            './src/javascript/client.js',
        ],
        // leverage browser caching by saving react and react-dom to separate file
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
    output: {
        path: path.join(__dirname, 'build/assets'),
        publicPath: `${process.env.HOST || ''}/assets/`,
        filename: '[name].js',
    },
    module: {
        loaders: [
            hotLoader,
            styleLoader,
            urlLoader,
        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            children: true,
            // async: true,
            minChunks: Infinity,
            filename: 'vendor.bundle.js'
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new ExtractTextPlugin('client.css'),
    ],
    devtool: '#eval-source-map',
});

export const clientConfig = extend(true, {}, config, {
    entry: {
        client: [
            './src/javascript/client.js',
        ],
        vendor: clientDevConfig.entry.vendor
    },
    output: clientDevConfig.output,
    module: {
        loaders: [
            babelLoader,
            extractTextLoader,
            urlLoader
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            children: true,
            // async: true,
            minChunks: Infinity,
            filename: 'vendor.bundle.js'
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new ExtractTextPlugin('client.css'),
        new webpack.optimize.UglifyJsPlugin(),
    ],

    debug: false,
});

//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------

export const serverConfig = extend(true, {}, config, {
    entry: {
        app: path.join(__dirname, 'src/javascript/server.js')
    },

    output: {
        path: path.join(__dirname, 'build'),
        publicPath: '/assets/',
        filename: 'server.js',
        libraryTarget: 'commonjs2',
    },

    target: 'node',

    module: {
        loaders: [
            {
                test: /(\.js|\.jsx)$/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: [
                        'react',
                        'node6',
                        'stage-0'
                    ]
                }
            },
            serverUrlLoader,
            serverStyleLoader,
        ],
    },

    externals: [
        function filter(context, request, cb) {
            const isAsset = /^(images|css|font)/.test(request);
            const isExternal = request.match(/^[@a-z][a-z\/\.\-0-9]*$/i);

            cb(null, !isAsset && Boolean(isExternal));
        },
    ],

    debug: false,
    devtool: 'inline-eval-cheap-source-map',
});
