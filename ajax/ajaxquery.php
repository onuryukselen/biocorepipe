<?php
error_reporting(E_ERROR);
error_reporting(E_ALL);
ini_set('report_errors','on');

require_once("../ajax/dbfuncs.php");

$db = new dbfuncs();

session_start();
$ownerID = isset($_SESSION['ownerID']) ? $_SESSION['ownerID'] : "";
$username = isset($_SESSION['username']) ? $_SESSION['username'] : "";
$google_id = isset($_SESSION['google_id']) ? $_SESSION['google_id'] : "";


$id = isset($_REQUEST["id"]) ? $_REQUEST["id"] : "";
$p = isset($_REQUEST["p"]) ? $_REQUEST["p"] : "";
$start = NULL;
$end = NULL;
if (isset($_REQUEST["start"])) {
	$start = $_REQUEST["start"];
	$end = $_REQUEST["end"];
}
if (isset($_REQUEST["type"])) {
    $type = $_REQUEST["type"];
}
if (isset($_REQUEST['id'])) {
    $id = $_REQUEST['id'];
}


if ($p=="createNextflow"){
	$data = $db -> getNextflow($id);
}
else if ($p=="saveRun"){
	$project_pipeline_id = $_REQUEST['project_pipeline_id'];
	$profileType = $_REQUEST['profileType'];
	$profileId = $_REQUEST['profileId'];
	$nextTextRaw = $_REQUEST['nextText'];
    $nextText = urldecode($nextTextRaw);
	$configTextRaw = $_REQUEST['configText'];
    $configText = urldecode($configTextRaw);
    //add run into run table
    $db -> insertRun($project_pipeline_id, $ownerID);
    $log_array = $db ->initRun($project_pipeline_id, $configText, $nextText, $profileType, $profileId, $ownerID);
    $data = $db->runCmd($project_pipeline_id,$ownerID, $profileType, $profileId, $ownerID, $log_array);

}
else if ($p=="getServerLog"){
	$project_pipeline_id = $_REQUEST['project_pipeline_id'];
    $data = $db -> getServerLog($project_pipeline_id,$ownerID);
}
else if ($p=="getRun"){
	$project_pipeline_id = $_REQUEST['project_pipeline_id'];
    $data = $db -> getRun($project_pipeline_id,$ownerID);
}
else if ($p=="checkRunPid"){
	$pid = $_REQUEST['pid'];
    $data = $db -> checkRunPid($pid);
}
else if ($p=="updateRunPid"){
	$pid = $_REQUEST['pid'];
	$project_pipeline_id = $_REQUEST['project_pipeline_id'];
    $data = $db -> updateRunPid($project_pipeline_id, $pid, $ownerID);
}

else if ($p=="getAllParameters"){
    $data = $db -> getAllParameters($ownerID);
}

else if ($p=="getAllProcesses"){
    $data = $db -> getAllProcesses();
}
else if ($p=="getProjects"){
    $data = $db -> getProjects($id,$ownerID);
}
else if ($p=="getProjectPipelines"){
    $project_id = $_REQUEST['project_id'];
    $data = $db -> getProjectPipelines($id,$project_id,$ownerID);
}
else if ($p=="getProjectInputs"){
    $project_id = $_REQUEST['project_id'];
    $data = $db -> getProjectInputs($project_id,$ownerID);
}
else if ($p=="getProjectInput"){
    $data = $db -> getProjectInput($id,$ownerID);
}
else if ($p=="getProjectPipelineInputs"){
    $g_num = $_REQUEST['g_num'];
    $project_pipeline_id = $_REQUEST['project_pipeline_id'];
    if (!empty($id)) {
    $data = $db->getProjectPipelineInputsById($id,$ownerID);
    } else {
    $data = $db->getProjectPipelineInputs($g_num, $project_pipeline_id,$ownerID);
    }
}
else if ($p=="getAllProjectPipelineInputs"){
    $project_pipeline_id = $_REQUEST['project_pipeline_id'];
       $data = $db->getAllProjectPipelineInputs($project_pipeline_id,$ownerID);
}
else if ($p=="getInputs"){
    $data = $db -> getInputs($id,$ownerID);
}
else if ($p=="getAllProcessGroups"){
    $data = $db -> getAllProcessGroups($ownerID);
}
//else if ($p=="getAllProcessParameters"){
//   $process_id = $_REQUEST["process_id"];
//   $data = $db->getAllProcessParameters($process_id, $type, $start, $end);
//}

