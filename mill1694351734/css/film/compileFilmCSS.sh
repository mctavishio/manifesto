#!/bin/bash
ts=$(date +"%s")
echo $ts
cat ../printRoot.css > printFilm$ts.css
cat printFrame.css >> printFilm$ts.css
cat printCounters.css >> printFilm$ts.css
cp printFilm$ts.css printFilm.css
