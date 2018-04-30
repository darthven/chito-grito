const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './main.ts',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: { extensions: ['.ts', '.js'] },
  plugins: [
    new UglifyJsPlugin({uglifyOptions: {     
      ecma: 8,      
      output: {
        comments: false,
        beautify: false,        
      },    
      warnings: false
    }
  })],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname)
  }
}