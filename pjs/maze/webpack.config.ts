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
      'process.env.DEBUG': JSON.stringify(process.env.DEBUG)
   }),
  ],
  optimization: {
    minimizer: [
      new EsbuildPlugin({
        keepNames: true
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)?$/,
        exclude: /node_modules/,
        loader: 'esbuild-loader',
        options: {
          target: 'es2015'
        }
      },
      {
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
      },
    ]
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src')
    },
    extensions: [".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
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
