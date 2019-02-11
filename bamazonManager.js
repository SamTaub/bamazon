//Variables to Require "Inquirer", "MySQL", and "dotenv" node modules.
var inquirer = require('inquirer');
var mysql = require('mysql');
require('dotenv').config();

//Establishes authentication for the local MySQL Database.  Root password is hidden using "dotenv" node module.
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.DB_Pass,
    database: "bamazon"
});

//Connections to Bamazon Database and runs the function to display the contents of the database.
connection.connect(function (err, res) {
    if (err) throw err;
    console.log("\nConnection to Bamazon established...", "\nWelcome to Bamazon Manager!\n\n");
    managerPrompt();
});

var managerPrompt = function() {
inquirer.prompt({
    name: "managerPrompt",
    type: "list",
    message: "Select an action",
    choices: ["View items for sale", "View low inventory", "Add to inventory", "Add new product", "Exit Bamazon Manager"]
}).then(function(answer){
    
    switch (answer.managerPrompt) {
        case "View items for sale":
        viewItems();
        break;
        case "View low inventory":
        viewLow();
        break;
        case "Add to inventory":
        addInventory();
        break;
        case "Add new product":
        newProduct();
        break;
        default: 
        console.log("Exiting Bamazon Manager...  Have a nice day!");
        connection.end();
    }
})
};