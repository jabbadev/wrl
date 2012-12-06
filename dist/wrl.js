/*! Web Resource Loader - v0.1.0 - 2012-12-06
* Copyright (c) 2012 Francesco Dalpra'; Licensed MIT */

(function($) {
  $.fn.wrl = function() {
  };
}(jQuery));

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
	
	this.load = function(config){
		for(var resType in {js: true,css: true,html: true }){
			conf[resType]={};
			for(var resName in config[resType]){
				conf[resType][resName]= new window.Resource(resName,config[resType][resName]);
			}
		}
	};
	
	this.js = function(names){
		return _getres('js',names);
	};
	this.css = function(names){
		return _getres('css',names);
	};
	this.html = function(names){
		return _getres('html',names);
	};
}