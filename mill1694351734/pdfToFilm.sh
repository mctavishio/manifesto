pdfseparate print.pdf frame%03d.pdf
for file in frame*.pdf; do magick convert $file -resize 1920 $file.png; done;
for file in *pdf.png; do mv "$file" "${file/.pdf.png/.png}"; done;
ffmpeg -framerate 24 -i frame%03d.png -c:v libx264 -r 24 -pix_fmt yuv420p film.mp4
rm *.png
magick convert frame024.pdf -resize 1920 poster.png
magick convert frame018.pdf -resize 1920 poster000.png
open film.mp4
echo done;
