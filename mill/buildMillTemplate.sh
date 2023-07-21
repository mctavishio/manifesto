#!/bin/bash
ts=$(date +"%s")
echo $ts
mkdir data/mill$ts
cp BmillTemplate.js data/mill$ts/Bmill$ts_temp.js
cp inputTemplate.js data/mill$ts/input$ts.js
sed "s/00000000/\"$ts\"/" data/mill$ts/Bmill$ts_temp.js > data/mill$ts/Bmill$ts.js
rm data/mill$ts/Bmill$ts_temp.js
echo "cd data/mill$ts"
echo "$(date)" > data/mill$ts/readMe.txt
echo "done"
