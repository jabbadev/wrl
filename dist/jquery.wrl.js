/*! Web Resource Loader - v0.1.0 - 2013-05-31
* Copyright (c) 2013 Francesco Dalprà; Licensed MIT */

/*
	* jquery.wrl
	* 
	*
	* Copyright (c) 2012 Francesco Dalpra'
	* Licensed under the MIT license.
	*/
(function($) {

/*global Resource:true*/
function Config() {
	var conf = {};
	
	function _getres(resType,names){
		if ( typeof(names) === "undefined" ){
			return conf[resType];
		}
		if ( typeof(names) === "string" ){
			return conf[resType][names];
		}
		if ( typeof(names)==="object" && typeof(names.length) === "number" ){
			var out = {};
			for(var i in names){
				out[names[i]] = conf[resType][names[i]];
			}
			return out;
		}
	}
	
	function _buildChain(resType,resInfo,resChain){
		var res = _getres(resType,resInfo.name);
		
		var _resList = res['require']();
		var resList = [];
		for(var i in _resList){
			var _re = /^([\w|\W]+):([\w|\W]+)$/.exec(_resList[i]);
			var _d = _re?resList.push({name:_re[1],meth:_re[2]}):resList.push({name:_resList[i],meth:null});
		}
		
		var _dummy;
		if (resList){
			for(var rn in resList){
				_buildChain(resType,resList[rn],resChain);
			}
			_dummy = res.isVirtual()||resChain.push({meth: resInfo.meth,res: res.pointer()});
		}
		else {
			_dummy = res.isVirtual()||resChain.push({meth: resInfo.meth,res: res.pointer()});
		}
	}
	
	function _getRes(resType,resName){
		var resChain = [];
		_buildChain(resType,{name: resName,meth: null},resChain);
		return resChain;
	}
	
	function _resReady(resType,resName){
		var resources = _getRes(resType,resName);
		
		var status = {
			ready: false,
			tot: resources.length,
			readyRef:[],
			resurces:[],
			nrr: 0,
			loadPerc: function(){
				return (this.nrr*100/this.tot).toFixed(2);
			}
		};
		for(var i in resources){
			var res = resources[i];
			if(res.res().ready()){
				status.nrr++;
				status.readyRef.push(res.res().name());
			}
			else {
				status.resurces.push(res.res().name());
			}
		}
		status.ready = ( status.tot === status.nrr ); 
		return status;
	}
	
	function _resLoaded(resType,resName,value){
		return conf[resType][resName].isLoaded(value);
	}
	function _resLoading(resType,resName,value){
		return conf[resType][resName].isLoading(value);
	}
	
	/* Public methods */
	
	this.jsLoaded = function(resName,value){ return _resLoaded('js',resName,value);};
	this.jsLoading = function(resName,value){return _resLoading('js',resName,value);};
	
	this.getJsReq = function(resName){return _getRes('js',resName);};
	this.getCssReq = function(resName){return _getRes('css',resName);};
	this.getGetReq = function(resName){return _getRes('get',resName);};
		
	this.jsReady = function(resName){
		return _resReady('js',resName);
	};
	
	this.cssReady = function(resName){
		return _resReady('css',resName);
	};
	
	this.getReady = function(resName){
		return _resReady('get',resName);
	};
	
	this.load = function(config){
		for(var resType in {js: true,css: true,get: true }){
			conf[resType]={};
			for(var resName in config[resType]){
				conf[resType][resName]= new Resource(resName,resType,config[resType][resName]);
			}
		}
	};
	
	this.plugLoad = function(fnLoad){
		Resource.prototype.pluggedLoad = fnLoad;
	};
	
	this.plugLoadJS = function(fnLoadJS){
		Resource.prototype.pluggedLoadJS = fnLoadJS;
	};
	
	this.plugLoadCSS = function(fnLoadCSS){
		Resource.prototype.pluggedLoadCSS = fnLoadCSS;
	};
	
	this.plugLoadGET = function(fnLoadGET){
		Resource.prototype.pluggedLoadGET = fnLoadGET;
	};
}

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
/*global Resource:true Config:true console:true*/

function Loader(lc){
	/* private functions that can be overridden  */	
	function setUpHandler(st,handler,res,callback){
		var done = false;
		return function(){
			if (!this.readyState){
				handler(res,callback);
				st.onload = null;
			}
			else{
				if (!done && ( this.readyState === "complete" || this.readyState === "loaded" )) {		
					handler(res,callback);
					done = true;
					st.onreadystatechange = null;
				}
			}
		};
	}	

	function _loadfnJS(handler,res,callback){
		var st = document.createElement("script");
		st.setAttribute("type","text/javascript");
		st.setAttribute("charset","utf-8");
		st.setAttribute("src",res.url);
		var _dummy = ( res.id ) && st.setAttribute("id",res.id);
		_dummy = ( res.defer ) && st.setAttribute("defer",res.defer);
		st.onreadystatechange = st.onload = setUpHandler(st,handler,res,callback);
		
		var ref = document.getElementsByTagName('head')[0];
		var parent;
		if ( ref ){
			if (ref.firstChild){
				parent = ref;
				ref = ref.firstChild;
				parent.insertBefore(st,ref);
			}
			else {  
				ref.appendChild(st);
			}
		}
		else {
			ref = document.getElementsByTagName('script')[0];
			parent = ref.parentNode;
			parent.insertBefore(st,ref);
		}
	}
	
	function _loadfnCSS(handler,res,callback){
		var st = document.createElement("link");
		st.setAttribute("type","text/css");
		st.setAttribute("rel","stylesheet");
		st.setAttribute("href",res.url);
		st.onreadystatechange = st.onload = setUpHandler(st,handler,res,callback);
		
		var ref = document.getElementsByTagName("head")[0];
		var parent;
		if ( ref ){
			if ( res.attach === "first" ){
				if ( ref.firstChild ){
					parent = ref;
					ref = ref.firstChild;
					parent.insertBefore(st,ref);
				}
				else {
					ref.appendChild(st);
				}
			}
			if ( res.attach === "last" ){
				ref.appendChild(st);
			}
		}
	}
	
	function _loadfnGET(handler,res,callback){
		console.log('you must implement GET resource loader ....');
	}
	
	/* Private helper function */
	
	function initDoneFn(){
		var _done = false;
		return function(done){
			if ( typeof(done)!== "undefined" ){
				_done = done;
			}
			return _done;
		};
	}
	
	function initCd(count){
		return function(){
			return count--;
		};
	}
	
	function notify(res){
		var status = (this.opt.events.notifyStatus) && this.config[res.type+"Ready"](res.name);
		
		var eventName;
		if ( this.opt.events.type === "onload" ) {
			eventName = res.type + "-" + "loaded";
		}
		if ( this.opt.events.type === "byname" ){
			eventName = res.type + "-" + res.name;
		}
		if ( this.opt.events.type === "all" ){
			this.trigger(res.type + "-" + "loaded",{ res: res, status: status });
		}
		this.trigger(eventName,{ res: res, status: status });
	}
	
	function initLastFn(i,req,cd,done,reslist){
		var self = this;
		return function(){
			//console.info(req[i].res().name()," last attach");
			req[i].res().load(function(res){
				reslist.push(res);
				if (self.opt.events){
					setTimeout(function(){notify.call(self,res);},0);
				}
				if(!cd()){done(true);}
			});
		};
	}
	
	function initWaitFn(i,req,cd,done,fn,reslist){
		var self = this;
		return function(){
			//console.info(req[i].res().name()," wait attach");
			req[i].res().load(function(res){
				//console.info(req[i].res().name()," wait loaded");
				reslist.push(res);
				if (self.opt.events){
					setTimeout(function(){notify.call(self,res);},0);
				}
				if(!cd()){done(true);}
				fn[i+1]();
			});
		};
	}
	
	function initNoWaitFn(i,req,cd,done,fn,reslist){
		var self = this;
		return function(){
			//console.info(req[i].res().name()," attach");
			req[i].res().load(function(res){
				//console.info(req[i].res().name()," loaded");
				reslist.push(res);
				if (self.opt.events){
					setTimeout(function(){notify.call(self,res);},0);
				}
				if(!cd()){done(true);}
			});
			fn[i+1]();
		};
	}
	
	function _loadJsOrCss(req,callback){
		var self = this;
		var done = initDoneFn();
		var cd = initCd(req.length-1);
		
		function getFn(i,req,fn,reslist,cd,done){
			if (i===req.length-1){
				return initLastFn.call(self,i,req,cd,done,reslist);
			}
			else if( req[i].meth === "wait" ){
				return initWaitFn.call(self,i,req,cd,done,fn,reslist);
			}
			else {
				return initNoWaitFn.call(self,i,req,cd,done,fn,reslist);
			}
		}
		
		var reslist = [];
		var loadReq = (function(){
			return function(){
				var fn = [];
				for(var i=req.length-1;i>=0;i-- ){
					fn.unshift(getFn.call(self,i,req,fn,reslist,cd,done));
				}
				fn[0]();
			};
		})(req);
		
		var lr = ( req.length ) && setTimeout(loadReq,1);
		/* wait until all ready */
		var wait = setInterval(function(){
			if(done()){
				var _d = (typeof callback === "function") && callback(reslist);
				clearInterval(wait);
			}
		},1);
	}
	
	/* Loader */
	if(typeof lc.opt !== "undefined"){
		var def = { type: 'byname', notifyStatus: false };
		if (!!lc.opt.events){
			for( var i in def ){
				lc.opt.events[i] = (typeof lc.opt.events[i] !== "undefined") && lc.opt.events[i] || def[i];
			}
		}
		else {
			lc.opt.events = { type: 'byname',notifyStatus: false };
		}
	}
	else {
		lc.opt = {events: false};
	}
	
	var lm = {
			opt:lc.opt, 
			name: lc.name,
			config: new Config(),
			loadJS:function(resName,callback){
				_loadJsOrCss.call(this,this.config.getJsReq(resName),callback);
			},
			loadCSS:function(resName,callback){
				_loadJsOrCss.call(this,this.config.getCssReq(resName),callback);
			},
			loadGET:function(resName,callback){
				_loadJsOrCss.call(this,this.config.getGetReq(resName),callback);
			},
			trigger: function(evetType,extraParams){
				console.log('fire trigger ...',evetType,extraParams);
			},
			bind: function(){
				//console.log('fire bind ...');
			}
	};
	
	lm.fnLoadJS= Loader.prototype.fnLoadJS;
	lm.fnLoadCSS = Loader.prototype.fnLoadCSS;
	lm.fnLoadGET = Loader.prototype.fnLoadGET;
	
	lm.config.plugLoadJS(lm.fnLoadJS);
	lm.config.plugLoadCSS(lm.fnLoadCSS);
	lm.config.plugLoadGET(lm.fnLoadGET);
	
	lm.config.load(lc.config);
	
	/* Attach res function loaders */
	Loader.prototype._loadfnJS = _loadfnJS;
	Loader.prototype._loadfnCSS = _loadfnCSS;
	Loader.prototype._loadfnGET = _loadfnGET;
	
	return lm;
}

Loader.prototype.fnLoadJS = function(handler,res,callback){
	/*
	 * For custom implementation of fnLoadJS
	 *
	 * Loader.prototype.fnLoaderJS = function(handler,res,callback){
	 *     1) es. attach tag sript to dom
	 *     2) when ready call handler(res,callback);
	 * }
	 * 
	 */
	Loader.prototype._loadfnJS(handler,res,callback);
};

Loader.prototype.fnLoadCSS = function(handler,res,callback){
	/*
	 * For custom implementation of fnLoadJS
	 *
	 * Loader.prototype.fnLoadCSS = function(handler,res,callback){
	 *     1) attach link tag to dom
	 *     2) when ready call handler(res,callback);
	 * }
	 * 
	 */
	Loader.prototype._loadfnCSS(handler,res,callback);
};

Loader.prototype.fnLoadGET = function(handler,res,callback){
	/*
	 * You must implement fnLoadGET Loader don't have a default implementation
	 *
	 * Loader.prototype.fnLoadGET = function(handler,res,callback){
	 *     1) exec GET request
	 *     2) when ready call handler(res,callback);
	 * }
	 * 
	 */
	Loader.prototype._loadfnGET(handler,res,callback);
};


	$.extend(
		{ wrl: {
			loaders: {},
			addLoader: function(lc,callback){
				var $this = this,loader;
				
				//Loader.prototype.fnLoadJS = this.fnLoadJS;
				//Loader.prototype.fnLoadCSS = this.fnLoadCSS;
				Loader.prototype.fnLoadGET = this.fnLoadGET;
				
				function _factoryLoader(lc){
					var loader = $(new Loader(lc));
					loader[0].trigger = $.proxy(loader.trigger,loader);
					loader[0].bind = $.proxy(loader.bind,loader);
					loader.loadJS = $.proxy(loader[0].loadJS,loader[0]);
					loader.loadCSS = $.proxy(loader[0].loadCSS,loader[0]);
					loader.loadGET = $.proxy(loader[0].loadGET,loader[0]);
					return loader;
				}
				
				if($.type(lc.config)=="string"){
					$.getJSON(lc.config,function(data){
						lc.config = data;
						var loader = _factoryLoader(lc);
						$this.loaders[lc.name] = loader;
						$.type(callback)=="function" && callback(loader);
					})
					.error(function(jqXHR,textStatus,errorThrown){console.log("Get config in error [",textStatus,"]");});
				}
				else {
					loader = _factoryLoader(lc);
					this.loaders[lc.name] = loader;
					return loader;
				};
			},
			loadJS: function(ln,jsName,callback){
				return this.loaders[ln].loadJS(jsName,callback);
				return this.loaders[ln];
			},
			loadCSS: function(ln,jsName,callback){
				this.loaders[ln].loadCSS(jsName,callback);
				return this.loaders[ln];
			},
			loadGET: function(ln,jsName,callback){
				this.loaders[ln].loadGET(jsName,callback);
				return this.loaders[ln];
			},
			fnLoadGET: function(handler,res,callback){
				$.get(res.url,function(data){
					res.data = data;
					handler(res,callback);
				});
			}
		}
	});
}(jQuery));