else if ($p=="removeParameter"){
    $db->removeProcessParameterByParameterID($id);
    $data = $db->removeParameter($id);
}
else if ($p=="removeProcessGroup"){
    $db->removeProcessParameterByProcessGroupID($id);
    $db->removeProcessByProcessGroupID($id);
    $data = $db->removeProcessGroup($id);
}
else if ($p=="removePipelineById"){   
	$data = $db -> removePipelineById($id);
}

else if ($p=="removeProcess"){   
    $db->removeProcessParameterByProcessID($id);
//    $db->removePipelineProcessByProcessID($id);
	$data = $db -> removeProcess($id);
}
else if ($p=="removeProject"){   
    $db -> removeProjectPipelinebyProjectID($id);
    $data = $db -> removeProject($id);
}
else if ($p=="removeProjectPipeline"){  
    $db -> removeProjectPipelineInputByPipe($id);
    $data = $db -> removeProjectPipeline($id);
}
else if ($p=="removeProjectInput"){   
    $input_id = $_REQUEST['input_id'];
    $db -> removeProjectInput($id);
    $data = $db -> removeInput($input_id);
}
else if ($p=="removeInput"){   
    $data = $db -> removeInput($id);
}
else if ($p=="removeProLocal"){   
    $data = $db -> removeProLocal($id);
}
else if ($p=="removeProCluster"){   
    $data = $db -> removeProCluster($id);
}
else if ($p=="removeProAmazon"){   
    $data = $db -> removeProAmazon($id);
}
else if ($p=="removeProjectPipelineInput"){   
    $data = $db -> removeProjectPipelineInput($id);
}
else if ($p=="removeProjectPipelinebyProjectID"){   
    $data = $db -> removeProjectPipelinebyProjectID($id);
}
else if ($p=="removeProcessParameter"){   
	$data = $db -> removeProcessParameter($id);
}
else if ($p=="saveParameter"){
    $name = $_REQUEST['name'];
    $qualifier = $_REQUEST['qualifier'];
    $file_type = $_REQUEST['file_type'];
    
    if (!empty($id)) {
       $data = $db->updateParameter($id, $name, $qualifier, $file_type, $ownerID);
    } else {
       $data = $db->insertParameter($name, $qualifier, $file_type, $ownerID);
    }
}

else if ($p=="getProfileLocal")
{
    $data = $db->getProfileLocal($ownerID);
}
else if ($p=="getProfileCluster")
{
    if (!empty($id)) {
    $data = $db->getProfileClusterbyID($id, $ownerID);
    } else {
    $data = $db->getProfileCluster($ownerID);
        
    }
}

else if ($p=="saveProfileLocal"){
    $name = $_REQUEST['name'];
    $executor = $_REQUEST['executor'];
    $next_path = $_REQUEST['next_path'];
    if (!empty($id)) {
       $data = $db->updateProfileLocal($id, $name, $executor,$next_path, $ownerID);
    } else {
       $data = $db->insertProfileLocal($name, $executor,$next_path, $ownerID);
    }
}
else if ($p=="saveProfileCluster"){
    $name = $_REQUEST['name'];
    $executor = $_REQUEST['executor'];
    $username = $_REQUEST['username'];
    $hostname = $_REQUEST['hostname'];
    $prikey_cluRaw = $_REQUEST['prikey_clu'];
    $prikey_clu = urldecode($prikey_cluRaw);
    $next_path = $_REQUEST['next_path'];
    
    if (!empty($id)) {
       $data = $db->updateProfileCluster($id, $name, $executor,$next_path, $username, $hostname, $ownerID);
       $db->insertPrikey_clu($id, $prikey_clu, $ownerID);
    } else {
       $data = $db->insertProfileCluster($name, $executor,$next_path, $username, $hostname, $ownerID);
       $idArray = json_decode($data,true);
       $id = $idArray["id"];
       $db->insertPrikey_clu($id, $prikey_clu, $ownerID);
    }
}

