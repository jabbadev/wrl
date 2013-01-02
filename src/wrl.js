/*global Loader:true*/
/*
 * wrl
 * 
 *
 * Copyright (c) 2012 Francesco Dalpra'
 * Licensed under the MIT license.
 */
(function($) {
	var loadfn = {
		js: function (handler,res,callback){
			var st = document.createElement("script");
			st.setAttribute("type","text/javascript");
			st.setAttribute("charset","utf-8");
			st.setAttribute("src",res.url);
			var _dummy = ( res.id ) && st.setAttribute("id",res.id);
			_dummy = ( res.defer ) && st.setAttribute("defer",res.defer);
			st.onload = (function(res,callback){
				handler(res,callback);
			})(res,callback);
			st.onreadystatechange = function () { /* Same thing but for IE */
				if (this.readyState === "complete" || this.readyState === "loaded") {
					handler(res,callback);
				}
			};
			
			var ref = document.getElementsByTagName('head')[0];
			var parent;
			if ( ref !== "undefined" ){
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
	};
	
	$.extend(
		{ wrl: {
			loaders: {},
			addLoader: function(ln,config){
				Loader.prototype.fnLoad = this.fnLoad;
				var loader = $(new Loader(ln,config));
				loader[0].trigger = $.proxy(loader.trigger,loader);
				loader[0].bind = $.proxy(loader.bind,loader);
				
				loader.loadJS = $.proxy(loader[0].loadJS,loader[0]);
				loader.loadCSS = $.proxy(loader[0].loadJS,loader[0]);
				loader.loadHTML = $.proxy(loader[0].loadJS,loader[0]);
				
				this.loaders[ln] = loader;
				return loader;
			},
			loadJS: function(ln,jsName){
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

//Loader.prototype.fnLoader = $.wrl.fnLoader;	
