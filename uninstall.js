'use strict';

const fs = require('fs');
const path = require('path');
const exists = fs.existsSync || path.existsSync;

const cwd = path.resolve();
const precommitPath = path.resolve(cwd, '.git/hooks/pre-commit');

console.log('cwd', cwd);
console.log('precommitPath', precommitPath);
console.log('__dirname', __dirname);
