const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function(environment) {

    let webpackConfig = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist') // bundle js file, to output path/js
    },
    // devtool: 'inline-source-map',
    // devtool: 'source-map',
    plugins: [
        new CleanWebpackPlugin(['dist']), // clean up dist folder
        new HtmlWebpackPlugin({
            title: 'Tetrominos',
            template: './src/index.html'
        }),
        new BrowserSyncPlugin( // browsersync with proxy mode, will auto refresh on file changes
            {
                host: 'localhost',
                port: 3003,
                open: false,
                server: { baseDir: ['dist'] }
            }, {
                injectCss: true // css changes will not get full reload
            }
        ),
        new ExtractTextPlugin({
            filename: './css/bundle.css'

        })
    ],
    module: {
        rules: [{
                test: /\.(s*)css$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true,
                                minimize: (environment === 'production')? true : false
                            }
                        }, {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true
                            }
                        }
                    ],
                })
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
                include: path.resolve(__dirname, 'src/fonts'),
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '../fonts/[name].[ext]',
                        context: ''
                        //  outputPath: 'testing'
                    }
                }
            },
            {
                test: /.*\.(gif|png|jpe?g|svg)$/i,
                include: path.resolve(__dirname, 'src/images'),
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                        name: '../img/[name].[ext]',
                    }                  }
                ]
            }            
        ]
    }
};

    if (environment === 'production') {
        webpackConfig.plugins.push(
            new UglifyJsPlugin()
        );
    } else {
        webpackConfig.devtool = 'source-map';
        // webpackConfig.plugins.push(
        //     new UglifyJsPlugin()
        // );
    }

return webpackConfig;
};