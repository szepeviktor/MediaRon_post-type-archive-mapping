const path = require("path");
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require('webpack');

module.exports = [
	{
		mode: process.env.NODE_ENV,
		entry: {
			blocks: ["./src/blocks.js"],
		},
		output: {
			filename: "[name].js",
			sourceMapFilename: "[name].js.map",
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /(node_modules|bower_components)/,
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env", "@babel/preset-react"],
						plugins: [
							"@babel/plugin-proposal-class-properties",
							"@babel/plugin-transform-arrow-functions",
						],
					},
				},
				{
					test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
					exclude: /(node_modules|bower_components)/,
					use: [
						{
							loader: "file-loader",
							options: {
								name: "[name].[ext]",
								outputPath: "fonts/",
								esModule: false,
							},
						},
					],
				},
				{
					test: /\.(png|jpg|gif)(\?v=\d+\.\d+\.\d+)?$/,
					exclude: /(node_modules|bower_components)/,
					use: [
						{
							loader: "file-loader",
							options: {
								name: "[name].[ext]",
								outputPath: "images/",
								esModule: false,
							},
						},
					],
				},
				{
					test: /\.scss$/,
					exclude: /(node_modules|bower_components)/,
					use: [
						{
							loader: MiniCssExtractPlugin.loader,
						},
						{
							loader: "css-loader",
							options: {
								sourceMap: true,
								url: false,
							},
						},
						"sass-loader",
					],
				},
			],
		},
		devtool: "source-map",
		externals: {
			// Use external version of React
			react: "React",
			"react-dom": "ReactDOM",
			lodash: "lodash",
			'@wordpress': 'wp',
			'@wordpress/blocks': 'wp.blocks',
			'@wordpress/element': 'wp.element',
			"@wordpress/components": 'wp.components',
			"@wordpress/block-editor": 'wp.blockEditor',
			"@wordpress/i18n": 'wp.i18n',
		},
		optimization: {
			minimize: true,
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						ecma: undefined,
						parse: {},
						compress: true,
						mangle: false,
						module: false,
						output: null,
						toplevel: false,
						nameCache: null,
						ie8: false,
						keep_classnames: false,
						keep_fnames: ['__', '_n', '_x', '_nx' ],
						safari10: false,
					},
				}),
			],
		},
		plugins: [
			new MiniCssExtractPlugin(),
		],
	},
	{
		mode: process.env.NODE_ENV,
		entry: {
			blockstyles: ["./src/block/style.scss"],
			admin: ["./src/scss/admin.scss"],
		},
		output: {},
		module: {
			rules: [
				{
					test: /\.scss$/,
					exclude: /(node_modules|bower_components)/,
					use: [
						{
							loader: MiniCssExtractPlugin.loader,
						},
						{
							loader: "css-loader",
							options: {
								sourceMap: true,
								url: false,
							},
						},
						"sass-loader",
					],
				},
			],
		},
		plugins: [
			new FixStyleOnlyEntriesPlugin(),
			new MiniCssExtractPlugin(),
		],
	},
];
