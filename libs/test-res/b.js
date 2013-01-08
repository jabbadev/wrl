(function(w){
	b = 0;
	for(var i=0;i<5000;i++){b++;}
	w.getB = function getB(){
		return b * w.getC();
	};
})(window);