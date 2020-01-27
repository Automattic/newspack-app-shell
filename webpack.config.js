/**
 * External dependencies
 */
const fs = require('fs');
const getBaseWebpackConfig = require('@automattic/calypso-build/webpack.config.js');

module.exports = getBaseWebpackConfig(
	{ WP: true },
	{
		mode: process.env.NODE_ENV || 'production',
		entry: {
			client: './src/client/index.js',
		},
	}
);
