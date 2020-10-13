//Declaring all dependent libraries
const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employeeTracker_db"
  });

//Store 3 separate arrays of the created departments, roles, and employee objects all with same keys as the SQL database

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    initialPrompt();
  });

function initialPrompt() {
    inquirer.prompt([
        {
            name: "firstChoice",
            type: "list",
            message: "What would you like to do?",
            choices: ["View Employee Database", "Add/Update Employee, Role, Department", "Exit"]
        }
    ]).then(function(answer){
        if (answer.firstChoice === "View Employee Database")
        {viewDatabase();}
        else if (answer.firstChoice === "Add/Update Employee, Role, Department")
        {sendAddOrUpdate();}
        else if (answer.firstChoice === "Exit")
        {console.log("Goodbye!");
        connection.end();}
    });
}
//Add choice to delete employees to initial question if you get the rest working 

//Ask how the user wants the view of the database sorted (by department, role, and employee), then call another function that'll display it that way
function viewDatabase() {
    inquirer.prompt([
        {
            name: "sortDB",
            type: "list",
            choices: ["All Employees", "All Departments", "All Roles", "Back"],
            message: "How would you like to view the database?"
        }
    ]).then(function(answer){
        if (answer.sortDB === "All Employees")
        {viewEmployee();}
        else if (answer.sortDB === "All Departments")
        {viewDepartment();}
        else if (answer.sortDB === "All Roles")
        {viewRole();}
        else if (answer.sortDB === "Back")
        {initialPrompt();}
    })
}

function viewEmployee() {
    connection.query('SELECT first_name AS "First Name", last_name AS "Last Name", salary AS "Salary", dName AS "Department", title AS "Job Title" FROM ((employee JOIN roles ON employee.role_id = roles.id) JOIN department ON roles.department_id = department.id)', function(err, data){
        if (err) {throw err;}
        console.table(data);
        initialPrompt();
    });
}

function viewDepartment() {
    connection.query('SELECT dName AS "Department" FROM department', function(err, data){
        if (err) {throw err;}
        console.table(data);
        initialPrompt();
    });
}

function viewRole() {
    connection.query('SELECT title AS "Roles", dName AS "Department" FROM roles JOIN department ON roles.department_id = department.id', function(err, data){
        if (err) {throw err;}
        console.table(data);
        initialPrompt();
    });
}

function sendAddOrUpdate() {
    inquirer.prompt([
        {
            name: "choice",
            type: "list",
            choices: ["Add or Update Employee", "Add or Update Role", "Add or Update Department"],
            message: "Would you like to add/update an employee, a role, or a department?"
        }
    ]).then(function(answer){
    if (answer.choice === "Add or Update Employee"){
        sendEmployee();}
    if (answer.choice === "Add or Update Role"){
        sendRole();}
    if (answer.choice === "Add or Update Department"){
        sendDepartment();}
    }
)}

//Ask user if they want to add an employee or update one's info, then send them to other functions for both
function sendEmployee() {
    inquirer.prompt([
        {
            name: "addOrUpdate",
            message: "Would you like to add a new employee or edit an existing employee's info?",
            type: "list",
            choices: ["Add New Employee", "Edit Employee", "Back"]
        }
    ]).then(function(answer){
        if (answer.addOrUpdate === "Add New Employee")
        {
            addEmployee();
        }
        else if (answer.addOrUpdate === "Edit Employee")
        {
            editEmployee();
        }
        else if (answer.addOrUpdate === "Back")
        {
            initialPrompt();
        }
    })
}
function sendRole() {
    inquirer.prompt([
        {
            name: "addOrUpdate",
            message: "Would you like to add a new role or edit an existing role's info?",
            type: "list",
            choices: ["Add New Role", "Edit Role", "Back"]
        }
    ]).then(function(answer){
        if (answer.addOrUpdate === "Add New Role")
        {
            addRole();
        }
        else if (answer.addOrUpdate === "Edit Role")
        {
            editRole();
        }
        else if (answer.addOrUpdate === "Back")
        {
            initialPrompt();
        }
    })
}
function sendDepartment() {
    inquirer.prompt([
        {
            name: "addOrUpdate",
            message: "Would you like to add a new role or edit an existing department's info?",
            type: "list",
            choices: ["Add New Department", "Edit Department", "Back"]
        }
    ]).then(function(answer){
        if (answer.addOrUpdate === "Add New Department")
        {
            addDepartment();
        }
        else if (answer.addOrUpdate === "Edit Department")
        {
            editDepartment();
        }
        else if (answer.addOrUpdate === "Back")
        {
            initialPrompt();
        }
    })
}
//Ask user info on what employee they want to add; first name, last name, role id, manager id (if they have one); send info to another function to actually add employee to database; take back to start
function addEmployee() {
    connection.query("SELECT * FROM roles JOIN department ON roles.department_id = department.id", function(err, data) {
        if (err) {throw err;}
        inquirer.prompt([
            {
            name: "firstName",
            message: "What is the first name of the employee you wish to add?",
            type: "input"
            },
            {
            name: "lastName",
            message: "What is the last name of the employee you wish to add?",
            type: "input"
            },
            {
                name: "roleName",
                type: "rawlist",
                message: "Please select the role the employee you are adding will have:",
                choices: function () {
                    const choicesArray = []
                    for (let i = 0; i < data.length; i++) 
                        {
                        choicesArray.push(data[i].title)
                        }
                    return choicesArray
                    }
            }
        ]).then(({firstName, lastName, roleName}) => {
            //Need to get the department id from the results array and insert that into the object
            const [foundRole] = data.filter(role => role.title === roleName);
            connection.query("INSERT INTO employee SET ?", {
                first_name: firstName,
                last_name: lastName,
                role_id: foundRole.id
            }, (err, results) => {
                if (err) throw err
                console.log("======================")
                console.log("Added new employee.")
                console.log("======================")
                initialPrompt();
            })
        })
    })
}

