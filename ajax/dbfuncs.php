<?php
require_once("../config/config.php");

class dbfuncs {

    private $dbhost = DBHOST;
    private $db = DB;
    private $dbuser = DBUSER;
    private $dbpass = DBPASS;
    private $dbport = DBPORT;
    private $last_modified_user = LMUSER;
    private $run_path = RUNPATH;
    private $ssh_path = SSHPATH;
    private $dolphin_path = DOLPHINPATH;
    private static $link;

    function __construct() {
        if (!isset(self::$link)) {
            self::$link = new mysqli($this->dbhost, $this->dbuser, $this->dbpass, $this->db, $this->dbport);
            // check connection
            if (mysqli_connect_errno()) {
                exit('Connect failed: ' . mysqli_connect_error());
            }
        }
    }

    function __destruct() {
        if (isset(self::$link)) {
            self::$link->close();
        }
    }
   function runSQL($sql)
   {
        $link = new mysqli($this->dbhost, $this->dbuser, $this->dbpass, $this->db);
        // check connection
        if (mysqli_connect_errno()) {
                exit('Connect failed: '. mysqli_connect_error());
        }
        $result=self::$link->query($sql);
		if (!$result) {
            trigger_error('Database Error: ' . self::$link->error);
        }
        if ($result && $result!="1")
        {
            return $result;
        }
        return json_encode (json_decode ("{}"));
   }
   function queryTable($sql)
   {
     $data = array();
     if ($res = $this->runSQL($sql))
     {
        while(($row=$res->fetch_assoc()))
        {
            if ($row['script']){
            $row['script'] = htmlspecialchars_decode($row['script'], ENT_QUOTES);
            }
            
            $data[]=$row;
        }
         
        $res->close();
     }
     return json_encode($data);
   }
   
   function insTable($sql)
   {
	 $data = array();

     if ($res = $this->runSQL($sql))
     {
		$insertID = self::$link->insert_id;
		$data = array('id' => $insertID);
     }
     return json_encode($data);
   }
    
