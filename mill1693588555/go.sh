rm run*.txt
ts=$(date +"%s")
echo $ts
bash buildMillTemplate.sh > run$ts.txt 
