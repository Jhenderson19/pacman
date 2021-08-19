const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './client/src/entry.js',
  output: {
    path: path.resolve(__dirname, 'client', 'compiled'),
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "client", "src", "index.html")
    }),
    new CopyWebpackPlugin({
      patterns: [
        {from: path.resolve(__dirname, 'client', 'src', 'css'), to: path.resolve(__dirname, 'client', 'compiled', 'css')}
      ]
    })
  ],
  watchOptions: {
    ignored: /node_modules/
  }
};