
<?php
$name = $_POST['name'];
$object = $_POST['object'];

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

$fh = fopen('objects/'.$name.'.gltf',"a");
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