
<?php
header_remove('Set-Cookie');
include 'ChromePhp.php';

//$obj = json_decode($_POST["x"], false);
$name = $_POST['name'];
//$object = $_POST['object'];
$index = $_POST['index'];
$shaderinfo = $_POST['shaderinformation'];

if( is_dir('planets/'.$name.'/Ring') === false ){
    mkdir('planets/'.$name.'/Ring', 7777); // Create Directory
}


////Writeing Object Data
//$fh = fopen('planets/'.$name.'/Ring/'.$name.'_Ring_'.$index.'.gltf',"a");
//fwrite($fh,($object."\r\n")); // add newline for next time
//fclose($fh);

//Writeing Shader Information

$fp = file_put_contents('planets/'.$name.'/'.$name.'_Ring_'.$index.'_shader_info.txt', $shaderinfo);
ChromePhp::log($name);
//header_remove('Set-Cookie');
//fwrite($fh, ($shaderinfo."\r\n")); // add newline for next time
//fclose($fh);

//file_put_contents('objects/'.$name.'.txt', file_get_contents($object));
usleep(1000);
die();
?>