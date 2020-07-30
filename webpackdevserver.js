// This little dev server is basically a wrapped express server that 'hot loads' our javascript for super fancy and fast live reload in development
var webpack = require('webpack')
var WebpackDevServer = require('webpack-dev-server')
var config = require('./webpack.config')
var port = process.env.HOT_LOAD_PORT || 3000
var path = require('path')
new WebpackDevServer(webpack(config), {
	publicPath: '/',
	contentBase: path.resolve(__dirname, 'public'),
	hot: true,
}).listen(port, 'localhost', function (err, result) {
	if (err) {
		console.log(err)
	}
	console.log('Listening at localhost:' + port)
})
