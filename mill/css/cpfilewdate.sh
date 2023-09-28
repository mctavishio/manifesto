echo "p1 (file name with suffix): $1";
filename=$(basename -- "$1")
extension="${filename##*.}"
filenameroot="${filename%.*}"
echo "$filename"
echo "$extension"
echo "$filenameroot"
cp "$1" "$filenameroot$(date +%Y%m%d%H%M%S).$extension"
