const fs = require("fs"); 
console.log(process.argv);
const dirTimestamp = 00000000;
let dt = new Date();
let timestamp = dt.getTime();
let datetime = dt.toDateString();
const inputfile = (args[2] || "./data/inputTemplate.js");
const input = require(inputfile);
const outputfile = `./data/mill${dirTimestamp}/B${timestamp}.js`;
const tools = require("./tools.js");
const nticks = input.nticks || 48;
const bookunits = input.units || bookunits;
const bookwidth = input.bookwidth || 8.5;
const bookheight = input.bookheight || 8.5;
const bookmargin = input.bookheight || 1;
const pixelsperunit = input.pixelsperunit || 300;
const captionheight = input.captionheight || 1;

let B = {nticks,bookunits,bookwidth,bookheight,bookmargin,pixelsperunit,captionheight};

let bookobj = {
	title: "field notes",
	subtitle: "blueatlas ::: fieldnotes",
	description: "the rider passenger repair(*)",
	rooturl: "https://bluerider.work",
	file: "indexbook",
	authorurl: "https://mctavish.work/index.html",
	author: "mctavish",
	copyright: "Copyright ©2021 mctavish<br/>",
	isbn: "ISBN: 00000<br/>",
	publisher: "mctavish",
	bookwidth: w, //inches
	bookheight: h, //inches
	bookmargin: m, //inches
	sections: [
		{ 
			id: "sectiontoc",
			title: "Table of Contents",
			cssclasses: ["pagenonumbers", "notoc"],
			generatorf: "generateTOC",
		},
		{ 
			id: "sectionfieldnotes",
			title: "the repair(*)",
			inscription: "it was like this every morning ...",
			cssclasses: ["pagestartnumbers"],
			poems: poems.map( (poem,j) => { return poem.id }), 
		},
	],
	poemids: poems.map( (poem,j) => { return poem.id }),
};

let drawf = (canvas,p,tag) => {
	let attmap = att => { console.log(att); return ["width","x","x1","x2","stroke-width","cx"].includes(att) ? canvas.w : canvas.h};
    let atts = Object.keys(p).reduce( (acc,key) => {
		if(isNaN(p[key]) && key!=="ischange") {
			acc.push([key,p[key]]);
		}
		else if(key!=="ischange") {
			acc.push([key,Math.round(p[key]*attmap(key))]);
		}
		return acc; 
	},[]);
	console.log("drawf = "+ tools.createElementTagStr({tag:tag,attributes:atts,isEmpty:true}));
	return tools.createElementTagStr({tag:tag,attributes:atts,isEmpty:true});
};
let Bobj = {
	nticks: nticks,
	elements: [
		{tag:"rect", drawf:drawf},
		{tag:"line", role:"vline", drawf:drawf},
		{tag:"line", role:"hline", drawf:drawf},
		{tag:"circle", drawf:drawf}, 
	],
};
Bobj.b = poems.map( (poem,j) => {
	let cx=j/nticks,cy=j/nticks;
	let bt = [];
	bt[0] = j===0 ? {ischange:true,x:0,y:0,width:1,height:1,"stroke-dasharray":tools.randominteger(5,40)/100,"stroke-width":tools.randominteger(10,48)/100,stroke:"#000000",fill:"#000000"} : {ischange:false,x:0,y:0,width:1,height:1,"stroke-dasharray":tools.randominteger(5,40)/100,"stroke-width":tools.randominteger(10,48)/100,stroke:"#000000",fill:"#000000"};
	bt[1] = j%3===0 ? {ischange:true,x1:cx,x2:cx,y1:0,y2:1,"stroke-dasharray":tools.randominteger(5,40)/100,"stroke-width":tools.randominteger(10,48)/100,stroke:"#ffcc00"} : {ischange:false,x1:cx,x2:cx,y1:0,y2:1,"stroke-dasharray":tools.randominteger(5,40)/100,"stroke-width":tools.randominteger(10,48)/100,stroke:"#ffcc00"};
	bt[2] = j%5===0 ? {ischange:true,x1:0,x2:1,y1:cy,y2:cy,"stroke-dasharray":tools.randominteger(5,40)/100,"stroke-width":tools.randominteger(10,48)/100,stroke:"#ffcc00"} : {ischange:false,x1:0,x2:1,y1:cy,y2:cy,"stroke-dasharray":tools.randominteger(5,40)/100,"stroke-width":tools.randominteger(10,48)/100,stroke:"#ffcc00"};
	bt[3] = j%2===0 ? {ischange:true,cx:cx,cy:cy,r:tools.randominteger(10,44)/100,"stroke-dasharray":tools.randominteger(5,40)/100,"stroke-width":tools.randominteger(10,48)/100,stroke:"#ffffff",fill:"#9a0000"} : {ischange:false,cx:cx,cy:cy,r:tools.randominteger(10,44)/100,"stroke-dasharray":tools.randominteger(5,40)/100,"stroke-width":tools.randominteger(10,48)/100,stroke:"#ffffff",fill:"#9a0000"};
	return bt;
});

let canvas = {w:svgwidth,h:svgheight};
let poemsobj = poems.map( (poem,t) => {
	let elementdraw = Bobj.elements.map( (el,j) => {
		console.log("Bobj.b[t][j] = "+JSON.stringify(Bobj.b[t][j]));
		console.log("drawf = "+el.drawf(canvas,Bobj.b[t][j],el.tag));
		return el.drawf(canvas,Bobj.b[t][j],el.tag);
	}).join(" ");
	poem.figure = {
	picture:`
	<svg viewBox="0 0 ${svgwidth} ${svgheight}">
		${elementdraw}
	</svg>
	`,
	caption:`caption ${t.toString().padStart(2, '0')}`};
	return poem;
});
let Bstr = `let B =
${JSON.stringify(Bobj, null, "\t")};
module.exports = B;`

let bookstr = `let book =
${JSON.stringify(bookobj, null, "\t")};
module.exports = book;`

let poemsstr = `let poems =
${JSON.stringify(poemsobj, null, "\t")};
module.exports = poems;`

fs.writeFileSync(Bfile, Bstr, (err) => {
  if (err)
    console.log(err);
  else {
    console.log(`${Bfile} written successfully\n`);
  }
});
fs.writeFileSync(bookfile, bookstr, (err) => {
  if (err)
    console.log(err);
  else {
    console.log(`${bookfile} written successfully\n`);
  }
});
fs.writeFileSync(poemsfile, poemsstr, (err) => {
  if (err)
    console.log(err);
  else {
    console.log(`${poemsfile} written successfully\n`);
  }
});
