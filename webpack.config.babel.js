import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
    entry: './src/index.jsx',
    output: {
        path: './dist/',
        publicPath: '/',
        filename: './js/bundle.[chunkhash:8].js'
    },
    module: {
        loaders: [
            { test: /.jsx|.js?$/, loader: 'babel-loader' },
            { test: /.sass?$/, loader: ExtractTextPlugin.extract('style', 'css!sass?sourceMap') },
            { test: /\.(eot|svg|ttf|woff|woff2)$/, loader: 'file?name=public/fonts/[name].[ext]' }
        ]
    },
    plugins: [
        new ExtractTextPlugin('./css/bundle.[chunkhash:8].css'),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify: false
        })
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};
