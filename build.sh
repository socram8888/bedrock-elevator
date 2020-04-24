#!/bin/bash -e

cd "$(dirname "$0")"

echo "### GENERATING RESOURCES"
./generate-resources.sh

echo
echo "### TESTING JSONS"
./test-syntax.sh

echo
echo "### COMPRESSING PNGS"
./optimize-png.sh
