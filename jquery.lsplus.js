/*!
 * jQuery LocalStoragePlus Plugin.
 * Version : 0.2
 * https://github.com/mmagn/LocalStoragePlus
 * Requires jQuery 1.4.2 
 * and JSON2 https://github.com/douglascrockford/JSON-js (for old browsers compatibility)
 *
 * BSD License
 */
 
(function($) {

	$.lsplus = {

		settings : {
			'mode' : 'prod'	
		},	
		
		init:function(options){
			var self = $.lsplus;
			$.extend(self.settings, options);
		},
		
		isDebug: function(){
			var self = $.lsplus;
			if(self.settings.mode === 'debug'){
				return true;
			}
			return false;
		},
		
		isEnabled : function(){		
			try{
				return 'localStorage' in window && window['localStorage'] !== null;
			}
			catch(e){
				return false;
			}
		},
		
		storeItem : function(key, itemToStore, expirationDate){
			var self = $.lsplus;		
			
			if(self.isEnabled()){		
				var objectToStore = { 
					value : itemToStore,
					date : expirationDate
				};
				try {
					localStorage.setItem(key, JSON.stringify(objectToStore)); 
					self.logDebug('item stored : ' + key);
				}
				catch(e){
					if (console && console.log) {
						console.log(e);
					}
				}
			}
		},
		
		getItem : function (key){
			var self = $.lsplus;		
			
			if(self.isEnabled()){	
				var item = JSON.parse(localStorage.getItem(key));
				
				if(item !== null && item.date > (new Date()).getTime()){
					self.logDebug('item retreived : ' + key);
					return item.value;
				}
			}
			
			return null;
		},
		
		deleteItem : function (key){
			var self = $.lsplus;		
			
			if(self.isEnabled()){	
				localStorage.removeItem(key);
			}
			
			return null;
		},
		
		// clean expired items
		clean: function(){
			var self = $.lsplus;
			if(self.isEnabled()){	
				var counter = 0;
				var item;
				for(var i = 0; i < localStorage.length; i ++){
					item = JSON.parse( localStorage.getItem(localStorage.key(i)));
					if(item.date < (new Date()).getTime()){
						localStorage.removeItem(localStorage.key(i));
						counter++;
					}		
				}
				self.logDebug('Cleaning result : ' + counter + ' items deleted.');
			}
		},
		
		logDebug:function(message){
			var self = $.lsplus;
			if(self.isDebug()){
				if (typeof(console) !== 'undefined' && console != null) {
					console.log('DEBUG >> ' + message);
				}
			}
		}
	};
})(jQuery);
