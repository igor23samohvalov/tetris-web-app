import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { fileURLToPath } from 'url';

const isProduction = process.env.NODE_ENV == 'production';

const stylesHandler = MiniCssExtractPlugin.loader;
const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename);

const config = {
    entry: './frontend/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        open: true,
        port: 8080,
    },
    plugins: [
        new MiniCssExtractPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
            },
            {
                test: /\.s[ac]ss$/i,
                use: [stylesHandler,'css-loader', 'sass-loader'],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
                type: 'asset',
            },
        ],
    },
};

export default () => {
    if (isProduction) {
      config.mode = 'production';
    } else {
      config.mode = 'development';
      config.plugins = [
        new HtmlWebpackPlugin({
            template: 'frontend/index.html',
        }),
        new MiniCssExtractPlugin(),
      ]
    }
    return config;
  };
