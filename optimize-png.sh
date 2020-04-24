#!/bin/bash -e

cd "$(dirname "$0")"
find -name '*.png' -print0 | xargs -0 optipng -o7 -nb -nc -strip all -quiet
