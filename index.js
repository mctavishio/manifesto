const fs = require("fs");
let args = process.argv;
console.log(process.argv);
let inputfile = (args[2] || "./webinfo.js");
let input = require(inputfile);
/*
 * form of input: canvas => return
 * {
 * title,subtitle,abstract,text:[],
 * root,indexurl,pictureurl,inputurl,
 * codeurl,cssurl,
 * elements:[groups][elements]
 * elements[groupj][elementn] = {
 * 	id,
 * 	drawf:(canvas,p)=>f,
 * 	tag:"circ",cssclasses:[],
 * 	tweenf:(p1,p2)=>f
 * },
 * createB: (canvas,t) => {
 * return B:[nticks][fps][groups][els]
 * B:[t][frame][group][el]=p object
 *
 * }
 */

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
          	"url": "${input.indexurl}",
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
	<script src="${input.inputurl}"></script>
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
	<ul>
		<!-- <li><a href="#maincontent" id="skiptomaincontent">skip to main content</a></li> -->
		<li><a href="https://mctavish.io/index.html" id="homelink">go to mctavish portfolio</a></li>
		<li><a href="#dashboard" id="gotodashboard">access dashboard</a></li>
	</ul>
</nav>

<div class="screenreader-text">
	<p>Your feedback is always welcome.</p>
</div>`;
body = body + input.posts.reduce( (postsstr,post) => {
	return poststr += `
	<article>
		<header>
			<h1>${post.title}</h1>
			<h2>${post.subtitle}</h2>
			<p>${post.abstract}</p>
		</header>
		<div class="textContent">
			${post.text}
		</div>
	</article>`
},"");
body +=`
<fieldset id="dashboard">
<legend>access dashboard</legend>
<!-- <label for="sound"><input id="sound" type="checkbox"> play sound</label> -->
<label for="highcontrast"><input id="highcontrast" type="checkbox"> high contrast</label>
<label for="largetext"><input id="largetext" type="checkbox"> large text</label>
<label for="darklight"><input id="darklight" type="checkbox"> dark / light</label>
</fieldset>

</main>
<footer>
<p id="animationcontrols" style="min-width:100%">
<label for="animationonly"><input id="animationonly" type="checkbox"> animation only (hide text)</label>
</p>
<p><a href="#top" class="corelink">^ back to top</a></p>
</footer>

</div> <!-- end contentframe -->

</body>
<script>

window.addEventListener('load', e => {
  z.draw(${JSON.stringify(input.elements)},${JSON.stringify(input.B)});
  window.scroll(0,0);
});
</script>
</html>`;
fs.writeFileSync(indexname, head+body, (err) => {
  if (err)
    console.log(err);
  else {
    console.log("File written successfully\n");
  }
});