else if ($p=="saveInput"){
    $name = $_REQUEST['name'];
    
    if (!empty($id)) {
       $data = $db->updateInput($id, $name, $ownerID);
    } else {
       $data = $db->insertInput($name, $ownerID);
    }
}
else if ($p=="saveProPipeInput"){
    $input_id = $_REQUEST['input_id'];
    $project_id = $_REQUEST['project_id'];
    $pipeline_id = $_REQUEST['pipeline_id'];
    $project_pipeline_id = $_REQUEST['project_pipeline_id'];
    $g_num = $_REQUEST['g_num'];
    $given_name = $_REQUEST['given_name'];
    $qualifier = $_REQUEST['qualifier'];
    
    if (!empty($id)) {
       $data = $db->updateProPipeInput($id, $project_pipeline_id, $input_id, $project_id, $pipeline_id, $g_num, $given_name,$qualifier, $ownerID);
    } else {
       $data = $db->insertProPipeInput($project_pipeline_id, $input_id, $project_id, $pipeline_id, $g_num, $given_name,$qualifier, $ownerID);
    }
}
else if ($p=="saveProjectInput"){
    $input_id = $_REQUEST['input_id'];
    $project_id = $_REQUEST['project_id'];
    $data = $db->insertProjectInput($project_id, $input_id, $ownerID);
}
else if ($p=="saveUser"){
    $google_id = $_REQUEST['google_id'];
    $name = $_REQUEST['name'];
    $email = $_REQUEST['email'];
    $google_image = $_REQUEST['google_image'];
    $username = $_REQUEST['username'];
    //check if Google ID already exits
    $checkUser = $db->getUser($google_id);
    $checkarray = json_decode($checkUser,true); 
    $id = $checkarray[0]["id"];
    if (!empty($id)) {
        $data = $db->updateUser($id, $google_id, $name, $email, $google_image, $username);    
    } else {
        $data = $db->insertUser($google_id, $name, $email, $google_image, $username);  
    }
}
else if ($p=="checkLogin"){
    if (!empty($google_id)) {
       $checkUser = $db->getUserLess($google_id);
       $data = $checkUser;
    }else {
	   $errAr = array('error' => 1);
	   $data = json_encode($errAr);
    }
}
else if ($p=="saveProcessGroup"){
    $group_name = $_REQUEST['group_name'];
    if (!empty($id)) {
       $data = $db->updateProcessGroup($id, $group_name, $ownerID);
    } else {
       $data = $db->insertProcessGroup($group_name, $ownerID);
    }
}
else if ($p=="saveProcess"){
    $name = $_REQUEST['name'];
    $process_gid = $_REQUEST['process_gid'];
    $summary = $_REQUEST['summary'];
    $process_group_id = $_REQUEST['process_group_id'];
    $script = $_REQUEST['script']; 
    $script = htmlspecialchars($script, ENT_QUOTES);
    $rev_id = $_REQUEST['rev_id']; 
    $rev_comment = $_REQUEST['rev_comment']; 
    if (!empty($id)) {
        $data = $db->updateProcess($id, $name, $process_gid, $summary, $process_group_id, $script, $ownerID);
    } else {
        $data = $db->insertProcess($name, $process_gid, $summary, $process_group_id, $script, $rev_id, $rev_comment, $ownerID);
    }
}
else if ($p=="saveProject"){
    $name = $_REQUEST['name'];
    $summary = $_REQUEST['summary'];
    if (!empty($id)) {
        $data = $db->updateProject($id, $name, $summary, $ownerID);
    } else {
        $data = $db->insertProject($name, $summary, $ownerID);
    }
}
else if ($p=="saveProjectPipeline"){
    $pipeline_id = $_REQUEST['pipeline_id'];
    $project_id = $_REQUEST['project_id'];
    $name = $_REQUEST['name'];
    $summary = $_REQUEST['summary'];
    $output_dir = $_REQUEST['output_dir'];
    $perms = $_REQUEST['perms'];
    $profile = $_REQUEST['profile'];
    $interdel = $_REQUEST['interdel'];
    $group_id = $_REQUEST['group_id'];
    $exec_each = $_REQUEST['exec_each'];
    $exec_all = $_REQUEST['exec_all'];
    $exec_all_settings = $_REQUEST['exec_all_settings'];
    $exec_each_settings = $_REQUEST['exec_each_settings'];
        if (!empty($id)) {
        $data = $db->updateProjectPipeline($id, $name, $summary, $output_dir, $perms, $profile, $interdel, $group_id, $exec_each, $exec_all, $exec_all_settings, $exec_each_settings, $ownerID);
    } else {
        $data = $db->insertProjectPipeline($name, $project_id, $pipeline_id, $ownerID);
    }
}

