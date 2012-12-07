/*
 * wrl
 * 
 *
 * Copyright (c) 2012 Francesco Dalpra'
 * Licensed under the MIT license.
 */
(function($) {
	$.extend({ wrl: {
		managers: {},
		addManager: function(mn,config){
			var manager = $({
				name: mn,
				loadJS: function(jsName){
					console.log(this,jsName);
				}
			});
			
			manager.loadJS = $.proxy(manager[0].loadJS,manager[0]);
			return manager;
		}
	}});
}(jQuery));
