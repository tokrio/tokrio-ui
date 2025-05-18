
const TerserPlugin = require('terser-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const { whenProd, addBeforeLoaders, removeLoaders, loaderByName } = require('@craco/craco');
const { version } = require('./package.json');
const SplitChunksPlugin = require('webpack/lib/optimize/SplitChunksPlugin');
const WebpackBar = require('webpackbar');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const smp = new SpeedMeasurePlugin()
const path = require("path")
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = {


    webpack: smp.wrap({
        configure: (webpackConfig, { env, paths }) => {


           
            webpackConfig.resolve.extensions = [".tsx", ".ts", ".jsx", ".js", ".scss", ".css", ".json"];

           
            webpackConfig.cache.type = "filesystem";

          
            webpackConfig.optimization.splitChunks = {
                ...webpackConfig.optimization.splitChunks,
                cacheGroups: {
                    commons: {
                        chunks: "all",
                     
                        minChunks: 2,
                        name: "commons",
                        priority: 80,
                    },
                    vendor: {
                        test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
                        name: 'vendor',
                        chunks: 'all',
                        enforce: true
                    }
                },
            };

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
            // new BundleAnalyzerPlugin(),
            ...whenProd(
                () => [
                    // new WebpackBar(),
                    new TerserPlugin({
                        test: /\.js(\?.*)?$/i,   
                        include: /\/includes/,   
                        exclude: /\/excludes/,  
                        parallel: true,
                        extractComments: false, 
                        terserOptions: {
                            ecma: undefined,
                            warnings: false,
                            parse: {},
                            compress: {
                                drop_console: true,
                                drop_debugger: false,
                                pure_funcs: ['console.log'], 
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
