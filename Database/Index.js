// Import Dependencies
const Connection = require('./Connection');

// DB Module
class DB {
    constructor() {}

    async query(SQL, Arguments = []) {
        const Client = await Connection.connect();
        try {
            const Result = await Client.query(SQL, Arguments);
            return Result;
        } catch (error) {
            throw new Error(error);
        } finally {
            Client.release();
        }
    }

    // Employee Functions
    FindAllEmployees = () => {
        return this.query (
            "SELECT Employee.ID, Employee.First_Name, Employee.Last_Name, Role.Title, Department.Name AS Department, Role.Salary, CONCAT (Manager.First_Name, ' ', Manager.Last_Name) AS Manager FROM Employee LEFT JOIN Role on Employee.Role_ID = Role.ID LEFT JOIN Department on Role.Department_ID = Department.ID LEFT JOIN Employee Manager on Manager.ID = Employee.Manager_ID;"
        );
    }

    FindAllEmployeesByDepartment = (DepartmentID) => {
        return this.query (
            "SELECT Employee.ID, Employee.First_Name, Employee.Last_Name, Role.Title FROM Employee LEFT JOIN Role on Employee.Role_ID = Role.ID LEFT JOIN Department on Role.Department_ID = Department.ID WHERE Department.ID = $1;",
            [DepartmentID]
        );
    }

    FindAllEmployeesByManager = (ManagerID) => {
        return this.query (
            "SELECT Employee.ID, Employee.First_Name, Employee.Last_Name, Department.Name AS Department, Role.Title FROM Employee LEFT JOIN Role on Role.ID = Employee.Role_ID LEFT JOIN Department on Department.ID = Role.Department_ID WHERE Manager_ID = $1;",
            [ManagerID]
        );
    }

    FindAllPossibleManagers = (EmployeeID) => {
        return this.query (
            "SELECT ID, First_Name, Last_Name FROM Employee WHERE ID != $1",
            [EmployeeID]
        );
    }

    CreateEmployee = (Employee) => {
        const { First_Name, Last_Name, Role_ID, Manager_ID } = Employee;
        return this.query (
            "INSERT INTO Employee (First_Name, Last_Name, Role_ID, Manager_ID) VALUES ($1, $2, $3, $4)",
            [First_Name, Last_Name, Role_ID, Manager_ID]
        );
    }

    RemoveEmployee = (EmployeeID) => {
        return this.query (
            "DELETE FROM Employee WHERE ID = $1",
            [EmployeeID]
        );
    }

    UpdateEmployeeRole = (EmployeeID, RoleID) => {
        return this.query (
            "UPDATE Employee SET Role_ID = $1 WHERE ID = $2",
            [RoleID, EmployeeID]
        );
    }

    UpdateEmployeeManager = (EmployeeID, ManagerID) => {
        return this.query (
            "UPDATE Employee SET Manager_ID = $1 WHERE ID = $2",
            [ManagerID, EmployeeID]
        );
    }

    // Department Functions
    FindAllDepartments = () => {
        return this.query (
            "SELECT Department.ID, Department.Name FROM Department;"
        );
    }

    CreateDepartment = (Department) => {
        return this.query (
            "INSERT INTO Department (Name) VALUES ($1)",
            [Department.Name]
        );
    }

    RemoveDepartment = (DepartmentID) => {
        return this.query (
            "DELETE FROM Department WHERE ID = $1",
            [DepartmentID]
        );
    }

    ViewDepartmentBudgets = () => {
        return this.query (
            "SELECT Department.ID, Department.Name, SUM(Role.Salary) AS Utilized_Budget FROM Employee LEFT JOIN Role Employee.Role_ID = Role.ID LEFT JOIN Department on Role.Department_ID = Department.ID GROUP BY Department.ID, Department.Name;"
        );
    }

    // Role Functions
    FindAllRoles = () => {
        return this.query (
            "SELECT Role.ID, Role.Title, Department.Name AS Department, Role.Salary FROM Role LEFT JOIN Department on Role.Department_ID = Department.ID;"
        );
    }

    CreateRole = (Role) => {
        const { Title, Salary, Department_ID } = Role;
        return this.query (
            "INSERT INTO Role (Title, Salary, Department_ID) VALUES ($1, $2, $3)",
            [Title, Salary, Department_ID]
        );
    }

    RemoveRole = (RoleID) => {
        return this.query (
            "DELETE FROM Role WHERE ID = $1",
            [RoleID]
        );
    }
}

module.exports = new DB();