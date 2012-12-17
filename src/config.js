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
			_dummy = res.isVirtual()||resChain.push(res);
		}
		else {
			_dummy = res.isVirtual()||resChain.push(res);
		}
	}
	
	this.getJsReq = function(resName){
		var resChain = [];
		_buildChain('js',resName,'require',resChain);
		return resChain;
	};
	
	this.getJsDep = function(resName){
		var resChain = [];
		_buildChain('js',resName,'depon',resChain);
		return resChain;
	};
	
	this.load = function(config){
		for(var resType in {js: true,css: true,html: true }){
			conf[resType]={};
			for(var resName in config[resType]){
				conf[resType][resName]= new Resource(resName,config[resType][resName]);
			}
		}
	};
}