
#!/bin/bash
cd ../..
ts=1690225968
echo "ts=1690225968"
mkdir data/mill1690225968
cp BmillTemplate.js data/mill1690225968/Bmill_temp.js
cp inputTemplate.js data/mill1690225968/input.js
sed "s/"1690225968"/"1690225968"/" data/mill1690225968/Bmill_temp.js > data/mill1690225968/Bmill.js
rm data/mill1690225968/Bmill_temp.js
node data/mill1690225968/Bmill.js
node poemMill ./data/mill1690225968
node bookMill ./data/mill1690225968 
prince -s css/bookprint.css data/mill1690225968/print.html -o data/mill1690225968/print.pdf
echo "cd data/mill1690225968"
echo "$(date)" > data/mill1690225968/readMe.txt
echo "done"
