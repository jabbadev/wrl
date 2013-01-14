/*global Loader:true*/
/*
 * wrl
 * 
 *
 * Copyright (c) 2012 Francesco Dalpra'
 * Licensed under the MIT license.
 */
(function($) {

	$.extend(
		{ wrl: {
			loaders: {},
			addLoader: function(ln,config){
				//Loader.prototype.fnLoadJS = this.fnLoadJS;
				//Loader.prototype.fnLoadCSS = this.fnLoadCSS;
				//Loader.prototype.fnLoadGET = this.fnLoadGET;
				
				var loader = $(new Loader(ln,config));
				loader[0].trigger = $.proxy(loader.trigger,loader);
				loader[0].bind = $.proxy(loader.bind,loader);
				
				loader.loadJS = $.proxy(loader[0].loadJS,loader[0]);
				loader.loadCSS = $.proxy(loader[0].loadJS,loader[0]);
				loader.loadHTML = $.proxy(loader[0].loadJS,loader[0]);
				
				this.loaders[ln] = loader;
				return loader;
			},
			loadJS: function(ln,jsName,callback){
				return this.loaders[ln].loadJS(jsName);
				//return loaders[ln];
			},
			loadCSS: function(ln,jsName){
				this.loaders[ln].loadCSS(jsName);
				return this.loaders[ln];
			},
			loadHTML: function(ln,jsName){
				this.loaders[ln].loadHTML(jsName);
				return this.loaders[ln];
			},
			fnLoad: function(handler,res,callback){
				loadfn[res.type](handler,res,callback);
			}
		}
	});
	
}(jQuery));
