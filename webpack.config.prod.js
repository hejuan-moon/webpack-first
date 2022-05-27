
const { merge } = require('webpack-merge');
const isDev = process.env.NODE_ENV === 'development';
const config = require("./public/config")[isDev ? 'dev' : 'build']
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');
const baseWebpackConfig = require('./webpack.config.base');
const HappyPack = require('happypack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// var HardSourceWebpackPlugin = require('hard-source-webpack-plugin');


console.log(process.env.NODE_ENV, 'enviroment')

module.exports = merge(baseWebpackConfig, {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                // 把对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实例
                use: ['happypack/loader?id=babel'],
                exclude: /node_modules/ //排除 node_modules 目录
            },
            {
                test: /\.(le|c)ss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader'], // 注意，这里不再用 style-loader
                // use: ['Happypack/loader?id=css'],
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10240, //10K
                        esModule: false, // file-loader 的版本是 5.0.2，5版本之后，需要增加 esModule 属性：
                        name: '[name]_[hash:6].[ext]', //自定义图片名字，未设置时，生成的文件的文件名就是文件内容的 MD5 哈希值并会保留所引用资源的原始扩展名
                        outputPath: 'assets' //指定打包到某个文件夹下
                    }
                },
                exclude: /node_modules/
            },
            // {
            //     test:/.html$/,
            //     use:'html-withimg-loader'  //处理html文件中可以使用相对路径引入图片,但是加了这个后，html中就不可以用vm, ejs 的模板了，也就是不能用<% 这种语法了
            // }

        ]
    },

    plugins: [
        //不需要传参数喔，它可以找到 outputPath,不创参数时默认删除整个dist文件
        new CleanWebpackPlugin(),
        // 抽离css
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash:6].css'  //个人习惯将css文件放在单独目录下
        }),
        //压缩
        // 直接配置在 plugins 里面，那么 js 和 css 都能够正常压缩，如果你将这个配置在 optimization，那么需要再配置一下 js 的压缩(开发环境下不需要去做CSS的压缩，因此后面记得将其放到 webpack.config.prod.js 中哈
        new OptimizeCssPlugin(),
        // happyPack 开启多进程打包
        new HappyPack({
            // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
            id: 'babel',
            // 如何处理 .js 文件，用法和 Loader 配置中一样
            loaders: ['babel-loader?cacheDirectory']
        }),
        new BundleAnalyzerPlugin(),  //npm run build 构建，会默认打开：http://127.0.0.1:8888/，可以看到各个包的体积
        // new HappyPack({
        //     id: 'css',//和rule中的id=css对应
        //     use: [MiniCssExtractPlugin.loader, 'css-loader','postcss-loader'],
        // })
        // new HardSourceWebpackPlugin()


    ],

})