    function initRun($project_pipeline_id, $configText, $nextText, $profileType, $profileId, $ownerID)
    {
        mkdir("../{$this->run_path}/run{$project_pipeline_id}", 0755, true);
        $file = fopen("../{$this->run_path}/run{$project_pipeline_id}/nextflow.nf", 'w');//creates new file
        fwrite($file, $nextText);
        fclose($file);
        chmod("../{$this->run_path}/run{$project_pipeline_id}/nextflow.nf", 0755);
        $file = fopen("../{$this->run_path}/run{$project_pipeline_id}/nextflow.config", 'w');//creates new file
        fwrite($file, $configText);
        fclose($file);
        chmod("../{$this->run_path}/run{$project_pipeline_id}/nextflow.config", 0755);
        if ($profileType == "cluster") {
            // get username and hostname for connection
            $cluData=$this->getProfileClusterbyID($profileId, $ownerID);
            $cluDataArr=json_decode($cluData,true);
            $connect = $cluDataArr[0]["username"]."@".$cluDataArr[0]["hostname"];
            //get userpky
            $userpky = "../{$this->ssh_path}/{$ownerID}_{$profileId}.pky";
            //check $userpky file exist
            if (!file_exists($userpky)) die(json_encode('Private key is not found!'));
            $run_path_real = "../{$this->run_path}/run{$project_pipeline_id}";
            if (!file_exists($run_path_real."/nextflow.nf")) die(json_encode('Nextflow file is not found!'));
            $dolphin_path_real = "{$this->dolphin_path}/run{$project_pipeline_id}";
            //mkdir in cluster
            $mkdir_copynext_pid = shell_exec("ssh -oStrictHostKeyChecking=no -i $userpky $connect 'mkdir -p $dolphin_path_real' > $run_path_real/log.txt && scp -oStrictHostKeyChecking=no -i $userpky $run_path_real/nextflow.nf $connect:$dolphin_path_real >> $run_path_real/log.txt 2>&1 & echo $! &");
            if (!$mkdir_copynext_pid) die('Connection failed while creating new folder in the cluster');
            $log_array = array('mkdir_copynext_pid' => $mkdir_copynext_pid);
            //copy nextflow file to run directory in cluster
//            $copy_next_pid = shell_exec("scp -oStrictHostKeyChecking=no -i $userpky $run_path_real/nextflow.nf $connect:$dolphin_path_real >> $run_path_real/log.txt 2>&1 & echo $! &");
//            if (!$copy_next_pid) die('Connection failed while copying nextflow file in to the cluster');
//            $log_array['copy_next_pid'] = $copy_next_pid;
            return $log_array;
        }
    }
    
    
    function runCmd($project_pipeline_id, $ownerID, $profileType, $profileId, $ownerID, $log_array)
    {
        //get input parameters
        $allinputs = json_decode($this->getProjectPipelineInputs("", $project_pipeline_id, $ownerID));
        $next_inputs="";
        foreach ($allinputs as $inputitem):
            $next_inputs.="--".$inputitem->{'given_name'}." '".$inputitem->{'name'}."' ";
        endforeach;
        //run command
        if ($profileType == "local") {
            $path= "../{$this->run_path}/run$project_pipeline_id";
            $cmd = 'export PATH=$PATH:/usr/local/bin/dolphin-bin/tophat2_2.0.12:/usr/local/bin/dolphin-bin/hisat2:/usr/local/bin/dolphin-bin/:/usr/local/bin/dolphin-bin/fastqc_0.10.1 && ';
		    $cmd .= "cd $path && nextflow nextflow.nf $next_inputs -with-trace> log.txt 2>&1 & echo $! &";
            $pid_command = popen($cmd, "r" );
            $pid = fread($pid_command, 2096);
		    $this->updateRunPid($project_pipeline_id, $pid, $ownerID);
		    pclose($pid_command);
            $log_array['next_submit_pid'] = $pid;
            return json_encode($log_array);
            
        } else if ($profileType == "cluster") {
            //get username and hostname for connection
            $cluData=$this->getProfileClusterbyID($profileId, $ownerID);
            $cluDataArr=json_decode($cluData,true);
            $connect = $cluDataArr[0]["username"]."@".$cluDataArr[0]["hostname"];
            $next_path = $cluDataArr[0]["next_path"];
            //eg. /project/umw_biocore/bin
            if (!empty($next_path)){
                $next_path_real = "$next_path/nextflow";
            } else {
                $next_path_real  = "nextflow";
            }
            //get userpky
            $userpky = "../{$this->ssh_path}/{$ownerID}_{$profileId}.pky";
            if (!file_exists($userpky)) die(json_encode('Private key is not found!'));
            $run_path_real = "../{$this->run_path}/run{$project_pipeline_id}";
            $dolphin_path_real = "{$this->dolphin_path}/run{$project_pipeline_id}";
            //check if files are exist
            $next_exist = shell_exec("ssh -oStrictHostKeyChecking=no -i $userpky $connect test  -f \"$dolphin_path_real/nextflow.nf\"  && echo \"Nextflow file exists\" || echo \"Nextflow file not exists\" 2>&1 & echo $! &");
            preg_match("/(.*)Nextflow file(.*)exists(.*)/", $next_exist, $matches);
            $log_array['next_exist'] = $next_exist;
            // if $matches[2] == " ", it means nextflow file is exist otherwise die
            if ($matches[2] == " ") {
            //         ssh ak97w@ghpcc06.umassrc.org 'source /etc/bashrc && module load java/1.8.0_31 && bsub -q long -n 1  -W 3040 -R rusage[mem=32024] "/project/umw_biocore/bin/nextflow   ~/.dolphinnext/tmp/logs/run#/nextflow.nf >  ~/.dolphinnext/tmp/logs/run#/log.txt > 2&1”’
            $cmd="ssh -i $userpky $connect 'source /etc/bashrc && module load java/1.8.0_31 && bsub -q long -n 1  -W 3040 -R rusage[mem=32024] \"$next_path_real $dolphin_path_real/nextflow.nf $next_inputs -with-trace > $dolphin_path_real/log.txt \"' >> $run_path_real/log.txt 2>&1 & echo $! &";
            $next_submit_pid= shell_exec($cmd); //"Job <203477> is submitted to queue <long>.\n"
            if (!$next_submit_pid) die(json_encode('Connection failed while running nextflow in the cluster'));
            $log_array['next_submit_pid'] = $next_submit_pid;
            return json_encode($log_array);
            
            
//            preg_match("/Job <(.*)> is/",$content, $matches);
//		    $this->updateRunPid($project_pipeline_id, $pid, $ownerID);
            }else if ($matches[2] == " not "){
                die(json_encode('Nextflow file not exists'));
            }
        }
    }
    
    
    function insertPrikey_clu($id, $prikey_clu, $ownerID){
        mkdir("../{$this->ssh_path}", 0755, true);
        $file = fopen("../{$this->ssh_path}/{$ownerID}_{$id}.pky", 'w');//creates new file
        fwrite($file, $prikey_clu);
        fclose($file);
        chmod("../{$this->ssh_path}/{$ownerID}_{$id}.pky", 0600); 
    }

    
//    ---------------  Users ---------------
    public function getUser($google_id) {
        $sql = "SELECT * FROM users WHERE google_id = $google_id";
        return self::queryTable($sql);
    }
    public function getUserLess($google_id) {
        $sql = "SELECT username, name, email, google_image FROM users WHERE google_id = $google_id";
        return self::queryTable($sql);
    }
    public function insertUser($google_id, $name, $email, $google_image, $username) {
        $sql = "INSERT INTO users(google_id, name, email, google_image, username, memberdate, date_created, date_modified, last_modified_user) VALUES 
			('$google_id', '$name', '$email', '$google_image', '$username', now() , now(), now(), '".$this->last_modified_user."')";
        return self::insTable($sql);
    }
    
