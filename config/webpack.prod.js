const EslintWebpackPlugin = require("eslint-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerWebpackPlugin = require("css-minimizer-webpack-plugin")
const TerserWebpackPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require("copy-webpack-plugin")
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin")
const path = require('path')
const {VueLoaderPlugin} = require('vue-loader')
const {DefinePlugin} = require('webpack')
const getStyleLoaders = (pre) => {
    return [
        MiniCssExtractPlugin.loader,
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
        path:path.resolve(__dirname,'../dist'),
        filename:"static/js/[name].[contenthash:10].js",
        chunkFilename:"static/js/[name].[contenthash:10]chunk.js",
        assetModuleFilename:"static/media/[hash:10][ext][query]",
        clean:true,
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
            },

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
        new MiniCssExtractPlugin({
            filename:"static/css/[name].[contenthash:10].css",
            chunkFilename:"static/css/[name].[contenthash:10].chunk.css"
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from:path.resolve(__dirname,'../public'),
                    to: path.resolve(__dirname,'../dist'),
                    globOptions: {
                        ignore:["**/index.html"]
                    }
                }
            ]
        }),
        new VueLoaderPlugin(),
        new DefinePlugin({
            __VUE_OPTIONS_API__:true,
            __VUE_PROD_DEVTOOLS__:false,
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true,
        }),
    ],
    mode:"production",
    devtool:"source-map",
    optimization: {
        splitChunks: {
            chunks:'all',
        },
        runtimeChunk: {
            name:(entrypoint) => `runtime~${entrypoint.name}.js`
        },
        minimizer:[
            new CssMinimizerWebpackPlugin(),
            new TerserWebpackPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  plugins: [
                    "preset-default",
                    "prefixIds",
                    {
                      name: "sortAttrs",
                      params: {
                        xmlnsOrder: "alphabetical",
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),

        ]
    },
    resolve: {
        extensions:[".vue", ".js", ".json"]
    },
}