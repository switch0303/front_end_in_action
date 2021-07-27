const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader/dist/index");

module.exports = {
    entry: path.resolve(__dirname, "../public/src/index.js"),
    output: {
        path: path.resolve(__dirname, "../public/build"),
        filename: "bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ["vue-loader"],
            },
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        cacheDirectory: true,
                    },
                },
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.less$/,
                use: ["style-loader", "css-loader", "less-loader"],
            },
            {
                test: /\.(jpg|png|jpeg|gif|bmp)$/,
                use: {
                    loader: "url-loader",
                    options: {
                        limit: 1024,
                        fallback: {
                            loader: "file-loader",
                            options: {
                                name: "[name].[ext]",
                            },
                        },
                    },
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../public/src/index.html"),
            title: "预览",
            inject: "body",
            scriptLoading: "blocking",
            publicPath: "./build",
        }),
        new VueLoaderPlugin(),
    ],
};
