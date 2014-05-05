var html5rocks = {};
html5rocks.webdb = {};
html5rocks.webdb.db = null;

html5rocks.webdb.open = function () {
    var dbSize = 5 * 1024 * 1024; // 5MB
    html5rocks.webdb.db = openDatabase("dessert", "1.0", "Daily Dessert", dbSize);
}

html5rocks.webdb.createTable = function () {
    var db = html5rocks.webdb.db;
    db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS user(ID INTEGER PRIMARY KEY ASC, name TEXT)", []);
        tx.executeSql("CREATE TABLE IF NOT EXISTS dessert(ID INTEGER PRIMARY KEY ASC, name TEXT, price FLOAT)", []);
        tx.executeSql("CREATE TABLE IF NOT EXISTS userdessert(ID INTEGER PRIMARY KEY ASC, user TEXT, dessert TEXT, dcount INTEGER, date TEXT)", []);

    });
}

html5rocks.webdb.onError = function (tx, e) {
    alert("There has been an error: " + e.message);
}


html5rocks.webdb.onSuccess = function (tx, r) {
    // re-render the data.
    //html5rocks.webdb.getAllUsers(loadUsers);
}


function init() {
    html5rocks.webdb.open();
    html5rocks.webdb.createTable();

}

function initUsers() {
    init();
    document.getElementById("dateTag").innerHTML = localStorage.selectedDate;
    html5rocks.webdb.getAllUsers(loadUsers);
}

function initDesserts() {
    init();
    var uname = getParameter("user");
    if (uname != null) {
        localStorage.selectedUser = uname;
    }
    document.getElementById("userTag").innerHTML = localStorage.selectedUser;
    html5rocks.webdb.getAllDesserts(loadDesserts);
}

function initDessertCount() {
    init();
    var dname = getParameter("dessert");
    if (dname != null) {
        localStorage.selectedDessert = dname;
    }
    document.getElementById("dtitle").innerHTML = localStorage.selectedDessert;
    
    html5rocks.webdb.selectUserDessertCount(setDessertCount,localStorage.selectedDessert);
}


function getParameter(paramName) {
    var searchString = window.location.search.substring(1),
        i, val, params = searchString.split("&");

    for (i = 0; i < params.length; i++) {
        val = params[i].split("=");
        if (val[0] == paramName) {
            return unescape(val[1]);
        }
    }
    return null;
}


// Users Region

html5rocks.webdb.addUser = function (name) {
    var db = html5rocks.webdb.db;
    db.transaction(function (tx) {

        tx.executeSql("INSERT INTO user(name) VALUES (?)", [name],
            html5rocks.webdb.onSuccessAddUser,
            html5rocks.webdb.onError);
    });
}

html5rocks.webdb.onSuccessAddUser = function (tx, r) {
    // re-render the data.

}

html5rocks.webdb.getAllUsers = function (renderFunc) {
    var db = html5rocks.webdb.db;
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM user", [], renderFunc,
            html5rocks.webdb.onError);
    });
}

html5rocks.webdb.deleteUser = function (id) {
    var db = html5rocks.webdb.db;
    db.transaction(function (tx) {
        tx.executeSql("DELETE FROM user WHERE ID=?", [id],
            html5rocks.webdb.onSuccess,
            html5rocks.webdb.onError);
    });
}

function loadUsers(tx, rs) {
    var rowOutput = "";
    var userItems = document.getElementById("user-list");
    for (var i = 0; i < rs.rows.length; i++) {
        rowOutput += renderUser(rs.rows.item(i));
    }

    userItems.innerHTML += rowOutput;
}

function renderUser(row) {
    return "<li><a href='desserts.html?user=" + row.name + "&id=" + row.id + "&date=" + getParameter("date") + "' data-ajax='false' class='ui-btn ui-btn-icon-right ui-icon-carat-r'>" + row.name + "</a></li>";
}


function addUser() {
    var name = document.getElementById("txtuser");
    html5rocks.webdb.addUser(name.value);
    name.value = "";

}

// Desserts Region

html5rocks.webdb.addDessert = function (name, price) {
    var db = html5rocks.webdb.db;
    db.transaction(function (tx) {

        tx.executeSql("INSERT INTO dessert(name,price) VALUES (?,?)", [name, price],
            html5rocks.webdb.onSuccessAddDessert,
            html5rocks.webdb.onError);
    });
}



html5rocks.webdb.onSuccessAddDessert = function (tx, r) {
    // re-render the data.

}

html5rocks.webdb.getAllDesserts = function (renderFunc) {
    var db = html5rocks.webdb.db;
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM dessert", [], renderFunc,
            html5rocks.webdb.onError);
    });
}

