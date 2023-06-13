const fs = require("fs");
const tools = require("./tools");
const template = require("./webinfo.js");
const domains = require("./data/domains.js");
console.log(domains);
let args = process.argv;
console.log(process.argv);
domains.forEach(domain => {
	let url = domain.url;
	template.url = url;
	template.indexname = "index_"+url;
	template.root = url.replace(/\.[^/.]+$/, "");
	template.title = template.root;
	template.subtitle = "coming soon";
	template.text = "";
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
