var mysql = require('mysql');
var databaseconfig = require('./databaseconfig.json');
var pool  = mysql.createPool({
    host     : databaseconfig.host,
    user     : databaseconfig.user,
    password : databaseconfig.password,
    database : databaseconfig.database
});

exports.pool = pool;