    public function updateUser($id, $google_id, $name, $email, $google_image, $username) {
        $sql = "UPDATE users SET id='$id', google_id='$google_id', name='$name', email='$email', google_image='$google_image', username='$username', last_modified_user='".$this->last_modified_user."' WHERE id = $id";
        return self::runSQL($sql);
    }
//    ------------- Profiles   ------------
    public function getProfileLocal($ownerID) {
        $sql = "SELECT id, name, executor, next_path FROM profile_local WHERE owner_id = $ownerID";
        return self::queryTable($sql);    
    }
    public function getProfileClusterbyID($id, $ownerID) {
        $sql = "SELECT id, name, executor, next_path, username, hostname FROM profile_cluster WHERE owner_id = $ownerID and id = $id";
        return self::queryTable($sql); 
    }
    public function getProfileCluster($ownerID) {
        $sql = "SELECT id, name, executor, next_path, username, hostname FROM profile_cluster WHERE owner_id = $ownerID";
        return self::queryTable($sql);    
    }
    
    public function insertProfileLocal($name, $executor, $next_path, $ownerID) {
        $sql = "INSERT INTO profile_local (name, executor, next_path, owner_id, perms, date_created, date_modified, last_modified_user) VALUES 
			('$name', '$executor','$next_path', '$ownerID', 3, now(), now(), '$ownerID')";
        return self::insTable($sql);
    }

    public function updateProfileLocal($id, $name, $executor, $next_path, $ownerID) {
        $sql = "UPDATE profile_local SET name='$name', executor='$executor', next_path='$next_path', last_modified_user ='$ownerID'  WHERE id = $id";
        return self::runSQL($sql);
    }
    
    public function insertProfileCluster($name, $executor, $next_path, $username, $hostname, $ownerID) {
        $sql = "INSERT INTO profile_cluster(name, executor, next_path, username, hostname, owner_id, perms, date_created, date_modified, last_modified_user) VALUES('$name', '$executor', '$next_path', '$username', '$hostname', '$ownerID', 3, now(), now(), '$ownerID')";
        return self::insTable($sql);
    }

    public function updateProfileCluster($id, $name, $executor, $next_path, $username, $hostname, $ownerID) {
        $sql = "UPDATE profile_cluster SET name='$name', executor='$executor', next_path='$next_path', username='$username', hostname='$hostname', last_modified_user ='$ownerID'  WHERE id = $id";
        return self::runSQL($sql);
    }
    public function removeProLocal($id) {
        $sql = "DELETE FROM profile_local WHERE id = '$id'";
        return self::runSQL($sql);
    }
    public function removeProCluster($id) {
        $sql = "DELETE FROM profile_cluster WHERE id = '$id'";
        return self::runSQL($sql);
    }
    public function removeProAmazon($id) {
        $sql = "DELETE FROM profile_amazon WHERE id = '$id'";
        return self::runSQL($sql);
    }
    
//    ------------- Parameters ------------
    
    public function getAllParameters($ownerID) {
        if ($ownerID == ""){
            $ownerID ="''";
        }
        $sql = "SELECT id, name, qualifier, file_type FROM parameter WHERE owner_id = $ownerID OR perms = 63";
        return self::queryTable($sql);
    }

    public function insertParameter($name, $qualifier, $file_type, $ownerID) {
        $sql = "INSERT INTO parameter(name, qualifier, file_type, owner_id, perms, date_created, date_modified, last_modified_user) VALUES 
			('$name', '$qualifier', '$file_type', '$ownerID', 3, now(), now(), '$ownerID')";
        return self::insTable($sql);
    }

    public function updateParameter($id, $name, $qualifier, $file_type, $ownerID) {
        $sql = "UPDATE parameter SET name='$name', qualifier='$qualifier', last_modified_user ='$ownerID', file_type='$file_type'  WHERE id = $id";
        return self::runSQL($sql);
    }
    
    public function insertProcessGroup($group_name, $ownerID) {
        $sql = "INSERT INTO process_group (owner_id, group_name, date_created, date_modified, last_modified_user, perms) VALUES ('$ownerID', '$group_name', now(), now(), '$ownerID', 3)";
        return self::insTable($sql);
    }

