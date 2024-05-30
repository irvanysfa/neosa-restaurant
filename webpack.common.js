const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const ImageminWebpackPlugin = require('imagemin-webpack-plugin').default;
const ImageminMozjpeg = require('imagemin-mozjpeg');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/scripts/index.js'),
    detailrestaurant: path.resolve(__dirname, 'src/scripts/detailrestaurant.js'),
    favorite: path.resolve(__dirname, 'src/scripts/favorite.js'),
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 20000,
      maxSize: 70000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      automaticNameDelimiter: "~",
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'src/templates/index.html'),
      chunks: ['app'],
    }),
    new HtmlWebpackPlugin({
      filename: 'detailrestaurant.html',
      template: path.resolve(__dirname, 'src/templates/detailrestaurant.html'),
      chunks: ['detailrestaurant'],
    }),
    new HtmlWebpackPlugin({
      filename: 'favorite.html',
      template: path.resolve(__dirname, 'src/templates/favorite.html'),
      chunks: ['favorite'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/public'),
          to: path.resolve(__dirname, 'dist'),
        },
      ],
    }),
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: new RegExp("https://restaurant-api.dicoding.dev"),
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "api-cache",
            expiration: {
              maxEntries: 100,
            },
          },
        },
        {
          urlPattern: new RegExp("https://restaurant-api.dicoding.dev/detail"),
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "restaurant-detail-cache",
            expiration: {
              maxEntries: 50,
            },
          },
        },
        {
          urlPattern: /\.(?:js|css|scss|html)$/,
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "static-resources",
          },
        },
        {
          urlPattern: new RegExp("detailrestaurant.html"),
          handler: "NetworkFirst",
          options: {
            cacheName: "detail-page-cache",
            expiration: {
              maxEntries: 5,
            },
          },
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
          handler: "CacheFirst",
          options: {
            cacheName: "images-cache",
            expiration: {
              maxEntries: 50,
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    }),
    new ImageminWebpackPlugin({
      plugins: [
        ImageminMozjpeg({
          quality: 75,
        }),
      ],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9090,
  },
};
