mkdir -p ../dykeink/code
mkdir -p ../dykeink/css
cp index_dykeink_temp.html ../dykeink/index.html
cp code/core.js ../dykeink/code/core.js
cp css/fieldnotes.css ../dykeink/css/fieldnotes.css
cd ../dykeink
git add --all
git commit -m "tweak to index"
git push
cd ../manifesto
