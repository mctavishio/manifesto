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
let nx = 2, ny = 2, nz = 4; 
/*
const colorsets = [
	["#fdfdf3", "#191918"], //"warmbw",
	["#8F0000", "#fdfdf3", "#191918"], //"warmbwred",
	["#fdfdf3", "#191918"], //"warmbw",
	["#ffcc00", "#fdfdf3", "#191918"], //"warmbwyellow",
	["#fdfdf3", "#191918"], //"warmbw",
	//["#006699", "#fdfdf3", "#191918"], //"warmbwblue",
];
*/
const colorsets = [[[["#fdfdf3", "#191918"],3],[["#8F0000", "#fdfdf3", "#191918"],1],[["#fdfdf3", "#191918"],2],[["#8F0000", "#fdfdf3", "#191918"],1]].map(wx=>{
	return [...new Array(wx[1]).keys()].map( w=>wx[0] );
}).flat(2)];

const colors = [...new Array(nticks).keys()].map( j=> {
	let k = Math.floor(j/10);
	return colorsets[k%colorsets.length];
});
/*
 * for each tick
 * for each (x,y,z) a parameter obj (r,sw,sd,color)
 * */
let rmin = .5, rmax = 40;
let swmin = 1, swmax = 40;
let sdmin = .08, sdmax = 18;
let cxs = [...new Array(nx).keys()].map( x => {
	return Math.round(100*x/nx)/100;
}).push(1);
cxs=[0.5,0.5,0.5,0.5];
let cys = [...new Array(ny).keys()].map( y => {
	return Math.round(100*y/ny)/100;
}).push(1);
cys=[0,0.5,0.5,1.0];
console.log(cys);
const pgrid = [...new Array(nticks).keys()].map( j=> {
	let cx = [...new Array(nx).keys()].map( x => {
		return cxs[x%cxs.length];
	});
	let cy = [...new Array(ny).keys()].map( y => {
		return cys[y%cys.length];
	});
	cy = j%2===0 ? cx : cx.reverse();
	let sos = [[2,0],[5,1]].flatMap(wx=>{
		return [...new Array(wx[0]).keys()].map( w=>wx[1] );
	});
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
			return [...new Array(nz).keys()].map( z => {
				//strokeopacity
				let so = tools.randominteger(0,sos.length);
				if(z===2) {so=1}
				//fillopacity
				let fo = (so+1)%2;
				return {cx:cx[x],cy:cy[y],r:rz[z],sw:swz[z],sd:sdz[z],so,fo};
			});
		});
	});
});
let drawp = {
	circle: p => { return {cx:p.cx,cy:p.cy,r:p.r,"stroke-width":p.sw,"stroke-dasharray":p.sd,"stroke-opacity":p.so,"fill-opacity":p.fo,stroke:p.color,fill:p.color } },
	rect: p => { return {x:p.cx,y:p.cy,width:p.w,height:p.h,"stroke-width":p.sw,"stroke-dasharray":p.sd,"stroke-opacity":p.so,"fill-opacity":p.fo,stroke:p.color,fill:p.color } },
	vline: p => { return {x1:p.cx,x2:p.cx,y1:0,y2:1,"stroke-width":p.sw,"stroke-dasharray":p.sd,"stroke-opacity":1,stroke:p.color } },
	hline: p => { return {x1:0,x2:1,y1:p.cy,y2:p.cy,"stroke-width":p.sw,"stroke-dasharray":p.sd,"stroke-opacity":1,stroke:p.color } },
}
let B = {nticks};

let elements = [...new Array(nz-2).keys()].reduce( (acc,z) => {
	let zels = [];
	[...new Array(nx).keys()].forEach( x => {
		zels.push({tag:"line", b:[]});
		zels.push({tag:"line", b:[]});
	});
	[...new Array(ny).keys()].forEach( y => {
		zels.push({tag:"line", b:[]});
		zels.push({tag:"line", b:[]});
	});
	[...new Array(nx).keys()].forEach( x => {
		[...new Array(ny).keys()].forEach( y => {
			zels.push({tag:"circle", x,y,b:[]});
		});
	});
	acc.push(zels);
	return acc;
//}, [[{tag:"rect", b:[]},{tag:"rect", b:[]}]]);
}, []);

//elements.push([{tag:"line", b:[]},{tag:"line", b:[]},{tag:"circle", b:[]},{tag:"circle", b:[]}]);
let Bobj = {
	nticks: nticks,
	elements: elements,
};
let changes = [[3,0],[2,1]].flatMap(wx=>{
	return [...new Array(wx[0]).keys()].map( w=>wx[1] );
});
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
/*
[...new Array(elements[0].length).keys()].forEach( n => { 
	elements[0][n].b = [...new Array(nticks).keys()].map( j => {
		//let color = colors[j][n%colors[j].length]; 
		let cx = 0, cy = 0, w = 1, h = 1, sw = 0.01, sd = 1, so = 0, fo = 1;
		let color = "#fdfdf3";
		if(n===1) {
			//if(j%9 !== 0) { color = colors[j-1][n%colors[j-1].length] }
			w = j%9 === 0 ? 0 : ( j%9 === 1 || j%9 === 8 ? 0.5 : 1 );
		} else if(n===0 && j%10 === 1) {
			//color = colors[j][n%colors[j].length];
		}
		return drawp.rect({cx:cx,cy:cy,w:w,h:h,sw,sd,so,fo,color});
	});
});
*/
/* layers 1 to z-1
 layers 0 to z-1
 * */
[...new Array(nz-2).keys()].map( z => z+0).forEach( z => { 
	elements[z].filter(el=>el.tag==="line").forEach( (el,n) => { 
		el.b = [...new Array(nticks).keys()].map( j => {
			let bt = [];
			let sw = pgrid[j][n%nx][n%ny][z].sw*0.8; 
			if(n%2===0) {
				bt = drawp.vline({cx:pgrid[j][n%nx][0][z].cx,cy:0,sw:sw,sd:pgrid[j][n%nx][n%ny][z].sd,so:1,fo:0,color:colors[j][n%colors[j].length]});
			}
			else {
				bt = drawp.hline({cx:0,cy:pgrid[j][0][n%ny][z].cy,sw:sw*1.1,sd:pgrid[j][n%nx][n%ny][z].sd,so:1,fo:0,color:colors[j][n%colors[j].length]});
			}
			return bt;
		});
	});
	elements[z].filter(el=>el.tag==="circle").forEach( (el,n) => { 
		let x = el.x, y = el.y;
		el.b = [...new Array(nticks).keys()].map( j => {
			let bt = [];
			//if(ischange[x][y][z]===1) {
			bt = drawp.circle({cx:pgrid[j][x][y][z].cx,cy:pgrid[j][x][y][z].cy,r:pgrid[j][x][y][z].r,sw:pgrid[j][x][y][z].sw,sd:pgrid[j][x][y][z].sd,so:pgrid[j][x][y][z].so,fo:pgrid[j][x][y][z].fo,color:colors[j][(n+z)%colors[j].length]});
			//}
			//else { bt = el.b[j-1] }
			return bt;
		});
	});
});
let Bstr = `let B =
	${JSON.stringify(Bobj)};
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
