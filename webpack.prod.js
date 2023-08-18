const path = require('path');
const common = require('./webpack.common');

module.exports = {
  ...common,
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'client/public'),
    filename: '[fullhash].js',
  },
};
