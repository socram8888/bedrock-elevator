#!/bin/bash -e

cd "$(dirname "$0")"

if which jshint &>/dev/null; then
	find \( -name "*.json" -o -name "*.js" \) -print0 | xargs -0 jshint
else
	echo "JShint not installed - syntax cannot be checked"
fi
