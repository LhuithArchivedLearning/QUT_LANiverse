<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mydb";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 

//sql to create table
$sql = "CREATE TABLE Planetoid (
   id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
   planetname VARCHAR(30) NOT NULL,
   texture_00 VARCHAR(30) NOT NULL,
   size FLOAT(128, 2) NOT NULL,
   planetTilt INT (128) NULL,
   planetRotationPeriod INT(128) NULL,
   numMoons INT(128) NULL,
   numRings INT(128) NULL
    )";
//$sql = "INSERT INTO Planet (planetname, texture_00)
//    VALUES ('Doe', 'john@example.com')";
//
////writeMsg();
//
//
//    
if ($conn->query($sql) === TRUE) {
    echo "Table MyGuests created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}
//
$conn->close();


//function writeMsg() {
 //   echo "Hello world!";
?>