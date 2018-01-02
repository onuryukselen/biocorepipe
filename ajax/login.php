<?php
error_reporting(E_ERROR);
error_reporting(E_ALL);
ini_set('report_errors','on');
    
require_once("../ajax/dbfuncs.php");
$db = new dbfuncs();
$p = isset($_REQUEST["p"]) ? $_REQUEST["p"] : "";
session_start();
if ($p=="saveUser"){
    $google_id = $_REQUEST['google_id'];
    $name = $_REQUEST['name'];
    $email = $_REQUEST['email'];
    $google_image = $_REQUEST['google_image'];
    $username = $_REQUEST['username'];
    //check if Google ID already exits
    $checkUser = $db->getUser($google_id);
    $checkarray = json_decode($checkUser,true); 
    $id = $checkarray[0]["id"];
    $_SESSION['username'] = $username;
//    $_SESSION['name'] = $name;
    $_SESSION['google_id'] = $google_id;
//    $_SESSION['email'] = $email;
//    $_SESSION['google_image'] = $google_image;
    if (!empty($id)) {
	    $_SESSION['ownerID'] = $id;
        $data = $db->updateUser($id, $google_id, $name, $email, $google_image, $username);  
        
    } else {
        $data = $db->insertUser($google_id, $name, $email, $google_image, $username);  
        $ownerIDarr = json_decode($data,true); 
        $id = $ownerIDarr['id'];
	    $_SESSION['ownerID'] = $id;
    }
} else if ($p=="logOutUser"){
    session_destroy();
    $logOutAr = array('logOut' => 1);
	$data = json_encode($logOutAr);
    
} else {
	$errAr = array('error' => 1);
	$data = json_encode($errAr);
}
//header("Location: ./index.php"); 
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo $data;
exit;
   