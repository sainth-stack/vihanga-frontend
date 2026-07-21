const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash:5].css',
      chunkFilename: '[name].[chunkhash:5].css',
      ignoreOrder: true,
    }),
    new FilterWarningsPlugin({
      exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
    }),
  ],
};