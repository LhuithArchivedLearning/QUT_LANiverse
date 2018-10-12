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
   texture_00_url VARCHAR(30) NOT NULL,
   object_url VARCHAR(30) NOT NULL,
   size FLOAT(128, 2) NOT NULL,
   tilt INT (128) NULL,
   planetRotationPeriod INT(128) NULL,
   numMoons INT(128) NULL,
   numRings INT(128) NULL,
   radius FLOAT(128, 3) NOT NULL,
   N1 FLOAT(128, 3) NOT NULL,
   N2 FLOAT(128, 3) NOT NULL,
   i1 FLOAT(128, 3) NOT NULL,
   i2 FLOAT(128, 3) NOT NULL,
   w1 FLOAT(128, 3) NOT NULL,
   w2 FLOAT(128, 3) NOT NULL,
   a1 FLOAT(128, 3) NOT NULL,
   a2 FLOAT(128, 3) NOT NULL,
   e1 FLOAT(128, 3) NOT NULL,
   e2 FLOAT(128, 3) NOT NULL,
   M1 FLOAT(128, 3) NOT NULL,
   M2 FLOAT(128, 3) NOT NULL,
   rot_period INT(128) NULL,
   orbit_speed FLOAT(128, 3) NOT NULL
    )";

if ($conn->query($sql) === TRUE) {
    echo "Table MyGuests created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}

$sql = "CREATE TABLE Moon (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    planetname VARCHAR(30) NOT NULL, 
    moonname VARCHAR(30) NOT NULL,
    texture_00_url VARCHAR(30) NOT NULL, 
    object_url FLOAT(128, 3) NOT NULL,
    radius FLOAT(128, 3) NOT NULL,
    tilt FLOAT(128, 3) NOT NULL,
    N1 FLOAT(128, 3) NOT NULL,
    N2 FLOAT(128, 3) NOT NULL,
    i1 FLOAT(128, 3) NOT NULL,
    i2 FLOAT(128, 3) NOT NULL,
    w1 FLOAT(128, 3) NOT NULL,
    w2 FLOAT(128, 3) NOT NULL,
    a1 FLOAT(128, 3) NOT NULL,
    a2 FLOAT(128, 3) NOT NULL,
    e1 FLOAT(128, 3) NOT NULL,
    e2 FLOAT(128, 3) NOT NULL,
    M1 FLOAT(128, 3) NOT NULL,
    M2 FLOAT(128, 3) NOT NULL,
    rot_period INT(128) NULL,
    size FLOAT(128, 3) NOT NULL,
    orbit_speed FLOAT(128, 3) NOT NULL
     )";


if ($conn->query($sql) === TRUE) {
    echo "Table MyGuests created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}
//
$sql = "CREATE TABLE Ring (
   id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, 
   texture_00_url VARCHAR(30) NOT NULL, 
   object_url FLOAT(128, 3) NOT NULL,
   radius FLOAT(128, 3) NOT NULL,
   tilt FLOAT(128, 3) NOT NULL,
   N1 FLOAT(128, 3) NOT NULL,
   N2 FLOAT(128, 3) NOT NULL,
   i1 FLOAT(128, 3) NOT NULL,
   i2 FLOAT(128, 3) NOT NULL,
   w1 FLOAT(128, 3) NOT NULL,
   w2 FLOAT(128, 3) NOT NULL,
   a1 FLOAT(128, 3) NOT NULL,
   a2 FLOAT(128, 3) NOT NULL,
   a3 FLOAT(128, 3) NOT NULL,
   a4 FLOAT(128, 3) NOT NULL,
   e1 FLOAT(128, 3) NOT NULL,
   e2 FLOAT(128, 3) NOT NULL,
   isFlat BIT(2) NOT NULL,
   M1 FLOAT(128, 3) NOT NULL,
   M2 FLOAT(128, 3) NOT NULL,
   rot_period INT(128) NULL,
   size FLOAT(128, 3) NOT NULL,
   orbit_speed FLOAT(128, 3) NOT NULL,
   numAstros INT(128) NULL
    )";

if ($conn->query($sql) === TRUE) {
    echo "Table MyGuests created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}

$conn->close();


////function writeMsg() {
// //   echo "Hello world!";
?>