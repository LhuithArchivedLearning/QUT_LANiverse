
<?php
header_remove('Set-Cookie');
$name = $_POST['name'];
$object = $_POST['object'];
$texture = $_POST['image'];

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mydb";

// Create connection

if( is_dir('planets/'.$name.'/') === false ){
    mkdir('planets/'.$name.'/', 7777); // Create Directory
}

if( is_dir('planets/'.$name.'/Atmo') === false ){
    mkdir('planets/'.$name.'/Atmo', 7777); // Create Directory
}

if( is_dir('planets/'.$name.'/img') === false ){
    mkdir('planets/'.$name.'/img', 7777); // Create Directory
}

if( is_dir('planets/'.$name.'/Ring') === false ){
    mkdir('planets/'.$name.'/Ring', 7777); // Create Directory
}
if( is_dir('planets/'.$name.'/Moon') === false ){
    mkdir('planets/'.$name.'/Moon', 7777); // Create Directory
}

$fh = fopen('planets/'.$name.'/'.$name.'.gltf',"a");
fwrite($fh,($object."\r\n")); // add newline for next time
fclose($fh);

file_put_contents('planets/'.$name.'/img/'.$name.'.png', file_get_contents($texture));

if ($conn->query($sql) === TRUE) {
    echo "document.getElementById('echo').innerHTML = 'Fart'";
} else {
    echo "document.getElementById('echo').innerHTML = 'Shit'";
}

usleep(1000);
die();
?>