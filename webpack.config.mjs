import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  target: ['web'],
  entry: {
    index: path.resolve(__dirname, 'src/index.ts'),
  },
  output: {
    module: true,
    path: path.resolve(__dirname, 'dist'),
    library: {
      // https://webpack.js.org/configuration/output/#type-modern-module
      type: 'modern-module',
    },
  },
  experiments: {
    outputModule: true,
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
    react: 'react',
  },
};
