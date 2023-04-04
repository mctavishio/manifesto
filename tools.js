module.exports = {
	randominteger: (min, max) => {
		return Math.floor( min + Math.random()*(max-min));
	},
	reifyWeightedArray: arr => {
		return arr.reduce( (acc, item, j) => {
			Array.prototype.push.apply(acc,[...Array(item[1]).keys()].reduce( (acc2,k) => { acc2.push(item[0]); return acc2 },[]) );
			return acc;
		}, []);
	},
	//Fisher-Yates (aka Knuth) Shuffle
	shufflearray: array => {
	  let currentIndex = array.length,  randomIndex;
	  // While there remain elements to shuffle...
	  while (currentIndex != 0) {
	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex--;
	    // And swap it with the current element.
	    [array[currentIndex], array[randomIndex]] = [
	      array[randomIndex], array[currentIndex]];
	  }
	  return array;
	},
	//linear tween
	//for more see: https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
	//https://spicyyoghurt.com/tools/easing-functions
	tweenParameters: (p1,p2,nsteps,t) => {
		let m = t/nsteps;
		let pt = Object.keys(p1).reduce( (ptacc,key) => {
			if(isNaN(p1[key])) {
				ptacc[key] = t>nsteps-3 ? [p1[key],p2[key]][Math.floor(Math.random() * 2)] : p1[key];
			}
			else {
				ptacc[key] = p1[key] + (p2[key] - p1[key])*m;
			}
			//console.log(`pt[${key}] = ${ptacc[key]}`);
			return ptacc;
		}, {});
		return pt;
	};
	//https://github.com/freder/bezier-spline
	interpolatePath: pts => {
	};
	getDateTime: () => {
		const datetime= new Date();
		const timestamp = datetime.getTime();
		const year = datetime.getFullYear();
		const month = datetime.getMonth();
		const date = datetime.getDate();
		const hour = datetime.getHours();
		const minute = datetime.getMinutes();
		const second = datetime.getSeconds();
		const millisecond = datetime.getMilliseconds();
		const day = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][datetime.getDay()];
		const str = datetime.toDateString();
		const codestr = `${year}.${month.toString().padStart(2,0)}.${date.toString().padStart(2,0)}T${hour.toString().padStart(2,0)}.${minute.toString().padStart(2,0)}.${second.toString().padStart(2,0)}.${millisecond.toString().padStart(3,0)}`;
		const ISOstr = datetime.toISOString();
		return {
			obj: datetime,timestamp,year,month,date,hour,minute,second,millisecond,day,str,codestr,ISOstr
		}
	},
	curves: {
		init:  () -> {
			// find each path, to see if it has Catmull-Rom splines in it
			var pathEls = document.documentElement.getElementsByTagName("path");
			for (var p = 0, pLen = pathEls.length; pLen > p; p++) {
				var eachPath = pathEls[ p ];
				tools.curves.parsePath( eachPath, eachPath.getAttribute("d") );
			}
		},
		parsePath: ( path, d ) => {
			var pathArray = [];
			var lastX = "";
			var lastY = "";

			//var d = path.getAttribute( "d" );
			if ( -1 != d.search(/[rR]/) ) {
				// no need to redraw the path if no Catmull-Rom segments are found
				// split path into constituent segments
					var pathSplit = d.split(/([A-Za-z])/);
					for (var i = 0, iLen = pathSplit.length; iLen > i; i++) {
					var segment = pathSplit[i];
					// make command code lower case, for easier matching
					// NOTE: this code assumes absolution coordinates, and doesn't account for relative command coordinates
					var command = segment.toLowerCase()
					if ( -1 != segment.search(/[A-Za-z]/) ) {
						var val = "";
						if ( "z" != command ) {
							i++;
							val = pathSplit[ i ].replace(/\s+$/, '');
						}

								if ( "r" == command ) {
							// "R" and "r" are the a Catmull-Rom spline segment
							var points = lastX + "," + lastY + " " + val;
									// convert Catmull-Rom spline to BÃ©zier curves
							var beziers = tools.curves.catmullRom2bezier( points );
							//insert replacement curves back into array of path segments
							pathArray.push( beziers );
						} else {
							 // rejoin the command code and the numerical values, place in array of path segments
							pathArray.push( segment + val );
									// find last x, y points, for feeding into Catmull-Rom conversion algorithm
							if ( "h" == command ) {
								lastX = val;
							} else if ( "v" == command ) {
								lastY = val;
							} else if ( "z" != command ) {
								var c = val.split(/[,\s]/);
								lastY = c.pop();
								lastX = c.pop();
							}
						}
					}
				}
				// recombine path segments and set new path description in DOM
				path.setAttribute( "d", pathArray.join(" ") );
			}
		},
		catmullRom2bezier: ( points ) => {
			// alert(points)
			points = points + "";
			var crp = points.split(/[,\s]/);
			var d = "";
			for (var i = 0, iLen = crp.length; iLen - 2 > i; i+=2) {
				var p = [];
				if ( 0 == i ) {
					p.push( {x: parseFloat(crp[ i ]), y: parseFloat(crp[ i + 1 ])} );
					p.push( {x: parseFloat(crp[ i ]), y: parseFloat(crp[ i + 1 ])} );
					p.push( {x: parseFloat(crp[ i + 2 ]), y: parseFloat(crp[ i + 3 ])} );
					p.push( {x: parseFloat(crp[ i + 4 ]), y: parseFloat(crp[ i + 5 ])} );
				} else if ( iLen - 4 == i ) {
					p.push( {x: parseFloat(crp[ i - 2 ]), y: parseFloat(crp[ i - 1 ])} );
					p.push( {x: parseFloat(crp[ i ]), y: parseFloat(crp[ i + 1 ])} );
					p.push( {x: parseFloat(crp[ i + 2 ]), y: parseFloat(crp[ i + 3 ])} );
					p.push( {x: parseFloat(crp[ i + 2 ]), y: parseFloat(crp[ i + 3 ])} );
				} else {
					p.push( {x: parseFloat(crp[ i - 2 ]), y: parseFloat(crp[ i - 1 ])} );
					p.push( {x: parseFloat(crp[ i ]), y: parseFloat(crp[ i + 1 ])} );
					p.push( {x: parseFloat(crp[ i + 2 ]), y: parseFloat(crp[ i + 3 ])} );
					p.push( {x: parseFloat(crp[ i + 4 ]), y: parseFloat(crp[ i + 5 ])} );
				}
				// Catmull-Rom to Cubic Bezier conversion matrix
				//    0       1       0       0
				//  -1/6      1      1/6      0
				//    0      1/6      1     -1/6
				//    0       0       1       0
				var bp = [];
				bp.push( { x: p[1].x,  y: p[1].y } );
				bp.push( { x: ((-p[0].x + 6*p[1].x + p[2].x) / 6), y: ((-p[0].y + 6*p[1].y + p[2].y) / 6)} );
				bp.push( { x: ((p[1].x + 6*p[2].x - p[3].x) / 6),  y: ((p[1].y + 6*p[2].y - p[3].y) / 6) } );
				bp.push( { x: p[2].x,  y: p[2].y } );

				d += "C" + bp[1].x + "," + bp[1].y + " " + bp[2].x + "," + bp[2].y + " " + bp[3].x + "," + bp[3].y + " ";
			}
			return d;
		},
};
let createtools = z => {
	return {
			randominteger: (min, max) => {
				return Math.floor( min + Math.random()*(max-min));
			},
			normalrandominteger: (min, max, n) => { // CLT
				return n === 0 ? z.tools.randominteger(min,max) : Math.floor(Array.from(Array(n).keys()).reduce( (sum, j) => { return sum + z.tools.randominteger(min,max) }, 0) / n)
			},
			clearDOMelement: (el) => {
				el.innerHTML = "";
			},
			telegraph: (el, msg) => {
				if(el) {
					try { el.innerHTML =  msg; z.tools.logmsg("... " + msg);}
					catch(err) { z.tools.logerror(err) }
				}
				else {
					z.tools.logmsg(" || ... " + msg);
				}
			},
			logmsg: function(msg) {
				try { 
					// console.log("### ::: " + msg); 
				}
				catch(err) { z.tools.logerror(err) }
			},
			logerror: function(error) {
				try { console.log("rusty error ... " + error); }
				catch(err) {}
			},
			randomhighharmonic: () => {
				let multipliers = [10.0, 12.5, 13.33, 15, 20];
				return multipliers[ z.tools.randominteger( 0, multipliers.length) ];
			},
			randomharmonic: () => {
				let multipliers = [5, 7.5, 10.0, 12.5, 13.33, 15, 20];
				return multipliers[ z.tools.randominteger( 0, multipliers.length) ];
			},
			randomlowharmonic: () => {
				let multipliers = [5, 7.5, 10.0, 12.5, 13.33, 15, 20];
				return multipliers[ z.tools.randominteger( 0, multipliers.length) ]/2;
			},
			randomkey: (object) => {
				let keys = Object.keys(object);
				let key = keys[z.tools.randominteger(0,keys.length)];
				// z.tools.logmsg("key = " + key);
				return key;
			},
			togrid: (min=1, max=1, x=1, ndivisions=1) => {
				let dx = Math.floor( (max-min) / ndivisions );
				return Math.floor( ( x-min+dx/2)/dx )*dx + min;
			},
			getrandomblanks: (ndrawings, nshapes) => {
				let blanks = [[0],[0,1]];
				for(let d=1; d<ndrawings+1; ++d) {
					let blank = []
					for(let s=0; s<d*nshapes; ++s) {
						blank.push(s);
					}
					blanks.push(blank);
				}
				return blanks[ z.tools.randominteger(0,ndrawings+2) ];
			},
			shuffle: (array) => {
				copy = array.slice();
				for (var i = copy.length - 1; i > 0; i--) {
					var j = Math.floor(Math.random() * (i + 1));
					var temp = copy[i];
					copy[i] = copy[j];
					copy[j] = temp;
				}
				return copy;
			},
			logstreams: streams => {
				Object.keys(streams).filter( key => {return key !== "clock"}).forEach( key => {
					z.tools.logmsg("key " + key );
					streams[key].onValue( e => { z.tools.logmsg("onvalue ::: " + key + ": " + JSON.stringify(e)) });
				});
			},
			datestr: function(date, options) {
				if(options===undefined) options = {year: "numeric", month: "2-digit", day: "numeric", hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit"};
				return date.toLocaleTimeString("en-US", options);
			},
			applyCSS: function(el, css, j, n) {
				var j = j || 0, n = n || 1;
				for (var key in css) {
					if (css.hasOwnProperty(key)) {
						if(typeof css[key] === "function") el.style[ key ] = css[key](j, n);
						else el.style[ key ] = css[key];
					}
				}
			},
		}
};let createtools = z => {
	return {
			randominteger: (min, max) => {
				return Math.floor( min + Math.random()*(max-min));
			},
			normalrandominteger: (min, max, n) => { // CLT
				return n === 0 ? z.tools.randominteger(min,max) : Math.floor(Array.from(Array(n).keys()).reduce( (sum, j) => { return sum + z.tools.randominteger(min,max) }, 0) / n)
			},
			clearDOMelement: (el) => {
				el.innerHTML = "";
			},
			telegraph: (el, msg) => {
				if(el) {
					try { el.innerHTML =  msg; z.tools.logmsg("... " + msg);}
					catch(err) { z.tools.logerror(err) }
				}
				else {
					z.tools.logmsg(" || ... " + msg);
				}
			},
			logmsg: function(msg) {
				try { 
					// console.log("### ::: " + msg); 
				}
				catch(err) { z.tools.logerror(err) }
			},
			logerror: function(error) {
				try { console.log("rusty error ... " + error); }
				catch(err) {}
			},
			randomhighharmonic: () => {
				let multipliers = [10.0, 12.5, 13.33, 15, 20];
				return multipliers[ z.tools.randominteger( 0, multipliers.length) ];
			},
			randomharmonic: () => {
				let multipliers = [5, 7.5, 10.0, 12.5, 13.33, 15, 20];
				return multipliers[ z.tools.randominteger( 0, multipliers.length) ];
			},
			randomlowharmonic: () => {
				let multipliers = [5, 7.5, 10.0, 12.5, 13.33, 15, 20];
				return multipliers[ z.tools.randominteger( 0, multipliers.length) ]/2;
			},
			randomkey: (object) => {
				let keys = Object.keys(object);
				let key = keys[z.tools.randominteger(0,keys.length)];
				// z.tools.logmsg("key = " + key);
				return key;
			},
			togrid: (min=1, max=1, x=1, ndivisions=1) => {
				let dx = Math.floor( (max-min) / ndivisions );
				return Math.floor( ( x-min+dx/2)/dx )*dx + min;
			},
			getrandomblanks: (ndrawings, nshapes) => {
				let blanks = [[0],[0,1]];
				for(let d=1; d<ndrawings+1; ++d) {
					let blank = []
					for(let s=0; s<d*nshapes; ++s) {
						blank.push(s);
					}
					blanks.push(blank);
				}
				return blanks[ z.tools.randominteger(0,ndrawings+2) ];
			},
			shuffle: (array) => {
				copy = array.slice();
				for (var i = copy.length - 1; i > 0; i--) {
					var j = Math.floor(Math.random() * (i + 1));
					var temp = copy[i];
					copy[i] = copy[j];
					copy[j] = temp;
				}
				return copy;
			},
			logstreams: streams => {
				Object.keys(streams).filter( key => {return key !== "clock"}).forEach( key => {
					z.tools.logmsg("key " + key );
					streams[key].onValue( e => { z.tools.logmsg("onvalue ::: " + key + ": " + JSON.stringify(e)) });
				});
			},
			datestr: function(date, options) {
				if(options===undefined) options = {year: "numeric", month: "2-digit", day: "numeric", hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit"};
				return date.toLocaleTimeString("en-US", options);
			},
			applyCSS: function(el, css, j, n) {
				var j = j || 0, n = n || 1;
				for (var key in css) {
					if (css.hasOwnProperty(key)) {
						if(typeof css[key] === "function") el.style[ key ] = css[key](j, n);
						else el.style[ key ] = css[key];
					}
				}
			},
		}
};module.exports = {
	randominteger: (min, max) => {
		return Math.floor( min + Math.random()*(max-min));
	},
	logmsg: function(msg) {
		console.log("### ::: " + msg);
	},
	logerror: function(error) {
		try { console.log("rusty error ... " + error); }
		catch(err) {}
	}			
}let createtools = z => {
	return {
			randominteger: (min, max) => {
				return Math.floor( min + Math.random()*(max-min));
			},
			normalrandominteger: (min, max, n) => { // CLT
				return n === 0 ? z.tools.randominteger(min,max) : Math.floor(Array.from(Array(n).keys()).reduce( (sum, j) => { return sum + z.tools.randominteger(min,max) }, 0) / n)
			},
			clearDOMelement: (el) => {
				el.innerHTML = "";
			},
			telegraph: (el, msg) => {
				if(el) {
					try { el.innerHTML =  msg; z.tools.logmsg("... " + msg);}
					catch(err) { z.tools.logerror(err) }
				}
				else {
					z.tools.logmsg(" || ... " + msg);
				}
			},
			logmsg: function(msg) {
				try { 
					// console.log("### ::: " + msg); 
				}
				catch(err) { z.tools.logerror(err) }
			},
			logerror: function(error) {
				try { console.log("rusty error ... " + error); }
				catch(err) {}
			},
			randomhighharmonic: () => {
				let multipliers = [10.0, 12.5, 13.33, 15, 20];
				return multipliers[ z.tools.randominteger( 0, multipliers.length) ];
			},
			randomharmonic: () => {
				let multipliers = [5, 7.5, 10.0, 12.5, 13.33, 15, 20];
				return multipliers[ z.tools.randominteger( 0, multipliers.length) ];
			},
			randomlowharmonic: () => {
				let multipliers = [5, 7.5, 10.0, 12.5, 13.33, 15, 20];
				return multipliers[ z.tools.randominteger( 0, multipliers.length) ]/2;
			},
			randomkey: (object) => {
				let keys = Object.keys(object);
				let key = keys[z.tools.randominteger(0,keys.length)];
				// z.tools.logmsg("key = " + key);
				return key;
			},
			togrid: (min=1, max=1, x=1, ndivisions=1) => {
				let dx = Math.floor( (max-min) / ndivisions );
				return Math.floor( ( x-min+dx/2)/dx )*dx + min;
			},
			getrandomblanks: (ndrawings, nshapes) => {
				let blanks = [[0],[0,1]];
				for(let d=1; d<ndrawings+1; ++d) {
					let blank = []
					for(let s=0; s<d*nshapes; ++s) {
						blank.push(s);
					}
					blanks.push(blank);
				}
				return blanks[ z.tools.randominteger(0,ndrawings+2) ];
			},
			shuffle: (array) => {
				copy = array.slice();
				for (var i = copy.length - 1; i > 0; i--) {
					var j = Math.floor(Math.random() * (i + 1));
					var temp = copy[i];
					copy[i] = copy[j];
					copy[j] = temp;
				}
				return copy;
			},
			logstreams: streams => {
				Object.keys(streams).filter( key => {return key !== "clock"}).forEach( key => {
					z.tools.logmsg("key " + key );
					streams[key].onValue( e => { z.tools.logmsg("onvalue ::: " + key + ": " + JSON.stringify(e)) });
				});
			},
			datestr: function(date, options) {
				if(options===undefined) options = {year: "numeric", month: "2-digit", day: "numeric", hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit"};
				return date.toLocaleTimeString("en-US", options);
			},
			applyCSS: function(el, css, j, n) {
				var j = j || 0, n = n || 1;
				for (var key in css) {
					if (css.hasOwnProperty(key)) {
						if(typeof css[key] === "function") el.style[ key ] = css[key](j, n);
						else el.style[ key ] = css[key];
					}
				}
			},
		}
};[
	{
		"word": "tools",
		"shortdef": "a handheld device that aids in accomplishing a task",
		"fl": "noun"
	},
	{
		"word": "tools",
		"shortdef": "drive, ride",
		"fl": "verb"
	},
	{
		"word": "tools",
		"shortdef": "a design (as on the binding of a book) made by tooling",
		"fl": "noun"
	},
	{
		"word": "tools",
		"shortdef": "a compact, portable device that has blades and extensions for many tools (such as knives, screwdrivers, pliers, scissors, openers, and saw blades) which can be folded into the handle",
		"fl": "noun"
	}
][
	{
		"word": "tools",
		"stems": [
			"tools"
		],
		"syns": [
			[
				"devices",
				"implements",
				"instruments",
				"utensils"
			],
			[
				"cat's-paws",
				"instruments",
				"lay figures",
				"pawns",
				"puppets"
			],
			[
				"chumps",
				"dupes",
				"gulls",
				"mugs",
				"patsies",
				"pigeons",
				"pushovers",
				"saps",
				"soft touches",
				"suckers"
			]
		],
		"ants": [],
		"shortdef": [
			"an article intended for use in work",
			"one that is or can be used to further the purposes of another",
			"one who is easily deceived or cheated"
		],
		"fl": "noun"
	},
	{
		"word": "tools",
		"stems": [
			"tools"
		],
		"syns": [
			[
				"automobiles",
				"drives",
				"motors"
			]
		],
		"ants": [],
		"shortdef": [
			"to travel by a motorized vehicle"
		],
		"fl": "verb"
	},
	{
		"word": "tools",
		"stems": [
			"tool",
			"tools"
		],
		"syns": [
			[
				"device",
				"implement",
				"instrument",
				"utensil"
			],
			[
				"cat's-paw",
				"instrument",
				"lay figure",
				"pawn",
				"puppet"
			],
			[
				"chump",
				"dupe",
				"gull",
				"mug",
				"patsy",
				"pigeon",
				"pushover",
				"sap",
				"soft touch",
				"sucker"
			]
		],
		"ants": [],
		"shortdef": [
			"an article intended for use in work",
			"one that is or can be used to further the purposes of another",
			"one who is easily deceived or cheated"
		],
		"fl": "noun"
	},
	{
		"word": "tools",
		"stems": [
			"tool",
			"tooled",
			"tooling",
			"tools"
		],
		"syns": [
			[
				"automobile",
				"drive",
				"motor"
			]
		],
		"ants": [],
		"shortdef": [
			"to travel by a motorized vehicle"
		],
		"fl": "verb"
	}
][
	{
		"meta": {
			"id": "tools",
			"uuid": "23217906-e9f5-4f32-82fa-d273fdb6289d",
			"src": "coll_thes",
			"section": "alpha",
			"stems": [
				"tools"
			],
			"syns": [
				[
					"devices",
					"implements",
					"instruments",
					"utensils"
				],
				[
					"cat's-paws",
					"instruments",
					"lay figures",
					"pawns",
					"puppets"
				],
				[
					"chumps",
					"dupes",
					"gulls",
					"mugs",
					"patsies",
					"pigeons",
					"pushovers",
					"saps",
					"soft touches",
					"suckers"
				]
			],
			"ants": [],
			"offensive": false
		},
		"hwi": {
			"hw": "tools"
		},
		"fl": "noun",
		"sls": [
			"plural of {d_link|tool|tool}"
		],
		"def": [
			{
				"sseq": [
					[
						[
							"sense",
							{
								"sn": "1",
								"dt": [
									[
										"text",
										"an article intended for use in work "
									],
									[
										"vis",
										[
											{
												"t": "needed a special {it}tool{/it} to open the case of the appliance"
											}
										]
									]
								],
								"syn_list": [
									[
										{
											"wd": "devices"
										},
										{
											"wd": "implements"
										},
										{
											"wd": "instruments"
										},
										{
											"wd": "utensils"
										}
									]
								],
								"rel_list": [
									[
										{
											"wd": "apparatuses",
											"wvrs": [
												{
													"wvl": "or",
													"wva": "apparatus"
												}
											]
										},
										{
											"wd": "appliances"
										},
										{
											"wd": "mechanisms"
										}
									],
									[
										{
											"wd": "contraptions"
										},
										{
											"wd": "contrivances"
										},
										{
											"wd": "gadgets"
										},
										{
											"wd": "gizmos",
											"wvrs": [
												{
													"wvl": "also",
													"wva": "gismos"
												}
											]
										},
										{
											"wd": "jiggers"
										}
									],
									[
										{
											"wd": "accessories",
											"wvrs": [
												{
													"wvl": "also",
													"wva": "accessaries"
												}
											]
										},
										{
											"wd": "accoutrements",
											"wvrs": [
												{
													"wvl": "or",
													"wva": "accouterments"
												}
											]
										},
										{
											"wd": "adjuncts"
										},
										{
											"wd": "appendages"
										},
										{
											"wd": "attachments"
										}
									]
								]
							}
						]
					],
					[
						[
							"sense",
							{
								"sn": "2",
								"dt": [
									[
										"text",
										"one that is or can be used to further the purposes of another "
									],
									[
										"vis",
										[
											{
												"t": "a ruthless leader using his trusting followers as {it}tools{/it} in his quest for power"
											}
										]
									]
								],
								"syn_list": [
									[
										{
											"wd": "cat's-paws"
										},
										{
											"wd": "instruments"
										},
										{
											"wd": "lay figures"
										},
										{
											"wd": "pawns"
										},
										{
											"wd": "puppets"
										}
									]
								],
								"rel_list": [
									[
										{
											"wd": "chumps"
										},
										{
											"wd": "dupes"
										},
										{
											"wd": "foils"
										},
										{
											"wd": "gulls"
										},
										{
											"wd": "suckers"
										},
										{
											"wd": "victims"
										}
									],
									[
										{
											"wd": "minions"
										},
										{
											"wd": "stooges"
										}
									],
									[
										{
											"wd": "lap dogs"
										},
										{
											"wd": "yes-men"
										}
									]
								]
							}
						]
					],
					[
						[
							"sense",
							{
								"sn": "3",
								"dt": [
									[
										"text",
										"one who is easily deceived or cheated "
									],
									[
										"vis",
										[
											{
												"t": "you're just a pathetic {it}tool{/it} of the advertising industry if you believe everything you see in TV commercials"
											}
										]
									]
								],
								"syn_list": [
									[
										{
											"wd": "chumps"
										},
										{
											"wd": "dupes"
										},
										{
											"wd": "gulls"
										},
										{
											"wd": "mugs",
											"wsls": [
												"chiefly British"
											]
										},
										{
											"wd": "patsies"
										},
										{
											"wd": "pigeons"
										},
										{
											"wd": "pushovers"
										},
										{
											"wd": "saps"
										},
										{
											"wd": "soft touches"
										},
										{
											"wd": "suckers"
										}
									]
								],
								"rel_list": [
									[
										{
											"wd": "cat's-paws"
										},
										{
											"wd": "marks"
										},
										{
											"wd": "targets"
										},
										{
											"wd": "victims"
										}
									],
									[
										{
											"wd": "schlemiels",
											"wvrs": [
												{
													"wvl": "also",
													"wva": "shlemiels"
												}
											]
										}
									],
									[
										{
											"wd": "butts"
										},
										{
											"wd": "derisions"
										},
										{
											"wd": "laughingstocks"
										},
										{
											"wd": "mockeries"
										},
										{
											"wd": "mocks"
										}
									],
									[
										{
											"wd": "boobies"
										},
										{
											"wd": "dodoes",
											"wvrs": [
												{
													"wvl": "or",
													"wva": "dodos"
												}
											]
										},
										{
											"wd": "fools"
										},
										{
											"wd": "geese"
										},
										{
											"wd": "half-wits"
										},
										{
											"wd": "jackasses"
										},
										{
											"wd": "lunatics"
										},
										{
											"wd": "monkeys"
										},
										{
											"wd": "nincompoops"
										},
										{
											"wd": "ninnies"
										},
										{
											"wd": "nitwits"
										},
										{
											"wd": "simpletons"
										},
										{
											"wd": "simps"
										},
										{
											"wd": "turkeys"
										},
										{
											"wd": "yo-yos"
										}
									],
									[
										{
											"wd": "losers"
										}
									],
									[
										{
											"wd": "blockheads"
										},
										{
											"wd": "dolts"
										},
										{
											"wd": "dopes"
										},
										{
											"wd": "dumbbells"
										},
										{
											"wd": "dummies"
										},
										{
											"wd": "dunces"
										},
										{
											"wd": "idiots"
										},
										{
											"wd": "imbeciles"
										},
										{
											"wd": "morons"
										},
										{
											"wd": "schlubs",
											"wvrs": [
												{
													"wvl": "also",
													"wva": "shlubs"
												}
											],
											"wsls": [
												"slang"
											]
										},
										{
											"wd": "schlumps",
											"wsls": [
												"slang"
											]
										},
										{
											"wd": "schnooks",
											"wsls": [
												"slang"
											]
										}
									]
								],
								"near_list": [
									[
										{
											"wd": "cheaters"
										},
										{
											"wd": "cheats"
										},
										{
											"wd": "confidence men"
										},
										{
											"wd": "cozeners"
										},
										{
											"wd": "defrauders"
										},
										{
											"wd": "dodgers"
										},
										{
											"wd": "hoaxers"
										},
										{
											"wd": "sharks"
										},
										{
											"wd": "sharpers"
										},
										{
											"wd": "slickers"
										},
										{
											"wd": "swindlers"
										},
										{
											"wd": "tricksters"
										}
									]
								]
							}
						]
					]
				]
			}
		],
		"shortdef": [
			"an article intended for use in work",
			"one that is or can be used to further the purposes of another",
			"one who is easily deceived or cheated"
		]
	},
	{
		"meta": {
			"id": "tools",
			"uuid": "f3e4d7e7-e991-4101-8ab1-5c11163cefb4",
			"src": "coll_thes",
			"section": "alpha",
			"stems": [
				"tools"
			],
			"syns": [
				[
					"automobiles",
					"drives",
					"motors"
				]
			],
			"ants": [],
			"offensive": false
		},
		"hwi": {
			"hw": "tools"
		},
		"fl": "verb",
		"sls": [
			"present tense third-person singular of {d_link|tool|tool}"
		],
		"def": [
			{
				"sseq": [
					[
						[
							"sense",
							{
								"dt": [
									[
										"text",
										"to travel by a motorized vehicle "
									],
									[
										"vis",
										[
											{
												"t": "I spent some time {it}tooling{/it} around town today"
											}
										]
									]
								],
								"syn_list": [
									[
										{
											"wd": "automobiles"
										},
										{
											"wd": "drives"
										},
										{
											"wd": "motors"
										}
									]
								],
								"rel_list": [
									[
										{
											"wd": "rolls"
										},
										{
											"wd": "wheels"
										}
									],
									[
										{
											"wd": "joyrides"
										}
									],
									[
										{
											"wd": "chauffeurs"
										},
										{
											"wd": "hacks"
										},
										{
											"wd": "taxis",
											"wvrs": [
												{
													"wvl": "or",
													"wva": "taxies"
												}
											]
										}
									],
									[
										{
											"wd": "rides"
										}
									],
									[
										{
											"wd": "drags"
										},
										{
											"wd": "races"
										}
									]
								]
							}
						]
					]
				]
			}
		],
		"shortdef": [
			"to travel by a motorized vehicle"
		]
	},
	{
		"meta": {
			"id": "tool",
			"uuid": "18b0db99-2196-4578-b8ce-0c7c259ca729",
			"src": "coll_thes",
			"section": "alpha",
			"stems": [
				"tool",
				"tools"
			],
			"syns": [
				[
					"device",
					"implement",
					"instrument",
					"utensil"
				],
				[
					"cat's-paw",
					"instrument",
					"lay figure",
					"pawn",
					"puppet"
				],
				[
					"chump",
					"dupe",
					"gull",
					"mug",
					"patsy",
					"pigeon",
					"pushover",
					"sap",
					"soft touch",
					"sucker"
				]
			],
			"ants": [],
			"offensive": false
		},
		"hwi": {
			"hw": "tool"
		},
		"fl": "noun",
		"def": [
			{
				"sseq": [
					[
						[
							"sense",
							{
								"sn": "1",
								"dt": [
									[
										"text",
										"an article intended for use in work "
									],
									[
										"vis",
										[
											{
												"t": "needed a special {it}tool{/it} to open the case of the appliance"
											}
										]
									]
								],
								"syn_list": [
									[
										{
											"wd": "device"
										},
										{
											"wd": "implement"
										},
										{
											"wd": "instrument"
										},
										{
											"wd": "utensil"
										}
									]
								],
								"rel_list": [
									[
										{
											"wd": "apparatus"
										},
										{
											"wd": "appliance"
										},
										{
											"wd": "mechanism"
										}
									],
									[
										{
											"wd": "contraption"
										},
										{
											"wd": "contrivance"
										},
										{
											"wd": "gadget"
										},
										{
											"wd": "gizmo",
											"wvrs": [
												{
													"wvl": "also",
													"wva": "gismo"
												}
											]
										},
										{
											"wd": "jigger"
										}
									],
									[
										{
											"wd": "accessory",
											"wvrs": [
												{
													"wvl": "also",
													"wva": "accessary"
												}
											]
										},
										{
											"wd": "accoutrement",
											"wvrs": [
												{
													"wvl": "or",
													"wva": "accouterment"
												}
											]
										},
										{
											"wd": "adjunct"
										},
										{
											"wd": "appendage"
										},
										{
											"wd": "attachment"
										}
									]
								]
							}
						]
					],
					[
						[
							"sense",
							{
								"sn": "2",
								"dt": [
									[
										"text",
										"one that is or can be used to further the purposes of another "
									],
									[
										"vis",
										[
											{
												"t": "a ruthless leader using his trusting followers as {it}tools{/it} in his quest for power"
											}
										]
									]
								],
								"syn_list": [
									[
										{
											"wd": "cat's-paw"
										},
										{
											"wd": "instrument"
										},
										{
											"wd": "lay figure"
										},
										{
											"wd": "pawn"
										},
										{
											"wd": "puppet"
										}
									]
								],
								"rel_list": [
									[
										{
											"wd": "chump"
										},
										{
											"wd": "dupe"
										},
										{
											"wd": "foil"
										},
										{
											"wd": "gull"
										},
										{
											"wd": "sucker"
										},
										{
											"wd": "victim"
										}
									],
									[
										{
											"wd": "minion"
										},
										{
											"wd": "stooge"
										}
									],
									[
										{
											"wd": "lap dog"
										},
										{
											"wd": "yes-man"
										}
									]
								]
							}
						]
					],
					[
						[
							"sense",
							{
								"sn": "3",
								"dt": [
									[
										"text",
										"one who is easily deceived or cheated "
									],
									[
										"vis",
										[
											{
												"t": "you're just a pathetic {it}tool{/it} of the advertising industry if you believe everything you see in TV commercials"
											}
										]
									]
								],
								"syn_list": [
									[
										{
											"wd": "chump"
										},
										{
											"wd": "dupe"
										},
										{
											"wd": "gull"
										},
										{
											"wd": "mug",
											"wsls": [
												"chiefly British"
											]
										},
										{
											"wd": "patsy"
										},
										{
											"wd": "pigeon"
										},
										{
											"wd": "pushover"
										},
										{
											"wd": "sap"
										},
										{
											"wd": "soft touch"
										},
										{
											"wd": "sucker"
										}
									]
								],
								"rel_list": [
									[
										{
											"wd": "cat's-paw"
										},
										{
											"wd": "mark"
										},
										{
											"wd": "target"
										},
										{
											"wd": "victim"
										}
									],
									[
										{
											"wd": "schlemiel",
											"wvrs": [
												{
													"wvl": "also",
													"wva": "shlemiel"
												}
											]
										}
									],
									[
										{
											"wd": "butt"
										},
										{
											"wd": "derision"
										},
										{
											"wd": "laughingstock"
										},
										{
											"wd": "mock"
										},
										{
											"wd": "mockery"
										}
									],
									[
										{
											"wd": "booby"
										},
										{
											"wd": "dodo"
										},
										{
											"wd": "fool"
										},
										{
											"wd": "goose"
										},
										{
											"wd": "half-wit"
										},
										{
											"wd": "jackass"
										},
										{
											"wd": "lunatic"
										},
										{
											"wd": "monkey"
										},
										{
											"wd": "nincompoop"
										},
										{
											"wd": "ninny"
										},
										{
											"wd": "nitwit"
										},
										{
											"wd": "simp"
										},
										{
											"wd": "simpleton"
										},
										{
											"wd": "turkey"
										},
										{
											"wd": "yo-yo"
										}
									],
									[
										{
											"wd": "loser"
										}
									],
									[
										{
											"wd": "blockhead"
										},
										{
											"wd": "dolt"
										},
										{
											"wd": "dope"
										},
										{
											"wd": "dumbbell"
										},
										{
											"wd": "dummy"
										},
										{
											"wd": "dunce"
										},
										{
											"wd": "idiot"
										},
										{
											"wd": "imbecile"
										},
										{
											"wd": "moron"
										},
										{
											"wd": "schlub",
											"wvrs": [
												{
													"wvl": "also",
													"wva": "shlub"
												}
											],
											"wsls": [
												"slang"
											]
										},
										{
											"wd": "schlump",
											"wsls": [
												"slang"
											]
										},
										{
											"wd": "schnook",
											"wsls": [
												"slang"
											]
										}
									]
								],
								"near_list": [
									[
										{
											"wd": "cheat"
										},
										{
											"wd": "cheater"
										},
										{
											"wd": "confidence man"
										},
										{
											"wd": "cozener"
										},
										{
											"wd": "defrauder"
										},
										{
											"wd": "dodger"
										},
										{
											"wd": "hoaxer"
										},
										{
											"wd": "shark"
										},
										{
											"wd": "sharper"
										},
										{
											"wd": "slicker"
										},
										{
											"wd": "swindler"
										},
										{
											"wd": "trickster"
										}
									]
								]
							}
						]
					]
				]
			}
		],
		"shortdef": [
			"an article intended for use in work",
			"one that is or can be used to further the purposes of another",
			"one who is easily deceived or cheated"
		]
	},
	{
		"meta": {
			"id": "tool",
			"uuid": "e9d598fe-1313-4047-93d1-a63a3d19450c",
			"src": "coll_thes",
			"section": "alpha",
			"target": {
				"tuuid": "ca972855-b4ba-47d8-aeed-f8f833453816",
				"tsrc": "collegiate"
			},
			"stems": [
				"tool",
				"tooled",
				"tooling",
				"tools"
			],
			"syns": [
				[
					"automobile",
					"drive",
					"motor"
				]
			],
			"ants": [],
			"offensive": false
		},
		"hwi": {
			"hw": "tool"
		},
		"fl": "verb",
		"def": [
			{
				"sseq": [
					[
						[
							"sense",
							{
								"dt": [
									[
										"text",
										"to travel by a motorized vehicle "
									],
									[
										"vis",
										[
											{
												"t": "I spent some time {it}tooling{/it} around town today"
											}
										]
									]
								],
								"syn_list": [
									[
										{
											"wd": "automobile"
										},
										{
											"wd": "drive"
										},
										{
											"wd": "motor"
										}
									]
								],
								"rel_list": [
									[
										{
											"wd": "roll"
										},
										{
											"wd": "wheel"
										}
									],
									[
										{
											"wd": "joyride"
										}
									],
									[
										{
											"wd": "chauffeur"
										},
										{
											"wd": "hack"
										},
										{
											"wd": "taxi"
										}
									],
									[
										{
											"wd": "ride"
										}
									],
									[
										{
											"wd": "drag"
										},
										{
											"wd": "race"
										}
									]
								]
							}
						]
					]
				]
			}
		],
		"shortdef": [
			"to travel by a motorized vehicle"
		]
	}
][
	{
		"word": "tools",
		"stems": [
			"tools"
		],
		"syns": [
			[
				"devices",
				"implements",
				"instruments",
				"utensils"
			],
			[
				"cat's-paws",
				"instruments",
				"lay figures",
				"pawns",
				"puppets"
			],
			[
				"chumps",
				"dupes",
				"gulls",
				"mugs",
				"patsies",
				"pigeons",
				"pushovers",
				"saps",
				"soft touches",
				"suckers"
			]
		],
		"ants": [],
		"shortdef": [
			"an article intended for use in work",
			"one that is or can be used to further the purposes of another",
			"one who is easily deceived or cheated"
		],
		"fl": "noun"
	},
	{
		"word": "tools",
		"stems": [
			"tools"
		],
		"syns": [
			[
				"automobiles",
				"drives",
				"motors"
			]
		],
		"ants": [],
		"shortdef": [
			"to travel by a motorized vehicle"
		],
		"fl": "verb"
	},
	{
		"word": "tools",
		"stems": [
			"tool",
			"tools"
		],
		"syns": [
			[
				"device",
				"implement",
				"instrument",
				"utensil"
			],
			[
				"cat's-paw",
				"instrument",
				"lay figure",
				"pawn",
				"puppet"
			],
			[
				"chump",
				"dupe",
				"gull",
				"mug",
				"patsy",
				"pigeon",
				"pushover",
				"sap",
				"soft touch",
				"sucker"
			]
		],
		"ants": [],
		"shortdef": [
			"an article intended for use in work",
			"one that is or can be used to further the purposes of another",
			"one who is easily deceived or cheated"
		],
		"fl": "noun"
	},
	{
		"word": "tools",
		"stems": [
			"tool",
			"tooled",
			"tooling",
			"tools"
		],
		"syns": [
			[
				"automobile",
				"drive",
				"motor"
			]
		],
		"ants": [],
		"shortdef": [
			"to travel by a motorized vehicle"
		],
		"fl": "verb"
	}
][
	{
		"word": "tools",
		"shortdef": "a handheld device that aids in accomplishing a task",
		"fl": "noun"
	},
	{
		"word": "tools",
		"shortdef": "drive, ride",
		"fl": "verb"
	},
	{
		"word": "tools",
		"shortdef": "a design (as on the binding of a book) made by tooling",
		"fl": "noun"
	},
	{
		"word": "tools",
		"shortdef": "a compact, portable device that has blades and extensions for many tools (such as knives, screwdrivers, pliers, scissors, openers, and saw blades) which can be folded into the handle",
		"fl": "noun"
	}
]module.exports = {
	randominteger: (min, max) => {
		return Math.floor( min + Math.random()*(max-min));
	},
	reifyWeightedArray: arr => {
		return arr.reduce( (acc, item, j) => {
			Array.prototype.push.apply(acc,[...Array(item[1]).keys()].reduce( (acc2,k) => { acc2.push(item[0]); return acc2 },[]) );
			return acc;
		}, []);
	},
	//Fisher-Yates (aka Knuth) Shuffle
	shufflearray: array => {
	  let currentIndex = array.length,  randomIndex;
	  // While there remain elements to shuffle...
	  while (currentIndex != 0) {
	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex--;
	    // And swap it with the current element.
	    [array[currentIndex], array[randomIndex]] = [
	      array[randomIndex], array[currentIndex]];
	  }
	  return array;
	},
	tweenParameters: (p1,p2,nsteps,t) => {
		let m = t/nsteps;
		let pt = Object.keys(p1).reduce( (ptacc,key) => {
			if(isNaN(p1[key])) {
				ptacc[key] = t>nsteps-3 ? [p1[key],p2[key]][Math.floor(Math.random() * 2)] : p1[key];
			}
			else {
				ptacc[key] = p1[key] + (p2[key] - p1[key])*m;
			}
			//console.log(`pt[${key}] = ${ptacc[key]}`);
			return ptacc;
		}, {});
		return pt;
	}
};
module.exports = {
	randominteger: (min, max) => {
		return Math.floor( min + Math.random()*(max-min));
	},
	reifyWeightedArray: arr => {
		return arr.reduce( (acc, item, j) => {
			Array.prototype.push.apply(acc,[...Array(item[1]).keys()].reduce( (acc2,k) => { acc2.push(item[0]); return acc2 },[]) );
			return acc;
		}, []);
	},
	//Fisher-Yates (aka Knuth) Shuffle
	shufflearray: array => {
	  let currentIndex = array.length,  randomIndex;
	  // While there remain elements to shuffle...
	  while (currentIndex != 0) {
	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex--;
	    // And swap it with the current element.
	    [array[currentIndex], array[randomIndex]] = [
	      array[randomIndex], array[currentIndex]];
	  }
	  return array;
	},
	tweenParameters: (p1,p2,nsteps,t) => {
		let m = t/nsteps;
		let pt = Object.keys(p1).reduce( (ptacc,key) => {
			if(isNaN(p1[key])) {
				ptacc[key] = t>nsteps-3 ? [p1[key],p2[key]][Math.floor(Math.random() * 2)] : p1[key];
			}
			else {
				ptacc[key] = p1[key] + (p2[key] - p1[key])*m;
			}
			//console.log(`pt[${key}] = ${ptacc[key]}`);
			return ptacc;
		}, {});
		return pt;
	}
};
module.exports = {
	randominteger: (min, max) => {
		return Math.floor( min + Math.random()*(max-min));
	},
	reifyWeightedArray: arr => {
		return arr.reduce( (acc, item, j) => {
			Array.prototype.push.apply(acc,[...Array(item[1]).keys()].reduce( (acc2,k) => { acc2.push(item[0]); return acc2 },[]) );
			return acc;
		}, []);
	},
	//Fisher-Yates (aka Knuth) Shuffle
	shufflearray: array => {
	  let currentIndex = array.length,  randomIndex;
	  // While there remain elements to shuffle...
	  while (currentIndex != 0) {
	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex--;
	    // And swap it with the current element.
	    [array[currentIndex], array[randomIndex]] = [
	      array[randomIndex], array[currentIndex]];
	  }
	  return array;
	}
};module.exports = {
	randominteger: (min, max) => {
		return Math.floor( min + Math.random()*(max-min));
	},
	reifyWeightedArray: arr => {
		return arr.reduce( (acc, item, j) => {
			Array.prototype.push.apply(acc,[...Array(item[1]).keys()].reduce( (acc2,k) => { acc2.push(item[0]); return acc2 },[]) );
			return acc;
		}, []);
	},
	//Fisher-Yates (aka Knuth) Shuffle
	shufflearray: array => {
	  let currentIndex = array.length,  randomIndex;
	  // While there remain elements to shuffle...
	  while (currentIndex != 0) {
	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex--;
	    // And swap it with the current element.
	    [array[currentIndex], array[randomIndex]] = [
	      array[randomIndex], array[currentIndex]];
	  }
	  return array;
	},
	tweenParameters: (p1,p2,nsteps,t) => {
		let m = t/nsteps;
		let pt = Object.keys(p1).reduce( (ptacc,key) => {
			if(isNaN(p1[key])) {
				ptacc[key] = t>nsteps-3 ? [p1[key],p2[key]][Math.floor(Math.random() * 2)] : p1[key];
			}
			else {
				ptacc[key] = p1[key] + (p2[key] - p1[key])*m;
			}
			//console.log(`pt[${key}] = ${ptacc[key]}`);
			return ptacc;
		}, {});
		return pt;
	}
};
module.exports = {
	randominteger: (min, max) => {
		return Math.floor( min + Math.random()*(max-min));
	},
	reifyWeightedArray: arr => {
		return arr.reduce( (acc, item, j) => {
			Array.prototype.push.apply(acc,[...Array(item[1]).keys()].reduce( (acc2,k) => { acc2.push(item[0]); return acc2 },[]) );
			return acc;
		}, []);
	},
	//Fisher-Yates (aka Knuth) Shuffle
	shufflearray: array => {
	  let currentIndex = array.length,  randomIndex;
	  // While there remain elements to shuffle...
	  while (currentIndex != 0) {
	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex--;
	    // And swap it with the current element.
	    [array[currentIndex], array[randomIndex]] = [
	      array[randomIndex], array[currentIndex]];
	  }
	  return array;
	},
	tweenParameters: (p1,p2,nsteps,t) => {
		let m = t/nsteps;
		let pt = Object.keys(p1).reduce( (ptacc,key) => {
			if(isNaN(p1[key])) {
				ptacc[key] = t>nsteps-3 ? [p1[key],p2[key]][Math.floor(Math.random() * 2)] : p1[key];
			}
			else {
				ptacc[key] = p1[key] + (p2[key] - p1[key])*m;
			}
			//console.log(`pt[${key}] = ${ptacc[key]}`);
			return ptacc;
		}, {});
		return pt;
	}
};
let createtools = z => {
	return {
		randominteger: (min, max) => {
			return Math.floor( min + Math.random()*(max-min));
		},
		normalrandominteger: (min, max, n) => { // CLT
			return n === 0 ? z.tools.randominteger(min,max) : Math.floor(Array.from(Array(n).keys()).reduce( (sum, j) => { return sum + z.tools.randominteger(min,max) }, 0) / n)
		},
		clearDOMelement: (el) => {
			el.innerHTML = "";
		},
		telegraph: (el, msg) => {
			if(el) {
				try { el.innerHTML =  msg; z.tools.logmsg("... " + msg);}
				catch(err) { z.tools.logerror(err) }
			}
			else {
				z.tools.logmsg(" || ... " + msg);
			}
		},
		logmsg: function(msg) {
			try { 
				// console.log("### ::: " + msg); 
			}
			catch(err) { z.tools.logerror(err) }
		},
		logerror: function(error) {
			try { console.log("rusty error ... " + error); }
			catch(err) {}
		},
		randomhighharmonic: () => {
			let multipliers = [10.0, 12.5, 13.33, 15, 20];
			return multipliers[ z.tools.randominteger( 0, multipliers.length) ];
		},
		randomharmonic: () => {
			let multipliers = [5, 7.5, 10.0, 12.5, 13.33, 15, 20];
			return multipliers[ z.tools.randominteger( 0, multipliers.length) ];
		},
		randomlowharmonic: () => {
			let multipliers = [5, 7.5, 10.0, 12.5, 13.33, 15, 20];
			return multipliers[ z.tools.randominteger( 0, multipliers.length) ]/2;
		},
		randomkey: (object) => {
			let keys = Object.keys(object);
			let key = keys[z.tools.randominteger(0,keys.length)];
			// z.tools.logmsg("key = " + key);
			return key;
		},
		togrid: (min=1, max=1, x=1, ndivisions=1) => {
			let dx = Math.floor( (max-min) / ndivisions );
			return Math.floor( ( x-min+dx/2)/dx )*dx + min;
		},
		getrandomblanks: (ndrawings, nshapes) => {
			let blanks = [[0],[0,1]];
			for(let d=1; d<ndrawings+1; ++d) {
				let blank = []
				for(let s=0; s<d*nshapes; ++s) {
					blank.push(s);
				}
				blanks.push(blank);
			}
			return blanks[ z.tools.randominteger(0,ndrawings+2) ];
		},
		shuffle: (array) => {
			copy = array.slice();
			for (var i = copy.length - 1; i > 0; i--) {
				var j = Math.floor(Math.random() * (i + 1));
				var temp = copy[i];
				copy[i] = copy[j];
				copy[j] = temp;
			}
			return copy;
		},
		logstreams: streams => {
			Object.keys(streams).filter( key => {return key !== "clock"}).forEach( key => {
				z.tools.logmsg("key " + key );
				streams[key].onValue( e => { z.tools.logmsg("onvalue ::: " + key + ": " + JSON.stringify(e)) });
			});
		},
		datestr: function(date, options) {
			if(options===undefined) options = {year: "numeric", month: "2-digit", day: "numeric", hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit"};
			return date.toLocaleTimeString("en-US", options);
		},
		applyCSS: function(el, css, j, n) {
			var j = j || 0, n = n || 1;
			for (var key in css) {
				if (css.hasOwnProperty(key)) {
					if(typeof css[key] === "function") el.style[ key ] = css[key](j, n);
					else el.style[ key ] = css[key];
				}
			}
		},
	}
};module.exports = {
	randominteger: (min, max) => {
		return Math.floor( min + Math.random()*(max-min));
	},
	reifyWeightedArray: arr => {
		return arr.reduce( (acc, item, j) => {
			Array.prototype.push.apply(acc,[...Array(item[1]).keys()].reduce( (acc2,k) => { acc2.push(item[0]); return acc2 },[]) );
			return acc;
		}, []);
	},
	//Fisher-Yates (aka Knuth) Shuffle
	shufflearray: array => {
	  let currentIndex = array.length,  randomIndex;
	  // While there remain elements to shuffle...
	  while (currentIndex != 0) {
	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex--;
	    // And swap it with the current element.
	    [array[currentIndex], array[randomIndex]] = [
	      array[randomIndex], array[currentIndex]];
	  }
	  return array;
	}
};module.exports = {
	randominteger: (min, max) => {
		return Math.floor( min + Math.random()*(max-min));
	},
	reifyWeightedArray: arr => {
		return arr.reduce( (acc, item, j) => {
			Array.prototype.push.apply(acc,[...Array(item[1]).keys()].reduce( (acc2,k) => { acc2.push(item[0]); return acc2 },[]) );
			return acc;
		}, []);
	},
	//Fisher-Yates (aka Knuth) Shuffle
	shufflearray: array => {
	  let currentIndex = array.length,  randomIndex;
	  // While there remain elements to shuffle...
	  while (currentIndex != 0) {
	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex--;
	    // And swap it with the current element.
	    [array[currentIndex], array[randomIndex]] = [
	      array[randomIndex], array[currentIndex]];
	  }
	  return array;
	}
};module.exports = {
	randominteger: (min, max) => {
		return Math.floor( min + Math.random()*(max-min));
	},
	reifyWeightedArray: arr => {
		return arr.reduce( (acc, item, j) => {
			Array.prototype.push.apply(acc,[...Array(item[1]).keys()].reduce( (acc2,k) => { acc2.push(item[0]); return acc2 },[]) );
			return acc;
		}, []);
	}
};module.exports = {
	randominteger: (min, max) => {
		return Math.floor( min + Math.random()*(max-min));
	},
	reifyWeightedArray: arr => {
		return arr.reduce( (acc, item, j) => {
			Array.prototype.push.apply(acc,[...Array(item[1]).keys()].reduce( (acc2,k) => { acc2.push(item[0]); return acc2 },[]) );
			return acc;
		}, []);
	},
	//Fisher-Yates (aka Knuth) Shuffle
	shufflearray: array => {
	  let currentIndex = array.length,  randomIndex;
	  // While there remain elements to shuffle...
	  while (currentIndex != 0) {
	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex--;
	    // And swap it with the current element.
	    [array[currentIndex], array[randomIndex]] = [
	      array[randomIndex], array[currentIndex]];
	  }
	  return array;
	},
	tweenParameters: (p1,p2,nsteps,t) => {
		let m = t/nsteps;
		let pt = Object.keys(p1).reduce( (ptacc,key) => {
			if(isNaN(p1[key])) {
				ptacc[key] = t>nsteps-3 ? [p1[key],p2[key]][Math.floor(Math.random() * 2)] : p1[key];
			}
			else {
				ptacc[key] = p1[key] + (p2[key] - p1[key])*m;
			}
			//console.log(`pt[${key}] = ${ptacc[key]}`);
			return ptacc;
		}, {});
		return pt;
	}
};
module.exports = {
	randominteger: (min, max) => {
		return Math.floor( min + Math.random()*(max-min));
	},
	reifyWeightedArray: arr => {
		return arr.reduce( (acc, item, j) => {
			Array.prototype.push.apply(acc,[...Array(item[1]).keys()].reduce( (acc2,k) => { acc2.push(item[0]); return acc2 },[]) );
			return acc;
		}, []);
	}
};