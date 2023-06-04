#!/bin/sh
outputfilename=index$(date "+%s").html
echo  "enter data and press [ENTER]: "
read datafile
echo
echo datafile: $datafile and outputfilename: $outputfilename
node indexweb $datafile
#node indexweb "./data/webinfo20230508.js"
