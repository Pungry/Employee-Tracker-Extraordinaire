//Declaring all dependent libraries
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "employeeTracker_db"
  });

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
            choices: ["View Employee Database", "Add/Update Employee", "Exit"]
        }
    ]).then(function(answer){
        if (answer.firstChoice === "View Employee Database")
        {viewDatabase();}
        else if (answer.firstChoice === "Add/Update Employee")
        {sendEmployee();}
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
            choices: ["By Employee", "By Department", "By Role", "Back"],
            message: "How would you like to view the database?"
        }
    ]).then(function(answer){
        if (answer.sortDB === "By Employee")
        {viewEmployee();}
        else if (answer.sortDB === "By Department")
        {viewDepartment();}
        else if (answer.sortDB === "By Role")
        {viewRole();}
        else if (answer.sortDB === "Back")
        {initialPrompt();}
    })
}
//Use cTable to table out the database sorted by employees
function viewEmployee() {
    console.log("You're looking at DB by employee");
}
//Use cTable to table out the database by department
function viewDepartment() {
    console.log("You're looking at the DB by department");
}
//Use cTable to table out the database by role
function viewRole() {
    console.log("You're looking at the DB sorted by role");
}
//Ask user if they want to add an employee or update one's info, then send them to other functions for both
function sendEmployee() {
    inquirer.prompt([
        {
            name: "addOrUpdate",
            message: "Would you like to add a new employee or edit an existing employee's info?",
            type: "list",
            choices: ["Add Employee", "Edit Employee", "Back"]
        }
    ]).then(function(answer){
        if (answer.addOrUpdate === "Add Employee")
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
//Ask user info on what employee they want to add; first name, last name, role id, manager id (if they have one); send info to another function to actually add employee to database; take back to start
function addEmployee() {
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
            name: "title",
            message: "What is the job title of the employee you wish to add?",
            type: "input"
        },
        {
            name: "salary",
            message: "What is the salary of the employee you wish to add? Give the answer in the form of a decimal.",
            type: "input",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        },
        {
            name: "department",
            message: "What department is the employee in?",
            type: "input"
        }
    ]).then(function(response){
        if (response.firstName === '')
        {
        console.log("Please provide a first name.");
        addEmployee();
        }
        else if (response.lastName === '')
        {
        console.log("Please provide a last name.");
        addEmployee();
        }
        else if (response.title === '')
        {
        console.log("Please provide a job title.");
        addEmployee();
        }
        else if (response.department === '')
        {
        console.log("Please provide a department.");
        addEmployee();
        }
        newEmployee(response);
    })
}
//expects an object passed through, then adds all the stuff in
function newEmployee(employee) {
    console.log("adding employee");
    console.log(employee);
    // connection.query(
    //     "INSERT INTO department SET ?"
    // )
}
//Ask user what the id of employee they want to edit is, then how they want to update the info; send new info to another function to actually add employee to database; take back to start
function editEmployee() {
    inquirer.prompt([
        {
            name: "id",
            message: "What is the id of the employee with info you wish to edit?",
            type: "input"
        }
    ]).then(function(response){
        console.log(response);
        //Check responses given with the database; then ask them if the employee found is the right one, then let them make edits; have to connect to database, select all, loop through them, then ask if that's correct
    })
}