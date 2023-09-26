#!/bin/bash
ts=$(date +"%s")
echo $ts
mkdir data/mill$ts
mkdir data/mill$ts/css
cp Bmill.js data/mill$ts/Bmill_temp.js
cp poemMill.js data/mill$ts/poemMill.js
cp filmMill.js data/mill$ts/filmMill.js
cd css/book
bash compileCSS.sh
cd ../..
cp css/book/print.css data/mill$ts/css/print.css
cp pdfToFilm.sh data/mill$ts/pdfToFilm.sh
sed "s/00000000/\"$ts\"/" data/mill$ts/Bmill_temp.js > data/mill$ts/Bmill.js
rm data/mill$ts/Bmill_temp.js
node data/mill$ts/Bmill.js
node poemMill ./data/mill$ts
node filmMill ./data/mill$ts 
prince -s data/mill$ts/css/print.css data/mill$ts/film.html -o data/mill$ts/film.pdf
echo "cd data/mill$ts"
echo "bash pdfToFilm.sh"
echo "$(date)" > data/mill$ts/readMe.txt
echo "directory=data/mill$ts" >> data/mill$ts/readMe.txt
echo "done"
echo "open data/mill$ts/film.pdf"
