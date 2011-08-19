/*!
 * LocalStoragePlus Plugin (Mathieu MAGNIN).
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
			'mode' : 'prod',
			'storageMode' : 'local'
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
				return 'localStorage' in window && window.localStorage !== null;
			}
			catch(e){
				return false;
			}
		},
		
		// store an object
		storeItem : function(item){
			var self = $.lsplus;	
			
			// check if localStorage is enabled
			if(self.isEnabled()){	
			
				// create an item with default options
				var itemToStore = {
					'key' : null,
					'data' : null,
					'expirationDate' : null
				};
				
				// extends the default item with new options
				$.extend(itemToStore, item);
				
				// check if the key is valid
				if(itemToStore.key === null || itemToStore.key === undefined){
					self.logError('key is null or undefined');
					return;
				}
				
				// check if the data is valid
				if(itemToStore.data === undefined){
					self.logError('data is undefined');
					return;
				}
				
				// prepare the object to store
				var objectToStore = { 
					'data' : itemToStore.data,
					'expirationDate' : itemToStore.expirationDate
				};
				
				try {
					localStorage.setItem(itemToStore.key, JSON.stringify(objectToStore)); 
					self.logDebug('item stored : ' + itemToStore.key);
				}
				catch(e){
					if (console && console.log) {
						console.log(e);
					}
				}
			}
		},

		// retreive an item from storage
		getItem : function (key){
			var self = $.lsplus;		

			// if localstorage is enabled
			if(self.isEnabled()){	
			
				// retreive and parse the item
				var item = JSON.parse(localStorage.getItem(key));
				
				if(item !== null){
				
					// if item has an expiration date
					if(item.expirationDate !== null){
					
						// check date validity
						if(item.date > (new Date()).getTime())
						{
							self.logDebug('item retreived : ' + key);
							return item.data;
						}else{
							deleteItem(key);
						}
						
					}else{
						return item.data;					
					}
				}
			}
			return null;
		},
		
		// delete an item 
		deleteItem : function (key){
			var self = $.lsplus;		

			if(self.isEnabled()){	
				localStorage.removeItem(key);
				self.logDebug('item deleted : ' + key);
			}

			return ;
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

		// log to console if debugmode is enabled
		logDebug:function(message){
			var self = $.lsplus;
			if(self.isDebug()){
				if (typeof(console) !== 'undefined' && console !== null) {
					console.log('DEBUG >> ' + message);
				}
			}
		},

		// log to console an error
		logError:function(message){
			var self = $.lsplus;
			if (typeof(console) !== 'undefined' && console !== null) {
				console.log('ERROR >> ' + message);
			}
		}
	};
})(jQuery);