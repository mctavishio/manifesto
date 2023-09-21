for f in film_start film_000 film_001 film_002 film_003 film_end
do
	cd $f
	for file in *.pdf; do magick convert $file -resize 1920 $file.png; done;
	for file in *pdf.png; do mv "$file" "${file/.pdf.png/.png}"; done;
	ffmpeg -framerate 24 -i frame%06d.png -c:v libx264 -r 24 -pix_fmt yuv420p film.mp4
	rm *.png
	echo "done with $f"
	cd ..
	echo "file './$f/film.mp4'" >> filmfiles.txt
	echo "file './$f/film.mp4'" >> filmfiles_extra.txt
done
cd film_extra 
for file in *.pdf; do magick convert $file -resize 1920 $file.png; done;
for file in *pdf.png; do mv "$file" "${file/.pdf.png/.png}"; done;
ffmpeg -framerate 24 -i frame%06d.png -c:v libx264 -r 24 -pix_fmt yuv420p film.mp4
rm *.png
echo "done with film_extra"
cd ..
echo "file './film_extra/film.mp4'" >> filmfiles_extra.txt
magick convert film_000/frame000124.pdf -resize 1920 poster.png
magick convert film_000/frame000248.pdf -resize 1920 poster000.png
magick convert film_001/frame000124.pdf -resize 1920 poster001.png
magick convert film_002/frame000124.pdf -resize 1920 poster002.png
magick convert film_003/frame000124.pdf -resize 1920 poster003.png
ffmpeg -f concat -safe 0 -i filmfiles.txt -c copy film_silent.mp4
for f in film_000 film_001 film_002 film_003 film_start film_end film_extra
do
	cd $f
	pdfunite $(ls frame*{24,48,72,96}.pdf) book.pdf
	cd ..
done
open film_silent.mp4

