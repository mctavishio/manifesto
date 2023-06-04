module.exports = {
	logmsg: msg => {
		try { 
			// console.log("### ::: " + msg); 
		}
		catch(err) { z.tools.logerror(err) }
	},
	logerror: error => {
		try { console.log("rusty error ... " + error); }
		catch(err) {}
	},
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
	},
	//https://github.com/freder/bezier-spline
	interpolatePath: pts => {
	},
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
	flatten: (arr) => {
		return arr.reduce(function (flat, item) {
			return flat.concat(Array.isArray(item) ? z.tools.flatten(item) : item);
		}, []);
	},
	createElementStr: ({tag="div", attributes=[], cssclasses=[], cssstyles=[], ns="none"}) => {
		let el=`<${tag} `;
		if(ns!=="none") {
			el = el + `xmlns="${ns}" `;
		}
		attributes.forEach( entry => {
			el = el + `${entry[0]}="${entry[1]}" `;
		});
		if(cssstyles.length>0) {
			el = el + `style="`;
			cssstyles.forEach( entry => {
				el = el + `${entry[0]}:${entry[1]};`;
			});
			el = el + `" `;
		}
		if(cssclasses.length>0) {
			el = el + `class="`;
			cssclasses.forEach( entry => {
				el = el + `${entry} `;
			});
			el = el + `" `;
		}
		tools.logmsg(`element created: ${el}`);
		return el;
	},
	createElement: ({parentel=document.querySelector("body"), tag="div", attributes=[], cssclasses=[], cssstyles=[], ns="none"}) => {
		let el;
		if(ns!=="none") {
			el = document.createElementNS(ns, tag);
			attributes.forEach( entry => {
				el.setAttributeNS(null, entry[0], entry[1]);
			});
		}
		else {
			el = document.createElement(tag);
			attributes.forEach( entry => {
				el.setAttribute(entry[0], entry[1]);
			});
		}
		cssstyles.forEach( entry => {
			z.tools.logmsg("entry = " + entry)
			el.style[entry[0]] = entry[1];
		});
		cssclasses.forEach( entry => {
			el.classList.add(entry);
		});
		parentel.appendChild(el);
		return el;
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
	curves: {
		init:  () => {
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
	},
};
