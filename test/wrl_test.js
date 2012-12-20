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
	//var config = new window.Config();
	module('test [ Resource ] object',{
		setup: function(){
			this.res1 = new Resource("a","js",{ id: "aRes", url: "a.js", require: ["c","d" ]});
			this.res2 = new Resource("b","js",{ defer: "true", url: "b.js", depon: [ "a" ]});
			this.virt = new Resource("virt","js",{depon: ["a","b"]});
			this.css = new Resource("a","css",{ id: "cssID", url: "a.css", media: "print" });
			this.load = new Resource("a","js",{ url: "../libs/test-res/a.js" });
		}
	});
	
	test('test [ Resource ]',function(){
		equal(this.res1.url(),"a.js","getter ok");
		equal(this.res1.isLoaded(),false,"resource is not loaded");
		this.res1.isLoaded(true);
		notEqual(this.res1.isLoaded(),false,"resource is loaded");
		equal(this.res1.isLoaded(),true,"resource is loaded method");
		ok(this.res1.depon() == null,"depon not set");
		ok(this.res2.depon() != null,"depon is set");
		deepEqual(this.res1.require(),["c","d" ],"require is set");
		equal(this.virt.isVirtual(),true,"Is virtual resource");
		equal(this.res1.tag(),'<script type="text/script" src="a.js" id="aRes"></script>',"tag script with id");
		equal(this.res2.tag(),'<script type="text/script" src="b.js" defer="defer"></script>',"tag script with defer");
		equal(this.css.tag(),'<link type="text/css" rel="stylesheet" href="a.css" id="cssID" media="print"></link>',"tag css");
		equal(this.res1.ready(),true,"Resource res1 is ready");
		equal(this.res2.ready(),false,"Resource res2 is not ready");
		this.res2.isLoading(true);
		equal(this.res2.ready(),false,"Resource res2 is not ready");
		this.res2.isLoaded(true);
		this.res2.isLoading(false);
		equal(this.res2.ready(),true,"Resource res2 is ready");
		
		console.log(this.load.tag());
	});
	
	module('test [ Config ] object',{
		setup: function(){
			this.config = new Config();
		}
	});
	
	test('test [ Config ]',function(){
		ok(typeof(this.config)==="object","oggetto corretamente istanziato");		
		
		this.config.load({
			js:{'virtual': { require: ['a','c'] }, a: {url: "a.js", require: ['d'] }, b: {url: "b.js"}, c: {url: "c.js"},
				d: {url: "d.js", require: ['e','f'], depon: [ "z" ] }, e: {url: "e.js"}, f: {url: "f.js"},
				z: { url: "z.js", depon: ["p","q"] },p: {url: "p.js"},q: {url: "q.js"} },
			css:{a: {url: "a.css" }, b: {url: "b.js" } },
			html:{ a: {url: "a.htm"}}
		});
		
		var reslist = this.config.getJsReq('virtual');
		var jslist = [];
		for( var i in reslist ){
			jslist.push(reslist[i].url());
		}
		deepEqual(jslist,["e.js", "f.js", "d.js", "a.js", "c.js"],"required resources to load");
		
		reslist = this.config.getJsDep('d');
		jslist = [];
		for( i in reslist ){
			jslist.push(reslist[i].url());
		}
		deepEqual(jslist,["p.js", "q.js", "z.js", "d.js"],"dependency resources to load");
		reslist = this.config.getJsReq('virtual'); jslist = [];
		for ( i in reslist ){
			jslist.push(reslist[i].name());
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
		equal(stat.loadPerc(),50.00,"50% loaded of d res");
		equal(stat.ready,false,"res d not ready");
		this.config.jsLoaded('p',true);
		this.config.jsLoaded('q',true);
		stat = this.config.jsReady('d');
		this.config.jsLoaded('d',true);
		stat = this.config.jsReady('d');
		equal(stat.loadPerc(),100.00,"100% loaded of d res");
		equal(stat.ready,true,"res d is ready");
	});
	
	module('test jQuery.wrl',{
		setup: function(){
			this.config = new Config();
		}
	});
	
	test('test [ jQuery.wrl ]',function(){
		ok(typeof($.wrl)=="object","wrl plugin is ready");
		
		var loader = $.wrl.addLoader('test',{
			js:{'virtual': { require: ['a','c'] }, a: {url: "a.js", require: ['d'] }, b: {url: "b.js"}, c: {url: "c.js"},
				d: {url: "d.js", require: ['e','f'], depon: [ "z" ] }, e: {url: "e.js"}, f: {url: "f.js"},
				z: { url: "z.js", depon: ["p","q"] },p: {url: "p.js"},q: {url: "q.js"} },
			css:{a: {url: "a.css" }, b: {url: "b.js" } },
			html:{ a: {url: "a.htm"}}
		});
		ok(typeof(loader)==="object","jquery chain obj");
		ok(typeof($.wrl.loaders.test)==="object","loader test is ready");
		
		loader.loadJS('d');
		//loader.loadJS('e');
	});
	
}(jQuery));
