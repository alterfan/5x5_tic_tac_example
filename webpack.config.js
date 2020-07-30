const path = require('path') 
const webpack = require('webpack') 
const HtmlWebpackPlugin = require('html-webpack-plugin') 
module.exports = {
	entry: __dirname + '/src/game.js', 
	output: {
		path: path.resolve(__dirname, 'dist'), 
		filename: 'bundle.js', 
		publicPath: '/', 
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: __dirname + '/public/index.html',
			inject: 'body',
		}),
	],
	devServer: {
		publicPath: '/',
		hot: true,
		//historyApiFallback: true,
		contentBase: path.resolve(__dirname, 'public'), 
		port: 3000, 
	},
}
