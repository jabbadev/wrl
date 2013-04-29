(function($) {
	
	module('test jQuery.wrl',{
		setup: function(){
			//this.config = new Config();
		}
	});
	
	test('test [ jQuery.wrl ]',function(){
		ok(typeof($.wrl)=== "object","wrl plugin is ready");
		
		var loader = $.wrl.addLoader({name: 'test',
			config: {
			js:{'dep': { url: "../libs/test-res/dep.js" ,depon: ['e','f'] }, 'req': { url: "../libs/test-res/req.js" ,require: ['e','f'] }, a: {url: "a.js", require: ['d'] }, b: {url: "b.js"}, c: {url: "c.js"},
				d: {url: "../libs/test-res/d.js", require: ['e','f'], depon: [ "z" ] }, e: { url: "../libs/test-res/e.js" }, f: {url: "../libs/test-res/f.js"},
				z: { url: "z.js", depon: ["p","q"] },p: {url: "p.js"},q: {url: "q.js"} },
			css:{a: {url: "a.css" }, b: {url: "b.js" } },
			html:{ a: {url: "a.htm"}}
		}});
		
		ok(typeof(loader)==="object","jquery chain obj");
		ok(typeof($.wrl.loaders.test)==="object","loader test is ready");
			
	});
	
	asyncTest( "Async test loading scripts",3, function() {	
			
		var calculator = $.wrl.addLoader({
			name: 'calc',
			opt : { events: { type: "byname" } },
			config: {
				js: {
					a: { url: "../libs/test-res/a.js" },
					b: { url: "../libs/test-res/b.js" , require: ['c:wait'] },
					c: { url: "../libs/test-res/c.js" },
					e: { url: "../libs/test-res/e.js", require: ['f'] },
					f: { url: "../libs/test-res/f.js"},
					calc1 : { url: "../libs/test-res/calc1.js", require: ['a','b'] }  
				},
				css: {
					virtual : { require: [ "a","b" ] },
					a: { url: "../libs/test-res/a.css" },
					b: { url: "../libs/test-res/b.css", require: [ "z","y" ]},
					z: { url: "../libs/test-res/z.css" },
					y: { url: "../libs/test-res/y.css", attach: "last" }
				},
				get: {
					a: {url: "../libs/test-res/a.html", require: ["b" ]},
					b: {url: "../libs/test-res/b.html"}
				}
			}});
		
		function calc1(callback){
			calculator.loadJS('calc1',callback);
		}
		
		function testCss(callback){
			calculator.loadCSS('virtual',callback);
		}
		
		function load_e(callback){
			window.e = 0;
			calculator.loadJS('e');
			calculator.on('js-e',function(event,eventData){
				equal(window.e,100000,'event jsE script e.js is ready ');
			});
		}
		
		function get(callback){
			calculator.loadGET("a",callback);
		}
		
		window.BASE_TS = new Date().getTime();
		calc1(function(reslist){
			equal(window.CALC1,100000,"javascript calc1 is loaded");
		});
		
		load_e(function(reslist){
			ok(true,'e is loaded ....');
		});
		
		testCss(function(reslist){
			equal($('#wrlbox').css('text-align'),"center","label wrlbox moved to center");
		});
		
		get(function(reslist){
			$('fieldset').append(reslist[1].data);
			$('#boxB').append(reslist[0].data);
		});
		
		setTimeout(function(){
			start();
		},5000);
		
	});
	
	}(jQuery));