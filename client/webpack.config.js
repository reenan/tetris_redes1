const webpack = require('webpack');
const path = require('path');

const basePath = __dirname;
const outputPath = path.join(basePath, 'build');
const publicPath = '/build/';

module.exports = {
	entry: {
		bundle: ['babel-polyfill', './index.jsx']
	},

	output: {
        path: outputPath,
        filename: '[name].js',
        publicPath: publicPath,
    },

    resolve: {
    	alias: {
    		source: path.join(basePath, 'source'),
    		components: path.join(basePath, 'source/components')
    	}
    },

	devtool: 'source-map',
	module: {
		loaders: [
			{
				test: /.(jsx|js)?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015', 'react', 'stage-0']
				}
			},
			{
                test: /\.(css|scss)$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            },
            { 
            	test: /\.(png|gif|jpe?g||eot|svg|ttf|woff)$/, 
            	loader: 'file-loader' 
            }
		]
	}
};