    public function updateProcessGroup($id, $group_name, $ownerID) {
        $sql = "UPDATE process_group SET group_name='$group_name', owner_id='$ownerID', last_modified_user ='$ownerID'  WHERE id = $id";
        return self::runSQL($sql);
    }

    public function removeParameter($id) {
        $sql = "DELETE FROM parameter WHERE id = '$id'";
        return self::runSQL($sql);
    }

    
    
    public function removeProcessGroup($id) {
        $sql = "DELETE FROM process_group WHERE id = '$id'";
        return self::runSQL($sql);
    }

    // --------- Process -----------

    public function getAllProcesses() {
        $sql = "SELECT id, name, version, script FROM process";
        return self::queryTable($sql);
    }

    public function getAllProcessGroups($ownerID) {
        $sql = "SELECT id, group_name FROM process_group WHERE owner_id = $ownerID OR perms = 63";
        return self::queryTable($sql);
    }
    
    public function insertProcess($name, $process_gid, $summary, $process_group_id, $script, $rev_id, $rev_comment, $ownerID) {
        $sql = "INSERT INTO process(name, process_gid, summary, process_group_id, script, rev_id, rev_comment, owner_id, date_created, date_modified, last_modified_user, perms) VALUES ('$name', '$process_gid', '$summary', '$process_group_id', '$script', '$rev_id','$rev_comment', '$ownerID', now(), now(), '$ownerID', 3)";
        return self::insTable($sql);
    }

    public function updateProcess($id, $name, $process_gid, $summary, $process_group_id, $script, $ownerID) {
        $sql = "UPDATE process SET name= '$name', process_gid='$process_gid', summary='$summary', process_group_id='$process_group_id', script='$script', owner_id='$ownerID', last_modified_user = '$ownerID'  WHERE id = $id";
        return self::runSQL($sql);
    }

    public function removeProcess($id) {
        $sql = "DELETE FROM process WHERE id = $id";
        return self::runSQL($sql);
    }
    public function removeProject($id) {
        $sql = "DELETE FROM project WHERE id = $id";
        return self::runSQL($sql);
    }
    public function removeProjectPipeline($id) {
        $sql = "DELETE FROM project_pipeline WHERE id = $id";
        return self::runSQL($sql);
    }
    public function removeInput($id) {
        $sql = "DELETE FROM input WHERE id = $id";
        return self::runSQL($sql);
    }
    public function removeProjectPipelineInput($id) {
        $sql = "DELETE FROM project_pipeline_input WHERE id = $id";
        return self::runSQL($sql);
    }
    public function removeProjectPipelineInputByPipe($id) {
        $sql = "DELETE FROM project_pipeline_input WHERE project_pipeline_id = $id";
        return self::runSQL($sql);
    }
    public function removeProjectInput($id) {
        $sql = "DELETE FROM project_input WHERE id = $id";
        return self::runSQL($sql);
    }
    public function removeProjectPipelinebyProjectID($id) {
        $sql = "DELETE FROM project_pipeline WHERE project_id = $id";
        return self::runSQL($sql);
    }
    
    public function removeProcessByProcessGroupID($process_group_id) {
        $sql = "DELETE FROM process WHERE process_group_id = $process_group_id";
        return self::runSQL($sql);
    }
//    ----------- Projects   ---------
    public function getProjects($id,$ownerID) {
        $where = " where p.owner_id = $ownerID OR p.perms = 63"; 
		if ($id != ""){
			$where = " where p.id = $id AND (p.owner_id = $ownerID OR p.perms = 63)";
		}
		$sql = "SELECT p.id, p.name, p.summary, p.date_created, u.username, p.date_modified FROM project p INNER JOIN users u ON p.owner_id = u.id $where";
		return self::queryTable($sql);
    }
    public function insertProject($name, $summary, $ownerID) {
        $sql = "INSERT INTO project(name, summary, owner_id, date_created, date_modified, last_modified_user, perms) VALUES ('$name', '$summary', '$ownerID', now(), now(), '$ownerID', 3)";
        return self::insTable($sql);
    }

