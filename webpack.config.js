/**
 * External dependencies
 */
const getBaseWebpackConfig = require('@automattic/calypso-build/webpack.config.js');

module.exports = getBaseWebpackConfig(
	{ WP: true },
	{
		mode: process.env.NODE_ENV || 'production',
		entry: {
			editor: './src/editor/index.js',
			client: './src/client/index.js',
		},
	}
);
