#!/bin/bash

# This pre-commit file should be placed in .git/hooks and will run ESLint on JavaScript and JSON files.

STAGED_FILES=$(git diff --diff-filter=d --cached --name-only --diff-filter=ACMR | grep -E '\.(js|json)$')

# Check there are files to be staged.
if [ "$STAGED_FILES" = "" ];
then
	exit 0
fi

# Test that eslint is available, if not exit and explain.
if ! [ -f node_modules/.bin/eslint ];
then
	echo "ESLint is not installed.  Please install it:  npm install eslint --save-dev"
	exit 1 # Exit with failure status.
fi

# Test that ESLint JSON plugin is installed.
if ! [ -f node_modules/eslint-plugin-json/lib/index.js ];
then
	echo "eslint-plugin-json is not installed.  Please install it:  npm install eslint-plugin-json --save-dev"
	exit 1 # Exit with failure status.
fi

# Lint each staged file.
for file in $STAGED_FILES
do
	# Run eslint on each staged file.
	git show ":$file" | node_modules/.bin/eslint --ext .js,.json --plugin json --stdin --stdin-filename "$file"

	# If the output from the last line (which ran eslint) exists or is a string longer than zero, then complain.
	if [ $? -ne 0 ];
	then
		echo "ESLint failed on staged file '$file'."
		echo "Please correct your code, commit it the corrections, and try again.  You can run ESLint manually with npm run eslint."
		exit 1 # Exit with failure status.
	fi
done
