# pdfseparate print.pdf frame%03d.pdf
# for file in frame*.pdf; do magick convert $file -resize 1920 $file.png; done;
# for file in *pdf.png; do mv "$file" "${file/.pdf.png/.png}"; done;
# https://www.princexml.com/doc/command-line/
prince -s css/print.css film.html --raster-dpi=150 --raster-output=frame%03d.png;
ffmpeg -framerate 24 -i frame%03d.png -c:v libx264 -r 24 -pix_fmt yuv420p film.mp4
cp frame024.png poster.png
cp frame018.png poster001.png
rm frame*.png
# magick convert frame024.pdf -resize 1920 poster.png
# magick convert frame018.pdf -resize 1920 poster000.png
open film.mp4
echo done;