    public function updateProject($id, $name, $summary, $ownerID) {
        $sql = "UPDATE project SET name= '$name', summary= '$summary', owner_id='$ownerID', last_modified_user = '$ownerID', date_modified = now() WHERE id = $id";
        return self::runSQL($sql);
    }

//    ----------- Runs     ---------
    public function insertRun($project_pipeline_id, $ownerID) {
        $sql = "INSERT INTO run (project_pipeline_id, owner_id, perms, date_created, date_modified, last_modified_user) VALUES 
			('$project_pipeline_id', '$ownerID', 3, now(), now(), '$ownerID')";
        return self::insTable($sql);
    }
    public function updateRunPid($project_pipeline_id, $pid, $ownerID) {
        $sql = "UPDATE run SET pid='$pid', date_modified= now(), last_modified_user ='$ownerID'  WHERE project_pipeline_id = $project_pipeline_id";
        return self::runSQL($sql);
    }
    public function getRunLog($project_pipeline_id,$ownerID) {
        $path= "../{$this->run_path}/run$project_pipeline_id";
        // get contents of a file into a string
        $filename = "$path/log.txt";
        $handle = fopen($filename, "r");
        $content = fread($handle, filesize($filename));
        fclose($handle);
        return json_encode($content);
    }
    public function getRun($project_pipeline_id,$ownerID) {
        $sql = "SELECT * FROM run WHERE project_pipeline_id = $project_pipeline_id";
		return self::queryTable($sql);
    }
    
    public function checkRunPid($pid) {
        if (file_exists( "/proc/$pid" )){
        return json_encode("running");
        } else {
        return json_encode("finished");    
        }
    }
    
//    ----------- Inputs, Project Inputs   ---------
    
    public function getInputs($id,$ownerID) {
        $where = " where owner_id = $ownerID OR perms = 63"; 
		if ($id != ""){
			$where = " where id = $id AND (owner_id = $ownerID OR perms = 63)";
		}
		$sql = "SELECT id, name 
        FROM input $where";
		return self::queryTable($sql);
    }
    public function getProjectInputs($project_id,$ownerID) {
        $where = " where pi.project_id = $project_id AND (pi.owner_id = $ownerID OR pi.perms = 63)" ; 
		$sql = "SELECT pi.id, i.id as input_id, i.name
                FROM project_input pi
                INNER JOIN input i ON i.id = pi.input_id
                $where";
		return self::queryTable($sql);
    }
    public function getProjectInput($id,$ownerID) {
        $where = " where pi.id = $id AND (pi.owner_id = $ownerID OR pi.perms = 63)" ; 
		$sql = "SELECT pi.id, i.id as input_id, i.name
                FROM project_input pi
                INNER JOIN input i ON i.id = pi.input_id
                $where";
		return self::queryTable($sql);
    }
    
    public function insertProjectInput($project_id, $input_id, $ownerID) {
        $sql = "INSERT INTO project_input(project_id, input_id, owner_id, perms, date_created, date_modified, last_modified_user) VALUES 
			('$project_id', '$input_id', '$ownerID', 3, now(), now(), '$ownerID')";
        return self::insTable($sql);
    }
    public function insertInput($name, $ownerID) {
        $sql = "INSERT INTO input(name, owner_id, perms, date_created, date_modified, last_modified_user) VALUES 
			('$name', '$ownerID', 3, now(), now(), '$ownerID')";
        return self::insTable($sql);
    }

    public function updateInput($id, $name, $ownerID) {
        $sql = "UPDATE input SET name='$name', date_modified= now(), last_modified_user ='$ownerID'  WHERE id = $id";
        return self::runSQL($sql);
    }
    

    
     // ------- Project Pipelines  ------
 
    public function insertProjectPipeline($name, $project_id, $pipeline_id, $ownerID) {
        $sql = "INSERT INTO project_pipeline(name, project_id, pipeline_id, owner_id, date_created, date_modified, last_modified_user, perms) 
                VALUES ('$name', '$project_id', '$pipeline_id', '$ownerID', now(), now(), '$ownerID', 3)";
        return self::insTable($sql);
    }
    public function updateProjectPipeline($id, $name, $summary, $output_dir, $perms, $profile, $interdel, $group_id, $exec_each, $exec_all, $exec_all_settings, $exec_each_settings, $ownerID) {
        $sql = "UPDATE project_pipeline SET name='$name', summary='$summary', output_dir='$output_dir', perms='$perms', profile='$profile', interdel='$interdel', group_id='$group_id', exec_each='$exec_each', exec_all='$exec_all', exec_all_settings='$exec_all_settings', exec_each_settings='$exec_each_settings', date_modified= now(), last_modified_user ='$ownerID'  WHERE id = $id";
        return self::runSQL($sql);
        
    }
    
