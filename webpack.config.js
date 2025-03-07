// const Path = require('path');
import Path from 'node:path';
import Webpack from 'webpack';

const __dirname = import.meta.dirname;

const MODE = process.env.NODE_ENV || 'none';

export default {
  entry: './src/webui/index.tsx',
  devtool: 'inline-source-map',
  mode: MODE,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'app.js',
    path: Path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: {
      directory: Path.join(__dirname, 'dist'),
    },
    port: 9000,
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || MODE),
    }),
  ]
};