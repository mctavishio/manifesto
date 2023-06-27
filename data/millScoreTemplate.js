const fs = require("fs");
const tools = require("../tools");
let now = new Date();
const timestamp = now.getTime();
let args = process.argv;
console.log(process.argv);
let scoreFilename = (args[2] || `./score${timestamp}.js`);
console.log("scoreFilename = "+scoreFilename);
let grid =  {
	x: [0,0.125,0.265625,0.5,0.6875,1.0],
	y: [0,0.125,0.265625,0.5,0.6875,1.0],
};
let xn = 3;
let yn = 3;
let nlayers = 4;
let gridsubsetx = [...Array(Math.min(xn,grid.x.length)).keys()].reduce( (acc,x,j) => {
	let newpt = acc[0][tools.randominteger(0,acc[0].length)];
	let arr = [];
	arr[0] = acc[0].filter(x=>x!==newpt);
	arr[1] = acc[1].concat([newpt]);
	return arr;
},[grid.x,[]])[1].sort();
console.log("gridsubsetx="+JSON.stringify(gridsubsetx));

let gridsubsety = [...Array(Math.min(yn,grid.y.length)).keys()].reduce( (acc,y,j) => {
	let newpt = acc[0][tools.randominteger(0,acc[0].length)];
	let arr = [];
	arr[0] = acc[0].filter(y=>y!==newpt);
	arr[1] = acc[1].concat([newpt]);
	return arr;
},[grid.y,[]])[1].sort();
console.log("gridsubsety="+JSON.stringify(gridsubsety));

grid.pts = gridsubsetx.reduce( (acc,x,j )=>{
	gridsubsety.forEach(y=>{
		acc.push([x,y]);
	});
	return acc;
},[]);
console.log("grid.pts="+JSON.stringify(grid.pts));

let circlen = 50; hlinen = yn; vlinen = xn, nrect=2;


let drawf = (el,p,dimensions) => {
	console.log("p="+JSON.stringify(p));
	Object.keys(p).forEach(k=> {
	/*
		if(k==="r") { el.setAttribute(k,p[k]*dimensions["max"]/100); console.log(k+p[k]) }
		else if(k==="cx") { el.setAttribute(k,p[k]*dimensions["width"]/100); console.log(k+p[k])  }
		else if(k==="cy") { el.setAttribute(k,p[k]*dimensions["height"]/100); console.log(k+p[k]) }
		*/
		el.setAttribute(k,p[k]);
	})
};
let elements = [...Array(circlen).keys()].map(j => {
	return {
		drawf: drawf,
		tag: "circle",
		attributes: [
			["r","0"]
		],
 	}	
});
console.log("elements="+JSON.stringify(elements));
let B = {
		nticks:2,
		elements: [{drawf:drawf, tag:"circle", attributes:[["r","0"],["cx","0"],["cy","0"]], cssstyles:[["fill","var(--warmwhite)"],["stroke-opacity","1"], ["stroke-dasharray","1 2 5"]]}, {drawf:drawf, tag:"circle", attributes:[["r","0"],["cx","0"],["cy","0"]], cssstyles:[["fill","var(--red)"],["stroke-opacity","1"], ["stroke","var(--warmblack)"], ["stroke-width","10"], ["stroke-dasharray","1 2 5"]]}],
		b:[
			[{r:"10",cx:"10",cy:"10"},{r:"12",cx:"80",cy:"80","stroke-width":"2"}],
			[{r:"25",cx:"50",cy:"50"},{r:"12",cx:"50",cy:"50","stroke-width":"9"}],
			[{r:"12",cx:"15",cy:"10"},{r:"12",cx:"80",cy:"80","stroke-width":"4"}],
			[{r:10,cx:0,cy:0},{r:12,cx:90,cy:90}],
			[{r:5,cx:20,cy:10},{r:10,cx:60,cy:80}],
		],
	};
console.log("B="+JSON.stringify(B));
 /*
	z.draw = (B,t,dimensions) => {
		let nticks = B.nticks;
		let tn = t%nticks;
		B.elements.forEach( (element,j) => {
			if(b[tn][j].ischanged!==0) {
				let p = b[tn][j].p;
				element.drawf(element.el,dimensions,p);
			}
		});
		if(z.animate) {
			window.setTimeout(()=>{z.draw(B,tn+1,z.dimensions)},z.dt);
		}
	}
	*/
fs.writeFileSync(scoreFilename, JSON.stringify(B,null,2), (err) => {
  if (err)
    console.log(err);
  else {
    console.log(Bfilename + " file written successfully\n");
  }
});
