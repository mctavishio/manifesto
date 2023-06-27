const fs = require("fs");
const tools = require("./tools");
const domains = require("./data/domains.js");
console.log(domains);
let args = process.argv;
console.log(process.argv);
let now = new Date();
let nextsteps = "";
domains.forEach(domain => {
	//console.log(JSON.stringify(domain));
	let url = domain.url;
	let localdir = domain.localdir;
	console.log(localdir);
	let gitdir = domain.gitdir;
	root = url.replace(/\.[^/.]+$/, "");
	let inputfile = "./webinfo_"+root+".js";
	let input = require(inputfile);
	let indexname = input.indexname;
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
	<!--<script src="${input.scoreurl}"></script>-->
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
<rect x=0 y=0 width="80vw" height="80vh" fill="#000000" stroke-width="18" stroke="#ffffff" stroke-dasharray="8"/>
<rect x="10vw" y="0" width="80vw" height="80vh" fill="#000000" stroke-width="8" stroke="#ffcc00" stroke-dasharray="20"/>
<rect x="50vw" y="0" width="50vw" height="50vh" fill="#333333" stroke-width="2" stroke="#006668" stroke-dasharray="2"/>
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
<!--<p><a href="#top" class="corelink">^ back to top</a></p>-->
</footer>
</div> <!-- end contentframe -->
</body>
<script src="code/velocity_v2.min.js"></script>
<script src="${input.codeurl}"></script>
<script>
document.querySelectorAll("h1").velocity({
	properties: {"color": "red"},
	options: { duration: 500 }
});
document.querySelectorAll("rect").velocity({
	properties: {"fill": "#ffcc00", x:"50vw", y:"50vh", width:"20vmin", height: "10vmin", strokeDasharray:30},
	options: { duration: 2500 }
}).velocity({
	properties: {"fill": "#686868", x:"80vw", y:"80vh", width:"10vmin", height: "8vmin", strokeDasharray:10},
	options: { duration: 2500 }
});
</script>
</html>`;
nextsteps = nextsteps + `
mkdir -p ../${localdir}/code
mkdir -p ../${localdir}/css
cp ${indexname} ../${localdir}/index.html
cp code/core.js ../${localdir}/code/core.js
cp css/core.css ../${localdir}/css/core.css
cd ../${localdir}
git add --all
git commit -m "tweak to index"
git push
cd ../manifesto
`;
fs.writeFileSync(indexname, head+body, (err) => {
  if (err)
    console.log(err);
  else {
    console.log(inputfile + " written successfully\n");
  }
});
});
nextsteps = nextsteps + `
echo "done"
echo "rm index_*temp.html"
echo "rm webinfo_*.js"
`;
let nextstepsfile = `nextsteps${now.getTime()}.sh`;
fs.writeFileSync(nextstepsfile, nextsteps, (err) => {
  if (err)
    console.log(err);
  else {
    console.log(nextstepsfile + " written successfully\n");
    console.log("bash " + nextstepsfile);
  }
});
