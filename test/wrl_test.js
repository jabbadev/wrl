/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
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
			this.res1 = new window.Resource("a","js",{ id: "aRes", url: "a.js", require: ["c","d" ]});
			this.res2 = new window.Resource("b","js",{url: "b.js", depon: [ "a" ]});
			this.virt = new window.Resource("virt","js",{depon: ["a","b"]});
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
		
		console.log('tag: ',this.res1.tag());
	});	
	module('test [ Config ] object',{
		setup: function(){
			this.config = new window.Config();
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
		
	});

}(jQuery));
