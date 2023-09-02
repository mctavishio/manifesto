const fs = require("fs"); 
console.log(process.argv);
let args = process.argv;
const dirTimestamp = "1690225968";
let dt = new Date();
let timestamp = dt.getTime();
let datetime = dt.toDateString();
const inputfile = (args[2] || `./input.js`);
const input = require(inputfile);
const outputFile = `./data/mill${dirTimestamp}/B.js`;
const recipeFile = `./data/mill${dirTimestamp}/recipe.sh`;
const tools = require("../../tools.js");
const nticks = input.nticks || 48;

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
let Bobj = {
	nticks: nticks,
	elements: [
		{tag:"rect"},
		{tag:"line", role:"vline"},
		{tag:"line", role:"hline"},
		{tag:"line", role:"vline"},
		{tag:"line", role:"hline"},
		{tag:"circle"}, 
		{tag:"circle"}, 
	],
};

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
	attributes = {x1:cx,x2:cx,y1:0,y2:1,"stroke-dasharray":tools.randominteger(5,40)/800,"stroke-width":tools.randominteger(10,48)/100,stroke:"#000000"};
	bt[3] = {ischange:true, attributes};
	attributes = {x1:0,x2:1,y1:cy,y2:cy,"stroke-dasharray":tools.randominteger(5,40)/800,"stroke-width":tools.randominteger(10,48)/100,stroke:"#000000"};
	bt[4] = {ischange:true, attributes};
	attributes = {cx:cx,cy:cy,r:tools.randominteger(10,44)/100,"stroke-dasharray":tools.randominteger(5,40)/400,"stroke-width":tools.randominteger(10,48)/100,stroke:"#ffffff",fill:"#9a0000"};
	bt[5] = {ischange:true, attributes};
	attributes = {cx:cx,cy:cy,r:tools.randominteger(10,44)/100,"stroke-dasharray":tools.randominteger(5,40)/400,"stroke-width":tools.randominteger(10,48)/100,stroke:"#ffffff",fill:"#ffcc00"};
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
sed "s/"1690225968"/\"${dirTimestamp}\"/" data/mill${dirTimestamp}/Bmill_temp.js > data/mill${dirTimestamp}/Bmill.js
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
