/*global Resource:true*/

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
				
				console.log('require ....');
				for( var i in require ){
					console.log(require[i].tag());
				}
				
				console.log('dep ....');
				for( var i in dep ){
					console.log(dep[i].tag());
				}
				
				var stat = this.config.jsReady(resName);
				
				
				/*
				var $this = this;
				setTimeout(function(){
					$this.trigger('jsLoaded');
				},3000);
				return this;
				*/
				
			},
			loadCSS:function(id,resName){
				console.log('loadCSS: ',resName);
			},
			loadHTML:function(id,resName){
				console.log('loadHTML: ',resName);
			},
			trigger: function(evetType,extraParams){
				console.log('fire trigger ...',evetType,extraParams);
			},
			bind: function(){
				console.log('fire bind ...');
			}
	};
	
	lm.config.load(config);
	
	return lm;
}