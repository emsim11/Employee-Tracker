// Import Modules
const { prompt } = require('inquirer');
const Figlet = require('figlet');

// Import Dependencies
const Database = require('./Database/Index');

// Initialize Application
Init();

function Init() {
    Figlet('Employee Manager', function (error, data) {
        if (error) {
            console.log('Something went wrong...');
            console.dir(error);
            return;
        } else {
            console.log(data);
        }
    })
        .then(() => console.log('\n'))
        .then(() => LoadMainPrompts())
}

// Initialize Main Prompt
const LoadMainPrompts = () => {
    prompt([
        {
            name: "Actions",
            type: "list",
            message: "What would you like to do?",
            choices: [
                // Employee Actions
                {
                    name: 'View All Employees',
                    value: 'VIEW_EMPLOYEES'
                },
                {
                    name: 'View All Employees By Department',
                    value: 'VIEW_EMPLOYEES_BY_DEPARTMENT'
                },
                {
                    name: 'View All Employees By Manager',
                    value: 'VIEW_EMPLOYEES_BY_MANAGER'
                },
                {
                    name: 'Add Employee',
                    value: 'ADD_EMPLOYEE'
                },
                {
                    name: 'Remove Employee',
                    value: 'REMOVE_EMPLOYEE'
                },
                {
                    name: 'Update Employee Role',
                    value: 'UPDATE_EMPLOYEE_ROLE'
                },
                {
                    name: 'Update Employee Manager',
                    value: 'UPDATE_EMPLOYEE_MANAGER'
                },
                // Department Actions
                {
                    name: 'View All Departments',
                    value: 'VIEW_DEPARTMENTS'
                },
                {
                    name: 'Add Department',
                    value: 'ADD_DEPARTMENT'
                },
                {
                    name: 'Remove Department',
                    value: 'REMOVE_DEPARTMENT'
                },
                {
                    name: 'View Total Utilized Budget By Department',
                    value: 'VIEW_UTILIZED_BUDGET_BY_DEPARTMENT'
                },
                // Role Actions
                {
                    name: 'View All Roles',
                    value: 'VIEW_ROLES'
                },
                {
                    name: 'Add Role',
                    value: 'ADD_ROLE'
                },
                {
                    name: 'Remove Role',
                    value: 'REMOVE_ROLE'
                },
                // Exit Action
                {
                    name: 'Quit',
                    value: 'QUIT'
                }
            ]
        }
    ]).then((Response) => {
        let Choice = Response.Actions;
        switch (Choice) {
            // Employee Choices
            case 'VIEW_EMPLOYEES':
                ViewEmployees();
                break;
            case 'VIEW_EMPLOYEES_BY_DEPARTMENT':
                ViewEmployeesByDepartment();
                break;
            case 'VIEW_EMPLOYEES_BY_MANAGER':
                ViewEmployeesByManager();
            case 'ADD_EMPLOYEE':
                AddEmployee();
                break;
            case 'REMOVE_EMPLOYEE':
                RemoveEmployee();
                break;
            case  'UPDATE_EMPLOYEE_ROLE':
                UpdateEmployeeRole();
                break;
            case 'UPDATE_EMPLOYEE_MANAGER':
                UpdateEmployeeManager();
                break;
            // Department Choices
            case 'VIEW_DEPARTMENTS':
                ViewDepartments();
                break;
            case 'ADD_DEPARTMENT':
                AddDepartment();
                break;
            case 'REMOVE_DEPARTMENT':
                RemoveDepartment();
                break;
            case 'VIEW_UTILIZED_BUDGET_BY_DEPARTMENT':
                ViewUtilizedBudgetByDepartment();
                break;
            // Role Choices
            case 'VIEW_ROLES':
                ViewRoles();
                break;
            case 'ADD_ROLE':
                AddRole();
                break;
            case 'REMOVE_ROLE':
                RemoveRole();
                break;
            // Exit Choice
            default:
                Quit();
        }
    });
}

// Employee Functions
const ViewEmployees = () => {
    Database.FindAllEmployees()
        .then(({ rows }) => {
            let Employees = rows;
            console.group('\n');
            console.table(Employees);
        })
        .then(() => LoadMainPrompts());
}

const ViewEmployeesByDepartment = () => {
    Database.FindAllDepartments().then(({ rows }) => {
        let Departments = rows;
        const DepartmentChoices = Departments.map(({ ID, Name }) => ({
            name: Name,
            value: ID
        }));

        prompt([
            {
                name: 'DepartmentID',
                type: 'list',
                message: 'Which department would you like to view employees for?',
                choices: DepartmentChoices
            }
        ])
            .then((Response) => Database.FindAllEmployeesByDepartment(Response.DepartmentID))
            .then(({ rows }) => {
                let Employees = rows;
                console.log('\n');
                console.table(Employees);
            })
            .then(() => LoadMainPrompts());
    });
}

