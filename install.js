'use strict';

// Compatibility with older node.js as path.exists got moved to `fs`.
const fs = require('fs');
const path = require('path');
const exists = fs.existsSync || path.existsSync;

// Find the absolute location of the `pre-commit` file.
// The path needs to be absolute in order for the symlinking to work correctly.
const projectPath = path.resolve(__dirname, '..', '..');
const git = path.resolve(projectPath, '.git');
const hooks = path.resolve(git, 'hooks');
const precommitPath = path.resolve(hooks, 'pre-commit');
const newPrecommitHook = path.resolve(__dirname, 'pre-commit.sh');

console.log('precommitPath', precommitPath);
console.log('newPrecommitHook', newPrecommitHook);
console.log('__dirname', __dirname);

// Stop the install if a `.git` directory does not exist (as hooks would not be run).
if (!exists(git) || !fs.lstatSync(git).isDirectory()) {
	return;
}

// If there is a .git directory then create a hooks directory if it doesn't exist.
if (!exists(hooks)) {
	fs.mkdirSync(hooks);
}

// If a pre-commit hook already exists then back it up - it may contain functionality that it would be annoying to lose.
// But don’t bother if it is a symbolic link.
// When uninstalling the backed up hook may be restored.
if (exists(precommitPath) && !fs.lstatSync(precommitPath).isSymbolicLink()) {
	console.log('pre-commit: Detected an existing git pre-commit hook');

	fs.writeFileSync(
		precommitPath + '.bak',
		fs.readFileSync(precommitPath)
	);

	console.log('pre-commit: Backed up old pre-commit hook to pre-commit.bak');
}

// Try to install the new pre-commit file, and fail gracefully if it doesn’t work.
try {
	fs.writeFileSync(
		precommitPath,
		fs.readFileSync(newPrecommitHook)
	);
} catch (error) {
	console.error('pre-commit: Failed to create the pre-commit hook file in .git/hooks/  because:');
	console.error('pre-commit: ' + error.message);
}

// Try to make the new pre-commit file executable, and fail gracefully if it doesn’t work.
try {
	fs.chmodSync(precommitPath, '+x');
} catch (error) {
	console.error('pre-commit: chmod 0777 the pre-commit file in your .git/hooks folder because:');
	console.error('pre-commit: ' + error.message);
}
