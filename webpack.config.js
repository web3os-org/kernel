const glob = require('glob')
const path = require('path')
const webpack = require('webpack')

const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  devtool: 'eval-source-map',
  devServer: { static: './dist', https: true, devMiddleware: { writeToDisk: true } },
  experiments: {
    topLevelAwait: true
  },
  plugins: [
    // new WebpackBundleAnalyzer(),

    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser'
    }),

    new HtmlWebpackPlugin({
      favicon: 'src/assets/favicon.ico',
      template: './src/index.html',
      chunks: ['_loader']
    }),

    new CopyPlugin({
      patterns: [
        { from: 'node_modules/js-dos/dist/wdosbox.wasm' },
        { from: 'node_modules/js-dos/dist/wdosbox.js' }
      ]
    })
  ],

  entry: {
    _loader: './src/_loader.js',
    kernel: './src/index.js',
    ...glob.sync('./src/bin/**/*.js').reduce((obj, el) => { obj['bin/' + path.parse(el).dir.split('/').at(-1)] = el; return obj }, {})
  },

  output: {
    clean: true,
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },

  resolve: {
    fallback: {
      assert: false,
      buffer: require.resolve('buffer'),
      os: require.resolve('os-browserify/browser'),
      url: require.resolve('url/'),
      path: require.resolve('path-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify')
    }
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(md|txt)$/i,
        use: 'raw-loader'
      },
      {
        test: /\.(gif|mp3|wav|mp4|ogg|jsdos)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(png|jpe?g|webp|svg|)$/i,
        use: [
          {
            loader: `img-optimize-loader`,
            options: {
              compress: {
                mode: 'lossless',
                disableOnDevelopment: true,
              }
            }
          }
        ]
      }
    ]
  }
}
