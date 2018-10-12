
<?php
$name = $_POST['name'];
$texture_00_url = $_POST['texture_00_url'];
$texture_00 = $_POST['texture_00'];
$size = $_POST['size'];
$Tilt = $_POST['Tilt'];
$RotationPeriod = $_POST['RotationPeriod'];
$numMoons = $_POST['numMoons'];
$numRings = $_POST['numRings'];
$object = $_POST['object'];
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mydb";
$texture_00_url = 'planetimg/'.$name.'.png';
// Create connection

$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 
$sql = "INSERT INTO Planetoid (planetname, texture_00_url, size, planetTilt, planetRotationPeriod, numMoons, numRings)
    VALUES ('$name', '$texture_00_url', '$size', '$Tilt', '$RotationPeriod', '$numMoons', '$numRings')";

file_put_contents('planetimgs/'.$name.'.png', file_get_contents($texture_00));

$fh = fopen('objects/'.$name.'.obj',"a");
fwrite($fh,($object."\r\n")); // add newline for next time
fclose($fh);

//file_put_contents('objects/'.$name.'.txt', file_get_contents($object));

if ($conn->query($sql) === TRUE) {
    echo "document.getElementById('echo').innerHTML = 'Fart'";
} else {
    echo "document.getElementById('echo').innerHTML = 'Shit'";
}

$conn->close();
    echo'egggg';
?>