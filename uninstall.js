'use strict';

const fs = require('fs');
const path = require('path');
const exists = fs.existsSync || path.existsSync;

const projectPath = path.resolve(__dirname, '..', '..');
const precommitPath = path.resolve(projectPath, '.git/hooks/pre-commit');
const backupPath = precommitPath + '.bak';

// The pre-commit file might have already been removed, so stop trying to uninstall.
if (!exists(precommitPath)) {
	return;
}

if (exists(backupPath)) {
	// If there is a backup of the pre-commit file then reinstate it.
	fs.writeFileSync(
		precommitPath,
		fs.readFileSync(backupPath)
	);
	fs.chmodSync(precommitPath, '755');
	fs.unlinkSync(backupPath);
} else {
	// Else if there is not a backup, then just delete the pre-commit file.
	fs.unlinkSync(precommitPath);
}
