var dest = './build';
var src = './src';
var port = parseInt(process.env.PORT, 10) || 3000;
var path = require('path');

module.exports = {
    nodemon: {
        script: './build/server.js',
        ext: 'js',
        ignore: ['node_modules/*', 'gulp/*', 'src/[!server.js]', '[!src/stores/]'],
        env: {
            'NODE_ENV': 'development',
            'DEBUG': 'Server',
            'PORT': port
        }
    },
    webpackDevServer:  {
        contentBase: path.resolve('../build/assets'),
        publicPath: '/assets/',
        fileName: 'client.js',
        compress: true,
        quiet: false,
        noInfo: false,
        hot: true,
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
    },
};
