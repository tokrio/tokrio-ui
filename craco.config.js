
const TerserPlugin = require('terser-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const { whenProd, addBeforeLoaders, removeLoaders, loaderByName } = require('@craco/craco');
const { version } = require('./package.json');
const SplitChunksPlugin = require('webpack/lib/optimize/SplitChunksPlugin');
const WebpackBar = require('webpackbar');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const smp = new SpeedMeasurePlugin()
const path = require("path")

module.exports = {

    // babel: {
    //     plugins: [
    //         // lodash按需加载
    //         "lodash",
    //     ],
    //     loaderOptions: {
    //         // babel-loader开启缓存
    //         cacheDirectory: true,
    //     },
    // },
    webpack: smp.wrap({
        configure: (webpackConfig, { env, paths }) => {

            // webpackConfig.module.rules.forEach((rule) => {
            //     rule.include = path.resolve(__dirname, "src");
            // });

            // 配置扩展扩展名优化
            // webpackConfig.resolve.extensions = [".tsx", ".ts", ".jsx", ".js", ".scss", ".css", ".json"];

            // // 开启持久化缓存
            // webpackConfig.cache.type = "filesystem";

            // // splitChunks打包优化
            // webpackConfig.optimization.splitChunks = {
            //     ...webpackConfig.optimization.splitChunks,
            //     cacheGroups: {
            //         commons: {
            //             chunks: "all",
            //             // 将两个以上的chunk所共享的模块打包至commons组。
            //             minChunks: 2,
            //             name: "commons",
            //             priority: 80,
            //         },
            //         vendor: {
            //             test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
            //             name: 'vendor',
            //             chunks: 'all',
            //             enforce: true
            //         }
            //     },
            // };

            // addBeforeLoaders(webpackConfig, loaderByName("style-loader"), "thread-loader");
            // addBeforeLoaders(webpackConfig, loaderByName("style-loader"), "cache-loader");
            console.log(env)
            

            webpackConfig.output.filename = `static/js/[name].[hash:8]-${version}.js`;
            webpackConfig.output.chunkFilename = `static/js/[name].[hash:8]-${version}.js`;

            if (env == 'development') {
                webpackConfig.devtool = 'source-map';
            } else {

                webpackConfig.devtool = false;
                removeLoaders(webpackConfig, loaderByName("source-map-loader"));
            }

            return webpackConfig
        },


        plugins: [
            //new WebpackBar(),
            ...whenProd(
                () => [
                    new TerserPlugin({
                        test: /\.js(\?.*)?$/i,   //用来匹配需要压缩的文件
                        include: /\/includes/,   //匹配参与压缩的文件。
                        exclude: /\/excludes/,   //匹配不需要压缩的文件
                        parallel: true,//使用多进程并发运行以提高构建速度。 并发运行的默认数量： os.cpus().length - 1 。
                        extractComments: false, //是否将注释剥离到单独的文件中,默认值： true
                        terserOptions: {
                            ecma: undefined,
                            warnings: false,
                            parse: {},
                            compress: {
                                drop_console: true,
                                drop_debugger: false,
                                pure_funcs: ['console.log'], // 移除console
                            },
                        },
                    }),

                    new SplitChunksPlugin({
                        chunks: "all",
                        minSize: 30000,
                        maxAsyncRequests: 5,
                        name: true
                    }),
                    new CompressionWebpackPlugin({
                        algorithm: 'gzip',
                        test: /\.(js|css|html|svg)$/
                    })
                ], [])


        ],

    }),

};
