# pdfseparate print.pdf frame%03d.pdf
# for file in frame*.pdf; do magick convert $file -resize 1920 $file.png; done;
# for file in *pdf.png; do mv "$file" "${file/.pdf.png/.png}"; done;
# https://www.princexml.com/doc/command-line/
prince -s css/print.css film.html --raster-dpi=150 --raster-output=frame%04d.png;
rm frame0000.png
rm frame0001.png
ffmpeg -framerate 24 -i frame%04d.png -c:v libx264 -r 24 -pix_fmt yuv420p film.mp4
cp frame0048.png poster.png
cp frame0098.png poster0001.png
cp frame0218.png poster0002.png
cp frame0480.png poster0003.png
rm frame*.png

# with text film
prince -s css/print.css filmwithtext.html --raster-dpi=150 --raster-output=frame%04d_withtext.png;
rm frame0000_withtext.png
rm frame0001_withtext.png
ffmpeg -framerate 24 -i frame%04d_withtext.png -c:v libx264 -r 24 -pix_fmt yuv420p film_withtext.mp4
cp frame0048_withtext.png poster_withtext.png
cp frame0098_withtext.png poster0001_withtext.png
cp frame0218_withtext.png poster0002_withtext.png
cp frame0480_withtext.png poster0003_withtext.png
rm frame*_withtext.png

# magick convert frame024.pdf -resize 1920 poster.png
# magick convert frame018.pdf -resize 1920 poster000.png
open film.mp4
open film_withtext.mp4
echo done;
