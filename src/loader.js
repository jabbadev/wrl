/*global Resource:true Config:true console:true*/

function Loader(ln,config){
	var lm = {
			name: ln,
			config: new Config(),
			attachJS: function(){},
			attachCSS: function(){},
			loadJS:function(resName){
				var require = this.config.getJsReq(resName);
				var dep = this.config.getJsDep(resName);
				if ( dep.length > 1 ){
					require.pop();
				}
				else{
					dep.pop();
				}
				
				var stat = this.config.jsReady(resName);
				
				for( var i in require ){
					require[i]().load(function(){ console.log('loaded ..... ');});
				}
				
				/*
				var $this = this;
				setTimeout(function(){
					$this.trigger('jsLoaded');
				},3000);
				return this;
				*/
				
			},
			loadCSS:function(id,resName){
				//console.log('loadCSS: ',resName);
			},
			loadHTML:function(id,resName){
				//console.log('loadHTML: ',resName);
			},
			trigger: function(evetType,extraParams){
				//console.log('fire trigger ...',evetType,extraParams);
			},
			bind: function(){
				//console.log('fire bind ...');
			}
	};
	
	lm.fnLoad = Loader.prototype.fnLoad;
	lm.config.plugLoad(lm.fnLoad);
	lm.config.load(config);
	
	return lm;
}

Loader.prototype.fnLoad = function(handler,res,callback){
	/*
	1) load js|css|html res
	2) call handler(res,callback)
	*/
	console.info('implement Loader.prototype.fnLoader = function(handler,res,callback){ /*1) load js|css|html res */; /*2) call handler(res,callback) */ }');
};