#!/bin/bash
ts=$(date +"%s")
echo $ts
cat printRoot.css > printBook$ts.css
cat printPage.css >> printBook$ts.css
cat printCounters.css >> printBook$ts.css
cat printSections.css >> printBook$ts.css
