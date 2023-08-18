const path = require('path');
const common = require('./webpack.common');

module.exports = {
  ...common,
  mode: 'development',
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'client/public'),
    },
    port: 3000,
    historyApiFallback: true,
    // allows to open the browser automatically when the project is run
    open: true,
  },
};
