pdfseparate print.pdf page%03d.pdf
mv page001.pdf page999.pdf
pdfunite page*.pdf printLogoLast.pdf
open printLogoLast.pdf
rm page*.pdf
