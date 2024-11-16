const EslintWebpackPlugin = require("eslint-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {VueLoaderPlugin} = require('vue-loader')
const {DefinePlugin} = require("webpack") 
const path = require('path')
const getStyleLoaders = (pre) => {
    return [
        "vue-style-loader",
        "css-loader",
        {
            loader:"postcss-loader",
            options: {
                postcssOptions: {
                    plugin:["postcss-preset-env"],
                },
            },
        },
        pre
    ].filter(Boolean)
}
module.exports  = {
    entry: './src/main.js',
    output: {
        path:undefined,
        filename:"static/js/[name].js",
        chunkFilename:"static/js/[name].chunk.js",
        assetModuleFilename:"static/media/[hash:10][ext][query]",
    },
    module: {
        rules: [
            {
                test:/\.css$/,
                use:getStyleLoaders()
            },
            {
                test:/\.less$/,
                use:getStyleLoaders("less-loader")
            },
            {
                test:/\.s[ac]ss$/,
                use:getStyleLoaders("sass-loader")
            },
            {
                test:/\.styl$/,
                use:getStyleLoaders("stylus-loader")
            },
            {
                test: /\.(jpe?g|png|gif|webp|svg)$/,
                type: "asset",
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024,
                    },
                }
            },
            {
                test:/\.(woff2?|ttf)$/,
                type: "asset/resource",
            },
            {
                test: /\.js$/,
                include: path.resolve(__dirname, "../src"),
                loader: "babel-loader",
                options : {
                    cacheDirectory:true,
                    cacheCompression:false,
                }
            },
            {
                test:/\.vue$/,
                loader: "vue-loader",
            }
        ]
    },
    plugins: [
        new EslintWebpackPlugin({
            context:path.resolve(__dirname,'../src'),
            exclude: "node_modules",
            cache:true,
            cacheLocation:path.resolve(__dirname,"../node_modules/.cache/.eslintcache"),
        }),
        new HtmlWebpackPlugin({
            template:path.resolve(__dirname, '../public/index.html'),
        }),
        new VueLoaderPlugin(),
        new DefinePlugin({
            __VUE_OPTIONS_API__:true,
            __VUE_PROD_DEVTOOLS__:false,
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true,
        })
    ],
    mode:"development",
    devtool:"cheap-module-source-map",
    optimization: {
        splitChunks: {
            chunks:'all',
        },
        runtimeChunk: {
            name:(entrypoint) => `runtime~${entrypoint.name}.js`
        }
    },
    resolve: {
        extensions:[".vue", ".js", ".json"]
    },
    devServer: {
        host: "localhost",
        port:3002,
        open:false,
        hot:true,
        historyApiFallback: true,
    },
}