const fs = require("fs"); 
console.log(process.argv);
let args = process.argv;
const path = (args[2] || "./data/mill00000000/");
const inputfile = `${path}/input.js`;
const input = require(inputfile);
const Bfile = `${path}/B.js`;
const B = require(Bfile);
const tools = require("./tools.js");
const nticks = input.nticks || 48;
const bookunits = input.bookunits || "in";
const bookwidth = input.bookwidth || 8.5;
const bookheight = input.bookheight || 8.5;
const bookmargin = input.bookmargin || 1;
const pixelsperunit = input.pixelsperunit || 300;
const captionheight = input.captionheight || 1;
const width = bookwidth+bookunits;
const height = bookheight+bookunits;
const w = Number(bookwidth), h = Number(bookheight);
const m = Number(bookmargin);
const iw = (w-2.0*m);
const ih = (h-2.0*m);
const innerwidth = iw+bookunits;
const innerheight = ih+bookunits;
const margin = bookmargin+bookunits;
const margingutter = (m+0.2)+bookunits;
const svgwidth = Math.floor((iw-(m+0.2))*pixelsperunit);
const svgheight = Math.floor(.9*(ih-(m+0.2))*pixelsperunit);

const bookid = process.argv[4] ? process.argv[4] : "testmill";
const poemsfile = `${path}/poems.js`;
const bookfile = `${path}/book.js`;

const poems = require("./fieldnotespoems.js");
const npoems = poems.length;

let dt = new Date();
let timestamp = dt.getTime();
let datetime = dt.toDateString();
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
			//poems: poems.map( (poem,j) => { return poem.id }), 
			poems: [...new Array(nticks).keys()].map( j => { return poems[j%poems.length].id }), 
		},
	],
	/*poemids: poems.map( (poem,j) => { return poem.id }),*/
	poemids: [...new Array(nticks).keys()].map( j => { return poems[j%poems.length].id }), 
};


let canvas = {width:svgwidth,height:svgheight,min:Math.min(svgwidth,svgheight),max:Math.max(svgwidth,svgheight)};
//let blength = B.elements[0][0].b.length;
let blength = nticks;

let poemsobj = [...new Array(nticks).keys()].map( j => {
	let poem = poems[j%poems.length];
	let elementdraw = B.elements.map( layer => {
	 return layer.map( el => {
		return tools.drawf(canvas,el.b[j%blength],el.tag);
		}).join(" ");
	}).join(" ");
	let textarray = "left throng city depot arrived alone worn suitcase sandwich lukewarm coffee thermosi tepid brown liquid greasy paper rusted texaco station folded map urgent mission fix the system repair reclaim rebuild reweave restore prairie meadow sequestration".split(" ");
	let captiontext = [0,1,2].map(j=>textarray[tools.randominteger(2,textarray.length)]).join(" :|: ");
	poem.figure = {
	picture:`
	<svg viewBox="0 0 ${svgwidth} ${svgheight}">
		${elementdraw}
	</svg>
	`,
	caption:`${captiontext} ::: ${(j+1).toString().padStart(2, '0')}`};
	return poem;
});

/*
let poemsobj = poems.map( (poem,t) => {
	let elementdraw = B.elements.map( layer => {
	 return layer.map( (el,j) => {
		//console.log("B.b[t%blength][j] = "+JSON.stringify(B.b[t%blength][j]));
		//console.log("drawf = "+tools.drawf(canvas,B.b[t%blength][j],el.tag));
		return tools.drawf(canvas,el.b[t%blength],el.tag);
		}).join(" ");
	}).join(" ");
	let textarray = "left throng city depot arrived alone worn suitcase sandwich lukewarm coffee thermosi tepid brown liquid greasy paper rusted texaco station folded map urgent mission fix the system repair reclaim rebuild reweave restore prairie meadow sequestration".split(" ");
	let captiontext = [0,1,2].map(j=>textarray[tools.randominteger(2,textarray.length)]).join(" :|: ");
	poem.figure = {
	picture:`
	<svg viewBox="0 0 ${svgwidth} ${svgheight}">
		${elementdraw}
	</svg>
	`,
	caption:`${captiontext} ::: ${(t+1).toString().padStart(2, '0')}`};
	return poem;
});
*/
let bookstr = `let book =
${JSON.stringify(bookobj, null, "\t")};
module.exports = book;`

let poemsstr = `let poems =
${JSON.stringify(poemsobj, null, "\t")};
module.exports = poems;`

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
