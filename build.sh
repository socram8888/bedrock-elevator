#!/bin/bash -e

cd "$(dirname "$0")"

echo "### GENERATING RESOURCES"
./generate-resources.sh

echo
echo "### TESTING JSONS"
./test-jsons.sh

echo
echo "### COMPRESSING PNGS"

