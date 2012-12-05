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
	var config = new window.Config();
	
	test('Resources [ config ]',function(){
		ok(typeof(config)==="object","oggetto corretamente istanziato");		
		config.load({
			js: { a: { url: "a.js" }, b: { url: "b.js" }, c: { url: "c.js" },
				  d: { url: "d.js" }, e: { url: "e.js" }, f: { url: "f.js" }},
			css: {a: { url: "a.css" }, b: { url: "b.js" } },
			html: {
				a: { url: "a.htm" }
			}
		});
		
		deepEqual(config.js().a,{ url: "a.js" },"access to js config resource a");
	});

}(jQuery));
