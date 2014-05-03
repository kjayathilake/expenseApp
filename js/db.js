var html5rocks = {};
html5rocks.webdb = {};
html5rocks.webdb.db = null;

html5rocks.webdb.open = function() {
  var dbSize = 5 * 1024 * 1024; // 5MB
  html5rocks.webdb.db = openDatabase("dessert", "1.0", "Daily Dessert", dbSize);
}

html5rocks.webdb.createTable = function() {
  var db = html5rocks.webdb.db;
  db.transaction(function(tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS user(ID INTEGER PRIMARY KEY ASC, name TEXT)", []);
    
  });
}

html5rocks.webdb.addUser = function(name) {
  var db = html5rocks.webdb.db;
  db.transaction(function(tx){
    
    tx.executeSql("INSERT INTO user(name) VALUES (?)",
        [name],
        html5rocks.webdb.onSuccessAdd,
        html5rocks.webdb.onError);
   });
}

html5rocks.webdb.onError = function(tx, e) {
  alert("There has been an error: " + e.message);
}

html5rocks.webdb.onSuccessAdd = function(tx, r) {
  // re-render the data.
  
}

html5rocks.webdb.onSuccess = function(tx, r) {
  // re-render the data.
  //html5rocks.webdb.getAllUsers(loadUsers);
}


html5rocks.webdb.getAllUsers = function(renderFunc) {
  var db = html5rocks.webdb.db;
  db.transaction(function(tx) {
    tx.executeSql("SELECT * FROM user", [], renderFunc,
        html5rocks.webdb.onError);
  });
}

html5rocks.webdb.deleteUser = function(id) {
  var db = html5rocks.webdb.db;
  db.transaction(function(tx){
    tx.executeSql("DELETE FROM user WHERE ID=?", [id],
        html5rocks.webdb.onSuccess,
        html5rocks.webdb.onError);
    });
}

function loadUsers(tx, rs) {
  var rowOutput = "";
  var userItems = document.getElementById("user-list");
  for (var i=0; i < rs.rows.length; i++) {
    rowOutput += renderUser(rs.rows.item(i));
  }

  userItems.innerHTML += rowOutput;
}

function renderUser(row) {
  return "<li class='ui-screen-hidden'><a href='desserts.html?user=" + row.name  + "' class='ui-btn ui-btn-icon-right ui-icon-carat-r'>" + row.name  + "</a></li>";
}

function init() {
  html5rocks.webdb.open();
  html5rocks.webdb.createTable();
  html5rocks.webdb.getAllUsers(loadUsers);
}

function addUser() {
  var name = document.getElementById("txtuser");
  html5rocks.webdb.addUser(name.value);
  name.value = "";
  
}