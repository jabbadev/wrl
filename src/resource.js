function Resource(resName,resType,resConf){
	
	var buildHtmlTag = {
			js: function(){
				var out = '<script type="text/script" src="' + res.url + '"';
				out += ( res.id ) && ' id="' + res.id + '"' || "";
				out += ( res.defer ) && ' defer="defer"' || "";
				out += "></script>"; 
				return out;
			},
			css: function(){
				var out = '<link type="text/css" rel="stylesheet" href="' + res.url + '"';
				out += ( res.id ) && ' id="' + res.id + '"' || "";
				out += ( res.media ) && ' media="' + res.media + '"' || "";
				out += "></link>"; 
				return out;
			}
	};
	
	var buildDomElement = {
		js: function(eventLoadHandler){
			var script_tag = document.createElement("script");
			script_tag.setAttribute("type","text/javascript");
			script_tag.setAttribute("charset","utf-8");
			script_tag.setAttribute("src",res.url);
			script_tag.onload = eventLoadHandler;
			script_tag.onreadystatechange = function () { /* Same thing but for IE */
				if (this.readyState === "complete" || this.readyState === "loaded") {
					eventLoadHandler();
				}
			};
			return script_tag;
		}
	};
	
	/* Public function */
	this.pointer = function(){
		var self = this;
		return function(){
			return self;
		};
	};
	
	this.isLoaded = function(value){
		if(typeof(value) !== "undefined"){
			res.loaded = value;
			return res.loaded;
		}
		return res.loaded;
	};
	this.isLoading = function(value){
		if(typeof(value) !== "undefined"){
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
		this.pluggedLoad(this.resLoadHandler,res,callback);
		
		/*
		if ( res.type === "js" ){
			var s = buildDomElement[res.type](callback);
			(document.getElementsByTagName("head")[0] || document.documentElement).appendChild(s);
		}
		if ( this.type === "css" ){
		}*/
		
	};
	
	this.resLoadHandler = function(res,callback){
		res.loading = false;
		res.loaded = true;
		callback();
	}
	
	this.url = function(){return res.url;};
	this.depon = function(){return res.depon;};
	this.require = function(){return res.require;};
	this.name = function(){return res.name;};
	this.isVirtual = function(){return res.virtual;};	
	this.tag = function(){
		return buildHtmlTag[res.type]();
	};
	
	/* Init Instance */
	var res = {};
	res.virtual = (typeof(resConf.url)==="undefined") && true || false;
	res.name = resName;
	res.type = resType;
	res.id = resConf.id || null;
	res.depon = resConf.depon || null;
	res.require =resConf.require || null;
	res.url = resConf.url;
	res.defer = resConf.defer || false;
	res.loaded = false;
	res.loading = false;
	res.media = resConf.media || null;
}

Resource.prototype.pluggedLoad = function(handler,res,callback){
	handler(res,callback);
}