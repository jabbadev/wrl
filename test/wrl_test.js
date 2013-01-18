/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
/*global Resource, Config*/
(function($) {

  /*
    ======== A Handy Little QUnit Reference ========
    http://docs.jquery.com/QUnit

    Test methods:
      expect(numAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      raises(block, [expected], [message])
  */
	
	module('test [ Resource ] object',{
		setup: function(){
			this.resLoaded = false;
			this.res1 = new Resource("a","js",{ id: "aRes", url: "a.js", require: ["c","d" ]});
			this.res2 = new Resource("b","js",{ defer: "true", url: "b.js", require: [ "a" ]});
			this.virt = new Resource("virt","js",{require: ["a","b"]});
			this.css = new Resource("a","css",{ id: "cssID", url: "a.css", media: "print" });
			this.css1 = new Resource("a","css",{ attach: "last", url: "a.css" });
			this.load = new Resource("a","js",{ url: "../libs/test-res/a.js" });
			this.res3 = new Resource("a","js",{ url: "a.js", require: [ "b","z","c:wait","b:wait","x","y" ]});
			this.html = new Resource("a","get",{ url: "../libs/test-res/a.html" });
		}
	});
	
	test('test [ Resource ]',function(){
		var $this = this;
		
		equal(this.res1.url(),"a.js","getter ok");
		equal(this.res1.isLoaded(),false,"resource is not loaded");
		this.res1.isLoaded(true);
		notEqual(this.res1.isLoaded(),false,"resource is loaded");
		equal(this.res1.isLoaded(),true,"resource is loaded method");
		deepEqual(this.res1.require(),["c","d" ],"require is set");
		equal(this.virt.isVirtual(),true,"Is virtual resource");
		equal(this.res1.ready(),true,"Resource res1 is ready");
		equal(this.res2.ready(),false,"Resource res2 is not ready");
		this.res2.isLoading(true);
		equal(this.res2.ready(),false,"Resource res2 is not ready");
		this.res2.isLoaded(true);
		this.res2.isLoading(false);
		equal(this.res2.ready(),true,"Resource res2 is ready");
		var pa = this.load.pointer();
		ok(this.load.url() === pa().url(),"access to res by pointer");
		this.load.isLoaded(true);
		equal(this.load.isLoaded(),true,"res is loaded");
		equal(pa().isLoaded(),true,"res is loaded [ access by pointer ]");
		ok(!this.resLoaded,'check res not loaded');
		this.load.load(function(){$this.resLoaded = true; ok($this.resLoaded,'callback resource is loaded');});
		equal(this.load.isLoaded(),true,"Resource a is loaded after call load function");
		equal(this.css.attach(),"first","Attach css on top of the head");
		equal(this.css1.attach(),"last","append css on head");
		deepEqual(this.html.data({html: "<div>Prova</div>"}),{html: "<div>Prova</div>"},"setter res.data ");
		deepEqual(this.html.data().html,"<div>Prova</div>","getter res.data ");
	});
	
	module('test [ Config ] object',{
		setup: function(){
			var $this = this;
			this.config = new Config();
			this.q = false;
			this.config.plugLoadJS(function(handler,res,callback){
				$this.q = true;
				handler(res,callback);	
			});
		}
	});
	
	test('test [ Config ]',function(){
		ok(typeof(this.config)==="object","oggetto corretamente istanziato");		
		
		this.config.load({
			js:{
				virtual: { require: ['a','c'] },
				a: {url: "a.js",require: ['d']},
				b: {url: "b.js"},
				c: {url: "c.js"},
				d: {url: "d.js",require: ['e','f']},
				e: {url: "e.js"},
				f: {url: "f.js"},
				z: { url: "z.js",require: ["p","q"]},
				p: {url: "p.js"},
				q: {url: "q.js"}
			},
			css:{
				virtual: { require: ['a','b'] },
				a: {url: "a.css", attach: "last" },
				b: {url: "b.js"}
			},
			get:{
				a: {url: "a.html", require: ["b" ] },
				b: { url: "c.html" }
			}
		});
		
		var reslist = this.config.getJsReq('virtual');
		var jslist = [];
		for( var i in reslist ){
			jslist.push(reslist[i].res().url());
		}
		deepEqual(jslist,["e.js", "f.js", "d.js", "a.js", "c.js"],"required resources to load");
		
		reslist = this.config.getJsReq('virtual'); jslist = [];
		for ( i in reslist ){
			jslist.push(reslist[i].res().name());
		}
		deepEqual(jslist,["e", "f", "d", "a", "c"],"dependency name resources to load");
		
		equal(this.config.jsReady('d').ready,false,"res d not ready");
		this.config.jsLoading('e',true);
		equal(this.config.jsReady('e').ready,false,"res e not ready");
		this.config.jsLoading('e',false);
		this.config.jsLoaded('e',true);
		equal(this.config.jsReady('e').ready,true,"res e is ready");
		equal(this.config.jsReady('d').nrr,1,"n of resurces ready");
		var stat = this.config.jsReady('d');
		this.config.jsLoaded('f',true);
		stat = this.config.jsReady('d');
		this.config.jsLoaded('z',true);
		stat = this.config.jsReady('d');
		equal(stat.loadPerc(),66.67,"50% loaded of d res");
		equal(stat.ready,false,"res d not ready");
		this.config.jsLoaded('p',true);
		this.config.jsLoaded('q',true);
		stat = this.config.jsReady('d');
		this.config.jsLoaded('d',true);
		stat = this.config.jsReady('d');
		equal(stat.loadPerc(),100.00,"100% loaded of d res");
		equal(stat.ready,true,"res d is ready");
		
		var res = this.config.getJsReq('e')[0];
		equal(res.res().isLoaded(),true,"res e is not loaded");
		res.res().isLoaded(true);
		equal(res.res().isLoaded(),true,"res e is loaded");
		equal(this.config.jsLoaded('e'),true,"res is not loaded");
		ok(res.res().isLoaded() === this.config.jsLoaded('e'),"resource e config are the same");
		
		ok(!this.q,'check pre load q res ...');
		var $this = this;
		res = this.config.getJsReq('q')[0];
		res.res().load(function(){ ok($this.q,"res q loaded ...."); });
		
		var csslist = this.config.getCssReq('virtual');
		equal(csslist[0].res().name(),"a","first css is a.css");
		equal(csslist[0].res().attach(),"last","append a.css");
		equal(csslist[1].res().name(),"b","second css is b.css");
		equal(csslist[1].res().name(),"b","attach b on top of head");
		
		var html = this.config.getGetReq('a');
		deepEqual([ html[0].res().url(),html[1].res().url() ],[ "c.html","a.html" ],"list of get resource");
		
		html[0].res().isLoaded(true);
		equal(this.config.getReady('a').ready,false,"get resources non ready");
		html[1].res().isLoaded(true);
		equal(this.config.getReady('a').ready,true,"get resources ready");
		
	});
	
	module('test jQuery.wrl',{
		setup: function(){
			this.config = new Config();
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
		};
		
		function testCss(callback){
			calculator.loadCSS('virtual',callback);
		};
		
		function load_e(callback){
			e = 0;
			calculator.loadJS('e');
			calculator.on('js-e',function(event,eventData){
				equal(e,100000,'event jsE script e.js is ready ');
			});
		}
		
		function get(callback){
			calculator.loadGET("a",callback);
		}
		
		BASE_TS = new Date().getTime();
		calc1(function(reslist){
			equal(CALC1,100000,"javascript calc1 is loaded");
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
