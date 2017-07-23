var path = require('path');
var webpack = require('webpack');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
    devtool: 'eval',
    entry: [
        './src/client'
    ],
    devServer: {
        hot: false,
        inline: true,
        contentBase: './src',
        port: 4240,
        proxy: {'**': 'http://localhost:1338'}
    },
    output: {
        path: path.join(__dirname, './assets/dist/'),
        filename: 'bundle.js',
        publicPath: '/website-assets/dist/'
    },
    plugins: [
        new webpack.DefinePlugin(
            {
                'process.env': {
                    'NODE_ENV': JSON.stringify('local'),
                }
            }
        ),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new OpenBrowserPlugin({ url: 'http://localhost:4240/' })
    ],
    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['awesome-typescript-loader'],
                include: path.join(__dirname, 'src')
            },
            {
                test   : /\.scss$/,
                use: ['style-loader', 'css-loader', 'resolve-url-loader', 'sass-loader?sourceMap']
            },
            {
                test   : /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
                use : 'file-loader'
            }
        ]
    }
};
