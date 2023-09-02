const fs = require("fs"); 
console.log(process.argv);
const path = process.argv[2] ? process.argv[2] : "./data/mill00000000";
const poemfile = `${path}/poems.js`;
const bookfile = `${path}/book.js`;
const tools = require("./tools.js");
const poems = require(poemfile);
const book = require(bookfile);
const w = Number(book.bookwidth), h = Number(book.bookheight);
const m = Number(book.bookmargin);
const width = book.bookwidth+"in";
const height = book.bookheight+"in";
const innerwidth = (w-2.0*m)+"in";
const innerheight = (h-2.0*m)+"in";
const margin = book.bookmargin+"in";
const margingutter = (book.bookmargin*1+0.2)+"in";
const svgwidth = book.bookwidth*300;
const svgheight = book.bookheight*300;
let dt = new Date();
let timestamp = dt.getTime();
let datetime = dt.toDateString();
const generatefunctions = {
	generateTOC: () => {
	let divstr = `
	<div id="toc"><nav>`;
	divstr = divstr + book.sections.filter(section=>{
		let b=true;
		if(section.cssclasses) {
			if(section.cssclasses.includes("notoc")) b=false;
		}
		return b
	}).reduce( (sectionstr,section,s) => {
	if(section.title) {
		sectionstr = sectionstr + `
		<div class="sectionlink"><a id="link_${section.id}" href="#${section.id}">${section.title}</a></div>`;
	}
	if(section.poems) {
		sectionstr = sectionstr + `
		<ul id="list_${section.id}">`
		sectionstr = sectionstr + section.poems.reduce( (poemstr,poemid,p) => {
			console.log(`poemid=${poemid}`);
			let poem = poems.filter(poem=>poem.id===poemid)[0];
			poemstr = poemstr + `<li><a id="link_${poem.id}" href="#${poem.id}">${poem.title}</a></li>`;
			return poemstr;
		}, "");
		sectionstr = sectionstr + `
		</ul>`
	}
	return sectionstr;
}, "");

	divstr = divstr + `
	</nav></div>`;
	return divstr;
}
}
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
	<link rel="stylesheet" media="print" href="css/bookprint.css"/>
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

let html = `<html>${head}<body><main id="top">`;
if(book.otherbooks) {
html = html + ` 
<section class="prelude num0 pagenonumbers notoc noweb" id="prelude">
<header>
	<h1>${book.title}</h1>
</header>
<article id="preludeotherbooks" class="lowertopmargin">
<header>
	<h1>Other books by ${book.author}</h1>
</header>`;
let otherbookstr = book.otherbooks.filter( b => {
	console.log(`book ${b} =? title ${book.title}`);
	return b!==book.title; 
}).reduce( (str,book,j) => {
	return str + `<i>${book}</i><br/>`
},"");
html = html + `
<p>
${otherbookstr}
</p>
</article>
</section>
`;
}
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
	if(section.id!=="sectiontoc") {
	sectionstr = sectionstr + `
<section class="interior num${s+1} ${cssstr}" id="${section.id}">`;
	}
	else {
	sectionstr = sectionstr + `
<section class="interior num${s} ${cssstr}" id="${section.id}">`;
	}
if(section.title) {
sectionstr = sectionstr + `
<header>
	<h1>${section.title}</h1>
</header>`;
}
if(section.inscription) {
sectionstr = sectionstr + `
	<div class="inscription">
	${section.inscription}
	</div>`
}
if(section.generatorf) {
	sectionstr = sectionstr + generatefunctions[section.generatorf]();
}
else if(section.poems) {
sectionstr = sectionstr + section.poems.reduce( (poemstr,poemid,p) => {
	console.log(`poemid=${poemid}`);
	let poem = poems.filter(poem=>poem.id===poemid)[0];
	let cssstr = poem.cssclasses ? poem.cssclasses.join(" ") : "";
	poemstr = poemstr + `
<article id="${poem.id}" class="${cssstr}">`;
	if(poem.title) {
		poemstr = poemstr + `
<header>
	<h1>${poem.title} <span class="top"><a href="#sectiontoc" title="back to contents" alt="back to table of contents">&uarr;</a></span></h1>
</header>`;
	}
	if(poem.inscription) {
		poemstr = poemstr + `
		<div class="inscription">
		${poem.inscription}
		</div>`
	}
	if(poem.subtitle) {
		poemstr = poemstr + `
		<div class="inscription">
		${poem.subtitle}
		</div>`
	}
	poemstr = poemstr + `${poem.text}`;
	console.log(poem.figure.picture);
	if(poem.figure.picture) {
		poemstr = poemstr + `
		<figure class="frame">
		${poem.figure.picture}
		<figcaption>${poem.figure.caption}</figcaption>
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
let filename = `${path}/print.html`;
fs.writeFileSync(filename, html, (err) => {
  if (err)
    console.log(err);
  else {
    console.log(`${filename} written successfully\n`);
  }
});
console.log(`prince ${filename} -o ${path}/print.pdf`);
console.log(`open ${path}/print.pdf`);
