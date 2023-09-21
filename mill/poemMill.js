let input = {
	nticks: 60*4,
	bookunits: "in",
	bookwidth: 8.5,
	bookheight: 8.5,
	bookmargin: 1,
	bookguttermargin: 1.2,
	bleed: 0.125,
	pixelsperunit: 72,
	captionheight: 1,
	cssstyles: "", 
};

const fs = require("fs"); 
console.log(process.argv);
let args = process.argv;
const path = (args[2] || "./data/mill00000000/");
const Bfile = `${path}/B.js`;
const B = require(Bfile);
const tools = require("./tools.js");
const nticks = B.nticks;
const bookunits = input.bookunits || "in";
const bookwidth = input.bookwidth || 8.5;
const bookheight = input.bookheight || 8.5;
const bookmargin = input.bookmargin || 1;
const bleed = input.bleed || 0.125;
const pixelsperunit = input.pixelsperunit || 300;
const captionheight = input.captionheight || 1;
const width = bookwidth+bookunits;
const height = bookheight+bookunits;
const w = Number(bookwidth), h = Number(bookheight);
const m = Number(bookmargin);
const b = Number(bleed);
const iw = (w-2.0*m);
const ih = (h-2.0*m);
const innerwidth = iw+bookunits;
const innerheight = ih+bookunits;
const margin = bookmargin+bookunits;
const margingutter = (m+0.2)+bookunits;
const svgwidth = w*pixelsperunit;
const svgheight = h*pixelsperunit;

const bookid = process.argv[4] ? process.argv[4] : "testmill";
const poemsfile = `${path}/poems.js`;
const bookfile = `${path}/book.js`;
const texts = require("./poemTextLists.js");
console.log(`texts.length = ${texts.length}`);

let dt = new Date();
let timestamp = dt.getTime();
let datetime = dt.toDateString();

//B.elements[B.elements.length] = [{tag:"rect", role:"veil"}];
//this will be the veil ... used to cover for transitions
const canvas = {width:svgwidth,height:svgheight,min:Math.min(svgwidth,svgheight),max:Math.max(svgwidth,svgheight)};
const fps = 24;

let poemsobj = [...new Array(nticks).keys()].map( j => {
	let poem = {
		id: `${(j+1).toString().padStart(2, '0')}`,
		title: `${(j+1).toString().padStart(2, '0')}`,
		text: texts[j%texts.length].text,
	};
	
	let elementdraw = B.elements.map( layer => {
	 return layer.map( el => {
		return tools.drawf(canvas,el.b[j],el.tag);
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
	console.log(`poemtitle = ${poem.title}, j=${j}`);
	return poem;
});

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
			id: "title",
			title: "field notes",
			cssclasses: ["pagenonumbers", "notoc", "booktitle", "booksection"],
		},
		{ 
			id: "section1",
			title: "the repair(*)",
			inscription: "it was like this every morning ...",
			cssclasses: ["pagestartnumbers", "booksection"],
			poems: [...new Array(nticks).keys()].map( j => { return poemsobj[j].id }), 
		},
		/*
		{ 
			id: "section1",
			title: "the repair(*)",
			inscription: "it was like this every morning ...",
			cssclasses: ["pagestartnumbers", "booksection"],
			poems: [...new Array(nticks).keys()].filter( j => j < 61 ).map( j => { return poems[j%poems.length].id }), 
		},
		{ 
			id: "section2",
			title: "#=> 2 <=#",
			inscription: " &&& ",
			cssclasses: ["booksection"],
			poems: [...new Array(nticks).keys()].filter( j => j > 60 && j < 121 ).map( j => { return poems[j%poems.length].id }), 
		},
		{ 
			id: "section3",
			title: "#=> 3 <=#",
			cssclasses: ["booksection"],
			poems: [...new Array(nticks).keys()].filter( j => j > 120 && j < 181 ).map( j => { return poems[j%poems.length].id }), 
		},
		{ 
			id: "section4",
			title: "#=> 4 <=#",
			cssclasses: ["booksection"],
			poems: [...new Array(nticks).keys()].filter( j => j > 180 && j < 241 ).map( j => { return poems[j%poems.length].id }), 
		},
		*/
	],
	poemids: [...new Array(nticks).keys()].map( j => { return poemsobj[j].id }), 
};


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
