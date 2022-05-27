// 插件可以测量各个插件和loader所花费的时间
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const isDev = process.env.NODE_ENV === 'development';
const config = require("./public/config")[isDev ? 'dev' : 'build']
const path = require('path');



console.log(process.env.NODE_ENV, 'enviroment')

module.exports = {
    // mode: isDev ? 'development' : 'production',
    // entry: './src/index.js', //webpack的默认配置
    entry: {
        index: './src/index.js',
        // login: './src/login.js'
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
            // babel-loader
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
        }),
        //不需要传参数喔，它可以找到 outputPath,不创参数时默认删除整个dist文件
        // new CleanWebpackPlugin(),
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
        //压缩
        // 直接配置在 plugins 里面，那么 js 和 css 都能够正常压缩，如果你将这个配置在 optimization，那么需要再配置一下 js 的压缩(开发环境下不需要去做CSS的压缩，因此后面记得将其放到 webpack.config.prod.js 中哈
        // new OptimizeCssPlugin(),
        // new webpack.HotModuleReplacementPlugin() //热更新插件,不知道为啥这里设置了不起作用
    ],
    // devtool: 'cheap-module-eval-source-map',//开发环境下使用

}

// module.exports = smp.wrap(webpackConfig);