    public function getProjectPipelines($id,$project_id,$ownerID) {
		if ($id != ""){
			$where = " where pp.id = $id AND (pp.owner_id = $ownerID OR pp.perms = 63)";
            $sql = "SELECT pp.id, pp.name as pp_name, pip.id as pip_id, pip.rev_id, pip.name, u.username, pp.summary, pp.project_id, pp.pipeline_id, pp.date_created, pp.date_modified, pp.owner_id, p.name as project_name, pp.output_dir, pp.profile, pp.interdel, pp.group_id, pp.exec_each, pp.exec_all, pp.exec_all_settings, pp.exec_each_settings, pp.perms
                    FROM project_pipeline pp 
                    INNER JOIN users u ON pp.owner_id = u.id 
                    INNER JOIN project p ON pp.project_id = p.id
                    INNER JOIN biocorepipe_save pip ON pip.id = pp.pipeline_id
                    $where";    
		} else {
            $where = " where pp.project_id = $project_id AND (pp.owner_id = $ownerID OR pp.perms = 63)" ; 
            $sql = "SELECT pp.id, pp.name as pp_name, pip.id as pip_id, pip.rev_id, pip.name, u.username, pp.summary, pp.date_modified 
                    FROM project_pipeline pp 
                    INNER JOIN biocorepipe_save pip ON pip.id = pp.pipeline_id
                    INNER JOIN users u ON pp.owner_id = u.id 
                    $where";    
        }
		
		return self::queryTable($sql);
    }
    
     // ------- Project Pipeline Inputs  ------
    public function insertProPipeInput($project_pipeline_id, $input_id, $project_id, $pipeline_id, $g_num, $given_name, $qualifier, $ownerID) {
        $sql = "INSERT INTO project_pipeline_input(project_pipeline_id, input_id, project_id, pipeline_id, g_num, given_name, qualifier, owner_id, perms, date_created, date_modified, last_modified_user) VALUES ('$project_pipeline_id', '$input_id', '$project_id', '$pipeline_id', '$g_num', '$given_name', '$qualifier', '$ownerID', 3, now(), now(), '$ownerID')";
        return self::insTable($sql);
    }

    public function updateProPipeInput($id, $project_pipeline_id, $input_id, $project_id, $pipeline_id, $gNum, $given_name, $qualifier, $ownerID) {
        $sql = "UPDATE project_pipeline_input SET project_pipeline_id='$project_pipeline_id', input_id='$input_id', project_id='$project_id', pipeline_id='$pipeline_id', g_num='$g_num', given_name='$given_name', qualifier='$qualifier', last_modified_user ='$ownerID'  WHERE id = $id";
        return self::runSQL($sql);
    } 
    
    public function getProjectPipelineInputs($g_num, $project_pipeline_id,$ownerID) {
        $where = " where ppi.project_pipeline_id = $project_pipeline_id AND (ppi.owner_id = $ownerID OR ppi.perms = 63)" ; 
        if ($g_num != ""){
			 $where = " where ppi.g_num= $g_num AND ppi.project_pipeline_id = $project_pipeline_id AND (ppi.owner_id = $ownerID OR ppi.perms = 63)" ; 
		}
		$sql = "SELECT ppi.id, i.id as input_id, i.name, ppi.given_name
                FROM project_pipeline_input ppi
                INNER JOIN input i ON i.id = ppi.input_id
                $where";
		return self::queryTable($sql);
    }
    public function getProjectPipelineInputsById($id,$ownerID) {
        $where = " where ppi.id= $id AND (ppi.owner_id = $ownerID OR ppi.perms = 63)" ; 
		$sql = "SELECT ppi.id, i.id as input_id, i.name
                FROM project_pipeline_input ppi
                INNER JOIN input i ON i.id = ppi.input_id
                $where";
		return self::queryTable($sql);
    }
    public function  getAllProjectPipelineInputs($project_pipeline_id,$ownerID) {
        $where = " where ppi.project_pipeline_id = $project_pipeline_id AND (ppi.owner_id = $ownerID OR ppi.perms = 63)" ; 
		$sql = "SELECT ppi.id, i.id as input_id, i.name
                FROM project_pipeline_input ppi
                INNER JOIN input i ON i.id = ppi.input_id
                $where";
		return self::queryTable($sql);
    }
    
    // ------- Process Parameters ------

//    public function getAllProcessParameters($process_id, $type, $start, $end) {
//        $time = "";
//        if (!empty($start)) {
//            $time = "date_created >= '$start' AND date_created < ('$end' + INTERVAL 1 DAY)";
//        }
//
//        $typeExp = "";
//        if (!empty($type)) {
//            $typeExp = "AND type = '$type'";
//        }
//
//        $sql = "SELECT pp.id, pp.name, p.name process_name, p.version, type FROM process p, process_parameter pp 
//                WHERE pp.process_id = $process_id $typeExp AND pp.process_id = p.id";
//        return self::queryTable($sql);
//    }
   

