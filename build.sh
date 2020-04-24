#!/bin/bash -e

cd "$(dirname "$0")"

echo "### GENERATING RESOURCES"
./generate_resources.sh

echo
echo "### TESTING JSONS"
./test_jsons.sh
