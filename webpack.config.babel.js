import ExtractTextPlugin from 'extract-text-webpack-plugin';

export default {
    entry: './src/index.jsx',
    output: {
        path: './dist/',
        publicPath: '/',
        filename: './js/bundle.js'
    },
    module: {
        loaders: [
            { test: /.jsx|.js?$/, loader: 'babel-loader' },
            { test: /.sass?$/, loader: ExtractTextPlugin.extract('style', 'css!sass?sourceMap') },
            { test: /\.(eot|svg|ttf|woff|woff2)$/, loader: 'file?name=public/fonts/[name].[ext]' }
        ]
    },
    plugins: [
        new ExtractTextPlugin('./css/bundle.css')
    ],
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};
