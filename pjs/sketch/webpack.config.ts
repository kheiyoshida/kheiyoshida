import path from "path"
import { Configuration as WebpackConfig, DefinePlugin } from "webpack"
import { Configuration as WebpackServerConfig } from 'webpack-dev-server'
import { EsbuildPlugin } from 'esbuild-loader'

interface Configuration extends WebpackConfig {
  devServer?: WebpackServerConfig
}

const config: Configuration = {
  entry: "./src/index.ts",
  plugins: [
    new DefinePlugin({
      'process.env.PROJECT': JSON.stringify(process.env.PROJECT)
   }),
  ],
  optimization: {
    minimizer: [
      new EsbuildPlugin()
    ]
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)?$/,
        exclude: /node_modules/,
        use: {
          loader: require.resolve("babel-loader"),
          options: {
            presets: ["@babel/preset-env", "@babel/preset-typescript"],
          },
        },
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: [require.resolve('source-map-loader')],
      },
      {
        test: /\.(wav|mp3|mov|mp4|ttf|jpg)$/,
        type: 'asset/resource',
      }
    ]
  },
  resolve: {
    symlinks: true,
    alias: {
      src: path.resolve(__dirname, 'src')
    },
    extensions: [".ts", ".js"],
  },
  devtool: 'source-map',
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
    // devtoolModuleFilenameTemplate: 'file:///[absolute-resource-path]'
  },
  devServer: {
    static: path.join(__dirname, "public"),
    compress: true,
    port: 3000,
    historyApiFallback: {
      index: 'index.html'
    }
  },
}

export default config
