
#!/bin/bash
cd ../..
ts=1690224832
echo "ts=1690224832"
mkdir data/mill1690224832
cp BmillTemplate.js data/mill1690224832/Bmill_temp.js
cp inputTemplate.js data/mill1690224832/input.js
sed "s/"1690224832"/"1690224832"/" data/mill1690224832/Bmill_temp.js > data/mill1690224832/Bmill.js
rm data/mill1690224832/Bmill_temp.js
node data/mill1690224832/Bmill.js
node poemMill ./data/mill1690224832
node bookMill ./data/mill1690224832 
prince -s css/bookprint.css data/mill1690224832/print.html -o data/mill1690224832/print.pdf
echo "cd data/mill1690224832"
echo "$(date)" > data/mill1690224832/readMe.txt
echo "done"
