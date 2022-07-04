const glob = require('glob')
const path = require('path')
const webpack = require('webpack')

const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  devtool: 'source-map',
  devServer: {
    hot: 'only',
    port: process.env.PORT || 30443,
    static: './dist',
    // devMiddleware: { writeToDisk: true },
    allowedHosts: ['localhost', '.web3os.dev', '.web3os.local'],
    client: {
      logging: 'info',
      // progress: true
    },
    server: {
      type: 'https',
      options: {
        cert: './src/assets/ssl/web3os.dev.crt',
        key: './src/assets/ssl/web3os.dev.key'
      }
    }
  },
  performance: {
    hints: false
  },
  experiments: {
    topLevelAwait: true,
    asyncWebAssembly: true
    // lazyCompilation: true
  },
  plugins: [
    // new WebpackBundleAnalyzer(),

    new webpack.NormalModuleReplacementPlugin(/node:/, resource => {
      const mod = resource.request.replace(/^node:/, '')
  
      switch (mod) {
        case 'path':
          resource.request = 'path-browserify'
          break
        default:
          throw new Error(`Not found ${mod}`)
        }
    }),

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
        { from: 'manifest.json' },
        { from: 'src/assets/dosbox' },
        { from: 'src/assets/icon-512.png', to: 'assets/icon.png' },
        { from: 'src/assets/icon-192.png', to: 'assets' },
        { from: 'src/assets/maskable_icon_x192.png', to: 'assets' }
      ]
    })
  ],

  entry: {
    _loader: './src/_loader.js',
    kernel: './src/kernel.js',
    'service-worker': './src/service-worker.js',
    ...glob.sync('./src/modules/**/*.js').reduce((obj, el) => { obj['modules/' + path.parse(el).dir.split('/').at(-1)] = el; return obj }, {})
  },

  output: {
    clean: true,
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: ''
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],

    fallback: {
      assert: require.resolve('assert'),
      buffer: require.resolve('buffer'),
      os: require.resolve('os-browserify/browser'),
      url: require.resolve('url/'),
      path: require.resolve('path-browserify'),
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      process: require.resolve('process/browser'),
      util: require.resolve('util')
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
      { // We're gonna slowly transition to typescript..
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
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
        test: /\.(gif|mp3|wav|mp4|ogg|jsdos|img|bin|zst|iso)$/i,
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
            loader: 'img-optimize-loader',
            options: {
              compress: {
                mode: 'lossless',
                disableOnDevelopment: true
              }
            }
          }
        ]
      }
    ]
  }
}
