const path = require('path'),
    pkgInfo = require('./package.json'),
    webpack = require('webpack'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = function (env, argv) {
    const mode = argv.mode || 'development'
    process.env.NODE_ENV = mode

    return {
        mode,
        entry: {
            'app': [path.join(__dirname, './src/app.js')]
        },
        output: {
            path: path.join(__dirname, './public/distr/'),
            filename: '[name].js',
            chunkFilename: '[name].js',
            publicPath: '/distr/'
        },
        module: {
            rules: [
                {
                    test: /\.js?$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                url: false,
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].css'
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(mode),
                appVersion: JSON.stringify(pkgInfo.version)
            }),
            new webpack.ProvidePlugin({ Buffer: ['buffer', 'Buffer'] })
        ],
        resolve: {
            fallback: {
                util: false,
                http: false,
                https: false,
            }
        },
        devtool: 'source-map',
        devServer: {
            historyApiFallback: {
                disableDotRule: true
            },
            compress: true,
            watchContentBase: true,
            port: 10001,
            contentBase: [path.resolve(__dirname, 'public')]
        }
    }
}