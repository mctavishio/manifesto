
#!/bin/bash
cd ../..
ts=1690833109
echo "ts=1690833109"
mkdir data/mill1690833109
cp BmillTemplate.js data/mill1690833109/Bmill_temp.js
cp inputTemplate.js data/mill1690833109/input.js
sed "s/"1690833109"/"1690833109"/" data/mill1690833109/Bmill_temp.js > data/mill1690833109/Bmill.js
rm data/mill1690833109/Bmill_temp.js
node data/mill1690833109/Bmill.js
node poemMill ./data/mill1690833109
node bookMill ./data/mill1690833109 
prince -s css/bookprint.css data/mill1690833109/print.html -o data/mill1690833109/print.pdf
echo "cd data/mill1690833109"
echo "$(date)" > data/mill1690833109/readMe.txt
echo "done"