html5rocks.webdb.deleteDessert = function (id) {
    var db = html5rocks.webdb.db;
    db.transaction(function (tx) {
        tx.executeSql("DELETE FROM dessert WHERE ID=?", [id],
            html5rocks.webdb.onSuccess,
            html5rocks.webdb.onError);
    });
}

function loadDesserts(tx, rs) {
    var rowOutput = "";
    var dessertItems = document.getElementById("dessert-list");
    for (var i = 0; i < rs.rows.length; i++) {
        rowOutput += renderDessert(rs.rows.item(i));
    }

    dessertItems.innerHTML += rowOutput;
}

function renderDessert(row) {
    
    return "<li><a href='setCount.html?dessert=" + row.name + "' data-ajax='false' class='ui-btn ui-btn-icon-right ui-icon-carat-r'>" + row.name + "</a></li>";
    
    //return "<div class='ui-checkbox'><input type='checkbox' name='"+row.name+"' id='"+row.name+"' checked=''><label for='"+row.name+"'>"+row.name+"</label></div>"
}



function addDessert() {
    var name = document.getElementById("txtdessert");
    var price = document.getElementById("txtprice");
    html5rocks.webdb.addDessert(name.value, price.value);
    name.value = "";
    price.value = "";

}

// user-dessert region

html5rocks.webdb.addUserDessert = function (user, dessert, count, date) {
    var db = html5rocks.webdb.db;
    db.transaction(function (tx) {

        tx.executeSql("INSERT INTO userdessert(user,dessert,dcount,date) VALUES (?,?,?,?)", [user, dessert, count, date],
            html5rocks.webdb.onSuccessAddUserDessert,
            html5rocks.webdb.onError);
    });
}

html5rocks.webdb.updateUserDessert = function (user, dessert, count, date) {
    var db = html5rocks.webdb.db;
    db.transaction(function (tx) {

        tx.executeSql("UPDATE userdessert SET dcount=dcount+? WHERE user=? and dessert=? and date=?", [count, user, dessert, date],
            html5rocks.webdb.onSuccessAddUserDessert,
            html5rocks.webdb.onError);
    });
}

html5rocks.webdb.onSuccessAddUserDessert = function (tx, r) {
    // re-render the data.

}

html5rocks.webdb.getAllUserDessert = function (renderFunc) {
    var db = html5rocks.webdb.db;
    db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM dessert", [], renderFunc,
            html5rocks.webdb.onError);
    });
}

html5rocks.webdb.deleteUserDessert = function (id) {
    var db = html5rocks.webdb.db;
    db.transaction(function (tx) {
        tx.executeSql("DELETE FROM dessert WHERE ID=?", [id],
            html5rocks.webdb.onSuccess,
            html5rocks.webdb.onError);
    });
}

function loadUserDesserts(tx, rs) {
    var rowOutput = "";
    var dessertItems = document.getElementById("dessert-list");
    for (var i = 0; i < rs.rows.length; i++) {
        rowOutput += renderDessert(rs.rows.item(i));
    }

    dessertItems.innerHTML += rowOutput;
}

function renderUserDessert(row) {
    return "<li><a href='desserts.html?user=" + row.name + "' data-ajax='false' class='ui-btn ui-btn-icon-right ui-icon-carat-r'>" + row.name + "</a></li>";
}


function addUserDessert() {

    html5rocks.webdb.addOrUpdateUserDessert(updateDesserts);


}

html5rocks.webdb.addOrUpdateUserDessert = function (renderFunc) {

    var db = html5rocks.webdb.db;
    db.transaction(function (tx) {

        tx.executeSql("SELECT dcount FROM userdessert WHERE user=? and dessert=? and date=?", [localStorage.selectedUser, localStorage.selectedDessert, localStorage.selectedDate],
            renderFunc,
            html5rocks.webdb.onError);
    });
}

function updateDesserts(tx, rs) {

    if (rs.rows.length > 0) {
        html5rocks.webdb.updateUserDessert(localStorage.selectedUser, localStorage.selectedDessert, document.getElementById("txtdessertcount").value, localStorage.selectedDate);
    } else {
        html5rocks.webdb.addUserDessert(localStorage.selectedUser, localStorage.selectedDessert, document.getElementById("txtdessertcount").value, localStorage.selectedDate);
    }
    
    document.getElementById("txtdessertcount").value="";
}

html5rocks.webdb.selectUserDessertCount = function (renderFunc,dname) {

    var db = html5rocks.webdb.db;
    db.transaction(function (tx) {

        tx.executeSql("SELECT dcount FROM userdessert WHERE user=? and dessert=? and date=?", [localStorage.selectedUser, dname, localStorage.selectedDate],
            renderFunc,
            html5rocks.webdb.onError);
    });
}

function setDessertCount(tx, rs) {

    for (var i = 0; i < rs.rows.length; i++) {
        document.getElementById("txtdessertcount").value = rs.rows.item(i).dcount;
    }
}