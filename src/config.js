function Config() {
	this.load = function(config){
		this.conf = config;
	};
	this.js = function(){
		return this.conf.js;
	};
	this.css = function(){
		return this.conf.css;
	};
	this.html = function(){
		return this.conf.html;
	};
}