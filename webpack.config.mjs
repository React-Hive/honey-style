import path from 'path';
import { fileURLToPath } from 'url';
import CopyPlugin from 'copy-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseConfig = {
  target: ['web'],
  entry: {
    index: path.resolve(__dirname, 'src/index.ts'),
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
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  externals: {
    react: 'react',
  },
};

const copyFiles = new CopyPlugin({
  patterns: [
    {
      from: path.resolve(__dirname, 'README.md'),
      to: path.resolve(__dirname, 'dist', 'README.md'),
    },
    {
      from: path.resolve(__dirname, 'LICENSE'),
      to: path.resolve(__dirname, 'dist', 'LICENSE'),
      toType: 'file',
    },
  ],
});

const esmConfig = {
  ...baseConfig,
  mode: 'production',
  output: {
    module: true,
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'module',
    },
  },
  devtool: 'source-map',
  experiments: {
    outputModule: true,
  },
  plugins: [copyFiles],
};

const cjsConfig = {
  ...baseConfig,
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].cjs',
    library: {
      type: 'commonjs2',
    },
  },
  devtool: 'source-map',
};

const devConfig = {
  ...baseConfig,
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].dev.cjs',
    library: {
      type: 'commonjs2',
    },
  },
  devtool: 'source-map',
};

export default [esmConfig, cjsConfig, devConfig];
