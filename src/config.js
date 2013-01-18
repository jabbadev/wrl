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
