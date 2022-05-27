const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack');
const isDev = process.env.NODE_ENV === 'development';
const config = require("./public/config")[isDev ? 'dev' : 'build']
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssPlugin = require('optimize-css-assets-webpack-plugin');

console.log(process.env.NODE_ENV,'enviroment')

module.exports = {
    mode: isDev ? 'development' : 'production',
    // entry: './src/index.js', //webpack的默认配置
    entry: {
        index: './src/index.js',
        login: './src/login.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'), //必须是绝对路径
        filename: '[name].[hash:6].js',    //指定哈希为6位数
        publicPath: isDev ? '/' : '/hsy-merchant' //也就是会在打包生成的html文件里面引用资源路径中添加前缀。
    },
    //resolve.modules , 哪些目录下寻找第三方模块，默认情况下，只会去 node_modules 下寻找，如果你我们项目中某个文件夹下的模块经常被导入，不希望写很长的路径，那么就可以通过配置 来简化
    resolve: {
        modules: ['./src/components', 'node_modules'],//从左到右依次查找
        // alias: {
        //     'react-native': '@my/react-native-web' //这个包名是我随便写的哈
        // }
        extensions: ['web.js', '.js'] //当然，你还可以配置 .json, .css,适配多端的项目中,例如首先寻找 ../dialog.web.js ，如果不存在的话，再寻找 ../dialog.js
    },
    // 这样配置之后,我们 import Dialog from 'dialog'，会去寻找 ./src/components/dialog，不再需要使用相对路径导入。如果在 ./src/components 下找不到的话，就会到 node_modules 下寻找。
    // resolve.alias 配置项通过别名把原导入路径映射成一个新的导入路径
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: ['babel-loader'],
                exclude: /node_modules/ //排除 node_modules 目录
            },
            {
                test: /\.(le|c)ss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader'], //用MiniCssExtractPlugin替换之前的 style-loader
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
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html', //打包后的文件名
            config: config.template,
            chunks: ['index']
            // minify: {
            //     removeAttributeQuotes: false,//是否删除属性的双引号
            //     collapseWhitespace: false,//是否折叠空白
            // },
            // hash: true //是否加上hash，默认是 false
        }),
        new HtmlWebpackPlugin({
            template: './public/login.html',
            filename: 'login.html', //打包后的文件名
            config: config.template,
            chunks: ['login']
            // minify: {
            //     removeAttributeQuotes: false,//是否删除属性的双引号
            //     collapseWhitespace: false,//是否折叠空白
            // },
            // hash: true //是否加上hash，默认是 false
        }),
        //不需要传参数喔，它可以找到 outputPath,不创参数时默认删除整个dist文件
        new CleanWebpackPlugin(),
        // 我们需要使用已有的JS文件、CSS文件（本地文件），但是不需要 webpack 编译,
        // 如果直接打包，那么在构建出来之后，肯定是找不到对应的 js / css 了，那么我们可以用下面这个插件设置拷贝到构建好的dist的目录下，不编译
        // new CopyWebpackPlugin({
        //     patterns: [{
        //         from: 'public/js/*.js',
        //         to: path.resolve(__dirname, 'dist', 'js'),
        //         // flatten: true, 
        //     }]
        // }),
        //ProvidePlugin 的作用就是不需要 import 或 require 就可以在项目中到处使用。,这样配置之后，你就可以在项目中随心所欲的使用 $、_map了，并且写 React 组件时，也不需要 import React 和 Component 了
        //配置全局变量
        new webpack.ProvidePlugin({
            React: 'react',
            Component: ['react', 'Component'],
            Vue: ['vue/dist/vue.esm.js', 'default'],
            $: 'jquery',
            _map: ['lodash', 'map']
        }),
        // 抽离css
        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash:6].css'  //个人习惯将css文件放在单独目录下
        }),
        //压缩
        // 直接配置在 plugins 里面，那么 js 和 css 都能够正常压缩，如果你将这个配置在 optimization，那么需要再配置一下 js 的压缩(开发环境下不需要去做CSS的压缩，因此后面记得将其放到 webpack.config.prod.js 中哈
        new OptimizeCssPlugin(),
        new webpack.HotModuleReplacementPlugin() //热更新插件,不知道为啥这里设置了不起作用
    ],
    devServer: {
        port: 3001,//默认是8080
        open: true, 
        quiet: false,///默认不启用，启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台这也意味着来自 webpack 的错误或警告在控制台不可见 ———— 我是不会开启这个的，看不到错误日志，还搞个锤子
        inline: true,//默认开启 inline 模式，如果设置为false,开启 iframe 模式
        stats: "errors-only", //终端仅打印 error
        overlay: false, //默认不启用，启用 overlay 后，当编译出错时，会在浏览器窗口全屏输出错误，默认是关闭的。
        clientLogLevel: "silent", //日志等级
        compress: true, //是否启用 gzip 压缩
        publicPath: '/',// devServer里面的publicPath表示的是此路径下的打包文件可在浏览器中访问，若是devServer里面的publicPath没有设置，则会认为是output里面设置的publicPath的值。
        //所以简单的理解是output的publicPath会在打包的html文件中引用资源路径添加前缀
        //devServer中的publicPath表示在浏览器中用此路径可以访问到打包的资源
        hotOnly:true,
       
    },
    // devtool: 'cheap-module-eval-source-map',//开发环境下使用

}