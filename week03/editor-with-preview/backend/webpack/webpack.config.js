const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: path.resolve(__dirname, "../public/src/index.js"),
    output: {
        path: path.resolve(__dirname, "../public/build"),
        filename: "bundle.js",
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "预览",
            inject: "body",
            scriptLoading: "blocking",
            publicPath: "./build",
        }),
    ],
};
