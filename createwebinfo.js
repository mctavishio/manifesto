const fs = require("fs");
const tools = require("./tools");
const template = require("./webinfo.js");
const domains = require("./data/domains.js");
const phrases_vowels = require("./data/text/texts_vowels_all.js");
const phrases_justify = require("./data/text/texts_justify_all.js");
const phrases = [...phrases_vowels, ...phrases_justify];
console.log(domains);
let args = process.argv;
console.log(process.argv);
domains.forEach(domain => {
	let url = domain.url;
	template.url = url;
	template.root = url.replace(/\.[^/.]+$/, "");
	template.indexname = "index_"+template.root+"_temp.html";
	template.title = template.root;
	template.subtitle = "...coming soon";
	template.text = [...Array(10).keys()].reduce( (acc,item,j)=>{
		let phrase = phrases[tools.randominteger(0,phrases.length)];
		return acc + `
		<article>
		<header>
		<h1>${phrase.split(" ")[0]}</h1>
		</header>
		<p>
		${phrase}
		</p><hr/>
		</article>`
	}, "");
	let filename = "webinfo_"+template.root+".js"
	let now = new Date();
	let module = `let input = ${JSON.stringify(template,null,2)};
	module.exports = input;`;
	fs.writeFileSync(filename, module, (err) => {
	  if (err)
		console.log(err);
	  else {
		console.log(filename+" written successfully\n");
	  }
	});
});
