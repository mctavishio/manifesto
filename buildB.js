const fs = require("fs");
const tools = require("./tools");
//find . -name "outsoundfiles.js" -print
let args = process.argv;
console.log(process.argv);
let outsoundfile = args[2];
let soundfiles = require(outsoundfile).sort();
let parts = outsoundfile.split('/');
console.log("***---"+soundfiles[0]);
console.log("###---"+parts[3].slice(-13));
console.log(parts);
let _timestamp = parts[3].slice(-13);
console.log(`timestamp=${_timestamp}, date=${new Date(parseInt(_timestamp)).toString()}`);
let _date = new Date(parseInt(_timestamp)).toString();
let _title = parts[3]; 
let _root = `https://soundfactory.work/`; 
let indexname = `index_${parts[3]}.html`;
let _url = `${_root}${indexname}`;
let _abstract = `sound file index: generative output from ${_title}`;
let _pictureurl = "/apple-touch-icon.png";
let _cssurl = "/css/soundfactory.css";
let _codeurl = "";
let colors = ["warmlightgray"];
let head = `<!DOCTYPE html>
<html lang="en">
<head>
	<title>${_title}</title>
	<meta charset="utf-8"/>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0"/>
	<meta name="description" content=${_abstract}/>
	<meta name="author" content="kathy mctavish">
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
	<link rel="manifest" href="/manifest.json">
	<script type="application/ld+json">
		{
			"@context": "http://schema.org",
			"@type": "WebPage",
			"name": "${_title}",
			"breadcrumb": "${_root} > ${_title}",
          	"url": "${_url}",
			"description": "${_abstract}",
			"datePublished": "${_date}",
          	"image": "${_pictureurl}",
			"author": "https://mctavish.io/bio.html",
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
	<link rel="stylesheet" href="${_cssurl}"/>
	<script src="${_codeurl}"></script>
	<style>
  		body {
			background: var(--${colors[tools.randominteger(0,colors.length)]});
		}
	</style>
</head>`;
soundfiles.forEach( file => {
	console.log(`file=${file.id} ${file.url}`);
});
let body = `<body id="top">
<div id="subtextframe" class="frame zlowest"></div>
<div id="svgframe" class="frame zlow"><svg xmlns="http://www.w3.org/2000/svg" id="svg" class="frame"></svg></div>
<div id="wordframe" class="frame z0"></div>
<div id="contentframe" class="absolute zhighest">
<div id="mainflex">
<main id="main" class="expand" data-state="expanded">
<header>
	<h1>${_title.replaceAll("_", " |  ")}</h1>
</header>
<nav>
<ul class="expand" >
	<li><a href="index.html" id="homelink" class="corelink">core index</a></li>
	<!-- <li><a href="https://www.mctavish.io/index.html" id="homelink" class="corelink">mctavish portfolio</a></li> -->
</ul>
</nav>
<p>${_abstract}</p>`;
const sfiles = soundfiles.map(file=>file.id).sort().map(id=> {
	return soundfiles.filter(sf=>sf.id===id)[0];
});
body += "<p><ul>"+sfiles.reduce( (acc,sfile)=> {
	return acc + `<li><a href="${sfile.url}">${sfile.id}</a></li>`;
}, "");
body +=`</ul></p>
</body>
</html>`;
fs.writeFileSync(indexname, head+body, (err) => {
  if (err)
    console.log(err);
  else {
    console.log("File written successfully\n");
  }
});
