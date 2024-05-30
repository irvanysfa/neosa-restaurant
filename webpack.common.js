module.exports = {
  mode: 'production', // Tambahkan mode produksi di sini
  entry: {
    app: './src/scripts/index.js',
    detailrestaurant: './src/scripts/detailrestaurant.js',
    favorite: './src/scripts/favorite.js',
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
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/templates/index.html',
      chunks: ['app'],
    }),
    new HtmlWebpackPlugin({
      filename: 'detailrestaurant.html',
      template: './src/templates/detailrestaurant.html',
      chunks: ['detailrestaurant'],
    }),
    new HtmlWebpackPlugin({
      filename: 'favorite.html',
      template: './src/templates/favorite.html',
      chunks: ['favorite'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/public',
          to: './dist',
        },
      ],
    }),
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        // Konfigurasi runtime caching
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