const ViewEmployeesByManager = () => {
    Database.FindAllEmployees().then(({ rows }) => {
        let Managers = rows;
        const ManagerChoices = Managers.map(({ ID, First_Name, Last_Name }) => ({
            name: `${First_Name} ${Last_Name}`,
            value: ID
        }));

        prompt([
            {
                name: 'ManagerID',
                type: 'list',
                message: 'Which employee do you want to see direct reports for?',
                choices: ManagerChoices
            }
        ])
            .then((Response) => Database.FindAllEmployeesByManager(Response.ManagerID))
            .then(({ rows }) => {
                let Employees = rows;
                console.log('\n');
                if (Employees.length === 0) {
                    console.log('The selected employee has no direct reports.');
                } else {
                    console.table(Employees);
                }
            })
                .then(() => LoadMainPrompts());
    });
}

const AddEmployee = () => {
    prompt([
        {
            name: 'First_Name',
            message: 'What is the first name of the employee?'
        },
        {
            name: 'Last_Name',
            message: 'What is the last name of the employee?'
        }
    ]).then((Response) => {
        let FirstName = Response.First_Name;
        let LastName = Response.Last_Name;

        Database.FindAllRoles().then(({ rows }) => {
            let Roles = rows;
            const RoleChoices = Roles.map(({ ID, Title }) => ({
                name: Title,
                value: ID
            }));

            prompt({
                name: 'RoleID',
                type: 'list',
                message: 'What is the role of this employee?',
                choices: RoleChoices
            })
                .then((Response) => {
                    let RoleID = Response.RoleID;
                
                    Database.FindAllEmployees().then(({ rows }) => {
                        let Employees = rows;
                        const ManagerChoices = Employees.map(
                            ({ ID, First_Name, Last_Name }) => ({
                                name: `${First_Name} ${Last_Name}`,
                                value: ID
                            })
                        );
                        ManagerChoices.unshift({ name: 'None', value: null });
                
                        prompt({
                            name: 'ManagerID',
                            type: 'list',
                            message: 'Who is the manager of this employee?',
                            choices: ManagerChoices
                        })
                            .then((Response) => {
                                let Employee = {
                                    Manager_ID: Response.ManagerID,
                                    Role_ID: RoleID,
                                    First_Name: FirstName,
                                    Last_Name: LastName
                                };

                                Database.CreateEmployee(Employee);
                            })
                            .then(() => console.log(`${FirstName} ${LastName} has been added as an Employee.`))
                            .then(() => LoadMainPrompts());
                    });
                });
        });
    });
}

const RemoveEmployee = () => {
    Database.FindAllEmployees().then(({ rows }) => {
        let Employees = rows;
        const EmployeeChoices = Employees.map(({ ID, First_Name, Last_Name }) => ({
            name: `${First_Name} ${Last_Name}`,
            value: ID
        }));

        prompt([
            {
                name: 'EmployeeID',
                type: 'list',
                message: 'Which employee would you like to remove?',
                choices: EmployeeChoices
            }
        ])
            .then((Response) => Database.RemoveEmployee(Response.EmployeeID))
            .then(() => console.log(`${FirstName} ${LastName} has been removed from Employees.`))
            .then(() => LoadMainPrompts());
    });
}

const UpdateEmployeeRole = () => {
    Database.FindAllEmployees().then(({ rows }) => {
        let Employees = rows;
        const EmployeeChoices = Employees.map(({ ID, First_Name, Last_Name }) => ({
            name: `${First_Name} ${Last_Name}`,
            value: ID
        }));

        prompt([
            {
                name: 'EmployeeID',
                type: 'list',
                message: 'Which employee would you like to update the role of?',
                choices: EmployeeChoices
            }
        ]).then((Response) => {
            let EmployeeID = Response.EmployeeID;
            let Role = Response.Role;

            Database.FindAllRoles().then(({ rows }) => {
                let Roles = rows;
                const RoleChoices = Roles.map(({ ID, Title }) => ({
                    name: Title,
                    value: ID
                }));

                prompt([
                    {
                        name: 'RoleID',
                        type: 'list',
                        message: 'Which role would you like to assign to the selected employee?',
                        choices: RoleChoices
                    }
                ])
                    .then((Response) => Database.UpdateEmployeeRole(EmployeeID, Response.RoleID))
                    .then(() => console.log(`Role of the selected employee has been updated to: ${Role}.`))
                    .then(() => LoadMainPrompts());
            });
        });
    });
}

