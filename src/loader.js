/*global Resource:true Config:true console:true*/

function Loader(ln,config){
	
	var lm = {
			name: ln,
			config: new Config(),
			attachJS: function(){},
			attachCSS: function(){},
			loadJS:function(resName,callback){
			
				var done = (function(){
					var _done = false;
					return function(done){
						if ( typeof(done)!== "undefined" ){
							_done = done;
						}
						return _done;
					};
				})();
							
				var req = this.config.getJsReq(resName);
				
				var loadReq = (function(req){
					
					var cd = (function(count){
						return function(){
							return count--;
						};
					})(req.length-1);
					
					function getFn(i,req,fn,cd){
						if (i===req.length-1){
							return function(){
								//console.info(req[i].res().name()," last attach");
								req[i].res().load(function(){
									//console.info(req[i].res().name()," end loaded");
									if(!cd())done(true);
								});
							};
						}
						else if( req[i].meth === "wait" ){
							return function(){
									//console.info(req[i].res().name()," wait attach");
									req[i].res().load(function(){
										//console.info(req[i].res().name()," wait loaded");
										if(!cd())done(true);
										fn[i+1]();
									});
							};
						}
						else {
							return function(){
									//console.info(req[i].res().name()," attach");
									req[i].res().load(function(){
										//console.info(req[i].res().name()," loaded");
										if(!cd())done(true);
									});
									fn[i+1]();
							};
						}
					}
					
					return function(){
						var fn = [];
						for(var i=req.length-1;i>=0;i-- ){
							fn.unshift(getFn(i,req,fn,cd));
						}
						fn[0]();
					};
					
				})(req);
				
				var lr = ( req.length ) && setTimeout(loadReq,1);
				
				/* wait until all ready */
				var wait = setInterval(function(){
					if(done()){
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