function Resource(resName,resConf){
	//this.set = function(prop,value){res[prop]=value;};
	//this.get = function(prop){ return res[prop];};
	
	this.isLoaded = function(value){
		if(typeof(value) !== "undefined"){
			res.loaded = value;	
		}
		return res.loaded;
	};
	
	this.url = function(){return res.url;};
	this.depon = function(){return res.depon;};
	this.require = function(){return res.require;};
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