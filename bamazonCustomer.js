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
    console.log("Connection to Bamazon established...", "\nWelcome to Bamazon!");
    displayBamazon();
});

var displayBamazon = function () {
    //Selects all content from the Products table.  A for loop is used to display the data for all products.
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("\nID | Product | Department | Price | Quantity")
        for (var i = 0; i < res.length; i++) {
            console.log("\n" + res[i].id, res[i].productName, res[i].departmentName, res[i].price, res[i].stockQuantity);
        };
        console.log("\n\n");
        welcomeScreen();
    });
};

//Our Welcome Screen will prompt the user to purchase an item or exit the application.
//"Purchase an Item" will continue the function that contains the logic for the application.
//"Exit Bamazon" will end the application and terminate the connection to the database.
var welcomeScreen = function () {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "Select an action",
        choices: ["Purchase an item", "Exit Bamazon"]
    }).then(function (answer) {
        if (answer.action === "Purchase an item") {
            console.log("Bamazon Purchase Screen");
            purchaseItem();
        } else {
            console.log("Thank you for visiting Bamazon.  Have a nice day.");
            connection.end();
        }
    })
};

//The main logic for the application.
var purchaseItem = function () {
    //Connects to the Bamazon Database and requires the user to enter a number as valid product ID and Quantity.
    connection.query("SELECT * FROM PRODUCTS", function (err, res) {
        inquirer.prompt([{
            name: "idReq",
            type: "input",
            message: "Enter the Product ID",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    console.log(" is an invalid product ID.  Please try again.");
                    return false;
                }
            }
        },
        {
            name: "quantityReq",
            type: "input",
            message: "Enter a quantity",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                } else {
                    console.log(" is an invalid input.  Please try again by entering a number.");
                    return false;
                }
            }
        }
        ]).then(function (answer) {
            //Local variables that store the ID, Item Name, total purchase cost, and quantity that is needed to update the products table.
            var updateId;
            var item;
            var cost;
            var quantityUpdate;
            //Validates that the product ID the user entered exists.  Redirects to the purchase screen if it does not.
            if (parseInt(answer.idReq) > res.length) {
                console.log("Product ID " + answer.idReq + " does not exist.  Please review our Warehouse and replace your order.");
                purchaseItem();
            };
            //Matches the ID the user entered with the ID's available in the products table and updates local variables.
            for (var i = 0; i < res.length; i++) {
                if (res[i].id === parseInt(answer.idReq)) {
                    updateId = res[i].id;
                    item = res[i].productName;
                    cost = res[i].price * parseInt(answer.quantityReq);
                    quantityUpdate = res[i].stockQuantity - parseInt(answer.quantityReq);
                    //Validates that the product is in stock.  Provides user with error message and redirects to purchase screen.
                    if (answer.quantityReq > res[i].stockQuantity) {
                        console.log("We apologize.  We can not fulfill your order of " + answer.quantityReq + " " + res[i].productName + " because our stock for this item is currently " + quantity + ".  Please request a lower quantity of the item or select a new item.");
                        purchaseItem();
                    };
                }
            };
            //Re-establishes connection to the Bamazon Database to update the Products table with the new quantity.
            connection.query("UPDATE products SET ? WHERE ?", [{ stockQuantity: quantityUpdate }, { id: updateId }], function (err, res) {
                if (err) throw err;
                //Provides user with a message summarizing their purchase.
                console.log("\nCongragulations on your purchase of " + answer.quantityReq + " " + item + " for " + cost + ".  You really broke the bank today!\n");
                //Prompts user if they wish to purchase more items or exit the application.
                inquirer.prompt({
                    name: "completePurchase",
                    type: "list",
                    message: "What would like to do next?",
                    choices: ["View/Purchase more items", "Exit Bamazon"]
                }).then(function (answer) {
                    if (answer.completePurchase === "View/Purchase more items") {
                        displayBamazon();
                    } else {
                        console.log("Thank you for purchase.  We hope you visit again soon.  Stay tuned for Bamazon Prime");
                        connection.end();
                    }
                })
            })
        })
    })
};