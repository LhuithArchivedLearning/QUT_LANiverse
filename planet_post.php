
<?php
$name = $_POST['name'];
$texture_00 = $_POST['texture_00'];
$size = $_POST['size'];
$Tilt = $_POST['Tilt'];
$RotationPeriod = $_POST['RotationPeriod'];
$numMoons = $_POST['numMoons'];
$numRings = $_POST['numRings'];

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
$sql = "INSERT INTO Planetoid (planetname, texture_00, size, planetTilt, planetRotationPeriod, numMoons, numRings)
    VALUES ('$name', '$texture_00', '$size', '$Tilt', '$RotationPeriod', '$numMoons', '$numRings')";

if ($conn->query($sql) === TRUE) {
    echo "Table MyGuests created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}

$conn->close();

    echo'egggg';
?>