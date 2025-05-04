const path = require('path');

module.exports = {
  entry: {
    index: path.resolve(__dirname, 'src/index.ts'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: path.resolve(__dirname, 'tsconfig.build.json'),
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  externals: {
    react: 'commonjs react',
  },
};
