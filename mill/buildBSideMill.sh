#!/bin/bash
ts=$(date +"%s")
echo $ts
mkdir data/mill$ts
mkdir data/mill$ts/css
cp Bmill.js data/mill$ts/Bmill_temp.js
cp poemMill.js data/mill$ts/poemMill.js
cp filmMill.js data/mill$ts/bookMill.js
cp bSideBookMill.js data/mill$ts/book.js
cd css/broadsides
bash compileCSS.sh
cd ../..
cp css/broadsides/print.css data/mill$ts/css/print.css
cp pdfToFilm.sh data/mill$ts/pdfToFilm.sh
sed "s/00000000/\"$ts\"/" data/mill$ts/Bmill_temp.js > data/mill$ts/Bmill.js
rm data/mill$ts/Bmill_temp.js
node data/mill$ts/Bmill.js
node poemMill ./data/mill$ts
node bSideBookMill ./data/mill$ts 
prince -s data/mill$ts/css/print.css data/mill$ts/print.html -o data/mill$ts/print.pdf
echo "cd data/mill$ts"
echo "$(date)" > data/mill$ts/readMe.txt
echo "directory=data/mill$ts" >> data/mill$ts/readMe.txt
echo "done"
open data/mill$ts/print.pdf
