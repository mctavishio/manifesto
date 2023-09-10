
#!/bin/bash
cd ../..
ts=1690833524
echo "ts=1690833524"
mkdir data/mill1690833524
cp BmillTemplate.js data/mill1690833524/Bmill_temp.js
cp inputTemplate.js data/mill1690833524/input.js
sed "s/"1690833524"/"1690833524"/" data/mill1690833524/Bmill_temp.js > data/mill1690833524/Bmill.js
rm data/mill1690833524/Bmill_temp.js
node data/mill1690833524/Bmill.js
node poemMill ./data/mill1690833524
node bookMill ./data/mill1690833524 
prince -s css/bookprint.css data/mill1690833524/print.html -o data/mill1690833524/print.pdf
echo "cd data/mill1690833524"
echo "$(date)" > data/mill1690833524/readMe.txt
echo "done"
