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
	
	function _buildChain(resType,resName,chainType,resChain){
		var res = _getres(resType,resName);
		var resList = res[chainType]();
		var _dummy;
		if (resList){
			for(var rn in resList){
				_buildChain(resType,resList[rn],chainType,resChain);
			}
			_dummy = res.isVirtual()||resChain.push(res.pointer());
		}
		else {
			_dummy = res.isVirtual()||resChain.push(res.pointer());
		}
	}
	
	function _getRes(resType,resName,chainType){
		var resChain = [];
		_buildChain(resType,resName,chainType,resChain);
		return resChain;
	}
	
	function _resReady(resType,resName){
		var resources = _getRes(resType,resName,'depon').concat(_getRes(resType,resName,'require'));
		resources.pop();
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
			if(res().ready()){
				status.nrr++;
				status.readyRef.push(res().name());
			}
			else {
				status.resurces.push(res().name());
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
	
	this.getJsReq = function(resName){ return _getRes('js',resName,'require'); };
	this.getJsDep = function(resName){ return _getRes('js',resName,'depon'); };
	this.getCssReq = function(resName){ return _getRes('css',resName,'require'); };
	this.getCssDep = function(resName){ return _getRes('css',resName,'depon'); };
		
	this.jsReady = function(resName){
		return _resReady('js',resName);
	};
	
	this.cssReady = function(resName){
		return _resReady('css',resName);
	};
	
	this.load = function(config){
		for(var resType in {js: true,css: true,html: true }){
			conf[resType]={};
			for(var resName in config[resType]){
				conf[resType][resName]= new Resource(resName,resType,config[resType][resName]);
			}
		}
	};
	
	this.plugLoad = function(fnLoad){
		Resource.prototype.pluggedLoad = fnLoad;
	};
}
