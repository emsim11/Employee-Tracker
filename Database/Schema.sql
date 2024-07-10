-- Drop the Database if it Already Exists --
DROP DATABASE IF EXISTS employees;

-- Create the New Database --
CREATE DATABASE employees;

-- Connect to the Database --
\c employees

-- Create the Department Table --
CREATE TABLE department (
    ID SERIAL PRIMARY KEY,
    Name VARCHAR(30) UNIQUE NOT NULL
);

-- Create the Role Table --
CREATE TABLE role (
    ID SERIAL PRIMARY KEY,
    Title VARCHAR(30) UNIQUE NOT NULL,
    Salary DECIMAL NOT NULL,
    Department_ID INTEGER NOT NULL,
    CONSTRAINT fk_Department FOREIGN KEY (Department_ID) REFERENCES Department(ID) ON DELETE CASCADE
);

-- Create the Employee Table --
CREATE TABLE employee (
    ID SERIAL PRIMARY KEY,
    First_Name VARCHAR(30) NOT NULL,
    Last_Name VARCHAR(30) NOT NULL,
    Role_ID INTEGER NOT NULL,
    CONSTRAINT fk_Role FOREIGN KEY (Role_ID) REFERENCES Role(ID) ON DELETE CASCADE,
    Manager_ID INTEGER,
    CONSTRAINT fk_Manager FOREIGN KEY (Manager_ID) REFERENCES Employee(ID) ON DELETE SET NULL
);