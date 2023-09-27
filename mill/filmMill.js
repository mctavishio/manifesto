const fs = require("fs"); 
console.log(process.argv);
const path = process.argv[2] ? process.argv[2] : "./data/mill00000000";
const poemfile = `${path}/frames.js`;
const bookfile = `${path}/film.js`;
const tools = require("./tools.js");
const poems = require(poemfile);
const book = require(bookfile);
const w = Number(book.bookwidth), h = Number(book.bookheight);
const m = Number(book.bookmargin);
const width = book.bookwidth+book.bookunits;
const height = book.bookheight+book.bookunits;
const innerwidth = (w-2.0*m)+book.bookunits;
const innerheight = (h-2.0*m)+book.bookunits;
const margin = book.bookmargin+book.bookunits;
const margingutter = book.bookguttermargin+book.bookunits;
const svgwidth = book.bookwidth*book.pixelsperunit;
const svgheight = book.bookheighti*book.pixelsperunit;
let dt = new Date();
let timestamp = dt.getTime();
let datetime = dt.toDateString();
let head = `
<head>
	<title>${book.title}</title>
	<meta charset="utf-8"/>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0"/>
	<meta name="description" content="${book.description}"/>
	<meta name="author" content="${book.author}">
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
	<link rel="manifest" href="/manifest.json">
	<script type="application/ld+json">
		{
			"@context": "http://schema.org",
			"@type": "WebPage",
			"name": "${book.title}",
			"breadcrumb": "core text",
          	"url": "${book.rooturl}/${book.file}.html",
			"description": "${book.description}",
			"datePublished": "${datetime}",
          	"image": "/apple-touch-icon.png",
			"author": "${book.authorurl}",
			"license": "http://creativecommons.org/licenses/by-nc-sa/3.0/us/deed.en_US"
		}
	</script>

	<!-- Global site tag (gtag.js) - Google Analytics -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-0989MECNZV"></script>
	<script>
	  window.dataLayer = window.dataLayer || [];
	  function gtag(){dataLayer.push(arguments);}
	  gtag('js', new Date());
	  gtag('config', 'G-0989MECNZV');
	</script>
	<link rel="stylesheet" media="screen" href="css/bookweb.css"/>
	<link rel="stylesheet" media="print" href="css/print.css"/>
	<style>
	:root {
		--margin:${margin};
		--margingutter:${margingutter};
		--width:${width};
		--height:${height};
		--innerwidth: ${innerwidth};
		--innerheight: ${innerheight};
	}
	@page {
		--margin:${margin};
		--width:${width};
		--height:${height};
		--innerwidth: ${innerwidth};
		--innerheight: ${innerheight};
		margin: var(--margin);
		size: var(--width) var(--height);
		}
	</style>
	<script src=""></script>
</head>
`;

let html = `<html>${head}
<body class="film notext">
<main id="top">`;
html = html + `
<header>
	<h1>${book.title}</h1>
	<h2>${book.subtitle}</h2>
	<h3 id="author">${book.author}</h3>
	<h4 id="publisher">${book.publisher}</h4>
</header>`
html = html + book.sections.reduce( (sectionstr,section,s) => {
	//console.log(`section = ${JSON.stringify(section)}`);
//<div class="blank"></div>
	let cssstr = section.cssclasses ? section.cssclasses.join(" ") : "";
	sectionstr = sectionstr + `
<section class="interior num${s+1} ${cssstr}" id="${section.id}">`;
if(section.poems) {
sectionstr = sectionstr + section.poems.reduce( (poemstr,poemid,p) => {
	//console.log(`poemid=${poemid}`);
	let poem = poems.filter(poem=>poem.id===poemid)[0];
	let cssstr = poem.cssclasses ? poem.cssclasses.join(" ") : "";
	poemstr = poemstr + `
<article id="${poem.id}" class="${cssstr}">`;
	poemstr = poemstr + `
	<header>
		<h1>${poem.title}</h1>
	</header>`;
	poemstr = poemstr + `
	<div class="flex">
	<div class="content">`;
	poemstr = poemstr + `
		<div class="banner">${poem.text}</div>`;
	poemstr = poemstr + `
	</div></div>`;
	//console.log(poem.figure.picture);
	if(poem.figure.picture) {
		poemstr = poemstr + `
		<figure class="frame">
		${poem.figure.picture}
		</figure>`
	}
	poemstr = poemstr + `
</article>`;
	return poemstr;
}, "");
}
sectionstr = sectionstr+`
</section>`;
//<div class="blank"></div>

return sectionstr;
}, "");
html = html + `
</main>
</body>
</html>`;
let poemids = poems.map(poem => poem.id); 
let filename = `${path}/film.html`;
fs.writeFileSync(filename, html, (err) => {
  if (err)
    console.log(err);
  else {
    console.log(`${filename} written successfully\n`);
  }
});
//console.log(`prince ${filename} -o ${path}/print.pdf`);
//console.log(`open ${path}/print.pdf`);
