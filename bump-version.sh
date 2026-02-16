#!/bin/bash

VERSION=$(date +%Y%m%d%H%M%S)

echo "Updating js and css to version: $VERSION ..."

find . -type f -name "*.html" | while read file; do
  sed -i -E "s/(\.(css|js)\?v=)[^\"']+/\1$VERSION/g" "$file"
done

echo "Done."
