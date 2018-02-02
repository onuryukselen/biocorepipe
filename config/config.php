<?php
    define('DBHOST', 'localhost');
    define('DB', 'biocorepipe');
    define('DBUSER', 'root');
    define('DBPASS', '');
    define('DBPORT', 3306);
    define('LMUSER', 'root');
    define('RUNPATH', 'tmp/logs');
    define('SSHPATH', 'tmp/.ssh');
    define('DOLPHINPATH', '~/.dolphinnext/tmp/logs');
    define('SSHSETT', '-oStrictHostKeyChecking=no -oChallengeResponseAuthentication=no -oBatchMode=yes -oPasswordAuthentication=no -o ConnectTimeout=3');

?>

<?php
///** Configuration Variables **/
///** If DOLPHIN_PARAMS_SECTION environment variable set into any parameter section in config.ini file 
//The configuration parameters will be read from that section**/
//if (!empty($_SERVER["HTTP_HOST"])){
//   $http_host=$_SERVER["HTTP_HOST"];
//   # CHANGE HERE ACCORDING TO YOUR ENVIRONMENT
//   if  ( preg_match("/dolphinnext.umassmed.edu/", $http_host) )
//   {
//      $param_section="Dolphinnext";
//   }
//   ###########################################
//}
//if(strpos(getcwd(),'travis/build') > 0){
//   $param_section="Travis";
//}
// 
//$ini = parse_ini_file("config.ini", true);
//$ini_array = $ini[$param_section];
//define ('DEVELOPMENT_ENVIRONMENT',true);
//date_default_timezone_set($ini_array['TIMEZONE']);
////define('REMOTE_HOST', $ini_array['REMOTE_HOST']);
////define('JOB_STATUS', $ini_array['JOB_STATUS']);
////define('PYTHON', $ini_array['PYTHON']);
////define('CONFIG', $ini_array['CONFIG']);
////define('LDAP_SERVER', $ini_array['LDAP_SERVER']);
////define('DN_STRING', $ini_array['DN_STRING']);
////define('BIND_USER', $ini_array['BIND_USER']);
////define('BIND_PASS', $ini_array['BIND_PASS']);
////define('SCHEDULAR', $ini_array['SCHEDULAR']);
////define('DEBROWSER_HOST', $ini_array['DEBROWSER_HOST']);
////define('ENCODE_URL', $ini_array['ENCODE_URL']);
////define('ENCODE_BUCKET', $ini_array['ENCODE_BUCKET']);
////define('VALIDATE_ENCODE', $ini_array['VALIDATE_ENCODE']);
////define('REQUESTS', $ini_array['REQUESTS']);
//$presalt = parse_ini_file(".salt", true);
//$salt = $presalt['Dolphinnext'];
//define('DB', $salt['DB']);
//define('DBUSER', $salt['DBUSER']);
//define('DBPASS', $salt['DBPASS']);
//define('DBHOST', $salt['DBHOST']);
//define('DBPORT', $salt['DBPORT']);
//define('RUNPATH', $salt['RUNPATH']);
//define('SSHPATH', $salt['SSHPATH']);
//define('DOLPHINPATH', $salt['DOLPHINPATH']);
//
//
////define('SALT', $salt['SALT']);
////define('PEPPER', $salt['PEPPER']);
////define('MASTER', $salt['MASTER']);
////define('AMAZON', $salt['AMAZON']);
////define('ENCODE_ACCESS', $salt['ENCODE_ACCESS']);
////define('ENCODE_SECRET', $salt['ENCODE_SECRET']);
////define('VERIFY', $salt['VERIFY']);
////if (!isset($_SESSION) || !is_array($_SESSION)) session_start();
////if (isset($_SESSION['user']))
////{
////  define('USERNAME', $_SESSION['user']);
////  define('UID', $_SESSION['uid']);
////}
////define('BASE_PATH', $ini_array['BASE_PATH']);
////define('API_PATH', $ini_array['API_PATH']);
?>