var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function(err, res){
    if (err) throw err;
    console.log("Connect to Bamazon established...", "\nWelcome to Bamazon!");
    connection.end();
});