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

function viewEmployee() {
    connection.query('SELECT first_name AS "First Name", last_name AS "Last Name", salary AS "Salary", dName AS "Department", title AS "Job Title" FROM ((employee JOIN roles ON employee.role_id = roles.id) JOIN department ON roles.department_id = department.id)', function(err, data){
        if (err) {throw err;}
        console.table(data);
        initialPrompt();
    });
}

function viewDepartment() {
    connection.query('SELECT dName AS "Department", title AS "Job Title", first_name AS "First Name", last_name AS "Last Name", salary AS "Salary" FROM ((employee JOIN roles ON employee.role_id = roles.id) JOIN department ON roles.department_id = department.id)', function(err, data){
        if (err) {throw err;}
        console.table(data);
        initialPrompt();
    });
}

function viewRole() {
    connection.query('SELECT title AS "Job Title", first_name AS "First Name", last_name AS "Last Name", salary AS "Salary", dName AS "Department" FROM ((employee JOIN roles ON employee.role_id = roles.id) JOIN department ON roles.department_id = department.id)', function(err, data){
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
            //list of limited department options/types
            name: "department",
            message: "What department is the employee in?",
            type: "rawlist",
            //Want the choices to be the array of departments
            choices: ["Marketing", "Executive", "Programming", "Human Resources", "New"]
        },
        {
            //list of limited employee options/types
            name: "title",
            message: "What is the job title of the employee you wish to add?",
            type: "rawlist",
            //Want the choices to be the array of titles
            choices: ["Marketer", "Salesman", "CEO", "Executive", "Programmer", "Junior Programmer", "Staffing Coordinator", "HR Manager", "New"]
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
        newEmployee(response);
    })
}
//expects an object passed through, then adds a new employee based on the answers
function newEmployee(employee) {
    console.log("adding employee");
    //Make employee a new employee object, push it into the array of employees, then add employee into SQL db using the data provided 
    //let role_id = connection.query("SELECT id FROM roles WHERE role.title = employee.title")
    console.log(employee);
    // connection.query(
    //     "INSERT INTO department SET ?", 
                //{
                    //first_name = employee.firstName,
                    //last_name = employee.lastName
                //},
                //function(err) {
                    //if(err)
                //     {
                //         throw err;
                //     }
                // }
    // )
    // connection.query(
        //"INSERT INTO roles SET ?",
        //{
            //title = employee.title,
            //salary == employee.salary
        //},
        //function(err) {
            //if (err)
        //     {
        //         throw err;
        //     }
        // }
    //)
    //connection.query(
        //"INSERT INTO department SET ?",
    //     {
    //         dName = "Marketing",
            //
    //     },
    //     function(err)
    //     {
    //         if (err)
    //         {
    //             throw err;
    //         }
    //     }
    // )
}
//JUST STEAL FROM greatBayBasic.js bidAuction() FUNCTION!!!!!
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

function addRole() {
    console.log("Adding role");
    //Make role a new role object, push it into the array of role, then add role into SQL db using the data provided
    //Ask "what is the name of the new role?", "what is its salary?", "what department is it in?" (give list of departments here)
    //Look at how Denis does it I guess :(
    //https://github.com/D-Molloy/sql-join-inquirer
    // const createBook = () => {
    //     connection.query("SELECT * FROM authors", (err, results) => {
    //         if (err) throw err
    //         // console.log('author results', results)
    //         inquirer.prompt([{
    //             type: "text",
    //             name: "bookName",
    //             message: "Please enter the name of the book:"
    //         }, {
    //             type: "rawlist",
    //             name: "bookAuthor",
    //             message: "Please select the book's author:",
    //             choices: function () {
    //                 const choicesArray = []
    //                 for (let i = 0; i < results.length; i++) {
    //                     choicesArray.push(results[i].firstName + " " + results[i].lastName)
    //                 }
    //                 return choicesArray
    //             }
    //         }]).then(({ bookName, bookAuthor }) => {
    //             const [firstName, lastName] = bookAuthor.split(" ")
    //             const [foundAuthor] = results.filter(author => author.firstName === firstName && author.lastName === lastName)
    
    //             connection.query("INSERT INTO books SET ?", {
    //                 title: bookName,
    //                 authorId: foundAuthor.id
    //             }, (err, results) => {
    //                 if (err) throw err
    //                 console.log("======================")
    //                 console.log("Book Added")
    //                 console.log("======================")
    //                 setTimeout(mainMenu, 2000)
    //             })
    
    //         })
    //     })
    // }
}

function editRole() {
    console.log("Editing role");
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