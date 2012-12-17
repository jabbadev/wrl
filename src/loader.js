/*global Resource:true*/

function Loader(ln,config){
	var lm = {
			name: ln,
			config: config,
			attachJS: function(){},
			attachCSS: function(){},
			loadJS:function(id,resName){
				
				var $this = this;
				setTimeout(function(){
					$this.trigger('jsLoaded');
				},3000);
				return this;
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
	
	return lm;
}