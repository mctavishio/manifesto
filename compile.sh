echo "p1: $1";
find . -name "$1" > "$1filelist.txt" 
{ xargs cat < "$1filelist.txt" ; } > "$1manifesto.txt"
