const path = require('path');

module.exports = {
  entry: './src/entry.js',
  output: {
    path: path.resolve(__dirname, 'compiled'),
    filename: 'bundle.js'
  }
};