else if ($p=="saveProcessParameter"){
    $name = $_REQUEST['name'];
    $process_id = $_REQUEST['process_id'];
    $parameter_id = $_REQUEST['parameter_id'];
    $type = $_REQUEST['type'];
    if (!empty($id)) {
        $data = $db->updateProcessParameter($id, $name, $process_id, $parameter_id, $type, $ownerID);
    } else {
        $data = $db->insertProcessParameter($name, $process_id, $parameter_id, $type, $ownerID);
    }
}

//else if ($p=="savePipelineProcessParameterDefault") //(2)  savePipelineProcessParameter yerine savePipelineProcessParameterDefault yazildi.
//{
//    $pipeline_id = $_REQUEST['pipeline_id'];
//    $process_id = $_REQUEST['process_id'];
//    $name = $_REQUEST['name'];
//    
//    $data = $db->insertPipelineProcessParameterDefault($name, $pipeline_id, $process_id);
//}
else if ($p=="getProcessData")
{
	$id = $_REQUEST['process_id'];
    $data = $db->getProcessData($id, $ownerID);
}
else if ($p=="getProcessRevision")
{
	$id = $_REQUEST['process_id'];
    $process_gidAr =$db->getProcessGID($id);
    $checkarray = json_decode($process_gidAr,true); 
    $process_gid = $checkarray[0]["process_gid"];
    $data = $db->getProcessRevision($process_gid);
}
else if ($p=="getPipelineRevision")
{
	$id = $_REQUEST['pipeline_id'];
    $pipeline_gidAr =$db->getPipelineGID($id);
    $checkarray = json_decode($pipeline_gidAr,true); 
    $pipeline_gid = $checkarray[0]["pipeline_gid"];
    $data = $db->getPipelineRevision($pipeline_gid);
}
else if ($p=="checkPipeline")
{
	$process_id = $_REQUEST['process_id'];
	$process_name = $_REQUEST['process_name'];
    $data = $db->checkPipeline($process_id,$process_name, $ownerID);
}
else if ($p=="checkProject")
{
	$pipeline_id = $_REQUEST['pipeline_id'];
    $data = $db->checkProject($pipeline_id, $ownerID);
}

else if ($p=="getMaxProcess_gid")
{
    $data = $db->getMaxProcess_gid();
}
else if ($p=="getMaxPipeline_gid")
{
    $data = $db->getMaxPipeline_gid();
}
else if ($p=="getProcess_gid")
{
    $process_id = $_REQUEST['process_id'];
    $data = $db->getProcess_gid($process_id);
}
else if ($p=="getPipeline_gid")
{
    $pipeline_id = $_REQUEST['pipeline_id'];
    $data = $db->getPipeline_gid($pipeline_id);
}
else if ($p=="getMaxRev_id")
{
    $process_gid = $_REQUEST['process_gid'];
    $data = $db->getMaxRev_id($process_gid);
}
else if ($p=="getMaxPipRev_id")
{
    $pipeline_gid = $_REQUEST['pipeline_gid'];
    $data = $db->getMaxPipRev_id($pipeline_gid);
}
else if ($p=="getInputsPP")
{
	$process_id = $_REQUEST['process_id'];
    $data = $db->getInputsPP($process_id);
}
else if ($p=="getOutputsPP")
{
	$process_id = $_REQUEST['process_id'];
    $data = $db->getOutputsPP($process_id);
}
else if ($p=="getParametersData")
{
    $data = $db->getParametersData($ownerID);
}
else if ($p=="saveAllPipeline")
{
	$dat = $_REQUEST['dat'];
    $data = $db->saveAllPipeline($dat,$ownerID);
}
else if ($p=="savePipelineName"){
    $name = $_REQUEST['name'];
    if (!empty($id)) {
        $data = $db->updatePipelineName($id, $name);
    } else {
        $data = $db->insertPipelineName($name,$ownerID);
    }
}
else if ($p=="getSavedPipelines")
{
    $data = $db->getSavedPipelines($ownerID);
}

else if ($p=="loadPipeline")
{
	$id = $_REQUEST['id'];
    $data = $db->loadPipeline($id);
}

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo $data;
exit;