/*global Resource:true Config:true console:true*/

function Loader(lc){
	/* private functions that can be overridden  */	
	function setUpHandler(st,handler,res,callback){
		var done = false;
		return function(){
			if (!this.readyState){
				handler(res,callback);
				st.onload = null;
			}
			else{
				if (!done && ( this.readyState === "complete" || this.readyState === "loaded" )) {		
					handler(res,callback);
					done = true;
					st.onreadystatechange = null;
				}
			}
		};
	}	

	function _loadfnJS(handler,res,callback){
		var st = document.createElement("script");
		st.setAttribute("type","text/javascript");
		st.setAttribute("charset","utf-8");
		st.setAttribute("src",res.url);
		var _dummy = ( res.id ) && st.setAttribute("id",res.id);
		_dummy = ( res.defer ) && st.setAttribute("defer",res.defer);
		st.onreadystatechange = st.onload = setUpHandler(st,handler,res,callback);
		
		var ref = document.getElementsByTagName('head')[0];
		var parent;
		if ( ref ){
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
	
	function _loadfnCSS(handler,res,callback){
		var st = document.createElement("link");
		st.setAttribute("type","text/css");
		st.setAttribute("rel","stylesheet");
		st.setAttribute("href",res.url);
		st.onreadystatechange = st.onload = setUpHandler(st,handler,res,callback);
		
		var ref = document.getElementsByTagName("head")[0];
		var parent;
		if ( ref ){
			if ( res.attach === "first" ){
				if ( ref.firstChild ){
					parent = ref;
					ref = ref.firstChild;
					parent.insertBefore(st,ref);
				}
				else {
					ref.appendChild(st);
				}
			}
			if ( res.attach === "last" ){
				ref.appendChild(st);
			}
		}
	}
	
	function _loadfnGET(handler,res,callback){
		console.log('you must implement GET resource loader ....');
	}
	
	/* Private helper function */
	
	function initDoneFn(){
		var _done = false;
		return function(done){
			if ( typeof(done)!== "undefined" ){
				_done = done;
			}
			return _done;
		};
	}
	
	function initCd(count){
		return function(){
			return count--;
		};
	}
	
	function notify(res){
		var status = (this.opt.events.notifyStatus) && this.config[res.type+"Ready"](res.name);
		
		var eventName;
		if ( this.opt.events.type === "onload" ) {
			eventName = res.type + "-" + "loaded";
		}
		if ( this.opt.events.type === "byname" ){
			eventName = res.type + "-" + res.name;
		}
		if ( this.opt.events.type === "all" ){
			this.trigger(res.type + "-" + "loaded",{ res: res, status: status });
		}
		this.trigger(eventName,{ res: res, status: status });
	}
	
	function initLastFn(i,req,cd,done,reslist){
		var self = this;
		return function(){
			//console.info(req[i].res().name()," last attach");
			req[i].res().load(function(res){
				reslist.push(res);
				if (self.opt.events){
					setTimeout(function(){notify.call(self,res);},0);
				}
				if(!cd()){done(true);}
			});
		};
	}
	
	function initWaitFn(i,req,cd,done,fn,reslist){
		var self = this;
		return function(){
			//console.info(req[i].res().name()," wait attach");
			req[i].res().load(function(res){
				//console.info(req[i].res().name()," wait loaded");
				reslist.push(res);
				if (self.opt.events){
					setTimeout(function(){notify.call(self,res);},0);
				}
				if(!cd()){done(true);}
				fn[i+1]();
			});
		};
	}
	
	function initNoWaitFn(i,req,cd,done,fn,reslist){
		var self = this;
		return function(){
			//console.info(req[i].res().name()," attach");
			req[i].res().load(function(res){
				//console.info(req[i].res().name()," loaded");
				reslist.push(res);
				if (self.opt.events){
					setTimeout(function(){notify.call(self,res);},0);
				}
				if(!cd()){done(true);}
			});
			fn[i+1]();
		};
	}
	
	function _loadJsOrCss(req,callback){
		var self = this;
		var done = initDoneFn();
		var cd = initCd(req.length-1);
		
		function getFn(i,req,fn,reslist,cd,done){
			if (i===req.length-1){
				return initLastFn.call(self,i,req,cd,done,reslist);
			}
			else if( req[i].meth === "wait" ){
				return initWaitFn.call(self,i,req,cd,done,fn,reslist);
			}
			else {
				return initNoWaitFn.call(self,i,req,cd,done,fn,reslist);
			}
		}
		
		var reslist = [];
		var loadReq = (function(){
			return function(){
				var fn = [];
				for(var i=req.length-1;i>=0;i-- ){
					fn.unshift(getFn.call(self,i,req,fn,reslist,cd,done));
				}
				fn[0]();
			};
		})(req);
		
		var lr = ( req.length ) && setTimeout(loadReq,1);
		/* wait until all ready */
		var wait = setInterval(function(){
			if(done()){
				var _d = (typeof callback === "function") && callback(reslist);
				clearInterval(wait);
			}
		},1);
	}
	
	/* Loader */
	if(typeof lc.opt !== "undefined"){
		var def = { type: 'byname', notifyStatus: false };
		if (!!lc.opt.events){
			for( var i in def ){
				lc.opt.events[i] = (typeof lc.opt.events[i] !== "undefined") && lc.opt.events[i] || def[i];
			}
		}
		else {
			lc.opt.events = { type: 'byname',notifyStatus: false };
		}
	}
	else {
		lc.opt = {events: false};
	}
	
	var lm = {
			opt:lc.opt, 
			name: lc.name,
			config: new Config(),
			loadJS:function(resName,callback){
				_loadJsOrCss.call(this,this.config.getJsReq(resName),callback);
			},
			loadCSS:function(resName,callback){
				_loadJsOrCss.call(this,this.config.getCssReq(resName),callback);
			},
			loadGET:function(resName,callback){
				_loadJsOrCss.call(this,this.config.getGetReq(resName),callback);
			},
			trigger: function(evetType,extraParams){
				console.log('fire trigger ...',evetType,extraParams);
			},
			bind: function(){
				//console.log('fire bind ...');
			}
	};
	
	lm.fnLoadJS= Loader.prototype.fnLoadJS;
	lm.fnLoadCSS = Loader.prototype.fnLoadCSS;
	lm.fnLoadGET = Loader.prototype.fnLoadGET;
	
	lm.config.plugLoadJS(lm.fnLoadJS);
	lm.config.plugLoadCSS(lm.fnLoadCSS);
	lm.config.plugLoadGET(lm.fnLoadGET);
	
	lm.config.load(lc.config);
	
	/* Attach res function loaders */
	Loader.prototype._loadfnJS = _loadfnJS;
	Loader.prototype._loadfnCSS = _loadfnCSS;
	Loader.prototype._loadfnGET = _loadfnGET;
	
	return lm;
}

Loader.prototype.fnLoadJS = function(handler,res,callback){
	/*
	 * For custom implementation of fnLoadJS
	 *
	 * Loader.prototype.fnLoaderJS = function(handler,res,callback){
	 *     1) es. attach tag sript to dom
	 *     2) when ready call handler(res,callback);
	 * }
	 * 
	 */
	Loader.prototype._loadfnJS(handler,res,callback);
};

Loader.prototype.fnLoadCSS = function(handler,res,callback){
	/*
	 * For custom implementation of fnLoadJS
	 *
	 * Loader.prototype.fnLoadCSS = function(handler,res,callback){
	 *     1) attach link tag to dom
	 *     2) when ready call handler(res,callback);
	 * }
	 * 
	 */
	Loader.prototype._loadfnCSS(handler,res,callback);
};

Loader.prototype.fnLoadGET = function(handler,res,callback){
	/*
	 * You must implement fnLoadGET Loader don't have a default implementation
	 *
	 * Loader.prototype.fnLoadGET = function(handler,res,callback){
	 *     1) exec GET request
	 *     2) when ready call handler(res,callback);
	 * }
	 * 
	 */
	Loader.prototype._loadfnGET(handler,res,callback);
};

