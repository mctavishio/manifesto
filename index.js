const fs = require("fs");
let args = process.argv;
console.log(process.argv);
let inputfile = (args[2] || "./webinfo.js");
let input = require(inputfile);
let indexname = input.indexname;
let now = new Date();
let head = `<!DOCTYPE html>
<html lang="en">
<head>
	<title>${input.title}</title>
	<meta charset="utf-8"/>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0"/>
	<meta name="description" content="${input.abstract}"/>
	<meta name="author" content="kathy mctavish">
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
	<link rel="manifest" href="/manifest.json">
	<script type="application/ld+json">
		{
			"@context": "http://schema.org",
			"@type": "WebPage",
			"name": "${input.title}",
			"breadcrumb": "${input.root} > ${input.title}",
          	"url": "${input.url}",
			"description": "${input.abstract}",
			"datePublished": "${now.toString()}",
          	"image": "${input.pictureurl}",
			"author": "https://mctavish.io/bio.html",
			"license": "http://creativecommons.org/licenses/by-nc-sa/3.0/us/deed.en.US"
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
	<link rel="stylesheet" href="${input.cssurl}"/>
	<script src="${input.codeurl}"></script>
	<style>
  		body {
			background: var(--warmgray});
		}
	</style>
</head>`;
let body = `<body id="top">
<div id="subtextframe" class="frame zlowest"></div>
<div id="svgframe" class="frame zlow"><svg xmlns="http://www.w3.org/2000/svg" id="svg" class="frame"></svg></div>
<div id="wordframe" class="frame z0"></div>
<div id="contentframe" class="absolute zhighest">
<div id="mainflex">
<main id="main">
<header>
	<h1>${input.title}</h1>
	<h2>${input.subtitle}</h2>
</header>
<nav>
<ul class="expand" >
	<li><a href="https://www.mctavish.io/index.html" id="homelink" class="corelink">mctavish portfolio</a></li>
</ul>
</nav>
${input.text}
</body>
</html>`;
fs.writeFileSync(indexname, head+body, (err) => {
  if (err)
    console.log(err);
  else {
    console.log("File written successfully\n");
  }
});
