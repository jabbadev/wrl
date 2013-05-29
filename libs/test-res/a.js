(function(w){
	a = 0;
	for(var i=0;i<100000;i++){a++;}
	w.getA = function(){
		return a; 
	};
	w.A_TS = new Date().getTime() - w.BASE_TS;
})(window);