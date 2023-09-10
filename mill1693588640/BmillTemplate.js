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
//const tools = require("./tools.js");
const nticks = input.nticks || 240;
/* 
 * think about gravitational locations / colors ...
 * */
let nx = 4, ny = 4, nz = 4; 
const colorsets = [
	["#fcfbe3", "#191918"], //"warmbw",
	["#9a0000", "#fcfbe3", "#191918"], //"warmbwred",
	["#fcfbe3", "#191918"], //"warmbw",
	["#ffcc00", "#fcfbe3", "#191918"], //"warmbwyellow",
	["#fcfbe3", "#191918"], //"warmbw",
	//["#006699", "#fcfbe3", "#191918"], //"warmbwblue",
];
const colors = [...new Array(nticks).keys()].map( j=> {
	let k = Math.floor(j/10);
	return colorsets[k%colorsets.length];
});
/*
 * for each tick
 * for each (x,y,z) a parameter obj (r,sw,sd,color)
 * */
let rmin = 1, rmax = 40;
let swmin = 1, swmax = 40;
let sdmin = 1, sdmax = 80;
const pgrid = [...new Array(nticks).keys()].map( j=> {
	let t = Math.round(100*j/nticks)/100;
	let cx = [0,0.5-t,0.5+t,1];
	let cy = [0,t,1-t,1];
	return [...new Array(nx).keys()].map( x => {
		return [...new Array(ny).keys()].map( y => {
			let rz = [...new Array(nz).keys()].map( z => {
				return tools.randominteger(rmin,rmax)/100;
			}).sort( (a,b) => b-a );
			let swz = [...new Array(nz).keys()].map( z => {
				return tools.randominteger(swmin,swmax)/100;
			}).sort( (a,b) => b-a );
			let sdz = [...new Array(nz).keys()].map( z => {
				return tools.randominteger(sdmin,sdmax)/100;
			}).sort( (a,b) => b-a );
			let so0 = tools.randominteger(0,1);
			return [...new Array(nz).keys()].map( z => {
				//strokeopacity
				let so = (so0+z)%2;
				//fillopacity
				let fo = (so+1)%2;
				return {cx:cx[x],cy:cy[y],r:rz[z],sw:swz[z],sd:sdz[z],so,fo};
			});
		});
	});
});
console.log(`pgrid=${JSON.stringify(pgrid)}`);
let drawp = {
	circle: p => { return {cx:p.cx,cy:p.cy,r:p.r,"stroke-width":p.sw,"stroke-dasharray":p.sd,"stroke-opacity":p.so,"fill-opacity":p.fo,stroke:p.color,fill:p.color } },
	rect: p => { return {x:p.cx,y:p.cy,width:p.w,height:p.h,"stroke-width":p.sw,"stroke-dasharray":p.sd,"stroke-opacity":p.so,"fill-opacity":p.fo,stroke:p.color,fill:p.color } },
	vline: p => { return {x1:p.cx,x2:p.cx,y1:0,y2:1,"stroke-width":p.sw,"stroke-dasharray":p.sd,"stroke-opacity":1,stroke:p.color } },
	hline: p => { return {x1:0,x2:1,y1:p.cy,y2:p.cy,"stroke-width":p.sw,"stroke-dasharray":p.sd,"stroke-opacity":1,stroke:p.color } },
}
let B = {nticks};

let elements = [...new Array(nz-2).keys()].reduce( (acc,z) => {
	console.log(`acc=${JSON.stringify(acc)}`);
	let zels = [];
	[...new Array(nx).keys()].forEach( x => {
		zels.push({tag:"line", b:[]});
	});
	[...new Array(ny).keys()].forEach( y => {
		zels.push({tag:"line", b:[]});
	});
	[...new Array(nx).keys()].forEach( x => {
		[...new Array(ny).keys()].forEach( y => {
			zels.push({tag:"circle", x,y,b:[]});
		});
	});
	acc.push(zels);
	return acc;
}, [[{tag:"rect", b:[]},{tag:"rect", b:[]}]]);

elements.push([{tag:"line", b:[]},{tag:"line", b:[]},{tag:"circle", b:[]},{tag:"circle", b:[]}]);
let Bobj = {
	nticks: nticks,
	elements: elements,
};
let changes = [[3,0],[2,1]].flatMap(wx=>{
	return [...new Array(wx[0]).keys()].map( w=>wx[1] );
});
console.log(`changes=${changes}`);
let ischange = [];
ischange[0] = [...new Array(nx).keys()].map( x => { 
	return [...new Array(ny).keys()].map( y => { 
		return [...new Array(nz).keys()].map( z => { 
			return 1;
		});
	});
});
[...new Array(nticks-1).keys()].map(j=>j+1).map(j => {
	ischange[j] = [...new Array(nx).keys()].map( x => { 
		return [...new Array(ny).keys()].map( y => { 
			return [...new Array(nz).keys()].map( z => { 
				return changes[tools.randominteger(0,changes.length)];
			});
		});
	});
});
/* layer 0
 * rectangle background
 * */
[...new Array(elements[0].length).keys()].forEach( n => { 
	elements[0][n].b = [...new Array(nticks).keys()].map( j => {
		let color = colors[j][n%colors[j].length]; 
		let cx = 0, cy = 0, w = 1, h = 1, sw = 0.01, sd = 1, so = 0, fo = 1;
		if(n===1) {
			if(j%10 !== 0) { color = colors[j-1][n%colors[j-1].length] }
			w = j%10 === 0 ? 0 : ( j%10 === 1 || j%10 === 9 ? 0.5 : 1 );
		} else if(n===0 && j%10 === 1) {
			color = colors[j][n%colors[j].length];
		}
		return drawp.rect({cx:cx,cy:cy,w:w,h:h,sw,sd,so,fo,color});
	});
});
/* layers 1 to z-1
 * */
[...new Array(nz-2).keys()].map( z => z+1).forEach( z => { 
	elements[z].filter(el=>el.tag==="line").forEach( (el,n) => { 
		el.b = [...new Array(nticks).keys()].map( j => {
			let bt = [];
			if(n%0===0) {
				bt = drawp.vline({cx:pgrid[j][n%nx][0][z].cx,cy:0,sw:pgrid[j][n%nx][n%ny][z].sw,sd:pgrid[j][n%nx][n%ny][z].sd,so:1,fo:0,color:colors[n%colors[j].length]});
			}
			else {
				bt = drawp.hline({cx:0,cy:pgrid[j][0][n%ny][z].cy,sw:pgrid[j][n%nx][n%ny][z].sw,sd:pgrid[j][n%nx][n%ny][z].sd,so:1,fo:0,color:colors[n%colors[j].length]});
			}
			return bt;
		});
	});
	elements[z].filter(el=>el.tag==="circle").forEach( (el,n) => { 
		let x = el.x, y = el.y;
		el.b = [...new Array(nticks).keys()].map( j => {
			let bt = [];
			if(ischange[x][y][z]===1) {
				bt = drawp.circle({cx:pgrid[j][x][y][z].cx,cy:pgrid[j][x][y][z].cy,r:[x][y][z],sw:pgrid[j][x][y][z].sw,sd:pgrid[j][x][y][z].sd,so:pgrid[j].so[x][y][z],fo:pgrid[j].fo[x][y][z],color:colors[j][(n+z)%colors[j].length]});
			}
			else { bt = el.b[j-1] }
			return bt;
		});
	});
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
