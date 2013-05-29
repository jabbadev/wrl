(function(w){
	b = 0;
	c = w.getC();
	w.getB = function getB(){
		return b * c;
	};
	w.B_TS = new Date().getTime() - w.BASE_TS;
})(window);