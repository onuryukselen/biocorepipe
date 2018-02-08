<?php
/** Configuration Variables **/
/** If DOLPHIN_PARAMS_SECTION environment variable set into any parameter section in config.ini file 
The configuration parameters will be read from that section**/
if (!empty($_SERVER["HTTP_HOST"])){
   $http_host=$_SERVER["HTTP_HOST"];
   # CHANGE HERE ACCORDING TO YOUR ENVIRONMENT
   if  ( preg_match("/dolphinnext.umassmed.edu/", $http_host) )
   {
      $param_section="Dolphinnext";
   } 
   else if  ( preg_match("/localhost/", $http_host) )
   {
      $param_section="Localhost";
   }
   ###########################################
}
if(strpos(getcwd(),'travis/build') > 0){
   $param_section="Travis";
}
 
$ini = parse_ini_file("config.ini", true);
$ini_array = $ini[$param_section];
date_default_timezone_set($ini_array['TIMEZONE']);
define('REMOTE_HOST', $ini_array['REMOTE_HOST']);
define('CONFIG', $ini_array['CONFIG']);
define('DOLPHINPATH', $ini_array['DOLPHINPATH']);
define('RUNPATH', $ini_array['RUNPATH']);
define('BASE_PATH', $ini_array['BASE_PATH']);
define('API_PATH', $ini_array['API_PATH']);

$secRaw = parse_ini_file(".sec", true);
$sec = $secRaw['Dolphinnext'];
define('DB', $sec['DB']);
define('DBUSER', $sec['DBUSER']);
define('DBPASS', $sec['DBPASS']);
define('DBHOST', $sec['DBHOST']);
define('DBPORT', $sec['DBPORT']);
define('SSHPATH', $sec['SSHPATH']);
define('AMAZON', $sec['AMAZON']);
define('AMZPATH', $sec['AMZPATH']);
//define('LMUSER', $sec['LMUSER']);

//define('MASTER', $salt['MASTER']);
//define('AMAZON', $salt['AMAZON']);
//define('ENCODE_ACCESS', $salt['ENCODE_ACCESS']);
//define('ENCODE_SECRET', $salt['ENCODE_SECRET']);
//define('VERIFY', $salt['VERIFY']);

//if (!isset($_SESSION) || !is_array($_SESSION)) session_start();
//if (isset($_SESSION['user']))
//{
//  define('USERNAME', $_SESSION['user']);
//  define('UID', $_SESSION['uid']);
//}

?>