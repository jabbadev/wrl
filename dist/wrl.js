/*! Web Resource Loader - v0.1.0 - 2012-12-05
* Copyright (c) 2012 Francesco Dalpra'; Licensed MIT */

(function($) {
  $.fn.wrl = function() {
  };
}(jQuery));

function Config() {
	this.load = function(config){
		this.res = config;
	};
	this.jsInfo = function(){
	};
	this.css = function(){
	};
	this.html = function(){
	};
}