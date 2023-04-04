let getz = () => {
	let width = window.innerWidth, height = window.innerHeight;
	let min = Math.min(width, height), max = Math.max(width, height);
	let version = (min < 680 || max < 980) ? "small" : "large";
	let v = version === "small" ? 0 : 1;
	let z = { 
		dimensions: {
			width, height, version, v
		},
		highcontrast: false,
		texthidden: false,
	};
	z.tools = {
		randominteger: (min, max) => {
			return Math.floor( min + Math.random()*(max-min));
		},
		logmsg: function(msg) {
			try { 
				console.log("### ::: " + msg); 
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
		datestr: (date, options) => {
			if(options===undefined) options = {year: "numeric", month: "2-digit", day: "numeric", hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit"};
			return date.toLocaleTimeString("en-US", options);
			//new Date().toLocaleTimeString("en-US", {year: "numeric", month: "2-digit", day: "numeric", hour12: true, hour: "2-digit", minute: "2-digit", second: "2-digit"});
		},
		togrid: (min=1, max=1, x=1, ndivisions=1) => {
			let dx = Math.floor( (max-min) / ndivisions );
			return Math.floor( ( x-min+dx/2)/dx )*dx + min;
		},
		flatten: (arr) => {
			return arr.reduce(function (flat, item) {
				return flat.concat(Array.isArray(item) ? z.tools.flatten(item) : item);
			}, []);
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
		hexToRGB: h => {
			let r = 0, g = 0, b = 0;
			// 3 digits
			if (h.length == 4) {
				r = "0x" + h[1] + h[1];
				g = "0x" + h[2] + h[2];
				b = "0x" + h[3] + h[3];
			// 6 digits
			} else if (h.length == 7) {
				r = "0x" + h[1] + h[2];
				g = "0x" + h[3] + h[4];
				b = "0x" + h[5] + h[6];
			}
			return {r:+r,g:+g,b:+b};
		},
		RGBToHSLA: ({r,g,b,a=1}={}) => {
			// Make r, g, and b fractions of 1
			r /= 255;
			g /= 255;
			b /= 255;

			// Find greatest and smallest channel values
			let cmin = Math.min(r,g,b),
			cmax = Math.max(r,g,b),
			delta = cmax - cmin,
			h = 0,
			s = 0,
			l = 0;

			if (delta == 0)
			h = 0;
			// Red is max
			else if (cmax == r)
			h = ((g - b) / delta) % 6;
			// Green is max
			else if (cmax == g)
			h = (b - r) / delta + 2;
			// Blue is max
			else
			h = (r - g) / delta + 4;

			h = Math.round(h * 60);

			// Make negative hues positive behind 360°
			if (h < 0) h += 360;

			// Calculate lightness
			l = (cmax + cmin) / 2;

			// Calculate saturation
			s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

			// Multiply l and s by 100
			s = +(s * 100).toFixed(1);
			l = +(l * 100).toFixed(1);
			//return "hsl(" + h + "," + s + "%," + l + "%)";
			// return "hsla(" + h + "," + s + "%," +l + "%," + a + ")";
			return {h:h, s:s, l:l, a:a}
		}
	};
	z.data = {
		colors: {
			sets: {
				warmbw: ["#fcfbe3", "#191918"],
				warmbwred: ["#9a0000", "#fcfbe3", "#191918"],
				warmbw: ["#fcfbe3", "#191918"],
				warmbwyellow: ["#ffcc00", "#fcfbe3", "#191918"],
				warmbw: ["#fcfbe3", "#191918"],
				warmbwbluegray: ["#006699", "#fcfbe3", "#191918", "#4b4b44"],
				warmbwbluesgray: ["#006699", "#fcfbe3", "#191918", "#004488"],
				warmbwblue: ["#006699", "#fcfbe3", "#191918"],
				warmbwbluegreen: ["#006699", "#006666", "#fcfbe3", "#191918"],
			},
			oldplaylists: {
				industryseed: [ ['#fcfbe3','#000000','#ffcc00','#9a0000'] ],
				industry: [ ['#fcfbe3','#000000','#ffcc00','#9a0000'],['#fcfbe3','#000000','#9a0000'],['#fcfbe3','#000000','#ffcc00'],['#fcfbe3','#000000'],['#fcfbe3','#000000','#ffcc00'],['#fcfbe3','#000000','#9a0000'],['#fcfbe3','#000000'] ],
				industrygrayseed: [ ['#fcfbe3','#000000','#ffcc00','#9a0000', '#444444'] ],
				industrygray: [ ['#fcfbe3','#000000','#ffcc00','#9a0000'],['#fcfbe3','#000000'],['#fcfbe3','#000000'], ['#fcfbe3','#000000','#9a0000'], ['000000', '#fcfbe3','#444444'], ['#fcfbe3','#000000'], ['#fcfbe3','#000000','#ffcc00'], ['#fcfbe3','#000000','#9a0000'],['#fcfbe3','#000000'] ],
				rbwg: [ ['#fcfbe3','#000000','#9a0000'],['#fcfbe3','#000000'], ['#fcfbe3','#000000','#9a0000'], ['#fcfbe3','#000000'], ['#fcfbe3','#000000','#9a0000','#444444'], ['#fcfbe3','#000000','#444444'], ['#fcfbe3','#000000','#9a0000'], ['#fcfbe3','#000000']],
				rbw: [ ['#fcfbe3','#000000','#9a0000'],['#fcfbe3','#000000'], ['#fcfbe3','#000000','#9a0000'], ['#fcfbe3','#000000'], ['#fcfbe3','#000000','#444444'] ],
				ybw: [ ['#fcfbe3','#000000','#ffcc00'],['#fcfbe3','#000000'], ['#fcfbe3','#000000','#ffcc00'], ['#fcfbe3','#000000'], ['#fcfbe3','#000000','#444444'] ],
				bwseed: [ ['#fcfbe3', '#000000'] ],
				bw: [ ['#fcfbe3', '#000000'], ['#fcfbe3', '#000000', '#fcfbe3', '#000000'], ['#fcfbe3', '#000000', '#000000'], ['#fcfbe3', '#000000', '#fcfbe3'] ],
				bwg: [ ['#fcfbe3', '#000000'], ['#fcfbe3', '#000000', '#fcfbe3', '#000000'], ['#fcfbe3','#000000','#444444'] ],
				blueyellow: [["#fedd00", '#006699', "#fcfbe3", "#000000"]],
				lightsseed: [ ['#aaaaaa','#c7c6bf','#e3e2d7','#ffffff'] ], //http://gka.github.io/palettes/#colors=#fcfbe3,#ffffff|steps=4|bez=1|coL=1
				lights: [ ['#aaaaaa','#c7c6bf','#e3e2d7','#ffffff'], ['#aaaaaa','#c7c6bf','#e3e2d7','#ffffff'], ['#aaaaaa','#c7c6bf','#ffffff'], ['#aaaaaa','#c7c6bf','#e3e2d7'] ],
				bluesseed: [ ['#006699','#0a7293','#0a7c8e','#008888'] ],
				blues: [ ['#006699','#0a7293','#0a7c8e','#008888'], ['#006699','#0a7293','#0a7c8e','#008888'], ['#006699','#0a7293','#008888'], ['#006699','#0a7293','#0a7c8e'] ],
				yellowsseed: [ ['#fcfbe3','#ffeba9','#ffdc6e','#ffcc00'] ],
				yellows: [ ['#fcfbe3','#ffeba9','#ffdc6e','#ffcc00'], ['#fcfbe3','#ffeba9','#ffdc6e','#ffcc00'], ['#fcfbe3','#ffeba9','#ffcc00'], ['#fcfbe3','#ffeba9','#ffdc6e'] ],
				darksseed: [ ['#686860','#464540','#252523','#000000'] ],
				darks:  [ ['#686860','#464540','#252523','#000000'], ['#686860','#464540','#252523','#000000'], ['#686860','#000000','#252523','#000000'], ['#686860','#464540', '#686860','#000000'] ],
				circusblues: [ ["#2B4C6F", "#4A6A8A", "#183d68", "#07325f", "#004866"] ],
				circusgreens: [ ["#267158", "#448870", "#126d4f", "#006644"] ],
				circusoranges: [ ["#E64A19", "#FF5722", "#ff6600", "#ffcc00", "#ff8000", "#e64d00"] ],
				circusblacks: [ ["#212121", "#727272"] ],
				circuswhites: [ ["fffffa", "#B6B6B6"] ],
				circus: [ ["#9a0000", "#de4400", "#ffcc00",  "#4682B4", "#008848",  "#004888", "#006699", '#fcfbe3','#000000',], ["#9a0000",  "#ffcc00",  "#006699"] ],
			},
			pigments: {
				black: "#191918",
				white: "#fcfbe3",
				blue: "#006699",
				red: "#9a0000",
				yellow: "#ffcc00",
				gray: "#484848",
			}
		},
		sound: {
			basetrackurl: "https://storage.googleapis.com/www.blueboatfilms.com/sound/",
			// basetrackurl: "http://www.blueboatfilms.com/sound/",
			baseclipurl: "data/sound/",
			allclips: ["128_c.mp3","144_d.mp3","192_g.mp3","288_d.mp3","384_g.mp3","432_a.mp3","64_c.mp3","accordion.mp3","bagpipe1.mp3","bagpipe1a.mp3","bagpipe1e.mp3","bagpipe1f.mp3","bagpipe1g.mp3","bagpipe1h.mp3","bagpipegeese.mp3","bagpiperadio.mp3","bell11.mp3","bell13.mp3","bell2.mp3","bell6.mp3","bell9.mp3","bird0.mp3","bird1.mp3","bird2.mp3","bird3.mp3", "birdcanyon.mp3","birdcry.mp3","birdcry4.mp3","birds4.mp3","birds5.mp3","birds6.mp3","birdtheme.mp3","cello_pitch1.mp3","cello_pitch2.mp3","cello_pitch3.mp3","cello_pitch4.mp3","cello_pitch5.mp3","cellohighthunk.mp3","celloknock0.mp3","celloknockcanyon.mp3","cellothunk.mp3","cellothunkcanyon.mp3","cellothunkradio.mp3","cellothunktelephone.mp3","cistern.mp3","cisterncello.mp3","clapping0.mp3","clarinet1.mp3","clarinet2.mp3","clarinetjazz0b.mp3","clarinetnotes_a.mp3","clarinetnotes_b.mp3","clarinetnotes_c.mp3","clarinetnotes_d.mp3","clarinetnotes_e.mp3","clarinetnotes_f.mp3","clarinetnotes_g.mp3","clarinetnotes_h.mp3","clarinetnotes_i.mp3","cmpb20200708_3.mp3","cmpb20200708_4.mp3","cmpb20200708_5.mp3","coffepot1eminor.mp3","cowbell.mp3","crow1.mp3","fan1.mp3","homing20201221_1pluck1.mp3","homing20201221_1thunk.mp3","icebowedcymbal2.mp3","icebowedvibes1.mp3","kantela1.mp3","kantela2.mp3","kantele3.mp3","knocking1.mp3","knocking2.mp3","longbell.mp3","lookingforyou0.mp3","magsSessionClips_1.mp3","magsSessionClips_2a.mp3","magsSessionClips_2b.mp3","magsSessionClips_3b.mp3","magsSessionClips_4b.mp3","magsSessionClips_5b.mp3","mctbreathing0.mp3","mctvox1b.mp3","mctvox1c.mp3","meow2.mp3","monksfromouterspacecistern_a.mp3","monksfromouterspacecistern_b.mp3","monksfromouterspacecistern_c.mp3","monksfromouterspacecistern_d.mp3","monksfromouterspacecistern_e.mp3","monksfromouterspacecistern_f.mp3","monksfromouterspacecistern_g.mp3","monksfromouterspacecistern_h.mp3","monksfromouterspacecistern_i.mp3","monksfromouterspacecistern_j.mp3","noise1.mp3","numberstation0.mp3","numberstation0b.mp3","piano1.mp3","piano3a.mp3","piano3b.mp3","rider1_a.mp3","rider1_b.mp3","rubbedpianoharp0.mp3","scraping1.mp3","sheila.mp3","sheila1.mp3","silobirds.mp3","stapler.mp3","starfallremix.mp3","strangebells.mp3","submarineecho.mp3","surf.mp3","surf2.mp3","t0.mp3","therider0_a.mp3","therider0_b.mp3","therider0_c.mp3","therider0_d.mp3","therider0_e.mp3","therider0b_a.mp3","therider0b_b.mp3","therider0b_c.mp3","therider0b_d.mp3","therider0b_e.mp3","therider0b_f.mp3","therider0b_g.mp3","thunk.mp3","tone64hz_clip.mp3","tornadosiren.mp3","traffickcorebirds1_a.mp3","traffickcorebirds1_b.mp3","traffickcorebirds1_c.mp3","train1.mp3","typewriter1.mp3","typewriterlong.mp3","typewriterlongcistern.mp3","vox20200118_8_3b.mp3","vox20200124_itwas.mp3","voxmct0.mp3","weatherradio1.mp3"],
			tracks: {
				lovemeditations: {title: "love meditations", url: "lovemeditationspodcast.mp3", duration: 3980 }, //1:06:24
				rivericarus: {title: "river icarus", url: "rivericaruspodcast.mp3", duration: 2110}, //35:13
				monksfromouterspace: {title: "monks from outer space", url: "monks.mp3", duration: 6*60+22}, //6:22
				monksfromouterspacecistern: {title: "monks from outer space ::: cistern", url: "monksfromouterspacecistern.mp3", duration: 6*60+25},
				
				oceanwindgrief: {title: "ocean | wind | grief", url: "oceanwindgriefpodcast.mp3", duration: 1870},//31:18
				nyx: {title: "nyx", url: "oceanwindgriefpodcast.mp3", duration: 1280},//21:26
				nighttrainbluewindow: {title: "night train / blue window", url: "nighttrainbluewindow/nighttrainbluewindowpodcast.mp3", duration: 2280}, //38:06
				originofbirds: {title: "origin of birds", url: "originofbirdssound20140330.mp3", duration: 1360},//22:50
				originofbirdslowthread: {title: "origin of birds ::: low thread", url: "20140304originofbirds_lowthread.mp3", duration: 15*60+5},//22:50
				originofbirdsskythread: {title: "origin of birds ::: sky thread", url: "20140304originofbirds_skythread.mp3", duration: 9*60+25},//22:50
				millcityrequiem: {title: "mill city requiem", url: "20150503millcityrequiem.mp3", duration: 33*60+3},//
				ahabsdream: {title: "ahab's dream", url: "ahabsdreampodcast.mp3", duration: 1220},//20:24
				birdland: {title: "birdland", url: "birdlandpodcast.mp3", duration: 3780},//1:03:05
				holyfool: {title: "holy fool", url: "holyfoolpodcast.mp3", duration: 1720},//28:43
				horsespeakstosky: {title: "horse speaks to sky", url: "horsespeakssky.mp3", duration: 420},//7:08
				roadtowillistonsoundthread1: {title: "road to williston sound thread #1", url: "traffick20141208_all_v6.mp3", duration:1170}, //19:35
				rainclouds: {title: "rain clouds", url: "dronespace7.mp3", duration:360}, //6:03
				thesoundofeverydayobjects: {title: "the sound of everyday objects", url: "thesoundofeverydayobjectspodcast.mp3", duration: 2380},//39:42
				between2desertstheswan: {title: "between2deserts / two - the swan", url: "theswanpodcast.mp3", duration:2970}, //49:33
				nyxtrack3: {title: "nyx ::: track #3", url: "nyx3.mp3", duration:200}, //3:20
				cistern5: {title: "cistern #5", url: "cistern20140630_5_cistern.mp3", duration:1790}, //29:51
				clarinetall: {title: "clarinetall", url: "clarinetall.mp3", duration:3*60+33}, 
				clarinetnotes: {title: "clarinetnotes", url: "clarinetnotes.mp3", duration:2*60+32}, 
				echolightning: {title: "echo & lightning", url: "echolightningpodcast.mp3", duration:2050}, //34:12
				// sophroniasoundscape 
				sophroniasoundscape: {title: "sophronia soundscape", url: "sophroniasoundscape.mp3", duration: 29*60+6},//
				graffititunnel: {title: "graffiti tunnel", url: "graffititunnelpodcast.mp3", duration: 1720},//45:12
				graffiti2hands: {title: "graffiti 2 hands", url: "graffiti2handspodcast.mp3", duration: 3780},//1:03:13
				northernspark20170603_final: {title: "northern spark 2017", url: "northernspark20170603_final.mp3", duration: 1100}, //18:29
				homing20201220_graffiti1: {title: "homing 2020.12.20 graffiti 1", url: "homing20201220_graffiti1.mp3", duration: 12*60+15}, //12:15
				homing20201220_0: {title: "homing 2020.12.20 0", url: "homing20201220_0.mp3", duration: 11*60+58}, //11:58
				northsea11: {title: "north sea 11", url: "northsea11.mp3", duration: 2*60+43}, //2 handed tender harmonic
				northsea13: {title: "north sea 13", url: "northsea13.mp3", duration: 2*60+6}, //2 handed tender
				northsea14: {title: "north sea 14", url: "northsea14.mp3", duration: 2*60+3}, //dolphin boat
				northsea15: {title: "north sea 15", url: "northsea15.mp3", duration: 2*60+16}, //boat
				northsea16: {title: "north sea 16", url: "northsea16.mp3", duration: 1*60+2}, //low sawing bow
				northsea19: {title: "north sea 19", url: "northsea19.mp3", duration: 0*60+40}, //below the bridge
				northsea20: {title: "north sea 20", url: "northsea20.mp3", duration: 0*60+58}, //low
				northsea22: {title: "north sea 22", url: "northsea22.mp3", duration: 1*60+57}, //1:57
				northsea23: {title: "north sea 23", url: "northsea23.mp3", duration: 1*60+54}, //1:54 ::: from wild geese echo lightning
				northsea24: {title: "north sea 24", url: "northsea24.mp3", duration: 2*60+6}, //2:06 ::: from wild geese echo lightning
				northsea25: {title: "north sea 25", url: "northsea25.mp3", duration: 3*60+45}, // ::: from echo lightning
				northsea26: {title: "north sea 26", url: "northsea26.mp3", duration: 3*60+48}, // ::: from echo lightning
				northsea27: {title: "north sea 27", url: "northsea27.mp3", duration: 2*60+25}, // ::: from echo lightning : low 
				northsea28: {title: "north sea 28", url: "northsea28.mp3", duration: 3*60+8}, // ::: from echo lightning : low
				northsea29: {title: "north sea 29", url: "northsea29.mp3", duration: 3*60+10}, // ::: from echo lightning : low tender
				road1: {title: "road1", url: "road1.mp3", duration: 0*60+24}, // ::: 
				road20140831_1_pingpongdepot: {title: "road20140831_1_pingpongdepot", url: "road20140831_1_pingpongdepot.mp3", duration: 3*60+14}, // ::: 
				road20141103_2: {title: "road20141103_2", url: "road20141103_2.mp3", duration: 9*60+1}, // ::: 
				roadTones_1min: {title: "roadTones_1min", url: "roadTones_1min.mp3", duration: 1*60+26}, // ::: 
				lowRoadLong: {title: "lowRoadLong", url: "lowRoadLong.mp3", duration: 3*60+42}, // ::: train bell elevator from traffick
				lowandtrain: {title: "train cistern", url: "20141208_1_lowandtrain.mp3", duration: 3*60+42}, // ::: train cistern voices
				klikt_rockscissorsblade: {title: "klikt_rockscissorsblade", url: "klikt_rockscissorsblade.mp3", duration: 3*60+13}, // ::: with iron bird sharpening sound sort of chaotic
				kanteledreams: {title: "kantele dreams", url: "kanteledreams.mp3", duration: 2*60+31}, // ::: with cello ... slidey
				holeinthesky: {title: "hole in the sky ::: crying machine", url: "holeinthesky.mp3", duration: 7*60+58}, // ::: tuning fork hymn ::: from vertov growly
				holeintheskyall20140504sound: {title: "hole in the sky ::: score surround", url: "holeintheskyall20140504sound.mp3", duration: 1*60*60+60*60+38}, // ::: minimalist bg
				holeinthesky20140919: {title: "hole in the sky ::: draft", url: "holeinthesky20140919.mp3", duration: 53*60+13}, // ::: minimalist more active bg
				soundscape20140501_1: {title: "hole in the sky ::: draft", url: "soundscape20140501_1.mp3", duration: 53*60+10}, // ::: minimalist more active bg
				trains20141218_v2: {title: "trains20141218_v2", url: "radio.mp3", duration: 18*60+17}, // ::: trains cello tuning ping ong
				trains20141219: {title: "trains20141219", url: "trains20141219.mp3", duration: 22*60+27}, // ::: trains cello 
				tuningforkhYmn2: {title: "tuningforkhYmn2", url: "tuningforkhYmn2.mp3", duration: 7*60+25}, // ::: 
				tuningforkhYmn3: {title: "tuningforkhYmn3", url: "20100603tuningforkhYmn_v3.mp3", duration: 10*60+10}, // ::: with coffeepot
				tuning: {title: "tuning", url: "tuning.mp3", duration: 3*60+43}, // ::: subtle tuning
				coffeepot: {title: "coffepot", url: "20140203_1_coffeepot.mp3", duration: 4*60+50}, // ::: subtle tuning
				bellslong: {title: "bellslong", url: "bellslong.mp3", duration: 2*60+29}, // ::: 
				bellslong1b: {title: "bellslong1b", url: "bellslong1b.mp3", duration: 2*60+29}, // ::: 
				bellslong1c: {title: "bellslong1c", url: "bellslong1c.mp3", duration: 2*60+32}, // ::: 
				
				pitchclasses_1_a_cistern: {title: "pitchclasses_1_a_cistern", url: "20150313_pitchclasses_1_a_cistern.mp3", duration: 2*60+44}, // ::: 
				pitchclasses_1_c_cistern: {title: "pitchclasses_1_c_cistern", url: "20150313_pitchclasses_1_c_cistern.mp3", duration: 2*60+55}, // ::: 
				pitchclasses_1_d_cistern: {title: "pitchclasses_1_d_cistern", url: "20150313_pitchclasses_1_d_cistern.mp3", duration: 6*60+3}, // ::: 
				pitchclasses_1_g_cistern: {title: "pitchclasses_1_g_cistern", url: "20150313_pitchclasses_1_g_cistern.mp3", duration: 4*60+32}, // ::: 
				I: {title: "I", url: "I.mp3", duration: 4*60+15}, // ::: * accordian file?
				II: {title: "II", url: "II.mp3", duration: 5*60+41}, // ::: strange ... not great accordian file?
				III: {title: "III", url: "III.mp3", duration: 2*60+38}, // ::: strange accordian file?
				V: {title: "V", url: "V.mp3", duration: 4*60+14}, // ::: *strange accordian file?
				VII: {title: "VII", url: "VII.mp3", duration: 2*60+53}, // *::: strange accordian file?
				IIIaIIfIcsharp: {title: "IIIaIIfIcsharp", url: "IIIaIIfIcsharp.mp3", duration: 0*60+23}, // ::: melodic
				IIIaIIfIcsharp3: {title: "IIIaIIfIcsharp3", url: "IIIaIIfIcsharp3.mp3", duration: 0*60+20}, // ::: melodic
				IIIaflatIIdIIIeflat1: {title: "IIIaflatIIdIIIeflat1", url: "IIIaflatIIdIIIeflat1.mp3", duration: 0*60+18}, // ::: melodic
				IIIaflatIIdIIIeflat2: {title: "IIIaflatIIdIIIeflat2", url: "IIIaflatIIdIIIeflat2.mp3", duration: 0*60+21}, // ::: melodic
				IIIcd: {title: "IIIcd", url: "IIIcd.mp3", duration: 0*60+11}, // ::: melodic (cut off end)
				IIIdfd2: {title: "IIIdfd2", url: "IIIdfd2.mp3", duration: 0*60+14}, // ::: melodic (cut off end)
				IIIdfd3: {title: "IIIdfd3", url: "IIIdfd3.mp3", duration: 0*60+22}, // ::: melodic (cut off end)
				IIIgharmonicandopen: {title: "IIIgharmonicandopen", url: "IIIgharmonicandopen.mp3", duration: 0*60+42}, // ::: 
				IIbflata: {title: "IIbflata", url: "IIbflata.mp3", duration: 0*60+42}, // ::: cat ::: cut off end
				IIca: {title: "IIca", url: "IIca.mp3", duration: 0*60+11}, // ::: the call ::: cut off end
				IIca2: {title: "IIca2", url: "IIca2.mp3", duration: 0*60+11}, // ::: the call ::: cut off end
				IIca3_sharpattack: {title: "IIca3_sharpattack", url: "IIca3_sharpattack.mp3", duration: 0*60+10}, // ::: the call ::: cut off end
				IIcd: {title: "IIcd", url: "IIcd.mp3", duration: 0*60+12}, // ::: the call ::: 
				IIdbflatharmonic: {title: "IIdbflatharmonic", url: "IIdbflatharmonic.mp3", duration: 1*60+8}, // ::: ice harmonic
				IIdfsharpharmonic: {title: "IIdfsharpharmonic", url: "IIdfsharpharmonic.mp3", duration: 0*60+38}, // ::: ice harmonic
				IIdglissando2: {title: "IIdglissando2", url: "IIdglissando2.mp3", duration: 0*60+42}, // ::: ice harmonic
				IVcopenandharmonics: {title: "IVcopenandharmonics", url: "IVcopenandharmonics.mp3", duration: 1*60+11}, // ::: 
				IIIgharmonicandopen: {title: "IIIgharmonicandopen", url: "IIIgharmonicandopen.mp3", duration: 0*60+42}, // ::: 
				IIdmidharmonic: {title: "IIdmidharmonic", url: "IIdmidharmonic.mp3", duration: 0*60+45}, // ::: 
				IIdopen: {title: "IIdopen", url: "IIdopen.mp3", duration: 0*60+53}, // ::: 
				IIdopen2: {title: "IIdopen2", url: "IIdopen2.mp3", duration: 1*60+21}, // ::: 
				IIdopen3: {title: "IIdopen3", url: "IIdopen3.mp3", duration: 1*60+21}, // ::: 
				IVcd: {title: "IVcd", url: "IVcd.mp3", duration: 0*60+13}, // ::: 
				IVdfd: {title: "IVdfd", url: "IVdfd.mp3", duration: 0*60+24}, // ::: 
				IVdfd2: {title: "IVdfd2", url: "IVdfd2.mp3", duration: 0*60+24}, // ::: 
				IVdharmonic: {title: "IVdharmonic", url: "IVdharmonic.mp3", duration: 0*60+53}, // ::: 
				IVdrrumble: {title: "IVdrrumble", url: "IVdrrumble.mp3", duration: 1*60+7}, // ::: 
				Iaglissando: {title: "Iaglissando", url: "Iaglissando.mp3", duration: 1*60+28}, // ::: 
				Iaglissando2: {title: "Iaglissando2", url: "Iaglissando2.mp3", duration: 1*60+3}, // ::: strange
				Iaopen: {title: "Iaopen", url: "Iaopen.mp3", duration: 1*60+24}, // ::: strange
				Ibflata: {title: "Ibflata", url: "Ibflata.mp3", duration: 0*60+18}, // ::: 
				IeIIca: {title: "IeIIca", url: "IeIIca.mp3", duration: 0*60+23}, // ::: the call
				IeIIca_short: {title: "IeIIca_short", url: "IeIIca_short.mp3", duration: 0*60+12}, // ::: the call
				IeIIca_short: {title: "IeIIca_short", url: "IeIIca_short.mp3", duration: 0*60+12}, // ::: the call
				Ifd: {title: "Ifd", url: "Ifd.mp3", duration: 0*60+10}, // ::: the call
				Ifd2: {title: "Ifd2", url: "Ifd2.mp3", duration: 0*60+23}, // ::: the call
				Ifd3_short: {title: "Ifd3_short", url: "Ifd3_short.mp3", duration: 0*60+10}, // ::: the call
				Ifd3_short: {title: "Ifd3_short", url: "Ifd3_short.mp3", duration: 0*60+10}, // ::: the call
				bartoktonerow: {title: "bartoktonerow", url: "bartoktonerow.mp3", duration: 2*60+26}, // ::: 2 hands cello
				berrymansdream: {title: "berrymansdream", url: "berrymansdream.mp3", duration: 2*60+25}, // ::: cello
				distantstormhorses: {title: "distantstormhorses", url: "distantstormhorses.mp3", duration: 4*60+25}, // ::: cello like a radio dream
				elegy: {title: "elegy", url: "elegy.mp3", duration: 4*60+41}, // ::: cello 
				elevator_6815_100percent: {title: "elevator_6815_100percent", url: "elevator_6815_100percent.mp3", duration: 1*60+8}, // :::  
				elevator_6815_48percent: {title: "elevator_6815_48percent", url: "elevator_6815_48percent.mp3", duration: 1*60+9}, // :::  
				elevator_6815_68percent: {title: "elevator_6815_68percent", url: "elevator_6815_68percent.mp3", duration: 1*60+8}, // :::  
				rubbedpianoharp0: {title: "rubbedpianoharp0", url: "rubbedpianoharp0.mp3", duration: 0*60+52}, // :::  
				rubbedbassdrum0: {title: "rubbedbassdrum0", url: "rubbedbassdrum0.mp3", duration: 2*60+47}, // :::  
				bowedvibe0: {title: "bowedvibe0", url: "bowedvibe0.mp3", duration: 4*60+21}, // :::  
				bowedcymbol0: {title: "bowedcymbol0", url: "bowedcymbol0.mp3", duration: 3*60+4}, // :::  
				steeldrum0: {title: "steeldrum0", url: "steeldrum0.mp3", duration: 1*60+4}, // :::  
				steeldrum0b: {title: "steeldrum0b", url: "steeldrum0b.mp3", duration: 1*60+9}, // :::  
				clarinetjazz0b: {title: "clarinetjazz0b", url: "clarinetjazz0b.mp3", duration: 1*60+1}, // :::  
				piano2: {title: "piano2", url: "piano2.mp3", duration: 2*60+52}, // :::  slight echo .. mct both piano & harp
				piano2b: {title: "piano2b", url: "piano2b.mp3", duration: 2*60+52}, // :::  no echo .. mct both piano & harp
				piano3a: {title: "piano3a", url: "piano3a.mp3", duration: 1*60+18}, // :::  mct piano
				piano3b: {title: "piano3b", url: "piano3b.mp3", duration: 1*60+13}, // :::  mct harp
				typewriterlong: {title: "typewriterlong", url: "typewriterlong.mp3", duration: 0*60+42}, // :::
				uniondepotcistern: {title: "uniondepotcistern", url: "uniondepotcistern.mp3", duration: 3*60+7}, // :::
				trainlong1: {title: "trainlong1", url: "trainlong1.mp3", duration: 3*60+1}, // :::
				trainlong2: {title: "trainlong2", url: "trainlong2.mp3", duration: 2*60+57}, // :::
				traffickcorebirds1: {title: "traffickcorebirds1", url: "traffickcorebirds1.mp3", duration: 11*60+15}, // :::
				birdcry4: {title: "birdcry4", url: "birdcry4.mp3", duration: 0*60+12}, // :::
				tuningcistern: {title: "tuningcistern", url: "tuningcistern.mp3", duration: 2*60+37}, // :::
				clapping0: {title: "clapping0", url: "clapping0.mp3", duration: 0*60+28}, // :::
				
				// frontstreet: {title: "frontstreet", url: "frontstreet.mp3", duration: 3*60+11}, // :::  
				gates20171012_mixdown: {title: "gates20171012_mixdown", url: "gates20171012_mixdown.mp3", duration: 6*60+37}, // :::  kelley film
				gates20171016_mixdown: {title: "gates20171016_mixdown", url: "gates20171016_mixdown.mp3", duration: 6*60+37}, // :::  
				geese20201220_1d: {title: "geese20201220_1d", url: "geese20201220_1d.mp3", duration: 2*60+47}, // :::  strange bagpipe
				coffepot1eminor: {title: "coffepot1eminor", url: "coffepot1eminor.mp3", duration: 1*60+12}, // :::  
				coffepot1: {title: "coffepot1", url: "coffepot1.mp3", duration: 1*60+12}, // :::  
				
				ghostwind1: {title: "ghostwind1", url: "ghostwind1.mp3", duration: 0*60+34}, // :::  below bridge
				ghostwind2: {title: "ghostwind2", url: "ghostwind2.mp3", duration: 0*60+33}, // :::  below bridge
				glassbowl: {title: "glassbowl", url: "glassbowl.mp3", duration: 7*60+14}, // ::: 
				glassyfires: {title: "glassyfires", url: "glassyfires.mp3", duration: 4*60+41}, // :::  
				graphitesky: {title: "graphitesky", url: "graphitesky.mp3", duration: 3*60+35}, // :::  
				helpless: {title: "helpless", url: "helpless.mp3", duration: 1*60+56}, // :::  
				helpless1: {title: "helpless1", url: "helpless1.mp3", duration: 2*60+59}, // :::  
				horsespeakssky: {title: "horsespeakssky", url: "horsespeakssky.mp3", duration: 7*60+8}, // :::  
				joyflightlonging: {title: "joyflightlonging", url: "joyflightlonging.mp3", duration: 8*60+46}, // :::  
				manwithamoviecamerapodcast: {title: "manwithamoviecamerapodcast", url: "manwithamoviecamerapodcast.mp3", duration: 1*60*60+7*60+28}, // :::  
				moonoverstyx: {title: "moonoverstyx", url: "moonoverstyx.mp3", duration: 3*60+29}, // :::  
				submarineecho: {title: "submarineecho", url: "submarineecho.mp3", duration: 0*60+37}, // :::  
				trappedbird: {title: "trappedbird", url: "trappedbird.mp3", duration: 6*60+46}, // :::  
				vox20200118_8_3b_mixdown: {title: "vox20200118_8_3b_mixdown", url: "vox20200118_8_3b_mixdown.mp3", duration: 2*60+5}, // :::  
				vox20200124_itwas: {title: "vox20200124_itwas", url: "vox20200124_itwas.mp3", duration: 0*60+8}, // :::  
				lookingforyou0: {title: "lookingforyou0", url: "lookingforyou0.mp3", duration: 0*60+11}, // :::  
				mctbreathing0: {title: "mctbreathing0", url: "mctbreathing0.mp3", duration: 0*60+23}, // :::  
				thinkingaboutthosethings: {title: "thinkingaboutthosethings", url: "thinkingaboutthosethings.mp3", duration: 2*60+22}, // :::  
				
				rider1: {title: "rider1", url: "rider1.mp3", duration: 2*60+15}, // ::: whisper echo 
				therider0: {title: "therider0", url: "therider0.mp3", duration: 3*60+37}, // ::: whisper echo 
				therider0b: {title: "therider0b", url: "therider0b.mp3", duration: 3*60+30}, // ::: less echo voice
				numberstation0: {title: "numberstation0", url: "numberstation0.mp3", duration: 0*60+55}, // :::  (excerpt from rider0)
				numberstation0b: {title: "numberstation0b", url: "numberstation0b.mp3", duration: 0*60+52}, // ::: less echo voice
				washingtonavenuebridge: {title: "washingtonavenuebridge", url: "washingtonavenuebridge.mp3", duration: 0*60+54}, // :::  
				worksample09minutes_bent2: {title: "worksample09minutes_bent2", url: "worksample09minutes_bent2.mp3", duration: 2*60+41}, // :::  
				worksample09minutes_bent2: {title: "worksample09minutes_bent2", url: "worksample09minutes_bent2.mp3", duration: 2*60+41}, // :::  
			},
			instruments: {
				//bagpipe
				bagpipe1a: {clip: "bagpipe1a", minvolume: 0.3, maxvolume: 0.9, playbackRate: () => { return z.tools.randomlowharmonic()/10 } },
				bagpipe1ahigh: {clip: "bagpipe1a", minvolume: 0.3, maxvolume: 0.9, playbackRate: () => { return z.tools.randomharmonic()/10 } },
				bagpipe1e: {clip: "bagpipe1e", minvolume: 0.3, maxvolume: 0.9, playbackRate: () => { return z.tools.randomharmonic()/10 } },
				bagpipe1f: {clip: "bagpipe1f", minvolume: 0.3, maxvolume: 0.9, playbackRate: () => { return z.tools.randomharmonic()/10 } },
				bagpipe1g: {clip: "bagpipe1g", minvolume: 0.3, maxvolume: 0.9, playbackRate: () => { return z.tools.randomharmonic()/10 } },
				bagpipe1h: {clip: "bagpipe1h", minvolume: 0.3, maxvolume: 0.9, playbackRate: () => { return z.tools.randomlowharmonic()/10 } },
				bagpipe1: {clip: "bagpipe1", minvolume: 0.3, maxvolume: 0.9, playbackRate: () => { return z.tools.randomlowharmonic()/4 } },
				bagpipe1high: {clip: "bagpipe1", minvolume: 0.3, maxvolume: 0.9, playbackRate: () => { return z.tools.randomharmonic()/4 } },
				bagpipegeese: {clip: "bagpipegeese", minvolume: 0.8, maxvolume: 1.0, playbackRate: () => { return z.tools.randomharmonic()/10 } },
				//birds
				bird0: {clip: "bird0", minvolume: 0.6, maxvolume: 0.9},
				bird1: {clip: "bird1", minvolume: 0.6, maxvolume: 0.9},
				bird1harmonic: {clip: "bird1", minvolume: 0.8, maxvolume: 1.0, playbackRate: () => { return z.tools.randomharmonic()/10 } },
				bird2: {clip: "bird2", minvolume: 0.6, maxvolume: 0.9},
				bird3: {clip: "bird3", minvolume: 0.6, maxvolume: 0.9},
				birdcry: {clip: "birdcry", minvolume: 0.4, maxvolume: 0.9},
				birds5harmonic: {clip: "birds5", minvolume: 0.2, maxvolume: 0.5, playbackRate: () => { return z.tools.randomhighharmonic()/10 } },
				birdtheme: {clip: "birdtheme", minvolume: 0.5, maxvolume: 0.9, bufferparams: {} },
				birdcanyon: {clip: "birdcanyon", minvolume: 0.8, maxvolume: 1.0, playbackRate: () => { return z.tools.randomharmonic()/10 } },
				crow1: {clip: "crow1", minvolume: 0.8, maxvolume: 0.9, playbackRate: () => { return z.tools.randominteger(6, 18)/10 } },

				//percussive
				thunk: {clip: "thunk", minvolume: 0.3, maxvolume: 0.8, playbackRate: () => { return z.tools.randomharmonic()/10 } },
				thunkhighharmonic: {clip: "thunk", minvolume: 0.3, maxvolume: 0.8, playbackRate: () => { return z.tools.randomhighharmonic()/10 } },
				knocking1: {clip: "knocking1", minvolume: 0.4, maxvolume: 0.9, playbackRate: () => { return z.tools.randominteger(4,48)/10 } },
				stapler: {clip: "stapler", minvolume: 0.8, maxvolume: 1.0, playbackRate: () => { return z.tools.randomharmonic()/10 } },
				typewriter1: {clip: "typewriter1", minvolume: 0.6, maxvolume: 0.8, playbackRate: () => { return z.tools.randominteger(4,14)/10 } },
				t0: {clip: "t0", minvolume: 0.8, maxvolume: 1.0, playbackRate: () => { return z.tools.randomharmonic()/10 } },

				//cello
				cello_pitch1: {clip: "cello_pitch1", minvolume: 0.3, maxvolume: 0.8, playbackRate: () => { return z.tools.randomharmonic()/10 } },
				cello_pitch1harmonic: {clip: "cello_pitch1", minvolume: 0.3, maxvolume: 0.8, playbackRate: () => { return z.tools.randomharmonic()/10 } },
				celloknockcanyon: {clip: "celloknockcanyon", minvolume: 0.8, maxvolume: 1.0, playbackRate: () => { return z.tools.randomharmonic()/10 } },
				// cellothunktelephone: {clip: "cellothunktelephone", minvolume: 0.8, maxvolume: 1.0, playbackRate: () => { return z.tools.randomharmonic()/10 } },
				// cellothunkradio: {clip: "cellothunkradio", minvolume: 0.8, maxvolume: 1.0, playbackRate: () => { return z.tools.randomharmonic()/10 } },
				cmpb20200708_3harmonic: {clip: "cmpb20200708_3", minvolume: 0.4, maxvolume: 0.9 },//* voice			
				cmpb20200708_4harmonic: {clip: "cmpb20200708_4", minvolume: 0.4, maxvolume: 0.9 },//* voice			

				//clarinet tones
				clarinetnotes_a: {clip: "clarinetnotes_a", minvolume: 0.4, maxvolume: 0.9},
				clarinetnotes_b: {clip: "clarinetnotes_b", minvolume: 0.4, maxvolume: 0.9},
				clarinetnotes_c: {clip: "clarinetnotes_c", minvolume: 0.4, maxvolume: 0.9},
				clarinetnotes_d: {clip: "clarinetnotes_d", minvolume: 0.4, maxvolume: 0.9},
				clarinetnotes_e: {clip: "clarinetnotes_e", minvolume: 0.4, maxvolume: 0.9},
				clarinetnotes_f: {clip: "clarinetnotes_f", minvolume: 0.4, maxvolume: 0.9},
				clarinetnotes_g: {clip: "clarinetnotes_g", minvolume: 0.4, maxvolume: 0.9},
				clarinetnotes_h: {clip: "clarinetnotes_h", minvolume: 0.4, maxvolume: 0.9},
				clarinetnotes_i: {clip: "clarinetnotes_i", minvolume: 0.4, maxvolume: 0.9},

				clarinet1: {clip: "clarinet1", minvolume: 0.5, maxvolume: 0.9, playbackRate: () => { return z.tools.randomharmonic()/10 } },
				clarinet2: {clip: "clarinet2", minvolume: 0.4, maxvolume: 0.8, playbackRate: () => { return z.tools.randomharmonic()/10 } },
				clarinetI: {clip: "clarinet1", minvolume: 0.4, maxvolume: 0.8, playbackRate: () => { return z.data.sound.intervals.I(100) / 100 } },
				clarinetIII: {clip: "clarinet1", minvolume: 0.4, maxvolume: 0.8, playbackRate: () => { return z.data.sound.intervals.III(100) / 100 } },
				clarinetII: {clip: "clarinet1", minvolume: 0.4, maxvolume: 0.8, playbackRate: () => { return z.data.sound.intervals.II(100) / 100 } },
				clarinetIV: {clip: "clarinet1", minvolume: 0.4, maxvolume: 0.8, playbackRate: () => { return z.data.sound.intervals.IV(100) / 100 } },
				clarinetV: {clip: "clarinet1", minvolume: 0.4, maxvolume: 0.8, playbackRate: () => { return z.data.sound.intervals.V(100) / 100 } },
				clarineti: {clip: "clarinet1", minvolume: 0.4, maxvolume: 0.8, playbackRate: () => { return z.data.sound.intervals.i(100) / 100 } },
				clarinetvii: {clip: "clarinet1", minvolume: 0.4, maxvolume: 0.8, playbackRate: () => { return z.data.sound.intervals.vii(100) / 100 } },
				clarinetVIII: {clip: "clarinet1", minvolume: 0.4, maxvolume: 0.8, playbackRate: () => { return z.data.sound.intervals.VIII(100) / 100 } },
				//bells
				bell2: {clip: "bell2", minvolume: 0.5, maxvolume: 0.8, playbackRate: () => { return z.tools.randominteger(5,20)/10 } },
				bell6: {clip: "bell6", minvolume: 0.5, maxvolume: 0.8, playbackRate: () => { return z.tools.randominteger(5,20)/10 } },
				bell11: {clip: "bell11", minvolume: 0.5, maxvolume: 0.8, playbackRate: () => { return z.tools.randominteger(4,13)/10 } },
				longbell: {clip: "longbell", minvolume: 0.4, maxvolume: 0.8, playbackRate: () => { return z.tools.randominteger(9,18)/10 } },
				icebowedvibes1: {clip: "icebowedvibes1", minvolume: 0.2, maxvolume: 0.4, playbackRate: () => { return z.tools.randomharmonic(5,13)/10 } },
				icebowedcymbal2: {clip: "icebowedcymbal2", minvolume: 0.3, maxvolume: 0.4, playbackRate: () => { return z.tools.randomharmonic(5,11)/10 } },
				//trains
				tornadosirenharmonic: {clip: "tornadosiren", minvolume: 0.1, maxvolume: 0.6, playbackRate: () => { return z.tools.randomlowharmonic()/10 } },									
				submarineecho1: {clip: "submarineecho", minvolume: 0.2, maxvolume: 0.8 },
				submarineecho2: {clip: "submarineecho", minvolume: 0.2, maxvolume: 0.8, playbackRate: () => { return z.tools.randomharmonic(4,10)/10  } },
				train1: {clip: "train1", minvolume: 0.4, maxvolume: 0.8, playbackRate: () => { return z.tools.randominteger(6,18)/10 } },
				weatherradio1: {clip: "weatherradio1", minvolume: 0.6, maxvolume: 1.0,  playbackRate: () => { return z.tools.randominteger(6,12)/10 } },
				fan1: {clip: "fan1", minvolume: 0.3, maxvolume: 0.8, playbackRate: () => { return z.tools.randominteger(6,20)/10 } },
				surf: {clip: "surf", minvolume: 0.3, maxvolume: 0.8, playbackRate: () => { return z.tools.randominteger(4,20)/10 } },
				silence1: {clip: "train1", minvolume: 0.1, maxvolume: 0.2},
				silence2: {clip: "fan1", minvolume: 0.1, maxvolume: 0.2},
				silence3: {clip: "surf", minvolume: 0.1, maxvolume: 0.2},
				//vox
				mags1: {clip: "magsSessionClips_1", minvolume: 0.3, maxvolume: 0.8 },
				mags1harmonic: {clip: "magsSessionClips_1", minvolume: 0.3, maxvolume: 0.8, playbackRate: () => { return z.tools.randomlowharmonic()/10 } },
				mags2harmonic: {clip: "magsSessionClips_2a", minvolume: 0.3, maxvolume: 0.8, playbackRate: () => { return z.tools.randomlowharmonic()/10 } },

				magsII_a: {clip: "magsSessionClips_1", minvolume: 0.1, maxvolume: 0.6},
				magsIII_a: {clip: "magsSessionClips_2a", minvolume: 0.1, maxvolume: 0.6},
				magsIV_b: {clip: "magsSessionClips_3b", minvolume: 0.1, maxvolume: 0.6},
				magsV_b: {clip: "magsSessionClips_4b", minvolume: 0.1, maxvolume: 0.6},
				// magsvii_a: {clip: "magsSessionClips_5a", minvolume: 0.1, maxvolume: 0.6},
				magsvii_b: {clip: "magsSessionClips_5b", minvolume: 0.1, maxvolume: 0.6},
				voxmct0: {clip: "voxmct0", minvolume: 0.8, maxvolume: 1.0, playbackRate: () => { return z.tools.randomharmonic()/10 } },
				voxmct0b: {clip: "voxmct0", minvolume: 0.8, maxvolume: 1.0, playbackRate: () => { return z.tools.randominteger(6,12)/10 } },
				vox20200124_itwas: {clip: "vox20200124_itwas", minvolume: 0.4, maxvolume: 1.0 },
				lookingforyou0: {clip: "lookingforyou0", minvolume: 0.4, maxvolume: 1.0 },
				cmpb20200708_5harmonic: {clip: "cmpb20200708_5", minvolume: 0.4, maxvolume: 0.9, playbackRate: () => { return z.tools.randomhighharmonic()/10 } },//* voice			
			},
			intervals: {
				lowi: function(basetone){ return Math.floor(basetone/4) },
				i: function(basetone){ return Math.floor(basetone/2) },
				I: function(basetone){ return Math.floor(basetone/1) },
				II: function(basetone){ return Math.floor(basetone*9/8) },
				III: function(basetone){ return Math.floor(basetone*5/4) },
				iii: function(basetone){ return Math.floor(basetone*6/5) },
				IV: function(basetone){ return Math.floor(basetone*4/3) },
				V: function(basetone){ return Math.floor(basetone*3/2) },
				VI: function(basetone){ return Math.floor(basetone*5/3) },
				VII: function(basetone){ return Math.floor(basetone*15/8) },
				vii: function(basetone){ return Math.floor(basetone*9/5) },
				VIII: function(basetone){ return Math.floor(basetone*2) },
			},
			oldplaylists: {
				clarinet: [ ["clarinetI"], ["clarinetII", "clarinetIV", "clarinetV", "clarinetI"] ],
				clarinetnotes: [ ["clarinetI", "clarineti"], ["clarinetII"], ["clarinetIII"], ["clarinetIV"], ["clarinetV"], ["clarinetvii"], ["clarinetII", "clarinetIV", "clarinetV", "clarinetI"], ["clarineti", "clarinetIII", "clarinetV", "clarinetI"] ],
				clarinetchord: [ ["silence1","silence2","silence3","clarinetI", "clarineti", "clarinetI", "clarinetI", "clarineti","clarinetI", "clarineti", "clarinetII", "clarinetIII", "clarinetIII", "clarinetIV","clarinetIV","clarinetIV","clarinetV","clarinetV","clarinetV","clarinetV","clarinetV", "clarinetV","clarinetV","clarinetvii"] ],
				clarinetchordwithradio: [ ["weatherradio1","silence1","silence2","silence3","clarinetI", "clarineti", "clarinetI", "clarinetI", "clarineti","clarinetI", "clarineti", "clarinetII", "clarinetIII", "clarinetIII", "clarinetIV","clarinetIV","clarinetIV","clarinetV","clarinetV","clarinetV","clarinetV","clarinetV", "clarinetV","clarinetV","clarinetvii"] ],
				clarinetchordIandV: [ ["silence1","silence2","silence3","clarinetI", "clarineti", "clarinetI", "clarinetI", "clarineti","clarinetI", "clarineti", "clarinetV","clarinetV","clarinetV","clarinetV","clarinetV", "clarinetV","clarinetV"] ],
				clarinetchordI: [ ["silence1","silence2","silence3","clarinetI", "clarineti", "clarinetI", "clarinetI", "clarineti","clarinetI", "clarineti", "clarinetV"] ],
				clarinetchordbell: [ ["silence1","silence2","silence3","clarinetI", "clarineti", "clarinetI", "clarinetI", "clarineti","clarinetI", "clarineti", "clarinetIII", "clarinetIV","clarinetIV","clarinetIV","clarinetV","clarinetV","clarinetV","clarinetV","clarinetV", "clarinetV","clarinetV"] ],
				clarinetchordwithcrow: [ ["crow1","silence1","silence2","silence3","clarinetI", "clarineti", "clarinetI", "clarinetI", "clarineti","clarinetI", "clarineti", "clarinetII", "clarinetIII", "clarinetIII", "clarinetIV","clarinetIV","clarinetIV","clarinetV","clarinetV","clarinetV","clarinetV","clarinetV", "clarinetV","clarinetV","clarinetvii"] ],
				bells: [ ["bell2", "bell6", "bell11"], ["bell2", "bell6", "bell11"] ],
				birds: [ ["bird0", "bird1", "bird2", "bird3", "birdtheme"], ["bird0", "bird1", "bird2", "bird3"], ["birdtheme"] ],
				crow: [ ["crow1"] ],
				weatherradio: [ ["weatherradio1", "clarinet1", "clarinet1", "clarinet1"] ],
				typewriter: [ ["typewriter1"] ],
				orbit: [ ["weatherradio1", "clarinet1", "clarinet1", "clarinet1"], ["clarinet1", "clarinet1"], ["clarinet1", "bell6"], ["bell6"], ["icebowedvibes1", "icebowedvibes1", "icebowedcymbal2"] ],
				chance: [  ["bell2", "bell6", "bell11"], ["clarinet1"], ["birdtheme"], ["bird0", "bird1", "bird2", "bird3", "birdtheme"], ["crow1"], ["typewriter1"], ["icebowedvibes1", "icebowedvibes1", "icebowedcymbal2"], ["thunk"], ["clarinet1"], ["bell2", "bell6", "bell11"], ["weatherradio1", "clarinet1", "clarinet1"], ["bird0", "bird1", "bird2", "bird3", "birdtheme"] ],
				all: [  ["bell2", "bell6", "bell11"], ["clarinet1"], ["birdtheme","silence1","silence2","silence3"],  ["bird0", "bird1", "bird2", "bird3", "birdtheme"], ["crow1"], ["clarinet1"], ["icebowedvibes1", "icebowedvibes1", "icebowedcymbal2"],["bell11"], ["clarinet1"], ["weatherradio1", "train1", "fan1", "surf"], ["typewriter1"], ["birdtheme"],  ["surf", "icebowedvibes1", "icebowedvibes1", "icebowedcymbal2"], ["thunk"], ["typewriter1"], ["bell2", "bell6", "bell11"],  ["clarinet1"], ["surf", "fan1"], ["bird0", "bird1", "bird2", "bird3", "birdtheme"], ["thunk", "weatherradio1"], [ "weatherradio1", "train1", "fan1", "surf" ], ["silence1","silence2","silence3","clarinetI", "clarineti", "clarinetI", "clarineti","clarinetI", "clarineti","clarinetIV", "clarinetV","magsIV_a","magsV_a"], ["silence1","silence2","silence3","clarinetI", "clarineti", "clarinetI", "clarineti","clarinetI", "clarineti","clarinetIV", "clarinetV","magsIV_a","magsV_a", "weatherradio1", "train1", "fan1", "surf"], ["train1","silence1","silence2","silence3"] ],
				draw: [ ["bell2", "bell6", "bell11"], ["clarinet1"], ["birdtheme","silence1","silence2","silence3"],  ["bird0", "bird1", "bird2", "bird3", "birdtheme"], ["crow1"], ["clarinet1"], ["icebowedvibes1", "icebowedvibes1", "icebowedcymbal2"],["bell11"], ["clarinet1"], ["weatherradio1", "train1", "fan1", "surf"], ["typewriter1"], ["birdtheme"],  ["surf", "icebowedvibes1", "icebowedvibes1", "icebowedcymbal2"], ["thunk"], ["typewriter1"], ["bell2", "bell6", "bell11"],  ["clarinet1"], ["surf", "fan1"], ["bird0", "bird1", "bird2", "bird3", "birdtheme"], ["thunk", "weatherradio1"], [ "weatherradio1", "train1", "fan1", "surf" ], ["silence1","silence2","silence3","clarinetI", "clarineti", "clarinetI", "clarineti","clarinetI", "clarineti","clarinetIV", "clarinetV"], ["silence1","silence2","silence3","clarinetI", "clarineti", "clarinetI", "clarineti","clarinetI", "clarineti", "clarinetIV", "clarinetV", "weatherradio1", "train1", "fan1", "surf"], ["train1", "weatherradio1", "train1", "fan1", "surf", "silence1","silence2","silence3"] ],
				chance0: [  ["bell2", "bell6", "bell11"], ["clarinet1"], ["birdtheme"],  ["clarinet2", "surf", "fan1"], ["bird0", "bird1", "bird2", "bird3", "birdtheme"], ["crow1"], ["clarinet1"], ["icebowedvibes1", "icebowedvibes1", "icebowedcymbal2"],["bell11"], ["clarinet1"], ["weatherradio1", "train1", "fan1", "surf"], ["typewriter1"], ["birdtheme"],  ["surf", "icebowedvibes1", "icebowedvibes1", "icebowedcymbal2"], ["thunk"], ["typewriter1"], ["bell2", "bell6", "bell11"],  ["clarinet1"], ["submarineecho1", "surf", "submarineecho2", "fan1"], ["bird0", "bird1", "bird2", "bird3", "birdtheme"], ["thunk", "weatherradio1"], [ "weatherradio1", "train1", "fan1", "surf" ] ],
				hymn: [  ["clarinetI", "clarineti"], ["clarinet1"], ["train1", "surf", "fan1"], ["crow1"], ["clarineti", "clarinetI", "clarinetIV", "clarinetV"], ["clarinetII", "clarinetI", "clarinetIV", "clarinetvii"], ["clarineti", "clarinetI", "clarinetIII", "clarinetV"], ["icebowedvibes1", "icebowedvibes1", "icebowedcymbal2"], ["weatherradio1", "train1", "fan1", "surf"], ["typewriter1"], ["surf"], ["clarinet1"], ["thunk", "weatherradio1"], [ "weatherradio1", "train1", "fan1", "surf" ] ],
				silence: [  ["silence1", "silence2", "silence3"] ],
				silencewithradio: [  ["weatherradio1", "train1", "silence1", "silence2", "silence3", "silence1", "silence2", "silence3","silence1", "silence2", "silence3", "silence1", "silence2", "silence3"] ],
				mags: [ ["crow1","silence1","silence2","silence3","clarinetI", "clarineti", "clarinetI", "clarineti","clarinetI", "clarineti","clarinetIV", "clarinetV","magsII_a","magsII_b","magsIII_a","magsIII_b","magsIII_c","magsIV_a","magsIV_b","magsV_a","magsV_b","magsvii_a","magsvii_b"] ],
				magschord: [ ["silence1","silence2","silence3","clarinetI", "clarineti", "clarinetI", "clarineti","clarinetIV", "clarinetV","magsII_a","magsII_b","magsIII_a","magsIII_b","magsIII_c","magsIV_a","magsIV_b","magsV_a","magsV_b","magsIV_a","magsIV_b","magsV_a","magsV_b","magsIV_a","magsIV_b","magsV_a","magsV_b", "magsV_a","magsV_b", "magsV_a","magsV_b","magsvii_a","magsvii_b"] ],
				magschordwithradio: [ ["weatherradio1", "silence1","silence2","silence3","clarinetI", "clarineti", "clarinetI", "clarineti","clarinetIV", "clarinetV","magsII_a","magsII_b","magsIII_a","magsIII_b","magsIII_c","magsIV_a","magsIV_b","magsV_a","magsV_b","magsIV_a","magsIV_b","magsV_a","magsV_b","magsIV_a","magsIV_b","magsV_a","magsV_b", "magsV_a","magsV_b", "magsV_a","magsV_b","magsvii_a","magsvii_b"] ],
				magschordbell: [ ["silence1","silence2","silence3","clarinetI", "clarineti", "clarinetI", "clarineti","clarinetIV", "clarinetV","magsIII_a","magsIII_b","magsIII_c","magsIV_a","magsIV_b","magsV_a","magsV_b","magsIV_a","magsIV_b","magsV_a","magsV_b","magsIV_a","magsIV_b","magsV_a","magsV_b", "magsV_a","magsV_b", "magsV_a","magsV_b"] ],
				magschordwithcrow: [ ["crow1", "silence1","silence2","silence3","clarinetI", "clarineti", "clarinetI", "clarineti","clarinetIV", "clarinetV","magsII_a","magsII_b","magsIII_a","magsIII_b","magsIII_c","magsIV_a","magsIV_b","magsV_a","magsV_b","magsIV_a","magsIV_b","magsV_a","magsV_b","magsIV_a","magsIV_b","magsV_a","magsV_b", "magsV_a","magsV_b", "magsV_a","magsV_b","magsvii_a","magsvii_b"] ],
				// grains: [ ["weatherradio1"],["thunk"],["typewriter1"], ["icebowedvibes1", "bell2", "bell6", "bell11"] ],
				grains: [ ["icebowedvibes1", "bell2", "bell6", "bell11"], ["crow1"],["bird0", "bird1", "bird2", "bird3", "birdtheme"] ],
				// talk: [  ["thunk"], ["submarineecho1", "clarinet2", "surf", "fan1"], ["submarineecho2", "thunk","typewriter1"], ["birdtheme","bird0", "bird1", "bird2", "bird3", "birdtheme"], ["bell2", "bell6", "bell11"], ["thunk"], ["typewriter1"], ["submarineecho1", "surf"], ["submarineecho2", "fan1"], ["crow1"], ["surf", "train1", "fan1", "thunk"], ["typewriter1"], ["thunk"], ["crow1"], [ "clarinet2", "weatherradio1", "train1", "fan1", "surf" ], ["typewriter1"], ["thunk"], ["crow1"] ],
				talk: [  ["thunk"], ["thunk","typewriter1"], ["birdtheme","bird0", "bird1", "bird2", "bird3", "birdtheme"], ["bell2", "bell6", "bell11"], ["thunk"], ["typewriter1"], ["surf"], ["surf", "train1", "fan1", "thunk"], ["typewriter1"], ["thunk"], ["crow1"], [ "clarinet2", "weatherradio1", "train1", "fan1", "surf" ], ["typewriter1"], ["thunk"], ["crow1"] ],
				// test: [  ["submarineecho1", "clarinet2", "surf", "fan1"], ["submarineecho2", "fan1"], ["submarineecho1", "surf", "submarineecho2", "train1", "fan1", "thunk"] ],
				test: [["silence1","silence2","silence3","clarinetI", "clarineti", "clarinetI", "clarineti","clarinetI", "clarineti","clarinetIV", "clarinetV","magsII_a","magsIII_a","magsIV_a","magsV_a", "weatherradio1", "train1", "fan1", "surf"], ["magsII_a","magsIII_a","magsIV_a","magsV_a", "thunk", "crow1"]],
			},
		},
		texts: {
			lorem: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in suscipit purus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus nec hendrerit felis. Morbi aliquam facilisis risus eu lacinia. Sed eu leo in turpis fringilla hendrerit. Ut nec accumsan nisl. Suspendisse rhoncus nisl posuere tortor tempus et dapibus elit porta. Cras leo neque, elementum a rhoncus ut, vestibulum non nibh. Phasellus pretium justo turpis. Etiam vulputate, odio vitae tincidunt ultricies, eros odio dapibus nisi, ut tincidunt lacus arcu eu elit. Aenean velit erat, vehicula eget lacinia ut, dignissim non tellus. Aliquam nec lacus mi, sed vestibulum nunc. Suspendisse potenti. Curabitur vitae sem turpis. Vestibulum sed neque eget dolor dapibus porttitor at sit amet sem. Fusce a turpis lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;',
			glitch: "xÅ“Â½YMo7Â½ÃÂ¯ÃÃ˜â€°(~Hâ€š=$mÃ´PÂ ÂoAÃ©Ãši{Ã˜Ã¶Ã¯Ã·QÂ³k{VjÂ½:YÃƒ#Å¡#Â½Gj%â€™â€™)DÃ¼Ã¬JIÃ‚Ã¡8Â¹;;;Ã—Â´Ã¼Ã½Ã§ÃÃ´ÃªÃ=â€¦_Ã®Â½MÂ­Ã½Ã¦Ã®Â¯ÃŸw?Â½{Ã·SÅ“k)â€°5U!ÃŠ&PPÃ§Â¤R#UÆ’Â¦4!Ã¦Ã³â€¹pÃ¸}â€žÃ¸Ã¶Ã½#Â¾Ã»Æ’#Â²#Â¾Ã™Ã€ÃŠ?&Ãª'Ã«ÃÃIÃ›â€Â±ÃˆÅ“c 7Ã‡Ã©Ã•wÂ¨JÂ¸Ã¹<}xmjÂ«â„¢Ã·Â4Â¼NwÃ»`mÃœâ€¡Ã¸1Ãœ|?}{3Ã½x~Â±8â€¹H/Â·Ã¶9'KV_il3Â¦f0eâ€¦tÃ»bTLÃ²Ã¢ÃƒG{Ã›Ã†$",
			earthprayer: "A prayer for our earth All-powerful God, you are present in the whole universe and in the smallest of your creatures. You embrace with your tenderness all that exists. Pour out upon us the power of your love, that we may protect life and beauty. Fill us with peace, that we may live as brothers and sisters, harming no one. O God of the poor, help us to rescue the abandoned and forgotten of this earth, so precious in your eyes. Bring healing to our lives, that we may protect the world and not prey on it, that we may sow beauty, not pollution and destruction. Touch the hearts of those who look only for gain at the expense of the poor and the earth. Teach us to discover the worth of each thing, to be filled with awe and contemplation, to recognize that we are profoundly united with every creature as we journey towards your infinite light. We thank you for being with us each day. Encourage us, we pray, in our struggle for justice, love and peace.",
			bird: ".......,.,/(##(/..#%#(*,.,/,,*/#%#(.#&&@#//(%/,.*/,*(&@&@%(.*%#/,*/(&@&%/,/#%&,.,*/(#%#/(%#/*/(#%##/../(,%(//(%&#%/,..,(%#/(#%&@&&/,#%#,*/(#&@&%*.*/(&%(./((#%#&%#%&@%/..*%/##&@&*..#%(%@%/../#%#(/*,,(%/*,*/#&@,*(#(#@%,#%@@/.*(//(#%*..*/(#%&@&@.*(#%&@&*,%@%*.,#%#(#%,#%@&@&,.(#%#@..#%&%#%&@&,..*&%&%/../%@&@%./&@@@&@&(,.,(&%&@&,(%&#%&@&*.*#&@&@,./%&%/@&,.#&/#&@./(&@@/(#(#@*./#&@%#*/#%(/(#@&%//&@&@&@#(/,*(#%@&**#&%@&*,*((*,*/#@%.,@&@*,*/(/(/(%#(#%@#*%*,.#&@&%@,*/(/#%#(#@&,.&(,.%&@&@&@(,/#&##(%@%/.@%,.,(&@@&%*/#(&@%#(/(%&&%,..(%&@&@&%@%(*/(#%#%&@%#%@&%#@#/.%&@&#&#%#(#&@&#@%#.(&#.*&&@&%#%&@#(%&&@&%*..*%&@*,(&%&((#%&&%#&@@%*,#@%(.*#%#(##(#%(/%&@&%&@&%,,#&@*((/(#(*/(%&&&%&/./@%(.(&(/*/*/#(//(#(#%#/,*/(/(%&@&%#&@%(*.,/@&/,(&%/(/,*(#%&#(///#%&%@@@&%(.,#&@&%(./%&%(/*#,/(%&%#&@&@%&@%#*,(@%*(#*/(/*/(#//#(*/#&(*/#%&/(%&,(@,.##(#/,.*/*/(/(%&&%(%(,/&/#%#%#*,*/*,.,,*,#@&@/#%&%((&%#%&@#(*(%@*.(%&%/,(#/.,&@&%(/((%&@%@#%#(/(%&(/#&@%(../%*.,(/(#,,.,*%(*(/(/((#%&%&%&##%&%#/#&*.(%&@/,#/*,(#%(/,/#&@&%##%&@#&@%,.#&@(,*#/*,*,,,*((&@&%(#&/*/#&@%/.*%&@&%*.*(%#(*.*(#&&&&(&@&,.#@%*,.(#/,*/(/(#%&@&#%#%/..*%@&@/,.*%#/*,.,.,/@@&@&%@%#*/,.,&*.,*/#@&#%&%#.,/@/.,/#/*,.*,*(#&&@&%#(,./#@#*,.,*,*##(#//%&&@&(,..*%&%#@(*.*,.,*/#&(/*/(#&@##(,,#&@&%/*,(&@,*/*/#&%#/*(#%@%(.,/%*,.(*,./#%/*,*/(/(&*../&&%(*%&@&(%#/*%(,/#&@&@%#/%@(,.*%&@&%#%&@%(//%&#*./#@&%,.,*/%&%&@&&%/(#%&(,,/%#*,,(*,/#%&%#%&@&%(#&@%../#&@&@(#&@&&%/,..,%@%#%&#*,/&@%,.(%#%&%*.,(/,./#,/@&*,/(@%.,(&%#/,/(/.,/%&@%/#@*.*/#@&@&%/(%*.,#%*(%&%&@@/*/.%/#@%/,(*,/#@(/%#&@&,../&@&@@#*,*/%(#%#%&@&&@#(@&@#,.*&&@&/,/#%#,./#%(*#&#,/&(.,*/,#&@&@/*/#&%#%@#%@&*/#@&(,*#*.*(&@&@&@&@%,..*&@&(((#&@,*%&@@&(/(&@&%&@*../&@%#%&*,.*&@%@%@&@%(#&,./#@&&*.,%&@#&%&@@&*%&@(.,%&%@*..#&(,/%&#&@%.,&@@*.,*#&@*.%@&**&%/#,(&%(/%/,,&@&@#/,.(&@%/,,.,(@%&/.&@%,*(%*,.,#(.(%(,,/#*.,.,*,.*%@%,*.*(*,*.,#@#/(#,*(@%,**&(.**(%&(*.,/&@%/.(&@(,#&@%/,,/((,.,(&(.*,.,/%&%(/.%&@&,*/**,/*,.,./#((#%(,.,*(/(%&%/*(/*,*,,(#/./((%#(//,.*,*%#%&%/.(#/#(/.*,,*,.#%#(/*,*/#%(,&@*,,*/&%(/*,.*,*(%@%/,,.*##/,*,.,&%(,,/&,(/(%#(,,*,(%(*.(,*(%&,,*,,**,,%&/*,#&,*,,/%(*,,*#(*,/@,.,,.,%(/.,,(#*,./(*/(/(/(*,.,*(/,,,/(//(/,*,*.,,./*/,/*,*/*.(*,*,*/*/*((*,,*//*//#(*(%#*,*/,.,*/*/#(*(/(/*/*(*,*/*,#,*/%/*,*,/*(//%/,.#%(*/,/(,*%(/(*//*/*#%#*/(/(#*//(#%#*/(/*/#/%&(#(*/*//#(#/(@%#/(/(/*%&@%#(/#((/(#(#((#%@(#/#(#(#//*(/(#(#(((#(#/#%#(#((#(#(#(#/(/(#(#((#*/#(/(/((/(/%(/((/#%##//(#(#%#%#/*#%#%((*,(&##%",
			binary: "011010010111010000100000011101110110000101110011001000000110110001101001011010110110010100100000011101000110100001101001011100110010000001100101011101100110010101110010011110010010000001101101011011110111001001101110011010010110111001100111",
			data: "196201, 2.82, 21.7,-1.82,-1.82, -.22,-1.82,0, 1239, -.04, -.37, -.24, -.94, -.54, -.06, -.17,196202, 3.08, 20.8,-1.35,-1.35,.85, -.87,0, 1173,.53,.21,-.1, -.71, -.54, -.11,-.3,196203,2.2, 33.5,-1.81,-1.81,-1.78,-1.81,0,917,-1.09, -.47, -.52, -.81, -.94, -.32,-.3,196204, 3.88, 44.7,-1.36,-1.36,.79,-.9,0,558,.53, -.37, -.11, -.27, -.87, -.58, -.24,196205, 2.09, 57.4,-2.11,-2.11,-2.69,-2.11,4,306,-1.31, -.48,-1.08, -.88,-1.13, -.94, -.54,196206,3, 65.3,-2.42,-2.42,-1.58,-2.42, 68, 48,-.6,-1.42, -.75, -1,-1.06,-1.12, -.62,196207, 3.36, 66.1,-2.36,-2.36, -.55,-2.36, 88, 36, -.43,-.7, -1.3,-1.05, -.98,-1.31, -.79,196208, 3.63, 66.7,-2.28,-2.28, -.51,-2.28,104, 33, -.08, -.48, -.73,-1.23, -1.1,-1.22, -.67,196209, 3.73, 57.1,-1.93,-1.93,.35,-1.71,8,189,.19,.02, -.28, -.72, -.96, -1, -.83,196210, 4.24, 49.3,-1.34,-1.34, 1.17, -.54,0,457,.66, .5,.34, -.57, -.61, -.62, -.63,196211, 3.46, 35.5, -.97, -.97,.71,.16,0,803,.09,.52,.43, -.15, -.68, -.67, -.51,196212,3.1, 23.2, -.94, -.94, -.22,.08,0, 1215, -.07, -.01,.36,.04, -.33, -.55, -.36",
			chancenotes: "Code is a literature ::: a pattern language ::: a score. It is a choreography ::: a performance. A code renderer is the weaver ::: the mill ::: the alchemist ::: the wizard. Code is a spell ::: an incantation ::: an intent. Chance is a frayed thread, a stochastic cloud, a pointillist field, a variance, a complexity, an uncertainty, a ragged line.  When code is performed, it is an activation of text ::: a linguistic gymnastics that speaks in image & sound. In a perfect confluence of electricity, network, rhythm, memory, processing, action & reactions a program comes to life ::: Pinocchio  ::: a real boi at last. The program (the cybernetic ze) speaks to us, calculates for us, responds to our touch : our keystrokes. It becomes our mirror :|: our cyborg self ::: our memory.. ",
			chancelecturewebs: [": : :", "|:|:| <<-- ::: . ::: -->> |:|:|", "networks", "webs","spiders", "quartets", "the body", "the infinite sky", "the networked (i)", "chords", "tone rows", "electrical current", "radio transmissions", "telephone wires", "choreographies", "scores", "sculpture", "hypertext", "material", "palette", "light", "echo", "resonance", "rivers", "wind mills", "differential equations", "(how things change)", "the carbon cycle", "pipelines", "systems", "cities", "food web", "lattice", "tree", "graph",  "space", "orchestration", "digital cloud", "multi threaded", "multi lingual", "multi dimensional", "infinite between", "gender fluid", "attraction", "diffusion", "distraction", "friction", "resonation", "intra dependent", "ecosystem", "galaxies", "arteries", "cellular connections", "forests", "histories", "the modernist grid", "the API"],
			chancelecturecyborg: ["the cyborg", "trans / border", "trans / platform", "trans / media", "trans / figured", "trans / formed", "trans / gender", "say my name", "cybernetix ze", "cybernetic she", "networked (i)"],
			chancelecture: ["xÅ“Â½YMo", "7Â½ÃÂ¯ÃÃ˜â€°", "(~Hâ€š=$mÃ´P", "oAÃ©Ãši{", "Ã˜Ã¶Ã¯Ã·QÂ³", "k{VjÂ½:YÃƒ", "#Å¡#Â½Gj%â€™â€™)", "DÃ¼Ã¬JIÃ‚Ã¡8Â¹", "Ã—Â´Ã¼Ã½Ã§ÃÃ´ÃªÃ=", "it was", "like this", "every morning", ". . .", "networks", "quartets", "sine waves", "infinite sky", "networked (i)", "chordal looms", "time", "electrical currents", "radio transmissions", "telephone wires", "hypertext sea", "torrents", "navigation", "score", "script", "material", "palette", "light", "resonance", "rivers", "wind mills", "/#&@%#*/#%(", "cities", "echo &amp; &amp;", "algorithms", "functions", "streams", "sound", "books", "words", "vectors", "code", "glyphs", "chalk pigment", "charcoal graphite", "house paint", "wood", "fragments", "web browsers", "computing machines", "the cloud", "the number 4", "red black", "white yellow", "electrical wires", "the carbon cycle", "the room", "rising walls", "the sky", "timelines", "random numbers", "circles lines", "body", "hand", "pitch", "bone", "sinew", "horse hair", "resin", "reed", "taut wire", "&infin; canvas sky", "cloud compass", "warp &amp; weft", "magnetic poles", "traversals", "transects", "densities", "gravities", "elliptical", "bendable time", "physical time", "manifest time", "open systems", "emergent systems", "evolving systems", "weather", "seasons", "night train", "blue window", "lonely passenger", "the century !", "the universe !", "industry !", "sandwiches", "a coin", "7 heavens", "winged angels", "holy, holy, hÃ¸ly", "love, love", "&amp; &amp; &amp;", "flight", "count", "map", "pulse", "breathe", "a topology", "a calculus", "an algebra", "ascensions", "extinctions", "trains", "grids", "clocks", "gears", "|:|:|Ã˜|:|:|", "threads |:| twisted", "crash of waves", "diffusion", "friction", "fray", "echo", "galaxies", "arteries", "neural nets", "forests", "food webs", "labyrinths", "histories", "an API", "technicolor", "galaxies", "infinities", "photosynthesis", "the swarm", "|:|:|<<--:::-->>|:|:|", "chance", "frayed thread", "stochastic cloud", "pointillist field", "variance", "complexity", "uncertainty", "ragged line", "prayer", "hYmn", "spell", "incantation", "invocation", "resistance", "persistence", "siren's lure", "witness", "|:|:|<<--:::-->>|:|:|", "net. x (i)", "(n) coded", "orchestrate", "activate", "pattern language", "digital score", "distillation", "choreography", "performance", "spell ::: ", "::: incantation", "intent", "code", "confluence ", "electricity &amp; network", "rhythm &amp; memory", "map filter reduce", "act || react", "code is", "a literature", "::: a poetry", "= > an intimacy", "fingers", "tapping glass", ": || : rubbing glass", "aladdin's lamp", "fiber optics", "the cyborg body", "the fragile", "electric", "body", "say my name", "|:|:|<<--:::-->>|:|:|", "the cyborg", "trans / border", "trans / platform", "trans / media", "trans / figured", "trans / formed", "trans / gender", "cybernetic ze", "cybernetic she", "web spider", "alchemist", "Ã¸ Z ", "omniscient", "machine learner", "data consumer", "sensitive", "cybernetic", "skull", "(m) bodied", "intelligence", "networked (i)", "encrypted cipher", "mechanized logic", "thinking loom", "subterranean gears", "::: heart / beat", "networked omniscience", "super intelligent Ã¸Z", "big data oracle", "gepetto's workshop", "pinocchio ::: ", ". reAl boi", "zero / Ã¸ne", "true / false", "on || off", "magnetic s/ze", "(i) mirror you ::: ", "speak to you", "|:|:|  remember", "your fingerprints", "your irises", "your steps &amp;&amp;", "destinations", "purchases", "preferences", "tickets", "searches", "longings", "your intimate", "data sets", "your imprint", "signals", "blood || circuits", "pulse", "|:|:|<<--:::-->>|:|:|", "memory", "trace", "(i) i ."],
		},
	};
	z.radio = {
		player: {}, loading: [], loaded: false,
		soundplaying:false,
		clips: {},
		clipduration: { min:0, max:0 },
		nbuffersplaying: 0, maxbuffersplaying: 14,
		intervals: {
			lowi: function(basetone){ return Math.floor(basetone/4) },
			i: function(basetone){ return Math.floor(basetone/2) },
			I: function(basetone){ return Math.floor(basetone/1) },
			II: function(basetone){ return Math.floor(basetone*9/8) },
			III: function(basetone){ return Math.floor(basetone*5/4) },
			iii: function(basetone){ return Math.floor(basetone*6/5) },
			IV: function(basetone){ return Math.floor(basetone*4/3) },
			V: function(basetone){ return Math.floor(basetone*3/2) },
			VI: function(basetone){ return Math.floor(basetone*5/3) },
			VII: function(basetone){ return Math.floor(basetone*15/8) },
			vii: function(basetone){ return Math.floor(basetone*9/5) },
			VIII: function(basetone){ return Math.floor(basetone*2) },
		},
		load: (instruments=["bagpipe1f"]) => {
			instruments.map( name => z.data.sound.instruments[name]).forEach( instrument => {
				z.radio.clips[instrument.clip] = { url: z.data.sound.baseclipurl + instrument.clip + ".mp3", loaded:false, duration:0, buffer:{} };
			});
			Object.keys(z.radio.clips).forEach( key => {
				let clip = z.radio.clips[key];
				if(!z.radio.loading.includes(clip.url)) {
					z.radio.loading.push(clip.url);
					let request = new XMLHttpRequest();
					request.open("GET", window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/" + clip.url, true);
					request.responseType = "arraybuffer";
					request.onload = () =>  {
						z.tools.logmsg("loaded ::: " + clip.url);
						z.radio.player.context.decodeAudioData(request.response, buffer => {
							clip.loaded = true;
							clip.buffer = buffer;
							clip.duration = clip.buffer.duration;
							if( clip.duration > z.radio.clipduration.max) {z.radio.clipduration.max = clip.duration}
							else if( clip.duration < z.radio.clipduration.min) {z.radio.clipduration.min  = clip.duration}
							z.tools.logmsg("decoded ::: " + clip.url);
						}, e => {
							z.tools.logerror("audio error! clip = " + clip.url + ", err = " + e);
						});
						
					};
					request.send();
				}
			});
			z.radio.loaded = true;
		},
		start: () => {
			/* set up player*/
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			z.radio.player.context = new AudioContext();
			/* experimental parameters */
			let parameters = [
				{ gain: 0.4, threshold: -24, knee: 30, ratio: 12, attack: 0.003, release: 0.25 }, //default
				{ gain: 0.3, threshold: -18, knee: 30, ratio: 18, attack: 0.0003, release: 0.28 },
				{ gain: 0.5, threshold: -8, knee: 30, ratio: 18, attack: 0.003, release: 0.28 },
				{ gain: 0.8, threshold: -8, knee: 30, ratio: 18, attack: 0.003, release: 0.28 },
				];
			let n = 0;

			//with compressor
			z.radio.player.compressor = z.radio.player.context.createDynamicsCompressor();
			z.radio.player.compressor.threshold.value = parameters[n].threshold;
			z.radio.player.compressor.knee.value = parameters[n].knee;
			z.radio.player.compressor.ratio.value = parameters[n].ratio;
			
			z.radio.player.compressor.attack.value = parameters[n].attack;
			z.radio.player.compressor.release.value = parameters[n].release;
			z.radio.player.gain = z.radio.player.context.createGain();
			z.radio.player.gain.value = parameters[n].gain;
			z.radio.player.compressor.connect(z.radio.player.gain);
			z.radio.player.gain.connect(z.radio.player.context.destination);
			// //with no compressor
			// z.radio.player.gain = z.radio.player.context.createGain();
			// z.radio.player.gain.value = parameters[n].gain;
			// z.radio.player.gain.connect(z.radio.player.context.destination);
		},
		playtone: ({ volume=0.8, delay=0, fadetime=0.1, duration=1.0, frequency=380 } = {}) => { 
			let vco = z.radio.player.context.createOscillator();
			vco.frequency.value = frequency;
			vco.type = "sine";
			let vca = z.radio.player.context.createGain();
			
			vco.connect(vca);
			vca.connect(z.radio.player.gain);
			let now = z.radio.player.context.currentTime;
			//fade in
			vca.gain.exponentialRampToValueAtTime(0.001, now + delay);
			vca.gain.exponentialRampToValueAtTime(volume, now + fadetime + delay);
			//fade out
			vca.gain.exponentialRampToValueAtTime(volume, now + duration + delay - fadetime);
			vca.gain.exponentialRampToValueAtTime(0.001, now + duration + delay);
			vco.start(now + delay);
			vco.stop(now + delay + duration + fadetime);
			vco.onended = function() {
			  	vco.disconnect(); vca.disconnect();
			}
		},
		playbuffer: ( { volume=0.8, delay=0, fadetime=1, duration=2, instrumentname="bagpipe1f" } = {} ) =>  {
			try {
				let instrument = z.data.sound.instruments[instrumentname];
				let clip = z.radio.clips[instrument.clip];
				// z.tools.logmsg("***buffer requested = " + instrument.clip + " z.radio.nbuffersplaying = " + z.radio.nbuffersplaying);
				if(clip.loaded && (z.radio.nbuffersplaying<z.radio.maxbuffersplaying-1 || z.radio.nbuffersplaying>z.radio.maxbuffersplaying+2)) {
					let rate = instrument.playbackRate ? instrument.playbackRate() : 1.0;
					try {
						// z.tools.logmsg("rate = " + rate + " ::: duration = " + clip.duration*rate);
						let vca = z.radio.player.context.createGain(); 
						let source = z.radio.player.context.createBufferSource();
						source.buffer = clip.buffer;
						source["playbackRate"].value = rate;
						source.connect(vca);
						vca.connect(z.radio.player.gain);
						source.loop = false;
						source.onended = e =>  { 
							z.radio.nbuffersplaying=z.radio.nbuffersplaying-1;
						};
						++z.radio.nbuffersplaying;
						let now = z.radio.player.context.currentTime;
						let dur = Math.min(duration/rate, clip.duration);
						let dt = Math.min(fadetime, dur*.25);
						let offset = z.tools.randominteger(0, (dur-4*dt)*10)/10;
						// source.start(now, offset, dt*4); //parameters (when,offset,duration)
						vca.gain.setValueAtTime(0.001, now);
						vca.gain.exponentialRampToValueAtTime(volume, now + dt);
						vca.gain.setValueAtTime(volume, dur - 2*dt);
						vca.gain.exponentialRampToValueAtTime(0.001, now + dur-dt/2 );
						source.start(now, offset, dur); //parameters (when,offset,duration)
						// z.tools.logmsg("playing = " + clip.url);
					} catch(e) { z.tools.logerror("error applying params to audio buffer e::: " + e) }
				}
				else {	
					z.tools.logmsg("NOT playing = " + clip.url);
				}
			}
			catch(err) { z.tools.logerror("line playbuffer" + err) }
		},
		jukebox: ( { tracks=["IIIaIIfIcsharp3"], partial=false, order="random", j=0, duration=[8,36000], volume=[0.2,0.4], el} ) => {
			z.tools.logmsg("** -> in jukebox el = " + el.getAttribute("id"));
			z.tools.logmsg("** -> in jukebox p = " + JSON.stringify({partial,duration,volume}));
			el.p = {start: 0, end: duration[1], dt: duration[0]/4, volume: 0};
			// el.currentTime=0;
			z.tools.logmsg("** -> in jukebox el.p = " + JSON.stringify(el.p));
			z.tools.logmsg("** -> in jukebox el.currentTime = " + el.currentTime);
			if(partial) {
				el.addEventListener("timeupdate", (e) => {
					try {
						let t = el.currentTime;
						// z.tools.logmsg("** -> in jukebox t = " + t);
						if( t < el.p.start ) { el.currentTime=el.p.start }
						else if( t >= el.p.end) {
							el.pause();
							z.radio.playtracks( {tracks,partial,order,j,duration,volume,el} );
						}
						else if( t < el.p.start + el.p.dt ) {
							// z.tools.logmsg("** -> in eventlistener jukebox el.id = " + el.id);
							// z.tools.logmsg("** -> in eventlistener jukebox e.volume = " + el.volume);
							// z.tools.logmsg("** -> in eventlistener jukebox el.p = " + JSON.stringify(el.p));
							// z.tools.logmsg("** -> in eventlistener jukebox t = " + t);
							// z.tools.logmsg("** -> in eventlistener jukebox el.p.volume/el.p.dt = " + el.p.volume/el.p.dt);
							let x = t*1.0 - el.p.start*1.0;
							// z.tools.logmsg("** -> in eventlistener jukebox t - el.p.start = " + x);
							let y = el.p.volume/el.p.dt * x;
							// z.tools.logmsg("** -> in eventlistener jukebox y = " + y);
							el.volume = el.p.volume/el.p.dt * (t - el.p.start);
						}
						else if(t > el.p.end - el.p.dt) {
							// z.tools.logmsg("** -> in jukebox else t = " + t);
							el.volume = el.p.volume/el.p.dt * (el.p.end - t);
						}
					}
					catch(error) {
						z.tools.logerror("error in timeupdate eventtlistener " + error);
					};
				});
			}
			else {
				el.addEventListener('ended', (e) => {
					z.tools.logmsg("done playing " + tracks[j]);
					j = (j+1)%tracks.length;
					z.radio.playtracks( {tracks,partial,order,j,duration,volume,el} );
				});
			}
			z.radio.playtracks( {tracks,partial,order,j,duration,volume,el} );
		},
		playtracks: ( { tracks=["IIIaIIfIcsharp3"], partial=false, order="random", j=0, duration=[8,36000], volume=[0.2,0.4], el} = {} ) => {
			j = order ==="random" ? z.tools.randominteger(0,tracks.length) : j;
			z.tools.logmsg("** -> in playtracks track = " + tracks[j]);
			z.tools.logmsg("** -> in playtracks p = " + JSON.stringify({track:tracks[j],partial,duration,volume}));
			z.radio.playtrack({track:tracks[j],partial,duration,volume,el});
		},
		playtrack: ({track,partial,duration,volume,el}) => {
			let dur = partial ? Math.min(z.tools.randominteger(duration[0],duration[1]), z.data.sound.tracks[track].duration) : z.data.sound.tracks[track].duration;
			// let duration = z.tools.randominteger(4, 20);
			let start = partial ? z.tools.randominteger(0,z.data.sound.tracks[track].duration-dur) : 0;
			let dt = Math.floor(Math.min(4, dur/4));
			
			el.currentTime=start;el.src = z.data.sound.basetrackurl + z.data.sound.tracks[track].url;
			let v = z.tools.randominteger(volume[0]*10,volume[1]*10)/10
			el.volume = partial ? 0 : v;
			el.p = {start: start, end: start+dur, dt: dt, volume: v};
			z.tools.logmsg("** -> in playtrack el.p = " + JSON.stringify(el.p));
			el.currentTime=start; 
			// el.playbackRate = z.tools.randominteger(100,200)/100;
			z.tools.logmsg("in playtrack track = " + track + " el.currentTime = " + el.currentTime + " duration = " + duration + " dt = " + dt + " start = " + start);
			if(z.radio.soundplaying) {

				let isPlaying = el.currentTime > 0 && !el.paused && !el.ended && el.readyState > el.HAVE_CURRENT_DATA;
				z.tools.logmsg("in radio -- src = " + el.src + " isplaying=" + isPlaying);
				let playPromise = el.play();
				if(!isPlaying) {
					playPromise.then( () => {
						z.tools.logmsg("now playing " + el.src);
					})
					.catch(error => {
						z.tools.logerror("error playing " + el.src);
						// Auto-play was prevented
						// Show paused UI.
					});
				}
			}
		},
		play: () => {},
		pause: () => {}
	};
	//core elements
	z.elements = ( () => {
		return {
			body: { el: document.querySelector("body") },
			main: { el: document.querySelector("main") },
			// clock: { el: document.querySelector("#clock") },
			// telegraph: { el: document.querySelector("#telegraph") },
			// svg:  { el: document.querySelector("#svg") },
			frames: ["svgframe", "divframe", "wordframe", "subtextframe", "contentframe"].reduce( (acc, id) => {
				z.tools.logmsg("create frame element ::: " + id);
				acc[id] = { el: document.querySelector("#"+id) };
				return acc;
			}, {}),
			poems: Array.from(document.querySelectorAll(".poem")).reduce( (acc,el,j)=> {
				z.tools.logmsg("create poem element ::: " + j);
				// el.setAttribute("id", "poem"+j);
				acc[j]={ el:el, id:"poem"+j, stanzas: Array.from(el.querySelectorAll(".stanza")).reduce( (acc,el,j)=> {
					// z.tools.logmsg("el.className ::: " + el.className);
					el.setAttribute("id", "stanza"+j);
					// el.className= "stanza " + afterclassnames1[j%afterclassnames1.length] + " " + afterclassnames2[0];

					acc[j]={ el:el, lines:Array.from(el.querySelectorAll("li")).reduce( (acc,el,j)=> {
						// z.tools.logmsg("create line element ::: " + j);
						// el.setAttribute("id", "line"+j);
						acc[j]={ el:el };
						return acc;
						}, []) }; 
					return acc;
				}, []) };
				return acc;
			}, []),
		}
	})();

	

		//set controls
	( () => {

		let sound = document.querySelector("#sound");
		if(sound!==null) {
			sound.addEventListener("change", () => {
				if(sound.checked) {
					try {
						z.radio.player.context.resume().then(() => {
							z.tools.logmsg("playback resumed");
							z.radio.soundplaying = true;
							z.radio.play();
						});
					} catch(e) { z.tools.logerror("dashboard ::: resumeaudio " + e) } 
				}
				else {
					try {
						z.radio.player.context.suspend().then(() => {
							z.radio.soundplaying = false;
							z.radio.pause();
						});
					} catch(e) { z.tools.logerror("dashboard ::: suspendaudio " + e) }
				}			
			});
		}

		let animationonly = document.querySelector("#animationonly");
		if(animationonly==null) {
			animationonly = z.tools.createElement({
				parentel: z.elements.frames["contentframe"].el, tag: "input",
				attributes: [ ["id", "animationonly"], ["type", "checkbox"] ]
			});
			z.tools.createElement({
				parentel: z.elements.frames["contentframe"].el, tag: "label",
				attributes: [ ["for", "animationonly"] ]
			});
		}
		animationonly.addEventListener("change", () => {
			if(animationonly.checked) {
				z.elements["main"].el.style["opacity"] = 0.0;
				z.elements.frames["contentframe"].el.classList.add("hidebg");
			}
			else {
				z.elements["main"].el.style["opacity"] = 1.0;
				z.elements.frames["contentframe"].el.classList.remove("hidebg");
			}
		});

		let largetext = document.querySelector("#largetext");
		if(largetext==null) {
			largetext = z.tools.createElement({
				parentel: z.elements["main"].el, tag: "input",
				attributes: [ ["id", "largetext"], ["type", "checkbox"] ]
			});
			let label = z.tools.createElement({
				parentel: z.elements["main"].el, tag: "label",
				attributes: [ ["for", "largetext"] ]
			});
			label.innerText = "large text";
		}
		largetext.addEventListener("change", () => {
			if(largetext.checked) {
				// z.elements["main"].el.classList.add("highcontrast");
				z.elements.frames["contentframe"].el.classList.add("largetext");
				z.largetext = true;
			}
			else {
				// z.elements["main"].el.classList.remove("highcontrast");
				z.elements.frames["contentframe"].el.classList.remove("largetext");
				z.largetext = false;
			}
			// highcontrast.checked ? z.elements["main"].el.classList.add("highcontrast") : z.elements["main"].el.classList.remove("highcontrast");
		});

		let highcontrast = document.querySelector("#highcontrast");
		if(highcontrast==null) {
			highcontrast = z.tools.createElement({
				parentel: z.elements["main"].el, tag: "input",
				attributes: [ ["id", "highcontrast"], ["type", "checkbox"] ]
			});
			let label = z.tools.createElement({
				parentel: z.elements["main"].el, tag: "label",
				attributes: [ ["for", "highcontrast"] ]
			});
			label.innerText = "high contrast";
		}
		highcontrast.addEventListener("change", () => {
			if(highcontrast.checked) {
				// z.elements["main"].el.classList.add("highcontrast");
				z.elements.frames["contentframe"].el.classList.add("highcontrast");
				z.highcontrast = true;
			}
			else {
				// z.elements["main"].el.classList.remove("highcontrast");
				z.elements.frames["contentframe"].el.classList.remove("highcontrast");
				z.highcontrast = false;
			}
			// highcontrast.checked ? z.elements["main"].el.classList.add("highcontrast") : z.elements["main"].el.classList.remove("highcontrast");
		});
		let darklight = document.querySelector("#darklight");
		if(darklight==null) {
			darklight = z.tools.createElement({
				parentel: z.elements["main"].el, tag: "input",
				attributes: [ ["id", "darklight"], ["type", "checkbox"] ]
			});
			z.tools.createElement({
				parentel: z.elements["main"].el, tag: "label",
				attributes: [ ["for", "darklight"] ]
			});
		}
		darklight.addEventListener("change", () => {
			if(!darklight.checked) {
				z.elements.frames["contentframe"].el.classList.add("day");
				document.documentElement.style.setProperty("--corecolor", "var(--daycolor)");
				document.documentElement.style.setProperty("--corebg", "var(--daybg)");
				document.documentElement.style.setProperty("--coreveilbg", "var(--dayveilbg)");
				z.day = true;
			}
			else {
				z.elements.frames["contentframe"].el.classList.remove("day");
				document.documentElement.style.setProperty("--corecolor", "var(--nightcolor)");
				document.documentElement.style.setProperty("--corebg", "var(--nightbg)");
				document.documentElement.style.setProperty("--coreveilbg", "var(--nightveilbg)");
				z.day = false;
			}
			// highcontrast.checked ? z.elements["main"].el.classList.add("highcontrast") : z.elements["main"].el.classList.remove("highcontrast");
		});
		
	})();
	return z;
};
