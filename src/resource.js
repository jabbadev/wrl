function Resource(resName,resType,resConf){
	
	/* Public function */
	this.pointer = function(){
		var self = this;
		return function(){
			return self;
		};
	};
	
	this.isLoaded = function(value){
		if(typeof value !== "undefined"){
			res.loaded = value;
			return res.loaded;
		}
		return res.loaded;
	};
	this.isLoading = function(value){
		if(typeof value !== "undefined"){
			res.loading = value;
			return res.loaded;
		}
		return res.loading;
	};
	this.ready = function(){
		if ( res.loaded && !res.loading ){
			return true;
		}
		return false;
	};
	
	this.load = function(callback){
		res.loading = true;
		//this.pluggedLoad(this.resLoadHandler,res,callback);
		this.pluggedLoadJS(this.resLoadHandler,res,callback);
	};
	
	this.resLoadHandler = function(res,callback){
		res.loading = false;
		res.loaded = true;
		var _d = (typeof callback === "function") && callback(res);
	};
	
	this.url = function(){return res.url;};
	this.require = function(){return res.require;};
	this.name = function(){return res.name;};
	this.isVirtual = function(){return res.virtual;};
	
	/* Init Instance */
	var res = {};
	res.virtual = (typeof(resConf.url)==="undefined") && true || false;
	res.name = resName;
	res.type = resType;
	res.id = resConf.id || null;
	res.require =resConf.require || null;
	res.url = resConf.url;
	res.defer = resConf.defer || false;
	res.loaded = false;
	res.loading = false;
	res.media = resConf.media || null;
}

Resource.prototype.pluggedLoad = function(handler,res,callback){
	handler(res,callback);
};

Resource.prototype.pluggedLoadJS = function(handler,res,callback){
	handler(res,callback);
};

Resource.prototype.pluggedLoadCSS = function(handler,res,callback){
	handler(res,callback);
};

Resource.prototype.pluggedLoadGET = function(handler,res,callback){
	handler(res,callback);
};