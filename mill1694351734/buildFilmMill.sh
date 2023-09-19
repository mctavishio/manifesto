#!/bin/bash
ts=$(date +"%s")
echo $ts
mkdir data/mill$ts
mkdir data/mill$ts/css
cp Bmill.js data/mill$ts/Bmill_temp.js
cp frameMill.js data/mill$ts/poemMill.js
cp filmMill.js data/mill$ts/bookMill.js
cp css/film/print.css data/mill$ts/css/print.css
cd css/film
bash compileCSS.sh
cd ../..
cp pdfToFilm.sh data/mill$ts/pdfToFilm.sh
sed "s/00000000/\"$ts\"/" data/mill$ts/Bmill_temp.js > data/mill$ts/Bmill.js
rm data/mill$ts/Bmill_temp.js
node data/mill$ts/Bmill.js
node frameMill ./data/mill$ts
node filmMill ./data/mill$ts 
prince -s data/mill$ts/css/print.css data/mill$ts/print.html -o data/mill$ts/print.pdf
echo "cd data/mill$ts"
echo "bash pdfToFilm.sh"
echo "$(date)" > data/mill$ts/readMe.txt
echo "directory=data/mill$ts" >> data/mill$ts/readMe.txt
echo "done"
open data/mill$ts/print.pdf
