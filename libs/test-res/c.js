(function(w){
	c = 0;
	for(var i=0;i<1000000;i++){c++;}
	w.getC = function getC(){
		return c; 
	};
	w.C_TS = new Date().getTime() - w.BASE_TS;
})(window);