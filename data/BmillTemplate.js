const fs = require("fs");
const tools = require("./tools");
const timestamp = 000000000;
let args = process.argv;
console.log(process.argv);
let Bfilename = (args[2] || `./B${timestamp}.js`);
let now = new Date();
let grid: {
	x: [0,0.125,0.265625,0.5,0.6875,1.0],
	y: [0,0.125,0.265625,0.5,0.6875,1.0],
	r: [0.05,0.1,0.15,0.2,0.25,0.3,0.35,0.4,0.45,0.5,0.55,0.6],
};
let xn = 3, yn = 3;
let gridsubsetx = [...Array(xn).keys()].reduce( (acc,j) => {
	let newpt = gridsubsetx[tools.randominteger(0,gridsubsetx.length)];
	while(newpt in acc) {
		newpt = gridsubsetx[tools.randominteger(0,gridsubsetx.length)];
	}
	acc.push(newpt);
},[]);
let circlen = 25; linen = 10;
let nlayers = 2;
  /**
 * Generate all combinations of an array.
 * @param {Array} sourceArray - Array of input elements.
 * @param {number} comboLength - Desired length of combinations.
 * @return {Array} Array of combination arrays.
 */
let generateCombinations = (sourceArray, comboLength) => {
 const sourceLength = sourceArray.length;
  if (comboLength > sourceLength) return [];

  const combos = []; // Stores valid combinations as they are generated.

  // Accepts a partial combination, an index into sourceArray,
  // and the number of elements required to be added to create a full-length combination.
  // Called recursively to build combinations, adding subsequent elements at each call depth.
  const makeNextCombos = (workingCombo, currentIndex, remainingCount) => {
    const oneAwayFromComboLength = remainingCount == 1;

    // For each element that remaines to be added to the working combination.
    for (let sourceIndex = currentIndex; sourceIndex < sourceLength; sourceIndex++) {
      // Get next (possibly partial) combination.
      const next = [ ...workingCombo, sourceArray[sourceIndex] ];

      if (oneAwayFromComboLength) {
        // Combo of right length found, save it.
        combos.push(next);
      }
      else {
        // Otherwise go deeper to add more elements to the current partial combination.
        makeNextCombos(next, sourceIndex + 1, remainingCount - 1);
      }
        }
  }

  makeNextCombos([], 0, comboLength);
  return combos;
}
/*
 * var array = ["apple", "banana", "lemon", "mango"];

var result = array.reduce( (acc, v, i) =>
    acc.concat(array.slice(i+1).map( w => v + ' ' + w )),
[]);

console.log(result);
 * */
/*
 * var array = ["apple", "banana", "lemon", "mango"];

var result = array.flatMap(
    (v, i) => array.slice(i+1).map( w => v + ' ' + w )
);

console.log(result);
from: https://stackoverflow.com/questions/43241174/javascript-generating-all-combinations-of-elements-in-a-single-array-in-pairs
*/
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
	let z = getz(B);
	z.draw(B,0,z.dimensions);
 });
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
 </script>
</html>`;
fs.writeFileSync(indexname, head+body, (err) => {
  if (err)
    console.log(err);
  else {
    console.log("File written successfully\n");
  }
});
