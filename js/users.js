$(function(){ 
	
	var localDBDemo = {
		init: function () {
			
			this.initDatabase();
			
			// Button and link actions
			$('#clear').on('click', function(){ 
				localDBDemo.dropTables(); 
			});
			
		 	$('#update').on('click', function(){ 
		 		localDBDemo.updateSetting(); 
		 	});

		},

		initDatabase: function() {
			try {
			    if (!window.openDatabase) {
			        alert('Local Databases are not supported by your browser. Please use a Webkit browser for this demo');
			    } else {
			        var shortName = 'myDB',
			        	version = '1.0',
						displayName = 'DEMO DB Test',
						maxSize = 100000; // in bytes
						
			        DEMODB = openDatabase(shortName, version, displayName, maxSize);
					this.createTables();
					this.selectAll();
			    }
			} catch(e) {
			    if (e === 2) {
			        // Version mismatch.
			        console.log("Invalid database version.");
			    } else {
			        console.log("Unknown error "+ e +".");
			    }
			    return;
			} 
		},
		
		/***
		**** CREATE TABLE ** 
		***/
		createTables: function() {
			var that = this;
			DEMODB.transaction(
		        function (transaction) {
		        	transaction.executeSql('CREATE TABLE IF NOT EXISTS USERS(id INTEGER NOT NULL PRIMARY KEY, name TEXT NOT NULL);', [], that.nullDataHandler, that.errorHandler);
                    transaction.executeSql('CREATE TABLE IF NOT EXISTS DESSERTS(id INTEGER NOT NULL PRIMARY KEY, price FLOAT NOT NULL, name TEXT NOT NULL);', [], that.nullDataHandler, that.errorHandler);
		        }
		    );
			this.prePopulate();			
		},

		/***
		**** INSERT INTO TABLE ** 
		***/		
		prePopulate: function() {
			DEMODB.transaction(
			    function (transaction) {
				//Starter data when page is initialized
				var data = ['1','krish'];  
                var data1 = ['2','jayz'];
				
				transaction.executeSql("INSERT INTO USERS(id, name) VALUES (?, ?)", [data[0], data[1]]);
                transaction.executeSql("INSERT INTO USERS(id, name) VALUES (?, ?)", [data1[0], data1[1]]);
			    }
			);				
		},
		
		/***
		**** UPDATE TABLE ** 
		***/
	    updateSetting: function() {
			DEMODB.transaction(
			    function (transaction) {
					var fname,
					bg    = $('#bg_color').val(),
					font  = $('#font_selection').val(),
					car   = $('#fav_car').val();
					
			    	if($('#fname').val() != '') {
			    		fname = $('#fname').val();
			    	} else {
			    		fname = 'none';
			    	}
					
			    	transaction.executeSql("UPDATE page_settings SET fname=?, bgcolor=?, font=?, favcar=? WHERE id = 1", [fname, bg, font, car]);
			    }
			);	
			
			this.selectAll();		    
	    },
	    
	    selectAll: function() {
	    	var that = this;
			DEMODB.transaction(
	    		function (transaction) {
					transaction.executeSql("SELECT * FROM USERS;", [], that.dataSelectHandler, that.errorHandler);
	        
				}
			);	
	    },
        
        
	    
	    dataSelectHandler: function( transaction, results ) {
			// Handle the results
			var i=0,
				row;
            
            var trHTML = '<tbody>';
		    for (i ; i<results.rows.length; i++) {
		        
		    	row = results.rows.item(i);
		        
		        trHTML += '<tr id="'+row.id+'" ><td>' +
                row.name + '</td><td>' +
                row.id + '</td></tr>';
		
		    }
            trHTML += '</tbody>'
            $('#usr_table').append(trHTML);
            
	    },
	    
		/***
		**** Save 'default' data into DB table **
		***/
	    saveAll: function() {
		    this.prePopulate(1);
	    },
	    
	    errorHandler: function( transaction, error ) {
	    
		 	if (error.code===1){
		 		// DB Table already exists
		 	} else {
		    	// Error is a human-readable string.
			    console.log('Oops.  Error was '+error.message+' (Code '+ error.code +')');
		 	}
		    return false;		    
	    },
	    
	    nullDataHandler: function() {
		    console.log("SQL Query Succeeded");
	    },
	    
		/***
		**** SELECT DATA **
		***/	    
	    selectAll: function() {
	    	var that = this;
			DEMODB.transaction(
			    function (transaction) {
			        transaction.executeSql("SELECT * FROM USERS;", [], that.dataSelectHandler, that.errorHandler);
			    }
			);			    
	    },
	    
		/***
		**** DELETE DB TABLE ** 
		***/
		dropTables: function() {
			var that = this;
			DEMODB.transaction(
			    function (transaction) {
			    	transaction.executeSql("DROP TABLE USERS;", [], that.nullDataHandler, that.errorHandler);
			    }
			);
			console.log("Table 'USERS' has been dropped.");
			//location.reload();			
		}
	    

	};

 	
 	//Instantiate Demo
 	localDBDemo.init();
	
});	

 function Redirect()
       {
        location.href="desserts.html";
       }


