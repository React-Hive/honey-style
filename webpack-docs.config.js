const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: path.resolve(__dirname, 'src/docs/index.tsx'),
  },
  output: {
    path: path.resolve(__dirname, 'dist-docs'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig-docs.json',
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.mdx$/,
        use: [
          {
            loader: '@mdx-js/loader',
            /** @type {import('@mdx-js/loader').Options} */
            options: {
              /* jsxImportSource: …, otherOptions… */
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/docs/index.html',
      filename: 'index.html',
    }),
  ],
};
