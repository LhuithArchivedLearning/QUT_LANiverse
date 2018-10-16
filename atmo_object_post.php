
<?php
header_remove('Set-Cookie');
$name = $_POST['name'];
$object = $_POST['object'];
$shaderinfo = $_POST['shaderinformation'];

if( is_dir('planets/'.$name.'/Atmo') === false ){
    mkdir('planets/'.$name.'/Atmo', 0774); // Create Directory
}

//Writeing Object Data
$fh = fopen('planets/'.$name.'/Atmo/'.$name.'_Atmo.gltf',"a");
fwrite($fh,($object."\r\n")); // add newline for next time
fclose($fh);

////Writeing Shader Information
$fh = fopen('planets/'.$name.'/Atmo/'.$name.'_Atmo_shader_info.txt',"a");
fwrite($fh,($shaderinfo."\r\n")); // add newline for next time
fclose($fh);

usleep(1000);
die();
?>