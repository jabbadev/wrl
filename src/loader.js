/*global Resource:true Config:true console:true*/

function Loader(ln,config){
	
	var lm = {
			name: ln,
			config: new Config(),
			attachJS: function(){},
			attachCSS: function(){},
			loadJS:function(resName,callback){
				var $this = this;
				var status = (function(){
					var _status = { reqdone: false, depdone: false };
					return function(status){
						if ( status ){
							_status.reqdone = (status.reqdone) && status.reqdone || _status.reqdone;
							_status.depdone = (status.depdone) && status.depdone || _status.depdone;
						}
						return _status.reqdone && _status.depdone;
					};
				})();
							
				var ff = (function (status,callback){
					return function(){
						status() && callback();
					};
				})(status,callback);
				
				var req = this.config.getJsReq(resName);
				var dep = this.config.getJsDep(resName);
				
				if ( dep.length > 1 ){
					req.pop();
				}
				else{
					dep.pop();
				}
				
				var loadReq = (function(req){
					return function(){
						for(var i=0; i < req.length; i++ ){
							//console.log('attach ... ',req[i]().name());
							req[i]().load();
						}
					};
				})(this.config.getJsReq(resName));
				
				
				var lr = setTimeout(loadReq,1);
				
				
				
				var wait = setInterval(function(){
					if($this.config.jsReady(resName).ready){
						callback();
						clearInterval(wait);
					}
				},1);
						
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