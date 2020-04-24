#!/bin/bash -e

cd "$(dirname "$0")"
find -name "*.json" | while read file; do
	echo -n "$file: "
	# Validate stripping comments
	cat "$file" | sed -r "s|^\s*//.*||" | jq . >>/dev/null && echo "OK"
done
