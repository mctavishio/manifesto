const fs = require("fs");
const tools = require("./tools");
let args = process.argv;
console.log(process.argv);
let inputfile = (args[2] || "./data/B0.js");
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
			"author": "https://mctavish.studio/bio.html",
			"license": "http://creativecommons.org/licenses/by-nc-sa/3.0/us/deed.en.US"
		}
	</script>
	
	<!-- Google Analytics -->
	<link rel="stylesheet" href="${input.cssurl}"/>
	<style>
  		body {
			background: var(--${input.bodybg[tools.randominteger(0,input.bodybg.length)]});
		}
  		main {
			background: var(--${input.mainbg[tools.randominteger(0,input.mainbg.length)]});
		}
	</style>
</head>`;
let body = `<body id="top">
<div id="subtextframe" class="frame zlowest"></div>
<div id="svgframe" class="frame zlow">
<svg xmlns="http://www.w3.org/2000/svg" id="svg" 
class="frame">
</svg></div>
<!--<div id="wordframe" class="frame z0"></div>-->
<div id="contentframe" class="absolute zhighest">

<div id="mainflex">
<main id="main" style="opacity:0.6">
<header>
	<h1>${input.title}</h1>
	<h2>${input.subtitle}</h2>
</header>`;
if(input.hasDashboard) {
	body=body+`
<nav>
	<ul>
		<!-- <li><a href="#maincontent" id="skiptomaincontent">skip to main content</a></li> -->
		<li><a href="https://mctavish.io/index.html" id="homelink">go to mctavish portfolio</a></li>
		<li><a href="#dashboard" id="gotodashboard">access dashboard</a></li>
	</ul>
</nav>`;
}
else {
	body=body+`
<nav>
	<ul>
		<!-- <li><a href="#maincontent" id="skiptomaincontent">skip to main content</a></li> -->
		<li><a href="https://mctavish.work/index.html" id="homelink">go to mctavish portfolio</a></li>
	</ul>
</nav>`;
}
body = body + `
<div class="screenreader-text">
	<p>Your feedback is always welcome.</p>
</div>
${input.text}`;

if(input.hasDashboard) {
	body=body+`
<fieldset id="dashboard">
<legend>access dashboard</legend>
<!-- <label for="sound"><input id="sound" type="checkbox"> play sound</label> -->
<label for="highcontrast"><input id="highcontrast" type="checkbox"> high contrast</label>
<label for="largetext"><input id="largetext" type="checkbox"> large text</label>
<label for="darklight"><input id="darklight" type="checkbox"> dark / light</label>
</fieldset>`
}
body = body + `
</main>
</div>
<footer>`
if(input.hasDashboard) {
	body = body + `
<p id="animationcontrols" style="min-width:100%">
<label for="animationonly"><input id="animationonly" type="checkbox"> animation only (hide text)</label>
</p>`;
}
	body = body + `
<p><a href="#top" class="corelink">^ back to top</a></p>
</footer>
</div> <!-- end contentframe -->
</body>
	<script src="${input.codeurl}"></script>
	<script>let B = ${input.B}</script>
<script>
let drawf = (el,p,dimensions) => {
	console.log("p="+JSON.stringify(p));
	Object.keys(p).forEach(k=> {
	/*
		if(k==="r") { el.setAttribute(k,p[k]*dimensions["max"]/100); console.log(k+p[k]) }
		else if(k==="cx") { el.setAttribute(k,p[k]*dimensions["width"]/100); console.log(k+p[k])  }
		else if(k==="cy") { el.setAttribute(k,p[k]*dimensions["height"]/100); console.log(k+p[k]) }
		*/
		el.setAttribute(k,p[k]);
	})
}
window.addEventListener('load', e => {
	const B = {
		nticks:2,
		elements: [{drawf:drawf, tag:"circle", attributes:[["r","0"],["cx","0"],["cy","0"]], cssstyles:[["fill","var(--warmwhite)"],["stroke-opacity","1"], ["stroke-dasharray","1 2 5"]]}, {drawf:drawf, tag:"circle", attributes:[["r","0"],["cx","0"],["cy","0"]], cssstyles:[["fill","var(--red)"],["stroke-opacity","1"], ["stroke","var(--warmblack)"], ["stroke-width","10"], ["stroke-dasharray","1 2 5"]]}],
		b:[
			[{r:"10",cx:"10",cy:"10"},{r:"12",cx:"80",cy:"80","stroke-width":"2"}],
			[{r:"25",cx:"50",cy:"50"},{r:"12",cx:"50",cy:"50","stroke-width":"9"}],
			[{r:"12",cx:"15",cy:"10"},{r:"12",cx:"80",cy:"80","stroke-width":"4"}],
			[{r:10,cx:0,cy:0},{r:12,cx:90,cy:90}],
			[{r:5,cx:20,cy:10},{r:10,cx:60,cy:80}],
		],
	};
	let z = getz(B);
	z.draw(B,0,z.dimensions);
 });
 /*
	z.draw = (B,t,dimensions) => {
		let nticks = B.nticks;
		let tn = t%nticks;
		B.elements.forEach( (element,j) => {
			if(b[tn][j].ischanged!==0) {
				let p = b[tn][j].p;
				element.drawf(element.el,dimensions,p);
			}
		});
		if(z.animate) {
			window.setTimeout(()=>{z.draw(B,tn+1,z.dimensions)},z.dt);
		}
	}
	*/
 </script>
</html>`;
fs.writeFileSync(indexname, head+body, (err) => {
  if (err)
    console.log(err);
  else {
    console.log("File written successfully\n");
  }
});
