#!/bin/bash
ts=$(date +"%s")
echo $ts
mkdir data/mill$ts
mkdir data/mill$ts/css
cp BmillTemplate.js data/mill$ts/Bmill_temp.js
cp inputTemplate.js data/mill$ts/input.js
cp poemMill.js data/mill$ts/poemMill.js
cp bookMill.js data/mill$ts/bookMill.js
cp css/bookprint.css data/mill$ts/css/bookprint.css
cp css/printFilm.css data/mill$ts/css/printFilm.css
sed "s/00000000/\"$ts\"/" data/mill$ts/Bmill_temp.js > data/mill$ts/Bmill.js
rm data/mill$ts/Bmill_temp.js
node data/mill$ts/Bmill.js
node poemMill ./data/mill$ts
node bookMill ./data/mill$ts 
prince -s css/printFilm.css data/mill$ts/print.html -o data/mill$ts/print.pdf
echo "cd data/mill$ts"
echo "$(date)" > data/mill$ts/readMe.txt
echo "directory=data/mill$ts" >> data/mill$ts/readMe.txt
echo "done"
open data/mill$ts/print.pdf
