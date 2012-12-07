function Resource(resName,resConf){
	this.set = function(prop,value){res[prop]=value;};
	this.get = function(prop){ return res[prop];};
	this.isLoaded = function(){return res.loaded;};
	this.getDepon = function(){return res.depon;};
	this.getRequire = function(){return res.require;};
	this.isVirtual = function(){return res.virtual;};
	
	/* Init Instance */
	var res = {};
	res.virtual = (typeof(resConf.url)==="undefined") && true || false;
	res.name = resName;
	res.id = resConf.id || null;
	res.depon = resConf.depon || null;
	res.require =resConf.require || null;
	res.url = resConf.url;
	res.deferred = resConf.deferred || false;
	res.loaded = false;
}