DROP DATABASE IF EXISTS employeeTracker_db;
CREATE DATABASE employeeTracker_db;

USE employeeTracker_db;

CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT,
    dName VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE roles(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL (5,2),
    department_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT INTO department (dName) VALUES ("Marketing");
INSERT INTO roles (title, salary, department_id) VALUES ("Marketer", 45.7, 1);
INSERT INTO employee (first_name, last_name, role_id) VALUES ("Henry", "Turner", 1);

SELECT * FROM department;
SELECT * FROM roles;
SELECT * FROM employee;

--Have to add a department first, then roles for the department, then employees to fill the roles