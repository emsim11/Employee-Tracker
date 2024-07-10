-- Connect to the Database --
\c employees

-- Add Departments to the Department Table --
INSERT INTO department (Name)
VALUES
    ("Administration"),
    ("Customer Services"),
    ("Engineering"),
    ("Finance"),
    ("Human Resources"),
    ("Legal"),
    ("Marketing"),
    ("Research & Development"),
    ("Sales");

-- Add Roles to the Role Table --
INSERT INTO role (Title, Salary, Department_ID)
VALUES
("CEO", 250000, 1), -- Administration: 1 --
("President", 200000, 1 ), -- Administration: 2 --
("Customer Services Director", 75000, 2), -- Customer Services: 3 -- 
("Customer Service Representative", 50000, 2), -- Customer Services: 4 -- 
("Lead Engineer", 150000, 3), -- Engineering: 5 --
("Software Engineer", 80000, 3), -- Engineering: 6 --
("Finance Director", 120000, 4), -- Finance: 7 --
("Financial Analyst", 100000, 4), -- Finance: 8 --
("Human Resources Director", 80000, 5), -- Human Resources: 9 --
("Human Resources Representative", 60000, 5), -- Human Resources: 10 --
("Legal Director", 200000, 6), -- Legal: 11 --
("Corporate Attorney", 140000, 6) -- Legal: 12 --
("Marketing Director", 150000, 7), -- Marketing: 13 --
("Marketing Representative", 80000, 7), -- Marketing: 14 --
("Research & Development Director", 200000, 8), -- Research & Development: 15 --
("Research & Development Representative", 100000, 8), -- Research & Development: 16 --
("Sales Director", 150000, 9), -- Sales: 17 --
("Sales Representative", 80000, 9); -- Sales: 18 --

-- Add Employees to the Employee Table --
INSERT INTO employee (First_Name, Last_Name, Role_ID, Manager_ID)
VALUES
("Braxton", "Leonard", 1, 1),
("Vanessa", "Cambria", 1, 2)