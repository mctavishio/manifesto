#!/bin/bash
ts=$(date +"%s")
echo $ts
cp data/BmillTemplate.js data/Bmill$ts_temp.js
sed "s/000000000/\"$ts\"/" data/Bmill$ts_temp.js > data/Bmill$ts.js
rm data/Bmill$ts_temp.js
echo 'done'
