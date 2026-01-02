CREATE DATABASE vegan_restaurant;
USE vegan_restaurant;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  password VARCHAR(255)
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  price DECIMAL(6,2)
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  total DECIMAL(8,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE dishes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  ingredients TEXT,
  allergens TEXT,
  image VARCHAR(255),
  price DECIMAL(10,2)
);

INSERT INTO products (name, description, price) VALUES
('Hambúrguer Vegano', 'Grão-de-bico', 29.90),
('Lasanha Vegana', 'Molho de tomate', 34.90);
