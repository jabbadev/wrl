(function(w){
	a = 0;
	for(var i=0;i<100000;i++){a++;}
	w.getA = function(){
		return a; 
	};
})(window);