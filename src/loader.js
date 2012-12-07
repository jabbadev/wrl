/*global Resource:true*/

function Loader(loaderName,config){
	var loader = {
			loaderName: loaderName,
			config: config,
			attachJS: function(){},
			attachCSS: function(){},
			loadJS:function(resName){
				
			},
			loadCSS:function(resName){
				
			},
			loadHTML:function(resName){
				
			}
	};
	return loader;
}