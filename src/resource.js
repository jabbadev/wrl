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
		
		var _d = null;
		if (!res.loaded && !res.loading ){
			res.loading = true;
			res.statinfo = "resource in loading";
			res.statcode = 1;
			_d = ( res.type === "js" ) && this.pluggedLoadJS(this.resLoadHandler,res,callback);
			_d = ( res.type === "css" ) && this.pluggedLoadCSS(this.resLoadHandler,res,callback);
			_d = ( res.type === "get" ) && this.pluggedLoadGET(this.resLoadHandler,res,callback);
		}
		else {
			_d = (typeof callback === "function") && callback(res);
		}
	};
	
	this.resLoadHandler = function(res,callback){
		res.loading = false;
		res.loaded = true;
		res.statinfo = "resource is loaded";
		res.statcode = 2;
		var _d = (typeof callback === "function") && callback(res);
	};
	
	this.data = function(data){ if(typeof data !== "undefined" ){ res.data = data; } return res.data; };
	
	this.url = function(){return res.url;};
	this.require = function(){return res.require;};
	this.name = function(){return res.name;};
	this.isVirtual = function(){return res.virtual;};
	this.attach = function(){return res.attach;};
	this.statinfo = function(){return res.statinfo;};
	this.statcode = function(){return res.statcode;};
	
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
	res.attach = resConf.attach || "first";
	res.data = null;
	res.statinfo = "resourse not loaded";
	res.statcode = 0;
	/* only for css:
	 * 1) first ( attach on top of head )
	 * 2) last ( append to head )
	 * */
}

Resource.prototype.pluggedLoadJS = function(handler,res,callback){
	handler(res,callback);
};

Resource.prototype.pluggedLoadCSS = function(handler,res,callback){
	handler(res,callback);
};

Resource.prototype.pluggedLoadGET = function(handler,res,callback){
	handler(res,callback);
};