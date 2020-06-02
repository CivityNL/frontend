const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpackBase = require('./webpack.base.babel');
const template = require('./template');

module.exports = webpackBase({
  mode: 'development',

  // Add hot reloading in development
  entry: [
    'webpack-hot-middleware/client?reload=true',
    path.join(process.cwd(), 'src/app.js'), // Start with js/app.js
  ],

  // Don't use hashes in dev mode for better performance
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },

  // Add development plugins
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // Tell webpack we want hot reloading
    new HtmlWebpackPlugin({
      inject: true, // Inject all files that are generated by webpack, e.g. bundle.js
      ...template,
    }),
    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/, // exclude node_modules
      failOnError: false, // show a warning when there is a circular dependency
    }),
    new CopyPlugin([
      { from: path.join(process.cwd(), 'src/sw-proxy.js') },
      { from: path.join(process.cwd(), 'src/sw-proxy-responses.js'), force: true },
    ]),
  ],

  // Emit a source map for easier debugging
  // See https://webpack.js.org/configuration/devtool/#devtool
  devtool: 'eval-source-map',

  performance: {
    hints: false,
  },
});