    public function insertProcessParameter($name, $process_id, $parameter_id, $type, $ownerID) {
        $sql = "INSERT INTO process_parameter(name, process_id, parameter_id, type, owner_id, date_created, date_modified, last_modified_user, perms) 
                VALUES ('$name', '$process_id', '$parameter_id', '$type', '$ownerID', now(), now(), '$ownerID', 3)";
        return self::insTable($sql);
    }
    
    public function updateProcessParameter($id, $name, $process_id, $parameter_id, $type, $ownerID) {
        $sql = "UPDATE process_parameter SET name='$name', process_id='$process_id', parameter_id='$parameter_id', type='$type', owner_id='$ownerID', last_modified_user ='$ownerID'  WHERE id = $id";
        return self::runSQL($sql);
    }

    public function removeProcessParameter($id) {
        $sql = "DELETE FROM process_parameter WHERE id = $id";
        return self::runSQL($sql);
    }

    public function removeProcessParameterByParameterID($parameter_id) {
        $sql = "DELETE FROM process_parameter WHERE parameter_id = $parameter_id";
        return self::runSQL($sql);
    }

    public function removeProcessParameterByProcessGroupID($process_group_id) {
        $sql = "DELETE process_parameter
                FROM process_parameter 
                JOIN process ON process.id = process_parameter.process_id 
                WHERE process.process_group_id = $process_group_id";        
        return self::runSQL($sql);
    }
    public function removeProcessParameterByProcessID($process_id) {
        $sql = "DELETE FROM process_parameter WHERE process_id = $process_id";
        return self::runSQL($sql);
    }

    
    // --------- Nextflow -------------
	
    public function getNextflow($id) {
        $data = array();

        $sql = "SELECT DISTINCT pi.id as pipeline_id,
                pro.id as process_id,
                pro.name as process_name,
                pro.script as process_script,
                propara.name as process_parameter_name,
                propara.type as process_parameter_type,
                para.id as parameter_id,	
                para.name as parameter_name,
                para.channel_name as parameter_channel_name,
                para.file_path as parameter_file_path,
                para.qualifier as parameter_qualifier,
                para.input_text as parameter_input_text,
				para.file_type as file_type,
				para.version as version,
				ppp.id as ppp_id,
                ppp.name as ppp_name, 
                ppp.pipeline_id as ppp_pipeline_id,
                ppp.parameter_id as ppp_parameter_id,
				ppp.process_id as ppp_process_id,
				ppp.process_name as ppp_process_name,
				ppp.type as ppp_type
				
                FROM pipeline pi, process pro, process_parameter propara, parameter para,
					 pipeline_process_parameter ppp
                WHERE pro.id = propara.process_id AND ppp.parameter_id=para.id
				AND ppp.pipeline_id = pi.id AND ppp.process_id=pro.id AND ppp.type=propara.type
                AND propara.parameter_id = para.id AND pi.id = '$id'";
        return self::queryTable($sql);
    }
	
	
// --------- New Pipeline -----------

	public function getProcessData($id, $ownerID) {
        if ($ownerID == ""){
            $ownerID ="''";
        }
		$where = " where owner_id = $ownerID OR perms = 63"; 
		if ($id != ""){
			$where = " where id = $id AND (owner_id = $ownerID OR perms = 63)";
		}
		$sql = "SELECT id, process_group_id, name, version, summary, script, rev_id FROM process $where";
		return self::queryTable($sql);
	}
    
    public function getProcessRevision($process_gid) {
		$sql = "SELECT id, rev_id, rev_comment, last_modified_user, date_created, date_modified  FROM process WHERE process_gid = $process_gid";
		return self::queryTable($sql);
	}
    public function getPipelineRevision($pipeline_gid) {
		$sql = "SELECT id, rev_id, rev_comment, last_modified_user, date_created, date_modified  FROM biocorepipe_save WHERE pipeline_gid = $pipeline_gid";
		return self::queryTable($sql);
	}
    
