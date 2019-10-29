const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');
const Visualizer = require('webpack-visualizer-plugin');

const rules = require('./webpack.rules');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

rules.push({
  test: /\.less$/,
  use: [
    { loader: 'style-loader' },
    { loader: 'css-loader' },
    {
      loader: 'less-loader',
    }
  ],
});

rules.push({
  test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
  loader: 'file-loader',
  options: {
    name: '[name].[ext]',
    outputPath: 'fonts/'
  }
});

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
  resolve: {
    /**
     * Determines which file extensions are okay to leave off from
     * the ends of require / import paths. Has no impact on what file types
     * webpack will process.
     *
     * For example:
     *
     * import { logger } from './logger';
     *
     * Instead of:
     *
     * import { logger } from './logger.ts';
     */
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  plugins: [
    new MonacoWebpackPlugin(),
    new Visualizer()
  ],
  externals: {
    'es6-promise': 'es6-promise'
  }
};
