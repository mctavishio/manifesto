
#!/bin/bash
cd ../..
ts=1690147078
echo "ts=1690147078"
mkdir data/mill1690147078
cp BmillTemplate.js data/mill1690147078/Bmill_temp.js
cp inputTemplate.js data/mill1690147078/input.js
sed "s/"1690147078"/"1690147078"/" data/mill1690147078/Bmill_temp.js > data/mill1690147078/Bmill.js
rm data/mill1690147078/Bmill_temp.js
node data/mill1690147078/Bmill.js
node poemMill ./data/mill1690147078
node bookMill ./data/mill1690147078 
prince -s css/bookprint.css data/mill1690147078/print.html -o data/mill1690147078/print.pdf
echo "cd data/mill1690147078"
echo "$(date)" > data/mill1690147078/readMe.txt
echo "done"