const UpdateEmployeeManager = () => {
    Database.FindAllEmployees().then(({ rows }) => {
        let Employees = rows;
        const EmployeeChoices = Employees.map(({ ID, First_Name, Last_Name }) => ({
            name: `${First_Name} ${Last_Name}`,
            value: ID
        }));

        prompt([
            {
                name: 'EmployeeID',
                type: 'list',
                message: 'Which employee would you like to update the manager of?',
                choices: EmployeeChoices
            }
        ]).then((Response) => {
            let EmployeeID = Response.EmployeeID;
            let ManagerID = Response.ManagerID;
            Database.FindAllPossibleManagers(EmployeeID).then(({ rows }) => {
                let Managers = rows;
                const ManagerChoices = Managers.map(({ ID, First_Name, Last_Name }) => ({
                    name: `${First_Name} ${Last_Name}`,
                    value: ID
                }));

                prompt([
                    {
                        name: 'ManagerID',
                        type: 'list',
                        message: 'Which manager would you like to assign to the selected employee?',
                        choices: ManagerChoices
                    }
                ])
                    .then((Response) => Database.UpdateEmployeeManager(EmployeeID, ManagerID))
                    .then(() => console.log('The manager of the selected employee has been updated.'))
                    .then(() => LoadMainPrompts());
            });
        });
    });
}

// Department Functions
const ViewDepartments = () => {
    Database.FindAllDepartments()
        .then(({ rows }) => {
            let Departments = rows;
            console.log('\n');
            console.table(Departments);
        })
        .then(() => LoadMainPrompts());
}

const AddDepartment = () => {
    prompt([
        {
            name: 'DepartmentName',
            message: 'What is the name of the department?'
        }
    ]).then((Response) => {
        let Name = Response;
        Database.CreateDepartment(Name)
            .then(() => console.log(`${Name.Name} has been added as a Department.`))
            .then(() => LoadMainPrompts());
    });
}

const RemoveDepartment = () => {
    Database.FindAllDepartments().then(({ rows }) => {
        let Departments = rows;
        const DepartmentChoices = Departments.map(({ ID, Name }) => ({
            name: Name,
            value: ID
        }));

        prompt({
            name: 'DepartmentID',
            type: 'list',
            message: 'Which department would you like to remove? ‼️ WARNING: This will also remove associated roles and employees.',
            choices: DepartmentChoices
        })
            .then((Response) => Database.RemoveDepartment(Response.DepartmentID))
            .then(() => console.log(`${Response.DepartmentID} Department, and its associated roles and employees, have been removed.`))
            .then(() => LoadMainPrompts());
    });
}

const ViewUtilizedBudgetByDepartment = () => {
    Database.ViewDepartmentBudgets()
        .then(({ rows }) => {
            let Departments = rows;
            console.log('\n');
            console.table(Departments);
        })
        .then(() => LoadMainPrompts());
}

// Role Functions
const ViewRoles = () => {
    Database.FindAllRoles()
        .then(({ rows }) => {
            let Roles = rows;
            console.log('\n');
            console.table(Roles);
        })
        .then(() => LoadMainPrompts());
}

const AddRole = () => {
    Database.FindAllDepartments().then(({ rows }) => {
        let Departments = rows;
        const DepartmentChoices = Departments.map(({ ID, Name }) => ({
            name: Name,
            value: ID
        }));

        prompt([
            {
                name: 'Title',
                message: 'What is the name of the new role?'
            },
            {
                name: 'Salary',
                message: 'What is the salary of the new role?'
            },
            {
                name: 'DepartmentID',
                type: 'list',
                message: 'Which department does the new role belong to?',
                choices: DepartmentChoices
            }
        ]).then((Role) => {
            Database.CreateRole(Role)
                .then(() => console.log(`${Role.Title} has been added as a Role.`))
                .then(() => LoadMainPrompts());
        });
    });
}

const RemoveRole = () => {
    Database.FindAllRoles().then(({ rows }) => {
        let Roles = rows;
        const RoleChoices = Roles.map(({ ID, Title }) => ({
            name: Title,
            value: ID
        }));

        prompt([
            {
                name: 'RoleID',
                type: 'list',
                message: 'Which role would you like to remove? ‼️ WARNING: This will also remove associated employees.',
                choices: RoleChoices
            }
        ])
            .then((Response) => {
                const SelectedRole = Roles.find(Role => Role.ID === Response.RoleID);
                Database.RemoveRole(Response.RoleID)
                    .then(() => {
                        console.log(`${roleToDelete.Title} Role has been removed from Roles.`);
                        LoadMainPrompts();
                    });
            });
    });
}

// Quit Function
const Quit = () => {
    console.log('Exiting From Employee Manager Program');
    process.exit();
}