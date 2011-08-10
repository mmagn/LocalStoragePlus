var Illico = {
};

// Extension du LocalStorage
Illico.LocalStoragePlus = {

	init:function(options){
		var self = Illico.LocalStoragePlus;
		$.extend(self.settings, options);
	},

	settings : {
		'mode' : 'prod'	
	},	
	
	isDebug: function(){
		var self = Illico.LocalStoragePlus;
		if(self.settings.mode === 'debug'){
			return true;
		}
		return false;
	},
	
	isEnabled : function(){		
		if (localStorage){
			return true;
		}
		else{
			return false;
		}
	},
	
	storeItem : function(key, itemToStore, expirationDate){
		var self = Illico.LocalStoragePlus;		
		
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
		var self = Illico.LocalStoragePlus;		
		
		if(self.isEnabled()){	
			var item = JSON.parse(localStorage.getItem(key));
			
			if(item !== null && item.date > (new Date()).getTime()){
				self.logDebug('item retreived : ' + key);
				return item.value;
			}
		}
		
		return null;
	},
	
	// clean expired items
	clean: function(){
		var self = Illico.LocalStoragePlus;
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
			self.logDebug(counter + ' items deleted.');
		}
	},
	
	logDebug:function(message){
		var self = Illico.LocalStoragePlus;
		if(self.isDebug()){
			if (console && console.log) {
				console.log(message);
			}
		}
	}
};