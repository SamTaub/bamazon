DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT,
    productName VARCHAR(75) NOT NULL,
    departmentName VARCHAR(75) NOT NULL,
    price INT(10) NOT NULL,
    stockQuantity INT(10) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO products (productName, departmentName, price, stockQuantity)
VALUES
("Scooter", "Outdoors", 80, 50),
("Patio Set", "Outdoors", 799, 12),
("E-Z Build Fence", "Outdoors", 400, 28),
("Air Purifier", "Home", 40, 30),
("Robo Puppy", "Home", 499, 200),
("Kitten Obstacle Course", "Pets", 39, 100),
("Bird Cage", "Pets", 19, 70),
("Smacbook Pro", "Electronics", 2000, 10),
("Bell XBS 15", "Electronics", 1500, 10),
("8k Flat Screen TV", "Electronics", 1999, 30),
("Electric Guitar", "Music", 300, 90),
("Weatherbest Car Mats", "Car", 180, 60);