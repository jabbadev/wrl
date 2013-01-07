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
							
				var req = this.config.getJsReq(resName);
				var dep = this.config.getJsDep(resName);
				
				if ( dep.length > 1 ){
					req.pop();
				}
				else{
					dep.pop();
				}
				
				var loadReq = (function(req){
					if (!req.length){status({reqdone: true});}
					
					var cd = (function(count){
						return function(){
							return count--;
						};
					})(req.length-1);
					
					function getFn(cd){
						return function(res){
							if(!cd()){status({reqdone: true});}
						};
					}
					
					return function(){
						for(var i=0; i < req.length; i++ ){
							req[i]().load(getFn(cd));
						}
					};
				})(req);
				
				var loadDep = (function(dep){
					if (!dep.length){status({depdone: true });}
					
					function getFn(i,dep,fn){
						return function(){
							if (i===dep.length-1){
								dep[i]().load(function(){
									status({depdone: true });
								});
							}
							else{
								dep[i]().load(fn[i+1]);
							}
						};
					}
					
					return function(){
						var fn = [];
						for(var i=dep.length-1;i>=0; i-- ){
							fn.unshift(getFn(i,dep,fn));
						}
						fn[0]();
					};
					
				})(dep);
				
				var lr = ( req.length ) && setTimeout(loadReq,1);
				var ld = ( dep.length ) && setTimeout(loadDep,1);
				
				/* wait until all ready */
				var wait = setInterval(function(){
					//if($this.config.jsReady(resName).ready){
					if(status()){
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