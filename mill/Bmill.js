const fs = require("fs"); 
console.log(process.argv);
let args = process.argv;
//const nticks = process.argv[2] ? process.argv[2] : 240;
const nticks = 40;
const fps = 24;
const dirTimestamp = 00000000;
let dt = new Date();
let timestamp = dt.getTime();
let datetime = dt.toDateString();
const Bfile = `./data/mill${dirTimestamp}/B.js`;
const BfilmFile = `./data/mill${dirTimestamp}/Bfilm.js`;
const recipeFile = `./data/mill${dirTimestamp}/recipe.sh`;
const tools = require("../../tools.js");
/* 
 * think about gravitational locations / colors ...
 * */
let nx = 2, ny = 2, nz = 4; 
/*
const colorsets = [
	["#fdfdf3", "#191918"], //"warmbw",
	["#8F0000", "#fdfdf3", ""#4b4b44","#191918"], //"warmbwred",
	["#8F0000", "#fdfdf3", "#191918"], //"warmbwgred",
	["#fdfdf3", "#191918"], //"warmbw",
	["#ffcc00", "#fdfdf3", "#191918"], //"warmbwyellow",
	["#fdfdf3", "#191918"], //"warmbw",
	//["#006699", "#fdfdf3", "#191918"], //"warmbwblue",
];
*/
const colorsets = [[[["#fdfdf3", "#191918"],3],[["#8F0000", "#fdfdf3", "#191918"],1],[["#fdfdf3", "#191918"],2],[["#4b4b44", "#fdfdf3", "#191918"],1]].map(wx=>{
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

const rmin = .5, rmax = 40;
const swmin = .5, swmax = 40;
const sdmin = .08, sdmax = 12;

const ncircles = 10;
const nvlines = 0;
const nhlines = 4;
const nlayers = 3;

const m = (nvlines+nhlines+ncircles)*nlayers;
//const m = nhlines*nlayers + ncircles;

const pgrid = [...new Array(nticks).keys()].map( j=> {
	const cx = [...new Array(m).keys()].map( x => {
		return 0.5;
	});
	const cy = [...new Array(m).keys()].map( x => {
		return 0.5;
	});
	const so = [...new Array(m).keys()].map( x => {
	 let so = x%3===0 ? 0.0 : 1.0;
		//if(j<2 || j>nticks-2) {so=0}
		return so;
	});
	const fo = [...new Array(m).keys()].map( x => {
		let fo = so[x]===0 ? 1.0 : 0.0;
		//if(j<2 || j>nticks-2) {fo=0}
		return fo;
	});
	const r = [...new Array(m).keys()].map( z => {
		return tools.randominteger(rmin,rmax)/100;
	}).map(x=>Math.max(x,0.01)).sort( (a,b) => b-a );
	const sw = [...new Array(m).keys()].map( z => {
		return tools.randominteger(swmin,swmax)/100;
	}).map(x=>Math.max(x,0.01)) ;
	//console.log(`sw=${JSON.stringify(sw)}`);
	const sd = [...new Array(m).keys()].map( z => {
		return tools.randominteger(sdmin,sdmax)/100;
	}).map(x=>Math.max(x,0.01));
	return {cx,cy,r,sw,sd,so,fo};
});
let drawp = {
	circle: p => { return {cx:p.cx,cy:p.cy,r:p.r,"stroke-width":p.sw,"stroke-dasharray":p.sd,"stroke-opacity":p.so,"fill-opacity":p.fo,stroke:p.color,fill:p.color } },
	rect: p => { return {x:p.cx,y:p.cy,width:p.w,height:p.h,"stroke-width":p.sw,"stroke-dasharray":p.sd,"stroke-opacity":p.so,"fill-opacity":p.fo,stroke:p.color,fill:p.color } },
	vline: p => { return {x1:p.cx,x2:p.cx,y1:0,y2:1,"stroke-width":p.sw,"stroke-dasharray":p.sd,"stroke-opacity":p.so,stroke:p.color } },
	hline: p => { return {x1:0,x2:1,y1:p.cy,y2:p.cy,"stroke-width":p.sw*2,"stroke-dasharray":p.sd,"stroke-opacity":p.so,stroke:p.color } },
	//vline: p => { return {x1:p.cx,x2:p.cx,y1:0,y2:1,"stroke-width":p.sw,"stroke-dasharray":p.sd,"stroke-opacity":1,stroke:p.color } },
	//hline: p => { return {x1:0,x2:1,y1:p.cy,y2:p.cy,"stroke-width":p.sw,"stroke-dasharray":p.sd,"stroke-opacity":1,stroke:p.color } },
}
const tween = (p1,p2,t,d) => {
	//console.log(`****p1=${JSON.stringify(p1)}`);
	//console.log(`****p2=${JSON.stringify(p2)}`);
	let dt = (100*t/d)/100;
	let pdt = {};
	Object.keys(p1).forEach(k=> {
		if(isNaN(p1[k])) {
			pdt[k] = p1[k];
		}
		else {
			pdt[k] = (100*p1[k] + 100*(p2[k]-p1[k])*dt)/100;
		//	console.log(`k=${k},dt=${dt},(p2[k]-p1[k])*dt=${(p2[k]-p1[k])*dt}`);
		}
	});
	//console.log(`pdt = ${JSON.stringify(pdt)}`);
	return pdt;
};

let elements = [...new Array(nlayers-1).keys()].reduce( (acc,z) => {
	let zels = [];
	let n = 0;
	//let colors = ["#fdfdf3","#4b4b44","#191918"];
	let colors = ["#fdfdf3","#191918"];
	[...new Array(nvlines).keys()].filter( j=>j%2===0 ).forEach( j => {
		zels.push({tag:"line", role:"vline", n:n, color:colors[(z+j)%colors.length]});
		++n;
	});
	[...new Array(nhlines).keys()].filter( j=>j%2===0 ).forEach( j => {
		zels.push({tag:"line", role:"hline", n:n, color:colors[(z+j)%colors.length]});
		++n;
	});
	[...new Array(nvlines).keys()].filter( j=>j%2===1 ).forEach( j => {
		zels.push({tag:"line", role:"vline", n:n, color:colors[(z+j)%colors.length]});
		++n;
	});
	[...new Array(nhlines).keys()].filter( j=>j%2===1 ).forEach( j => {
		zels.push({tag:"line", role:"hline", n:n, color:colors[(z+j)%colors.length]});
		++n;
	});
	acc.push(zels);
	return acc;
}, [[{tag:"rect"}]]);

elements[nlayers] = [...new Array(ncircles).keys()].map( n => {
 let colors = ["#fdfdf3","#191918","#fdfdf3"];
	return ({tag:"circle", role:"circle", n:n, color:colors[(nlayers+n)%colors.length]});
});

let B = {
	nticks: nticks,
	fps: fps,
	elements: elements,
};
let Bfilm = {
	nticks: nticks,
	fps: fps,
	elements: elements.map( z => {
		return z.map( el => {
			let newel = {};
			Object.keys(el).forEach(key=> {
				newel[key]=el[key];
			});
			newel.color = "#006666";
			return newel;
		});
	})
}
	const istweens = [[12,1],[1,0]].flatMap(wx=>{
		return [...new Array(wx[0]).keys()].map( w=>wx[1] );
	});
	const changes = [[6,1],[2,1]].flatMap(wx=>{
		return [...new Array(wx[0]).keys()].map( w=>wx[1] );
	});
	const ischange = [];
	[...new Array(nticks).keys()].forEach(j => {
		ischange[j] = [...new Array(m).keys()].map( x => { 
			return changes[tools.randominteger(0,changes.length)];
		});
	});
	[0,1,nticks-2,nticks-1].forEach( j=> {
		ischange[j] = [...new Array(m).keys()].map( x => { 
			return 1;
		})
	});

	/* layer 0
	 * rectangle background
	 * */
	[0].forEach( layer => {
		let cx = 0, cy = 0, w = 1.0, h = 1.0, sw = 0.01, sd = 1, so = 0, fo = 1;
		let color = "#fdfdf3";
		[...new Array(elements[layer].length).keys()].forEach( n => { 
			B.elements[layer][n].b = [...new Array(nticks).keys()].map( j => {
				return drawp.rect({cx:cx,cy:cy,w:w,h:h,sw,sd,so,fo,color});
			});
			Bfilm.elements[layer][n].b = [...new Array(nticks).keys()].flatMap( j => {
				return [...new Array(fps).keys()].map( t => {
					return drawp.rect({cx:cx,cy:cy,w:w,h:h,sw,sd,so,fo,color});
					//	return B.elements[layer][n].b[j]; 
				});
			});
		});
	});

	/* layers 1 to z-1
	 * */
	[...new Array(nlayers).keys()].map( z => z+1).forEach( z => { 
		B.elements[z].forEach( (el,n) => {
			let k = z < nlayers-1 ? n*(z-1)+n : n;
			let bframe = [...new Array(nticks).keys()].reduce( (acc,j) => {
				let bt = [];
				if(j===0 || ischange[j][n] || j===nticks-1) {
					let so = (j===0 || j===nticks-1) ? 0 : pgrid[j].so[k];
					let fo = (j===0 || j===nticks-1) ? 0 : pgrid[j].fo[k];
					if(el.tag==="line" && j>0 && j<nticks-1) { so=1.0; fo=0.0}
					//console.log(`j=${j}, so=${so}, fo=${fo}`);
					bt = drawp[el.role]({ 
						cx:pgrid[j].cx[k], cy:pgrid[j].cy[k],
						r:pgrid[j].r[k],w:1,h:1,
						so:so, fo:fo,
						sw:pgrid[j].sw[k], sd:pgrid[j].sd[k],
						color:el.color,
					});
				}
				else { bt = acc[j-1]; }
				acc.push(bt);
				return acc;
			}, []);

			[...new Array(12).keys()].forEach(x=> {
				let t = tools.randominteger(1,nticks-2);
				bframe[t] = tween(bframe[t-1],bframe[t+1],1,2);
			});
			[...new Array(6).keys()].forEach(x=> {
				let t = tools.randominteger(1,nticks-3);
				bframe[t] = tween(bframe[t-1],bframe[t+2],1,3);
				bframe[t+1] = tween(bframe[t-1],bframe[t+2],2,3);
			});

			el.b = bframe;
			Bfilm.elements[z][n].b = [...new Array(nticks).keys()].flatMap( j => { 
				//let p2 = j < nticks-1 ? bframe[j+1] : f;
				let p1 = bframe[j];
				let p2 = bframe[Math.min((j+1),(nticks-1))];
				//console.log(`el.n=${el.n}, j=${j}, p2=${JSON.stringify(p2)}`);
				let istween = istweens[tools.randominteger(0,istweens.length)];
				return [...new Array(fps).keys()].map( t => {
					let step = istween ? tween(p1,p2,t,fps) : bframe[tools.randominteger(0,bframe.length)];
					return step; 
				});
			});

			let introb = [...new Array(fps).keys()].map( t => {
				return Bfilm.elements[z][n].b[tools.randominteger(0,fps)];
			});
			introb.forEach(bt=>{Bfilm.elements[z][n].b.push(bt)});

			console.log(`Bfilm.elements[z][n].b.length =${Bfilm.elements[z][n].b.length}`);
			console.log(`el.b.length=${el.b.length}`);
			console.log(`count=${el.b.length}`);
			console.log(`count=${Bfilm.elements[z][n].b.length}`);
		});
	});

let Bstr = `let B =
	${JSON.stringify(B)};
module.exports = B;`

let Bfilmstr = `let B =
	${JSON.stringify(Bfilm)};
module.exports = B;`

fs.writeFileSync(Bfile, Bstr, (err) => {
	if (err)
		console.log(err);
	else {
		console.log(`${Bfile} written successfully\n`);
	}
});

fs.writeFileSync(BfilmFile, Bfilmstr, (err) => {
	if (err)
		console.log(err);
	else {
		console.log(`${BfilmFile} written successfully\n`);
	}
});

let recipe = `
#!/bin/bash
cd ../..
ts=${dirTimestamp}
echo "ts=${dirTimestamp}"
mkdir data/mill${dirTimestamp}
cp Bmill.js data/mill${dirTimestamp}/Bmill_temp.js
sed "s/00000000/\"${dirTimestamp}\"/" data/mill${dirTimestamp}/Bmill_temp.js > data/mill${dirTimestamp}/Bmill.js
rm data/mill${dirTimestamp}/Bmill_temp.js
node data/mill${dirTimestamp}/Bmill.js
node poemMill ./data/mill${dirTimestamp}
node bookMill ./data/mill${dirTimestamp} 
prince -s css/print.css data/mill${dirTimestamp}/print.html -o data/mill${dirTimestamp}/print.pdf
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
