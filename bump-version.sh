#!/bin/bash

VERSION=$(date +%Y%m%d%H%M%S)

echo "Updating js and css to version: $VERSION ..."

# ?v= nei tag <link>/<script> degli HTML
find . -type f -name "*.html" | while read file; do
  sed -i -E "s/(\.(css|js)\?v=)[^\"']+/\1$VERSION/g" "$file"
done

# ?v= negli import ES module (aggiunto se manca, aggiornato se presente)
find ./js -type f -name "*.js" | while read file; do
  sed -i -E "s/(import[^\"']*[\"'][^\"']+\.js)(\?v=[^\"']*)?([\"'])/\1?v=$VERSION\3/g" "$file"
done

echo "Done."