    public function getProcessGID($id) {
		$sql = "SELECT  process_gid FROM process WHERE id = $id";
		return self::queryTable($sql);
	}
    public function getPipelineGID($id) {
		$sql = "SELECT pipeline_gid FROM biocorepipe_save WHERE id = $id";
		return self::queryTable($sql);
	}
	public function getInputsPP($id) {
		$sql = "SELECT parameter_id, name, id FROM process_parameter where process_id = $id and type = 'input'";
		return self::queryTable($sql);
	}
	public function checkPipeline($process_id,$process_name, $ownerID) {
		$sql = "SELECT id, name FROM biocorepipe_save WHERE (owner_id = $ownerID OR perms = 63) AND nodes LIKE '%\"$process_id\",\"$process_name\"%'";
		return self::queryTable($sql);
	}
    public function checkProject($pipeline_id, $ownerID) {
		$sql = "SELECT DISTINCT pp.id, p.name 
        FROM project_pipeline pp
        INNER JOIN project p ON pp.project_id = p.id
        WHERE (pp.owner_id = $ownerID OR pp.perms = 63) AND pp.pipeline_id = $pipeline_id";
		return self::queryTable($sql);
	}
    public function getMaxProcess_gid() {
		$sql = "SELECT MAX(process_gid) process_gid FROM process";
		return self::queryTable($sql);
	}
    public function getMaxPipeline_gid() {
		$sql = "SELECT MAX(pipeline_gid) pipeline_gid FROM biocorepipe_save";
		return self::queryTable($sql);
	}
    public function getProcess_gid($process_id) {
		$sql = "SELECT process_gid FROM process WHERE id = $process_id";
		return self::queryTable($sql);
	}
    public function getPipeline_gid($pipeline_id) {
		$sql = "SELECT pipeline_gid FROM biocorepipe_save WHERE id = $pipeline_id";
		return self::queryTable($sql);
	}
    public function getMaxRev_id($process_gid) {
		$sql = "SELECT MAX(rev_id) rev_id FROM process WHERE process_gid = $process_gid";
		return self::queryTable($sql);
	}
    public function getMaxPipRev_id($pipeline_gid) {
		$sql = "SELECT MAX(rev_id) rev_id FROM biocorepipe_save WHERE pipeline_gid = $pipeline_gid";
		return self::queryTable($sql);
	}
	public function getOutputsPP($id) {
		$sql = "SELECT parameter_id, name, id FROM process_parameter where process_id = $id and type = 'output'";
		return self::queryTable($sql);
	}
	
	public function getParametersData($ownerID) {
        if ($ownerID == ""){
        $ownerID ="''";
        }
		$sql = "SELECT * FROM parameter WHERE owner_id = $ownerID OR perms = 63";
		return self::queryTable($sql);
	}
	
	public function saveAllPipeline($dat,$ownerID) {
		$obj = json_decode($dat);
		$name =  $obj[0]->{"name"};
        $id = $obj[1]->{"id"};
		$nodes = json_encode($obj[2]->{"nodes"});
		$mainG = "{\'mainG\':".json_encode($obj[3]->{"mainG"})."}";
		$edges = "{\'edges\':".json_encode($obj[4]->{"edges"})."}";
        $summary = $obj[5]->{"summary"};
        $pipeline_gid = $obj[6]->{"pipeline_gid"};
        $rev_comment = $obj[7]->{"rev_comment"};
        $rev_id = $obj[8]->{"rev_id"};
        
	
	    if ($id > 0){
            $sql = "UPDATE biocorepipe_save set name = '$name', edges = '$edges', summary = '$summary', mainG = '$mainG', nodes ='$nodes', date_modified = now(), last_modified_user = '$ownerID' where id = $id";
		}else{
            $sql = "INSERT INTO biocorepipe_save(owner_id, summary, edges, mainG, nodes, name, pipeline_gid, rev_comment, rev_id, date_created, date_modified, last_modified_user, perms) VALUES ('$ownerID', '$summary', '$edges', '$mainG', '$nodes', '$name', '$pipeline_gid', '$rev_comment', '$rev_id', now(), now(), '$ownerID', 3)";
		}
  		return self::insTable($sql);
	}
    
    
	public function getSavedPipelines($ownerID) {
        if ($ownerID == ""){
            $ownerID ="''";
        }
        $where = " where pip.owner_id = $ownerID OR pip.perms = 63";
		$sql = "select pip.id, pip.rev_id, pip.name, pip.summary, pip.date_modified, u.username 
        FROM biocorepipe_save pip
        INNER JOIN users u ON pip.owner_id = u.id
        $where";
		return self::queryTable($sql);
	}
    
	public function loadPipeline($id) {
		$sql = "select pip.*, u.username
        FROM biocorepipe_save pip 
        INNER JOIN users u ON pip.owner_id = u.id
        where pip.id = $id";
	   return self::queryTable($sql);
	}
    public function removePipelineById($id) {
		$sql = "DELETE FROM biocorepipe_save WHERE id = $id";
	   return self::runSQL($sql);
	}
    public function updatePipelineName($id, $name) {
        $sql = "UPDATE biocorepipe_save SET name='$name'  WHERE id = $id";
        return self::runSQL($sql);
    }
    
    public function insertPipelineName($name,$ownerID) {
        $sql = "INSERT INTO biocorepipe_save(owner_id, name) VALUES 
			('$ownerID','$name')";
        return self::insTable($sql);
    }
}