(function(w){
	c = 0;
	for(var i=0;i<100000;i++){c++;}
	w.getC = function getC(){
		return c; 
	};
})(window);