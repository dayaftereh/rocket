const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default

const srcDir = path.resolve(__dirname, './src')
const distDir = path.resolve(__dirname, '../sketch/data')

const packageJson = require(path.resolve(__dirname, 'package.json'))

module.exports = {
    mode: 'production',
    entry: path.join(srcDir, 'index.ts'),
    devServer: {
        static: {
            directory: './dist',
        },
        compress: true,
        port: 9000,
        liveReload: false,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "sass-loader",
                ],
            },           
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            templateParameters: {
                'name': packageJson.name,
                'version': packageJson.version,
            },
            inject: 'body',
            template: path.join(srcDir, 'index.html'),
        }),
        new MiniCssExtractPlugin({
            filename: "bundle.[name].css"
        }),
        new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/bundle/]),
        new HTMLInlineCSSWebpackPlugin(),
    ],
    output: {
        path: distDir,
        publicPath: '',
        filename: 'bundle.js',
    },
    performance: {
        hints: false,
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
};