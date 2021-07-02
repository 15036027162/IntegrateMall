const webpack = require('webpack')
const path = require("path");
function resolve(dir) {
    return path.join(__dirname, dir);
}
module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? './'
        : '/', //根路径
    outputDir: 'dist',  //构建输出目录
    assetsDir: 'assets', //静态资源目录（js,less,img,fonts）
    lintOnSave: false,
    productionSourceMap: false,

    //是否开启eslint保存监测，有效值： true || false || 'error'
    devServer: {
        open: false,      //打开页面
        //host: '10.1.1.101',   //域名   127.0.0.0本机    0.0.0.0真机测试
        host: 'localhost',   //域名   127.0.0.0本机    0.0.0.0真机测试
        port: '8080',     //端口号
        https: false,    //是否使用https
        hotOnly: false,
    },
    configureWebpack: {
        // 把原本需要写在webpack.config.js中的配置代码 写在这里 会自动合并
        plugins: [
            new webpack.ProvidePlugin({
                'window.Quill': 'quill/dist/quill.js',
                'Quill': 'quill/dist/quill.js'
            })
        ]
    },
    chainWebpack: config => {
        config.resolve.alias.set("@", resolve("src"));
        config.module.rules.delete("svg");
        config.module.rule("svg-smart")
            .test(/\.svg$/)
            .include.add(resolve("src/icons/svg"))
            .end()
            .use("svg-sprite-loader")
            .loader("svg-sprite-loader")
            .options({
                symbolId: "[name]"
            });
    }
}
