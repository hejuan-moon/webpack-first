//webpack.config.dev.js
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const baseWebpackConfig = require('./webpack.config.base');


module.exports = merge(baseWebpackConfig, {
    mode: 'development',
    //...其它的一些配置
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: ['cache-loader', 'babel-loader'],  //'cache-loader'缓存cache-loader 的配置很简单，放在其他 loader 之前即可
                exclude: /node_modules/ //排除 node_modules 目录
            },
            {
                test: /\.(le|c)ss$/,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader'],
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
        new webpack.DefinePlugin({
            DEV: JSON.stringify('dev'),  //字符串
            FLAG: 'true' //FLAG 是个布尔类型
        })
    ],
    devServer: {
        port: 3001,//默认是8080
        // open: true, 
        quiet: false,///默认不启用，启用 quiet 后，除了初始启动信息之外的任何内容都不会被打印到控制台这也意味着来自 webpack 的错误或警告在控制台不可见 ———— 我是不会开启这个的，看不到错误日志，还搞个锤子
        inline: true,//默认开启 inline 模式，如果设置为false,开启 iframe 模式
        stats: "errors-only", //终端仅打印 error
        overlay: false, //默认不启用，启用 overlay 后，当编译出错时，会在浏览器窗口全屏输出错误，默认是关闭的。
        clientLogLevel: "silent", //日志等级
        compress: true, //是否启用 gzip 压缩
        publicPath: '/',// devServer里面的publicPath表示的是此路径下的打包文件可在浏览器中访问，若是devServer里面的publicPath没有设置，则会认为是output里面设置的publicPath的值。
        //所以简单的理解是output的publicPath会在打包的html文件中引用资源路径添加前缀
        //devServer中的publicPath表示在浏览器中用此路径可以访问到打包的资源
        hotOnly: true,
        proxy: {
            // 尽管后端的接口并不包含 /api，我们在请求后端接口时，仍然以 /api 开头，在配置代理时，去掉 /api，修改配置:，
            // 加上/api是为了统一匹配，遇到/api开头的，就转到target服务器地址，在通过pathRewrite去掉api，保证正确的接口地址
            "/api": {
                target: 'http://localhost:4000',  //服务器接口地址
                pathRewrite: {
                    '/api': ""
                }
            }
        }
    }
});