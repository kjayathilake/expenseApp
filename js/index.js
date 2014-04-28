var localDBDemo;

$(function(){ 
	
	localDBDemo = {
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
		        	transaction.executeSql('CREATE TABLE IF NOT EXISTS LOGS(id INTEGER NOT NULL PRIMARY KEY, total FLOAT NOT NULL);', [], that.nullDataHandler, that.errorHandler);
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
				var data = ['1','576.5'];  
                var data1 = ['2','850.0'];
				
				transaction.executeSql("INSERT INTO LOGS(id, total) VALUES (?, ?)", [data[0], data[1]]);
                transaction.executeSql("INSERT INTO LOGS(id, total) VALUES (?, ?)", [data1[0], data1[1]]);
			    }
			);				
		},
        
        addData: function() {
            
			DEMODB.transaction(
			    function (transaction) {
				transaction.executeSql("SELECT * FROM LOGS;", [], that.dataSelectHandler, that.errorHandler);
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
					transaction.executeSql("SELECT * FROM LOGS;", [], that.dataSelectHandler, that.errorHandler);
	        
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
		        
		        trHTML += '<tr><td>' +
                row.id + '</td><td>' +
                row.total + '</td></tr>';
		
		    }
            trHTML += '</tbody>'
            $('#emp_table').append(trHTML);
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
			        transaction.executeSql("SELECT * FROM LOGS;", [], that.dataSelectHandler, that.errorHandler);
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
			    	transaction.executeSql("DROP TABLE LOGS;", [], that.nullDataHandler, that.errorHandler);
			    }
			);
			console.log("Table 'LOGS' has been dropped.");
			//location.reload();			
		}
	    

	};

 	
 	//Instantiate Demo
 	localDBDemo.init();
	
});	


        function call() {
            
            document.getElementById("txtname").value = "";
            
            $('#myModal').modal('show');
        }


function addItem() {
            
               localDBDemo.addData();
            }
