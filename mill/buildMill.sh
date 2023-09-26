#!/bin/bash
ts=$(date +"%s")
echo $ts
mkdir data/mill$ts
mkdir data/mill$ts/css
cp Bmill.js data/mill$ts/Bmill_temp.js
cp poemMill.js data/mill$ts/poemMill.js
cp bookMill.js data/mill$ts/bookMill.js
cp pdfToFilm.sh data/mill$ts/pdfToFilm.sh
cd css/book
bash compileCSS.sh
cd ../..
cp css/book/print.css data/mill$ts/css/print.css
sed "s/00000000/\"$ts\"/" data/mill$ts/Bmill_temp.js > data/mill$ts/Bmill.js
rm data/mill$ts/Bmill_temp.js
node data/mill$ts/Bmill.js
node poemMill ./data/mill$ts
node bookMill ./data/mill$ts 
prince -s data/mill$ts/css/print.css data/mill$ts/print.html -o data/mill$ts/printbook.pdf
sed "s/illustratedbook/broadsides/" data/mill$ts/print.html > data/mill$ts/printbroadsides.html
prince -s data/mill$ts/css/print.css data/mill$ts/printbroadsides.html -o data/mill$ts/printbroadsides.pdf
echo "cd data/mill$ts"
echo "$(date)" > data/mill$ts/readMe.txt
echo "directory=data/mill$ts" >> data/mill$ts/readMe.txt
echo "done"
open data/mill$ts/printbook.pdf
open data/mill$ts/printbroadsides.pdf
