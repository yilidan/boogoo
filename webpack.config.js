// var webpack = require("webpack");
module.exports = {
    entry: {
        ProductDetails: "./src/js/ProductDetails.js",
        Orderdetail: "./src/js/Orderdetail.js",
        Logistics: "./src/js/Logistics.js",
        Index: "./src/js/Index.js",
        ConfirmOrder: "./src/js/ConfirmOrder.js",
        SelectSite: "./src/js/SelectSite.js",
        ManageSite: "./src/js/ManageSite.js",
        EditSite: "./src/js/EditSite.js",
        AddSite: "./src/js/AddSite.js",
        ClassifyList: "./src/js/ClassifyList.js",
        PayStatus: "./src/js/PayStatus.js",
        BrandClass:"./src/js/BrandClass.js",
        GoodsClass:"./src/js/GoodsClass.js",
        Share:"./src/js/Share.js",
        aboutbg:"./src/js/aboutbg.js",
        serviceHelp:"./src/js/serviceHelp.js",
        test1:"./src/js/test1.js",
        shareProduct:"./src/js/shareProduct.js",
        Register:"./src/js/Register.js",
        personHome:"./src/js/personHome.js"

    },
    output: {
        path: './dist',
        filename: '[name].js'
    },
    resolve: {
        // //  第一项空字符串必不可少，否则报模块错误
        // extensions: ['', '.es6'],
        alias: {
            'vue': 'vue/dist/vue.js',
        }
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'

            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader!'
            },
            {
                test: /\.scss$/,
                loaders: ["style", "css", "sass"]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url'
            }

        ]
    },
    // plugins: [
    //     new webpack.optimize.UglifyJsPlugin({
    //         compress: {
    //             warnings: false
    //         }
    //     }),
    // ]

}
