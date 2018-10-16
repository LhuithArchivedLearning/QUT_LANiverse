
<?php
header_remove('Set-Cookie');
$name = $_POST['name'];
$texture_url = $_POST['texture_url'];
$size = $_POST['size'];
$Tilt = $_POST['Tilt'];
$RotationPeriod = $_POST['RotationPeriod'];
$numMoons = $_POST['numMoons'];
$numRings = $_POST['numRings'];
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mydb";
$texture_url = 'planets/images/'.$name.'.png';
// Create connection

$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
$sql = "INSERT INTO Planetoid (planetname, texture_url, size, planetTilt, planetRotationPeriod, numMoons, numRings)
    VALUES ('$name', '$texture_00_url', '$size', '$Tilt', '$RotationPeriod', '$numMoons', '$numRings')";

if ($conn->query($sql) === TRUE) {
    echo "document.getElementById('echo').innerHTML = 'Fart'";
} else {
    echo "document.getElementById('echo').innerHTML = 'Shit'";
}

$conn->close();
    echo'egggg';
?>