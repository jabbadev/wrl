$.extend(
		{ wrl: {
			loaders: {},
			addLoader: function(lc){
				//Loader.prototype.fnLoadJS = this.fnLoadJS;
				//Loader.prototype.fnLoadCSS = this.fnLoadCSS;
				Loader.prototype.fnLoadGET = this.fnLoadGET;
				
				var loader = $(new Loader(lc));
				loader[0].trigger = $.proxy(loader.trigger,loader);
				loader[0].bind = $.proxy(loader.bind,loader);
				
				loader.loadJS = $.proxy(loader[0].loadJS,loader[0]);
				loader.loadCSS = $.proxy(loader[0].loadCSS,loader[0]);
				loader.loadGET = $.proxy(loader[0].loadGET,loader[0]);
				
				this.loaders[lc.name] = loader;
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
			loadGET: function(ln,jsName){
				this.loaders[ln].loadGET(jsName);
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