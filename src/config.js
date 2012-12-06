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
	};

	_buildChain = function(resType,resName,chainType,resChain){
		var res = _getres(resType,resName);
		var resList = res.get(chainType);
		if (resList){
			for(var rn in resList){
				_buildChain(resType,resList[rn],chainType,resChain);
			}
			res.isVirtual() || resChain.push(res);
			console.log('isvirtual: ',res.isVirtual);
			//resChain.push(res);
		}
		else {
			res.isVirtual() || resChain.push(res);
			console.log('isvirtual: ',res.isVirtual);
			//resChain.push(res);
		}
	};	
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
				conf[resType][resName]= new window.Resource(resName,config[resType][resName]);
			}
		}
	};
	
}