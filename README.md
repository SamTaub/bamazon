# Bamazon

Link to GitHub: [https://github.com/SamTaub/bamazon]

Link to video demo: [https://drive.google.com/file/d/1pNDVBnpcOel_vgibAvjdUGJB186fSsEA/view]

### Description

Bamazon is a mock marketplace that houses various items.  This application runs in node and is connected to a local MySQL database.  Users can use this application in Customer or Manager mode.

### How to use

Users can enter customer mode by typing "node bamazonCustomer" into the terminal.  Use "node bamazonManager" to use the application in manager mode.

* Customer Mode
    
    * When the application starts the Bamazon Inventory will be displayed in the terminal.
    * Customers will be prompted to "Purchase an item" or "Exit Bamazon".  Exiting Bamazon will close the application.
    * When purchasing an item, users will be required to enter a valid product ID and quantity of the desired item.
    * Customers are then provided an order summary including the cost of their purchase.
    * Upon completion of purchase, customers will have the option to purcahse another item or exit Bamazon.

* Manager Mode

Manager Mode provides the user with an inquirer prompt with a list of options to view and manage the Bamazon inventory.

* View items
    * Allows the user to view all items and their stock that are in the Bamazon inventory.
* View low inventory
    * Provides the user with a list of products with a stock quantity of 5 or less.
* Add to inventory
    * Prompts the user to select an item and a quantity to add its stock.
* Add new product
    * Prompts the user to add a new item to the Bamazon Inventory.
* Exit Bamazon
    * Leaves the application and terminates the connection to the Bamazon Database.

### Technology Used

* node.js
* MySQL
* Node Modules
    * Inquirer
    * mysql
    * dotenv
