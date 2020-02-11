module.exports = {
	extends: [
		'plugin:@wordpress/eslint-plugin/recommended',
		'plugin:prettier/recommended',
		'plugin:jsdoc/recommended',
		'plugin:import/errors',
		'plugin:import/warnings',
	],
	env: {
		browser: true,
	},
	ignorePatterns: ['dist/', 'node_modules/'],
	rules: {
		camelcase: 'off',
		// Disallow importing or requiring packages that are not listed in package.json
		// This prevents us from depending on transitive dependencies, which could break in unexpected ways.
		'import/no-extraneous-dependencies': ['error', { packageDir: '.' }],
	},
};
