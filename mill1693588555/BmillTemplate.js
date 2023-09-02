const fs = require("fs"); 
console.log(process.argv);
let args = process.argv;
const dirTimestamp = 00000000;
let dt = new Date();
let timestamp = dt.getTime();
let datetime = dt.toDateString();
const inputfile = (args[2] || `./input.js`);
const input = require(inputfile);
const outputFile = `./data/mill${dirTimestamp}/B.js`;
const recipeFile = `./data/mill${dirTimestamp}/recipe.sh`;
const tools = require("../../tools.js");
const nticks = input.nticks || 48;
/* 
 * think about gravitational locations / colors ...
 * */
let n = 4; //nlayers,nxgridpts ...
const gridx = [...new Array(nticks).keys()].map( j=> {
	let t = Math.round(100*j/nticks)/100;
	return [0,0.5-t,0.5+t,1];
};
const gridy = [...new Array(nticks).keys()].map( j=> {
	let t = Math.round(100*j/nticks)/100;
	return [0,t,1-t,1];
}
const colorsets = [
	["#fcfbe3", "#191918"], //"warmbw",
	["#9a0000", "#fcfbe3", "#191918"], //"warmbwred",
	["#fcfbe3", "#191918"], //"warmbw",
	["#ffcc00", "#fcfbe3", "#191918"], //"warmbwyellow",
	["#fcfbe3", "#191918"], //"warmbw",
	["#006699", "#fcfbe3", "#191918"], //"warmbwblue",
];
const colors = [...new Array(nticks).keys()].map( j=> {
	return colorsets[j%colorsets.length];
};
let B = {nticks};
/*
let drawf = (canvas,p,tag) => {
	let attmap = att => { return ["width","x","x1","x2","cx"].includes(att) ? canvas.w : canvas.h};
    let atts = Object.keys(p).reduce( (acc,key) => {
		if(isNaN(p[key]) && key!=="ischange") {
			acc.push([key,p[key]]);
		}
		else if(key!=="ischange") {
			acc.push([key,Math.round(p[key]*attmap(key))]);
		}
		return acc; 
	},[]);
	//console.log("drawf = "+ tools.createElementTagStr({tag:tag,attributes:atts,isEmpty:true}));
	return tools.createElementTagStr({tag:tag,attributes:atts,isEmpty:true});
};
*/
let grid = [...new Array(nticks).keys()].map( tick => {
	return [...new Array(n).keys()].map( p => {
		return [ gridx[tick][p], gridy[tick][tools.randominteger(0,n)] ];
	});
});
let elements = [...new Array(n).keys()].reduce( (acc,layer) => {
	[...new Array(n).keys()].forEach( g => {
		acc.push([
		{tag:"line", role:"hline", b:[]},
		{tag:"line", role:"vline", b:[]},
		{tag:"circle", b:[]}]);
	});
}, [[{tag:"rect", b:[]},{tag:"rect", b:[]}]]);
let Bobj = {
	nticks: nticks,
	elements: elements,
};

let dash = (t,layer) => {
	let n1 = Math.min(4,t*10);
	let n2 = Math.min(40,layer*10+20);
	n1 = (n*2 - layer*2) + Math.sin(t*Math.PI);
	n2 = (n*2 - layer*2) + 2*Math.sin(t*Math.PI);
	return tools.randominteger(n1,n2)/400; 
}

let sw = (t,layer) => {
	let n1 = Math.min(4,t*10);
	let n2 = Math.min(40,layer*10+20);
	n1 = (n*2 - layer*2) + Math.sin(t*Math.PI);
	n2 = (n*2 - layer*2) + 2*Math.sin(t*Math.PI);
	return tools.randominteger(n1,n2)/100; 
}
let r = (t,layer) => {
	n1 = (n*2 - layer*2) + Math.sin(t*Math.PI);
	n2 = (n*2 - layer*2) + 2*Math.sin(t*Math.PI);
	return tools.randominteger(n1,n2)/100; 
}

Bobj.b = [...new Array(nticks).keys()].map( tick => {
	let bt = [];
	let t = Math.round(100*tick/nticks)/100;
	[...new Array(n).keys()].forEach( layer => {
		elements.filter( el => el.role==="hline" ).forEach( (el,j) => {
			let cx = grid[tick][j%n][0]; 
			let cy = grid[tick][j%n][1]; 
			let color = colors[tick][(j+layer)%colors[tick].length]; 
			let attributes = {x1:0,x2:1,y1:cy,y2:cy,"stroke-dasharray": dash(t,layer),"stroke-width": sw(t,layer), stroke: color};
			el.b.push({ischange:true, attributes});
		});
		elements.filter( el => el.role==="vline" ).forEach( (el,j) => {
			let cx = grid[tick][j%n][0]; 
			let cy = grid[tick][j%n][1]; 
			let color = colors[tick][(j+layer)%colors[tick].length]; 
			let attributes = {x1:cx,x2:cx,y1:0,y2:1,"stroke-dasharray": dash(t,layer),"stroke-width": sw(t,layer), stroke: color};
			el.b.push({ischange:true, attributes});
		});
		elements.filter( el => el.tag==="circle" ).forEach( (el,j) => {
			let cx = grid[tick][j%n][0]; 
			let cy = grid[tick][j%n][1]; 
			let color = colors[tick][(j+layer)%colors[tick].length]; 
			let attributes = {cx:cx,cy:cy,r:r(t,layer),"stroke-dasharray": dash(t,layer),"stroke-width": sw(t,layer), stroke: color, fill: color};
			el.b.push({ischange:true, attributes});
		});
	});
});
Bobj.b = [...new Array(nticks).keys()].map( j => {
	let cx=Math.round((j*100)/nticks)/100,cy=Math.round((j*100)/nticks)/100;
	console.log(`j=${j},cx=${cx},cy=${cy}`)
	let bt = [];
	let attributes = {x:0,y:0,width:1,height:1,"stroke-dasharray":tools.randominteger(5,40)/400,"stroke-width":tools.randominteger(10,48)/100,stroke:"#000000",fill:"#000000"}; 
	bt[0] = {ischange:true, attributes};
	attributes = {x1:cx,x2:cx,y1:0,y2:1,"stroke-dasharray":tools.randominteger(5,40)/400,"stroke-width":tools.randominteger(10,48)/100,stroke:"#ffcc00"};
	bt[1] = {ischange:true, attributes};
	attributes = {x1:0,x2:1,y1:cy,y2:cy,"stroke-dasharray":tools.randominteger(5,40)/400,"stroke-width":tools.randominteger(10,48)/100,stroke:"#ffcc00"};
	bt[2] = {ischange:true, attributes};
	attributes = {x1:cx,x2:cx,y1:0,y2:1,"stroke-dasharray":tools.randominteger(5,40)/800,"stroke-width":tools.randominteger(10,48)/100,stroke:"#9a0000"};
	bt[3] = {ischange:true, attributes};
	attributes = {x1:0,x2:1,y1:cy,y2:cy,"stroke-dasharray":tools.randominteger(5,40)/800,"stroke-width":tools.randominteger(10,48)/100,stroke:"#9a0000"};
	bt[4] = {ischange:true, attributes};
	attributes = {x1:cx,x2:cx,y1:0,y2:1,"stroke-dasharray":tools.randominteger(5,40)/800,"stroke-width":tools.randominteger(10,48)/100,stroke:"#000000"};
	bt[5] = {ischange:true, attributes};
	attributes = {x1:0,x2:1,y1:cy,y2:cy,"stroke-dasharray":tools.randominteger(5,40)/800,"stroke-width":tools.randominteger(10,48)/100,stroke:"#000000"};
	bt[6] = {ischange:true, attributes};
	return bt;
});
let Bstr = `let B =
${JSON.stringify(Bobj, null, "\t")};
module.exports = B;`

fs.writeFileSync(outputFile, Bstr, (err) => {
  if (err)
    console.log(err);
  else {
    console.log(`${outputFile} written successfully\n`);
  }
});
let recipe = `
#!/bin/bash
cd ../..
ts=${dirTimestamp}
echo "ts=${dirTimestamp}"
mkdir data/mill${dirTimestamp}
cp BmillTemplate.js data/mill${dirTimestamp}/Bmill_temp.js
cp inputTemplate.js data/mill${dirTimestamp}/input.js
sed "s/00000000/\"${dirTimestamp}\"/" data/mill${dirTimestamp}/Bmill_temp.js > data/mill${dirTimestamp}/Bmill.js
rm data/mill${dirTimestamp}/Bmill_temp.js
node data/mill${dirTimestamp}/Bmill.js
node poemMill ./data/mill${dirTimestamp}
node bookMill ./data/mill${dirTimestamp} 
prince -s css/bookprint.css data/mill${dirTimestamp}/print.html -o data/mill${dirTimestamp}/print.pdf
echo "cd data/mill${dirTimestamp}"
echo "$(date)" > data/mill${dirTimestamp}/readMe.txt
echo "done"
`;
fs.writeFileSync(recipeFile, recipe, (err) => {
  if (err)
    console.log(err);
  else {
    console.log(`${recipeFile} written successfully\n`);
  }
});
console.log(`bash ${recipeFile}\n`);
