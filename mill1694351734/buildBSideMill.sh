#!/bin/bash
ts=$(date +"%s")
echo $ts
mkdir data/mill$ts
mkdir data/mill$ts/css
cp BmillTemplate.js data/mill$ts/Bmill_temp.js
cp inputTemplate.js data/mill$ts/input.js
cp bSideMill.js data/mill$ts/poems.js
cp bSideBookMill.js data/mill$ts/book.js
cp css/broadsides/print.css data/mill$ts/css/print.css
cd css/broadsides
bash compileCSS.sh
cd ../..
cp pdfToFilm.sh data/mill$ts/pdfToFilm.sh
sed "s/00000000/\"$ts\"/" data/mill$ts/Bmill_temp.js > data/mill$ts/Bmill.js
rm data/mill$ts/Bmill_temp.js
node data/mill$ts/Bmill.js
node bSideMill ./data/mill$ts
node bSideBookMill ./data/mill$ts 
prince -s data/mill$ts/css/print.css data/mill$ts/print.html -o data/mill$ts/print.pdf
echo "cd data/mill$ts"
echo "$(date)" > data/mill$ts/readMe.txt
echo "directory=data/mill$ts" >> data/mill$ts/readMe.txt
echo "done"
open data/mill$ts/print.pdf
