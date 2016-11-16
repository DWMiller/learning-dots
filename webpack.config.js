
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: "./app/app.js",
  output: {
    filename: "build/bundle.js"
  },
   plugins: [new HtmlWebpackPlugin()],
  module: {
   loaders: [
     {
       test: /\.js$/,
       exclude: /node_modules/,
       loader: 'babel-loader',
       query: {
         presets: ['react', 'es2015']
       }
     },
     {
       test: /\.css$/,
       loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
     }
   ]
 },
 plugins: [
    new ExtractTextPlugin('styles.css'),
    new HtmlWebpackPlugin({
      template: './app/index.html'
})
],
 resolve: {
  extensions: ['', '.js']
},
   watch: true
}
