f_name = "f slow";
f = 0;
for(var i = 0; i<10000; i++){
	$('<p>pippo<p>').appendTo('body');
}
console.log('hello i am: ',f_name);