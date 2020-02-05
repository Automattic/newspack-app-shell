module.exports = {
	branches: [ 'release' ],
	prepare: [
		'@semantic-release/changelog',
		'@semantic-release/npm',
		[
			'semantic-release-version-bump',
			{
				files: 'newspack-app-shell.php',
			},
		],
		{
			path: '@semantic-release/git',
			assets: [ 'newspack-app-shell.php', 'package.json', 'package-lock.json', 'CHANGELOG.md' ],
			message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
		},
	],
	plugins: [
		'@semantic-release/commit-analyzer',
		'@semantic-release/release-notes-generator',
		[
			'@semantic-release/npm',
			{
				npmPublish: false,
			},
		],
		'semantic-release-version-bump',
		[
			'@semantic-release/github',
			{
				assets: [
					{
						path: './assets/release/newspack-app-shell.zip',
						label: 'newspack-app-shell.zip',
					},
				],
			},
		],
	],
};
