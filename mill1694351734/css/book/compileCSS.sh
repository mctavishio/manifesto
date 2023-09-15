#!/bin/bash
ts=$(date +"%s")
echo $ts
cat ../printRoot.css > print$ts.css
cat printPage.css >> print$ts.css
cat printCounters.css >> print$ts.css
cat printSections.css >> print$ts.css
cp print$ts.css print.css