function editEmployee() {
    connection.query("SELECT * FROM ((employee JOIN roles ON employee.role_id = roles.id) JOIN department ON roles.department_id = department.id)", function (err, results)
    {
        if (err) {throw err;}
        inquirer.prompt([
            {
                type: "rawlist",
                name: "empList",
                message: "Please select the last name of the Employee to edit:",
                choices: function () {
                const choicesArray = []
                for (let i = 0; i < results.length; i++)
                    {
                    choicesArray.push(results[i].last_name)
                    }
                return choicesArray}
            },
            {
                type: "text",
                name: "newFirst",
                message: "What do you wish to change this employee's first name to?"
            },
            {
                type: "text",
                name: "newLast",
                message: "What do you wish to change this employee's last name to?"
            },
            {
                name: "roleName",
                type: "rawlist",
                message: "Please select the role the new role of the employee:",
                choices: function () {
                    const choicesArray = []
                    for (let i = 0; i < results.length; i++) 
                        {
                        choicesArray.push(results[i].title)
                        }
                    return choicesArray
                    }
            }
        ]).then(function(response){
            console.log(response);
            const [foundName] = results.filter(last_name => results.last_name === response.last_name);
            const [foundID] = results.filter(role => results.roleName === response.title);
            console.log(foundName);
            console.log(foundID);
            connection.query("UPDATE employee SET ?, ?, ? WHERE ?", [{first_name: response.newFirst}, {last_name: response.newLast}, {role_id: foundID.id}, {id: foundName.id}], function(err, data)
            {
                if (err) {throw err;}
                console.log("Updated");
                initialPrompt();
            })
        })
    })
}

function addRole() {
    console.log("Adding role");
    //https://github.com/D-Molloy/sql-join-inquirer
        connection.query("SELECT * FROM department", (err, results) => {
            if (err) throw err
            // console.log('author results', results)
            inquirer.prompt([{
                type: "text",
                name: "roleName",
                message: "Please enter the name of the new role:"
            }, 
            {
                type: "number",
                name: "salary",
                message: "What is the salary of the new role? In decimal form."
            },
            {
                type: "rawlist",
                name: "depName",
                message: "Please select the department of which this role is for:",
                choices: function () {
                    const choicesArray = []
                    for (let i = 0; i < results.length; i++) {
                        choicesArray.push(results[i].dName)
                    }
                    return choicesArray
            }
            }]).then(({roleName, salary, depName}) => {
                //Need to get the department id from the results array and insert that into the object
                const [foundDep] = results.filter(department => department.dName === depName);
                connection.query("INSERT INTO roles SET ?", {
                    title: roleName,
                    salary: salary,
                    department_id: foundDep.id
                }, (err, results) => {
                    if (err) throw err
                    console.log("======================")
                    console.log("Added new role.")
                    console.log("======================")
                    initialPrompt();
                })
    
        })
    })
}

function editRole() {
    connection.query("SELECT title, salary FROM roles", function (err, results)
    {
        if (err) {throw err;}
        inquirer.prompt([
            {
                type: "rawlist",
                name: "roleList",
                message: "Please select the role to edit:",
                choices: function () {
                const choicesArray = []
                for (let i = 0; i < results.length; i++)
                    {
                    choicesArray.push(results[i].title)
                    }
                return choicesArray}
            },
            {
                type: "text",
                name: "newName",
                message: "What do you wish to change this role's name to?"
            },
            {
                type: "number",
                name: "newSal",
                message: "How much is the salary of this role? Give the answer in the form of a decimal."
            }
        ]).then(function(response){
            connection.query("UPDATE roles SET ?, ? WHERE ?", [{title: response.newName}, {salary: response.newSal}, {title: response.roleList}], function(err, data)
            {
                if (err) {throw err;}
                console.log("Updated");
                initialPrompt();
            })
        })
    })
}

function addDepartment() {
    inquirer.prompt([
        {
            name: "dName",
            message: "What is the name of the new department?",
            type: "text"
        }
    ]).then(function(response){
        connection.query("INSERT INTO department SET ?", {dName: response.dName}, function(err){
            if (err) {throw err;}
            console.log("Department added.");
            initialPrompt();
        })
    })
}

function editDepartment() {
    connection.query("SELECT dName FROM department", function (err, dName)
    {
        if (err) {throw err;}
        inquirer.prompt([
            {
                type: "rawlist",
                name: "depList",
                message: "Please select the department to edit:",
                choices: function () {
                const choicesArray = []
                for (let i = 0; i < dName.length; i++)
                    {
                    choicesArray.push(dName[i].dName)
                    }
                return choicesArray}
            },
            {
                type: "text",
                name: "newName",
                message: "What do you wish to change this department's name to?"
            }
        ]).then(function(response){
            connection.query("UPDATE department SET ? WHERE ?", [{dName: response.newName},{dName: response.depList}], function(err, data)
            {
                if (err) {throw err;}
                console.log("Updated");
                initialPrompt();
            })
        })
    })
}