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

var managerPrompt = function () {
    inquirer.prompt({
        name: "managerPrompt",
        type: "list",
        message: "Select an action",
        choices: ["View items for sale", "View low inventory", "Add to inventory", "Add new product", "Exit Bamazon Manager"]
    }).then(function (answer) {
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

var viewItems = function () {
    //Selects all content from the Products table.  A for loop is used to display the data for all products.
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("\nID | Product | Department | Price | Quantity")
        for (var i = 0; i < res.length; i++) {
            console.log("\n" + res[i].id, res[i].productName, res[i].departmentName, res[i].price, res[i].stockQuantity);
        };
        console.log("\n\n");
        //After the Bamazon Inventory is displayed, "managerPrompt()" runs again to provide the user with further options.
        managerPrompt();
    });
};

var viewLow = function () {
    connection.query("SELECT id, productName, stockQuantity FROM products WHERE stockQuantity < 5", function (err, res) {
        //Loops through our the Result of the query for items with a stock quantity of less than 5 and lists the ID, Name, and Quantity of the item.
        if (res.length > 0) {
            for (var i = 0; i < res.length; i++) {
                console.log("Product ID: " + res[i].id + " Product Name: " + res[i].productName + " Stock: " + res[i].stockQuantity + "\n");
            };
        } else {
            console.log("All items currently meet Bamazon stock requirements\n");
        }
        //Returns user to the Manager Prompt.
        managerPrompt();
    })
};


var addInventory = function () {
    //Connects to the Bamazon Database and requires the user to enter a number as valid product ID and Quantity.
    connection.query("SELECT * FROM PRODUCTS", function (err, res) {
        inquirer.prompt([{
            name: "idReq",
            type: "input",
            message: "Enter the Product ID of the product you wish to restock",
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
            message: "Enter a quantity to add",
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
            //Local variables that store the ID, Item Name, and quantity that is needed to update the products table.
            var updateId;
            var item;
            var quantityUpdate;
            //Validates that the product ID the user entered exists.  Restarts the prompt if it does not.
            if (parseInt(answer.idReq) > res.length) {
                console.log("Product ID " + answer.idReq + " does not exist.  Please enter a new Product ID.");
                addInventory();
            };
            //Matches the ID the user entered with the ID's available in the products table and updates local variables.
            for (var i = 0; i < res.length; i++) {
                if (res[i].id === parseInt(answer.idReq)) {
                    updateId = res[i].id;
                    item = res[i].productName;
                    quantityUpdate = res[i].stockQuantity + parseInt(answer.quantityReq);
                }
            };
            //Re-establishes connection to the Bamazon Database to update the Products table with the new quantity.
            connection.query("UPDATE products SET ? WHERE ?", [{ stockQuantity: quantityUpdate }, { id: updateId }], function (err, res) {
                if (err) throw err;
                //Provides user with a message summarizing the transaction.
                console.log("\n" + item + " has been restocked.  The stock of this product is now " + quantityUpdate + "\n");
                //Returns user to the Manager Prompt.
                managerPrompt();
            })
        })
    })
};
