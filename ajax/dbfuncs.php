<?php
require_once("../config/config.php");

class dbfuncs {

    private $dbhost = DBHOST;
    private $db = DB;
    private $dbuser = DBUSER;
    private $dbpass = DBPASS;
    private $dbport = DBPORT;
//    private $last_modified_user = LMUSER;
    private $run_path = RUNPATH;
    private $ssh_path = SSHPATH;
    private $ssh_settings = "-oStrictHostKeyChecking=no -oChallengeResponseAuthentication=no -oBatchMode=yes -oPasswordAuthentication=no -oConnectTimeout=3";
    private $dolphin_path = DOLPHINPATH;
    private $amz_path = AMZPATH;
    private $amazon = AMAZON;
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
            } else if ($row['sname']){
            $row['sname'] = htmlspecialchars_decode($row['sname'], ENT_QUOTES);
            } else if ($row['process_parameter_name']){
            $row['process_parameter_name'] = htmlspecialchars_decode($row['process_parameter_name'], ENT_QUOTES);
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
    
    function writeLog($project_pipeline_id,$text,$mode){
        $file = fopen("../{$this->run_path}/run{$project_pipeline_id}/log.txt", $mode);//creates new file
        fwrite($file, $text."\n");
        fclose($file);
    }
    //$img: path of image
    function imageCmd($img, $type, $profileType ){
        if ($type == 'singularity'){
            preg_match("/shub:\/\/(.*)/", $img, $matches);
              if ($matches[1] != ''){
                  $imageName = str_replace("/","-",$matches[1]);
                  $image = '~/.dolphinnext/singularity/' + $imageName;
                  if ($profileType == 'local' || $profileType == 'cluster'){
                  $cmd = "mkdir -p ~/.dolphinnext/singularity && cd ~/.dolphinnext/singularity && singularity pull --name ".$imageName.".simg ".$img;
                  return $cmd;
                  }
              }  
        } else if ($type == 'docker'){
            
        }
        
    }
    
    //type:w creates new file
    function createDirFile ($pathDir, $fileName, $type, $text){
        if ($pathDir != ""){
            mkdir("$pathDir", 0755, true);
        }
        if ($fileName != ""){
            $file = fopen("$pathDir/$fileName", $type);
            fwrite($file, $text);
            fclose($file);
            chmod("$pathDir/$fileName", 0755);
        }
    }
    
    //if logArray not exist than send empty ""
    function runCommand ($cmd, $logName, $logArray) {
        $pid_command = popen($cmd, 'r');
        $pid = fread($pid_command, 2096);
        pclose($pid_command);
        if (empty($logArray)){
        $log_array = array($logName => $pid);
        } else {
        $log_array[$logName] = $pid;    
        }
        return $log_array;
    }
    
    //full path for file
    function readFile($path){
        $handle = fopen($path, 'r');
        $content = fread($handle, filesize($path));
        fclose($handle);
        return $content;
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
        if ($profileType == "local") {
            // get outputdir
            $proPipeAll = json_decode($this->getProjectPipelines($project_pipeline_id,"",$ownerID));
            $outdir = $proPipeAll[0]->{'output_dir'};
            
            $run_path_real = "$outdir/run{$project_pipeline_id}";
            //check nextflow file
            $log_path_server = "../{$this->run_path}/run{$project_pipeline_id}";
            if (!file_exists($log_path_server."/nextflow.nf")) die(json_encode('Nextflow file is not found!'));
            if (!file_exists($log_path_server."/nextflow.config")) die(json_encode('Nextflow config file is not found!'));
            //mkdir and copy nextflow and config file to run directory in local
            mkdir("$run_path_real", 0755, true);
            $cmd = "cp $log_path_server/nextflow.nf $run_path_real/nextflow.nf && cp $log_path_server/nextflow.config $run_path_real/nextflow.config";
            $this->writeLog($project_pipeline_id,$cmd,'w');
            $pid_command = popen($cmd, 'r');//copy file
            $pid = fread($pid_command, 2096);
            pclose($pid_command);
            chmod("$run_path_real/nextflow.nf", 0755);
        } else if ($profileType == "cluster") {
            // get outputdir
            $proPipeAll = json_decode($this->getProjectPipelines($project_pipeline_id,"",$ownerID));
            $outdir = $proPipeAll[0]->{'output_dir'};
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
            if (!file_exists($run_path_real."/nextflow.config")) die(json_encode('Nextflow config file is not found!'));
            $dolphin_path_real = "$outdir/run{$project_pipeline_id}";
            //mkdir and copy nextflow file to run directory in cluster
            $cmd = "ssh {$this->ssh_settings}  -i $userpky $connect 'mkdir -p $dolphin_path_real' > $run_path_real/log.txt 2>&1 && scp {$this->ssh_settings} -i $userpky $run_path_real/nextflow.nf $run_path_real/nextflow.config $connect:$dolphin_path_real >> $run_path_real/log.txt 2>&1";
            $mkdir_copynext_pid =shell_exec($cmd);
            $this->writeLog($project_pipeline_id,$cmd,'a');
//           command below not working without &
//            if (!$mkdir_copynext_pid) die('Connection failed while creating new folder in the cluster');
            $log_array = array('mkdir_copynext_pid' => $mkdir_copynext_pid);
            return $log_array;
        } else if ($profileType == "amazon") {
            // get outputdir
            $proPipeAll = json_decode($this->getProjectPipelines($project_pipeline_id,"",$ownerID));
            $outdir = $proPipeAll[0]->{'output_dir'};
            // get username and hostname for connection
            $amzData=$this->getProfileAmazonbyID($profileId, $ownerID);
            $amzDataArr=json_decode($amzData,true);
            $connect = $amzDataArr[0]["ssh"];
            //get userpky
            $userpky = "../{$this->ssh_path}/{$ownerID}_{$profileId}_amz_pri.pky";
            //check $userpky file exist
            if (!file_exists($userpky)) die(json_encode('Private key is not found!'));
            $run_path_real = "../{$this->run_path}/run{$project_pipeline_id}";
            if (!file_exists($run_path_real."/nextflow.nf")) die(json_encode('Nextflow file is not found!'));
            if (!file_exists($run_path_real."/nextflow.config")) die(json_encode('Nextflow config file is not found!'));
            $dolphin_path_real = "$outdir/run{$project_pipeline_id}";
            //mkdir and copy nextflow file to run directory in cluster
            $cmd = "ssh {$this->ssh_settings}  -i $userpky $connect 'mkdir -p $dolphin_path_real' > $run_path_real/log.txt 2>&1 && scp {$this->ssh_settings} -i $userpky $run_path_real/nextflow.nf $run_path_real/nextflow.config $connect:$dolphin_path_real >> $run_path_real/log.txt 2>&1";
            $mkdir_copynext_pid =shell_exec($cmd);
            $this->writeLog($project_pipeline_id,$cmd,'a');
//           command below not working without &
//            if (!$mkdir_copynext_pid) die('Connection failed while creating new folder in the cluster');
            $log_array = array('mkdir_copynext_pid' => $mkdir_copynext_pid);
            return $log_array;
        }
    }
    
    
    function runCmd($project_pipeline_id, $ownerID, $profileType, $profileId, $ownerID, $log_array)
    {
        if ($profileType == "local") {
            //get input parameters
            $allinputs = json_decode($this->getProjectPipelineInputs("", $project_pipeline_id, $ownerID));
            $next_inputs="";
            foreach ($allinputs as $inputitem):
                $next_inputs.="--".$inputitem->{'given_name'}." '".$inputitem->{'name'}."' ";
            endforeach;
            // get outputdir  
            $proPipeAll = json_decode($this->getProjectPipelines($project_pipeline_id,"",$ownerID));
            $outdir = $proPipeAll[0]->{'output_dir'};
            $proPipeCmd = $proPipeAll[0]->{'cmd'};
            $singu_check = $proPipeAll[0]->{'singu_check'};
            if ($singu_check == "true"){
                $singu_img = $proPipeAll[0]->{'singu_img'};
                $imageCmd =='';
//                $imageCmd = $this->imageCmd($singu_img, 'singularity', $profileType);
            }
            //profile cmd before nextflow run
            $locData=$this->getProfileLocalbyID($profileId, $ownerID);
            $locDataArr=json_decode($locData,true);
            $next_path = $locDataArr[0]["next_path"];
            $profileCmd = $locDataArr[0]['cmd'];
            $executor = $locDataArr[0]['executor'];
            $next_time = $locDataArr[0]['next_time'];
            $next_queue = $locDataArr[0]['next_queue'];
            $next_memory = $locDataArr[0]['next_memory'];
            $next_cpu = $locDataArr[0]['next_cpu'];
            //combine pre-run cmd
            if (!empty($profileCmd) && !empty($proPipeCmd)){
                $preCmd = "&& ".$profileCmd." && ".$proPipeCmd;
            } else if (!empty($profileCmd)){
                $preCmd = "&& ".$profileCmd;
            } else if (!empty($proPipeCmd)){
                $preCmd = "&& ".$proPipeCmd;
            } else {
                $preCmd ="";
            }
            //combine pre-run cmd with $imageCmd
            if (!empty($preCmd) && !empty($imageCmd)){
                $preCmd = $preCmd." && ".$imageCmd;
            } else if (!empty($preCmd)){
                $preCmd = $preCmd;
            } else if (!empty($imageCmd)){
                $preCmd = "&& ".$imageCmd;
            } else {
                $preCmd ="";
            }
            
            //eg. /project/umw_biocore/bin
            if (!empty($next_path)){
                $next_path_real = "$next_path/nextflow";
            } else {
                $next_path_real  = "nextflow";
            }
            $run_path_real = "$outdir/run{$project_pipeline_id}";
            chdir('../');
            $server_dir = getcwd();
            chdir('ajax');
            $log_path_server = "$server_dir/{$this->run_path}/run{$project_pipeline_id}";
            //run command
//            $cmd = 'export PATH=$PATH:/usr/local/bin/dolphin-bin/tophat2_2.0.12:/usr/local/bin/dolphin-bin/hisat2:/usr/local/bin/dolphin-bin/:/usr/local/bin/dolphin-bin/fastqc_0.10.1  ';
            //for lsf "bsub -q short -n 1  -W 100 -R rusage[mem=32024]";
            if ($executor == "local"){
            $exec_next_all = "cd $run_path_real && $next_path_real nextflow.nf $next_inputs -with-trace >> $log_path_server/log.txt 2>&1 ";
            } else if ($executor == "lsf"){  
            $exec_string = "bsub -q $next_queue -n $next_cpu -W $next_time -R rusage[mem=$next_memory]";
            $exec_next_all = "cd $run_path_real && $exec_string \"$next_path_real nextflow.nf $next_inputs -with-trace >> $log_path_server/log.txt 2>&1 \">> $log_path_server/log.txt 2>&1";
            } else if ($executor == "sge"){
            } else if ($executor == "slurm"){
            }
		    $cmd = "cd $run_path_real $preCmd && $exec_next_all & echo $! &";
            $this->writeLog($project_pipeline_id, $cmd,'a');
            $pid_command = popen($cmd, "r" );
            $pid = fread($pid_command, 2096);
		    $this->updateRunPid($project_pipeline_id, $pid, $ownerID);
		    pclose($pid_command);
            $log_array['next_submit_pid'] = $pid;
            return json_encode($log_array);
            
        } else if ($profileType == "cluster") {
            //get input parameters
            $allinputs = json_decode($this->getProjectPipelineInputs("", $project_pipeline_id, $ownerID));
            $next_inputs="";
            foreach ($allinputs as $inputitem):
                $next_inputs.="--".$inputitem->{'given_name'}." '\"'\"'".$inputitem->{'name'}."'\"'\"' ";
            endforeach;
            //get nextflow executor parameters
            $proPipeAll = json_decode($this->getProjectPipelines($project_pipeline_id,"",$ownerID));
            $outdir = $proPipeAll[0]->{'output_dir'};
            $proPipeCmd = $proPipeAll[0]->{'cmd'};
//            $jobname = $proPipeAll[0]->{'pp_name'};
            $singu_check = $proPipeAll[0]->{'singu_check'};
            if ($singu_check == "true"){
                $singu_img = $proPipeAll[0]->{'singu_img'};
                $imageCmd =='';
//                $imageCmd = $this->imageCmd($singu_img, 'singularity', $profileType);
            }
 

            //get username and hostname for connection
            $cluData=$this->getProfileClusterbyID($profileId, $ownerID);
            $cluDataArr=json_decode($cluData,true);
            $connect = $cluDataArr[0]["username"]."@".$cluDataArr[0]["hostname"];
            $next_path = $cluDataArr[0]["next_path"];
            $profileCmd = $cluDataArr[0]["cmd"];
            $executor = $cluDataArr[0]['executor'];
            $next_time = $cluDataArr[0]['next_time'];
            $next_queue = $cluDataArr[0]['next_queue'];
            $next_memory = $cluDataArr[0]['next_memory'];
            $next_cpu = $cluDataArr[0]['next_cpu']; 
            //combine pre-run cmd
            if (!empty($profileCmd) && !empty($proPipeCmd)){
                $preCmd = "&& ".$profileCmd." && ".$proPipeCmd;
            } else if (!empty($profileCmd)){
                $preCmd = "&& ".$profileCmd;
            } else if (!empty($proPipeCmd)){
                $preCmd = "&& ".$proPipeCmd;
            } else {
                $preCmd ="";
            }
            //combine pre-run cmd with $imageCmd
            if (!empty($preCmd) && !empty($imageCmd)){
                $preCmd = $preCmd." && ".$imageCmd;
            } else if (!empty($preCmd)){
                $preCmd = $preCmd;
            } else if (!empty($imageCmd)){
                $preCmd = "&& ".$imageCmd;
            } else {
                $preCmd ="";
            }
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
            $dolphin_path_real = "$outdir/run{$project_pipeline_id}";
            //check if files are exist
            $next_exist_cmd= "ssh {$this->ssh_settings} -i $userpky $connect test  -f \"$dolphin_path_real/nextflow.nf\"  && echo \"Nextflow file exists\" || echo \"Nextflow file not exists\" 2>&1 & echo $! &";
            $next_exist = shell_exec($next_exist_cmd);
            $this->writeLog($project_pipeline_id,$next_exist_cmd,'a');
            preg_match("/(.*)Nextflow file(.*)exists(.*)/", $next_exist, $matches);
            $log_array['next_exist'] = $next_exist;
            // if $matches[2] == " ", it means nextflow file is exist 
            if ($matches[2] == " ") {
            //         ssh ak97w@ghpcc06.umassrc.org 'source /etc/bashrc && module load java/1.8.0_31 && bsub -q long -n 1  -W 3040 -R rusage[mem=32024] "/project/umw_biocore/bin/nextflow   ~/.dolphinnext/tmp/logs/run#/nextflow.nf >  ~/.dolphinnext/tmp/logs/run#/log.txt > 2&1”’
            
            //for lsf "bsub -q short -n 1  -W 100 -R rusage[mem=32024]";
            if ($executor == "local"){
            $exec_next_all = "cd $dolphin_path_real && $next_path_real $dolphin_path_real/nextflow.nf $next_inputs -with-trace > $dolphin_path_real/log.txt ";
            } else if ($executor == "lsf"){  
            $exec_string = "bsub -q $next_queue -n $next_cpu -W $next_time -R rusage[mem=$next_memory]";
            $exec_next_all = "cd $dolphin_path_real && $exec_string \"$next_path_real $dolphin_path_real/nextflow.nf $next_inputs -with-trace > $dolphin_path_real/log.txt \"";
            } else if ($executor == "sge"){
            } else if ($executor == "slurm"){
            }
            $cmd="ssh {$this->ssh_settings}  -i $userpky $connect 'cd $dolphin_path_real $preCmd && $exec_next_all' >> $run_path_real/log.txt 2>&1 & echo $! &";
            $next_submit_pid= shell_exec($cmd); //"Job <203477> is submitted to queue <long>.\n"
            $this->writeLog($project_pipeline_id,$cmd,'a');
            if (!$next_submit_pid) die(json_encode('Connection failed while running nextflow in the cluster'));
            $log_array['next_submit_pid'] = $next_submit_pid;
            return json_encode($log_array);
            
            }else if ($matches[2] == " not "){
                for( $i= 0 ; $i < 3 ; $i++ ){
                     sleep(3);
                     $next_exist = shell_exec($next_exist_cmd);
                     preg_match("/(.*)Nextflow file(.*)exists(.*)/", $next_exist, $matches);
                     $log_array['next_exist'] = $next_exist;
                     if ($matches[2] == " ") {
                         $next_submit_pid= shell_exec($cmd); //"Job <203477> is submitted to queue <long>.\n"
                         if (!$next_submit_pid) die(json_encode('Connection failed while running nextflow in the cluster'));
                            $log_array['next_submit_pid'] = $next_submit_pid;
                         return json_encode($log_array);
                     }
                }
                die(json_encode('Connection failed. Nextflow file not exists in cluster'));
            }
        } else if ($profileType == "amazon") {
            //get input parameters
            $allinputs = json_decode($this->getProjectPipelineInputs("", $project_pipeline_id, $ownerID));
            $next_inputs="";
            foreach ($allinputs as $inputitem):
                $next_inputs.="--".$inputitem->{'given_name'}." '\"'\"'".$inputitem->{'name'}."'\"'\"' ";
            endforeach;
            //get nextflow executor parameters
            $proPipeAll = json_decode($this->getProjectPipelines($project_pipeline_id,"",$ownerID));
            $outdir = $proPipeAll[0]->{'output_dir'};
            $proPipeCmd = $proPipeAll[0]->{'cmd'};
//            $jobname = $proPipeAll[0]->{'pp_name'};
            $singu_check = $proPipeAll[0]->{'singu_check'};
            if ($singu_check == "true"){
                $singu_img = $proPipeAll[0]->{'singu_img'};
                $imageCmd =='';
//                $imageCmd = $this->imageCmd($singu_img, 'singularity', $profileType);
            }
 

            //get username and hostname for connection
            $cluData=$this->getProfileAmazonbyID($profileId, $ownerID);
            $cluDataArr=json_decode($cluData,true);
            $connect = $cluDataArr[0]["ssh"];
            $next_path = $cluDataArr[0]["next_path"];
            $profileCmd = $cluDataArr[0]["cmd"];
            $executor = $cluDataArr[0]['executor'];
            $next_time = $cluDataArr[0]['next_time'];
            $next_queue = $cluDataArr[0]['next_queue'];
            $next_memory = $cluDataArr[0]['next_memory'];
            $next_cpu = $cluDataArr[0]['next_cpu']; 
            //combine pre-run cmd
            if (!empty($profileCmd) && !empty($proPipeCmd)){
                $preCmd = "&& ".$profileCmd." && ".$proPipeCmd;
            } else if (!empty($profileCmd)){
                $preCmd = "&& ".$profileCmd;
            } else if (!empty($proPipeCmd)){
                $preCmd = "&& ".$proPipeCmd;
            } else {
                $preCmd ="";
            }
            //combine pre-run cmd with $imageCmd
            if (!empty($preCmd) && !empty($imageCmd)){
                $preCmd = $preCmd." && ".$imageCmd;
            } else if (!empty($preCmd)){
                $preCmd = $preCmd;
            } else if (!empty($imageCmd)){
                $preCmd = "&& ".$imageCmd;
            } else {
                $preCmd ="";
            }
            //eg. /project/umw_biocore/bin
            if (!empty($next_path)){
                $next_path_real = "$next_path/nextflow";
            } else {
                $next_path_real  = "nextflow";
            }
            //get userpky
            $userpky = "../{$this->ssh_path}/{$ownerID}_{$profileId}_amz_pri.pky";
            if (!file_exists($userpky)) die(json_encode('Private key is not found!'));
            $run_path_real = "../{$this->run_path}/run{$project_pipeline_id}";
            $dolphin_path_real = "$outdir/run{$project_pipeline_id}";
            //check if files are exist
            $next_exist_cmd= "ssh {$this->ssh_settings} -i $userpky $connect test  -f \"$dolphin_path_real/nextflow.nf\"  && echo \"Nextflow file exists\" || echo \"Nextflow file not exists\" 2>&1 & echo $! &";
            $next_exist = shell_exec($next_exist_cmd);
            $this->writeLog($project_pipeline_id,$next_exist_cmd,'a');
            preg_match("/(.*)Nextflow file(.*)exists(.*)/", $next_exist, $matches);
            $log_array['next_exist'] = $next_exist;
            // if $matches[2] == " ", it means nextflow file is exist 
            if ($matches[2] == " ") {
            //         ssh ak97w@ghpcc06.umassrc.org 'source /etc/bashrc && module load java/1.8.0_31 && bsub -q long -n 1  -W 3040 -R rusage[mem=32024] "/project/umw_biocore/bin/nextflow   ~/.dolphinnext/tmp/logs/run#/nextflow.nf >  ~/.dolphinnext/tmp/logs/run#/log.txt > 2&1”’
            
            //for lsf "bsub -q short -n 1  -W 100 -R rusage[mem=32024]";
            if ($executor == "local"){
            $exec_next_all = "cd $dolphin_path_real && $next_path_real $dolphin_path_real/nextflow.nf $next_inputs -with-trace > $dolphin_path_real/log.txt ";
            } else if ($executor == "lsf"){  
            $exec_string = "bsub -q $next_queue -n $next_cpu -W $next_time -R rusage[mem=$next_memory]";
            $exec_next_all = "cd $dolphin_path_real && $exec_string \"$next_path_real $dolphin_path_real/nextflow.nf $next_inputs -with-trace > $dolphin_path_real/log.txt \"";
            } else if ($executor == "sge"){
            } else if ($executor == "slurm"){
            }
            $cmd="ssh {$this->ssh_settings}  -i $userpky $connect 'cd $dolphin_path_real $preCmd && $exec_next_all' >> $run_path_real/log.txt 2>&1 & echo $! &";
            $next_submit_pid= shell_exec($cmd); //"Job <203477> is submitted to queue <long>.\n"
            $this->writeLog($project_pipeline_id,$cmd,'a');
            if (!$next_submit_pid) die(json_encode('Connection failed while running nextflow in the cluster'));
            $log_array['next_submit_pid'] = $next_submit_pid;
            return json_encode($log_array);
            
            }else if ($matches[2] == " not "){
                for( $i= 0 ; $i < 3 ; $i++ ){
                     sleep(3);
                     $next_exist = shell_exec($next_exist_cmd);
                     preg_match("/(.*)Nextflow file(.*)exists(.*)/", $next_exist, $matches);
                     $log_array['next_exist'] = $next_exist;
                     if ($matches[2] == " ") {
                         $next_submit_pid= shell_exec($cmd); //"Job <203477> is submitted to queue <long>.\n"
                         if (!$next_submit_pid) die(json_encode('Connection failed while running nextflow in the cluster'));
                            $log_array['next_submit_pid'] = $next_submit_pid;
                         return json_encode($log_array);
                     }
                }
                die(json_encode('Connection failed. Nextflow file not exists in cluster'));
            }
        }
    }
    
    
    function insertKey($id, $key, $type, $ownerID){
            mkdir("../{$this->ssh_path}", 0755, true);
        if ($type == 'clu'){
            $file = fopen("../{$this->ssh_path}/{$ownerID}_{$id}.pky", 'w');//creates new file
            fwrite($file, $key);
            fclose($file);
            chmod("../{$this->ssh_path}/{$ownerID}_{$id}.pky", 0600); 
        } else if ($type == 'amz_pri'){
            $file = fopen("../{$this->ssh_path}/{$ownerID}_{$id}_{$type}.pky", 'w');//creates new file
            fwrite($file, $key);
            fclose($file);
            chmod("../{$this->ssh_path}/{$ownerID}_{$id}_{$type}.pky", 0600); 
        } else if ($type == 'amz_pub'){
            $file = fopen("../{$this->ssh_path}/{$ownerID}_{$id}_{$type}.pky", 'w');//creates new file
            fwrite($file, $key);
            fclose($file);
            chmod("../{$this->ssh_path}/{$ownerID}_{$id}_{$type}.pky", 0600); 
            
        }

    }
    function readKey($id, $type, $ownerID){
        
        if ($type == 'clu'){
        $filename = "../{$this->ssh_path}/{$ownerID}_{$id}.pky";
        } else if ($type == 'amz_pub' || $type == 'amz_pri'){
        $filename = "../{$this->ssh_path}/{$ownerID}_{$id}_{$type}.pky";
        }
        $handle = fopen($filename, 'r');//creates new file
        $content = fread($handle, filesize($filename));
        fclose($handle);
        
        return $content;
    }
    function delKey($id, $type, $ownerID){
        if ($type == 'clu'){
        $filename = "../{$this->ssh_path}/{$ownerID}_{$id}.pky";
        } else if ($type == 'amz_pub' || $type == 'amz_pri'){
        $filename = "../{$this->ssh_path}/{$ownerID}_{$id}_{$type}.pky";
        }
        unlink($filename); 
    }
    
    function amazonEncode($a_key){
        $encrypted_string=openssl_encrypt($a_key,"AES-128-ECB",$this->amazon);
        return $encrypted_string;
    }
    function amazonDecode($a_key){
        $decrypted_string=openssl_decrypt($a_key,"AES-128-ECB",$this->amazon);
        return $decrypted_string;
    }
    
    function startProAmazon($id,$ownerID){
        $data = json_decode($this->getProfileAmazonbyID($id, $ownerID));
        foreach($data as $d){
            $access = $d->access_key;
            $d->access_key = trim($this->amazonDecode($access));
            $secret = $d->secret_key;
            $d->secret_key = trim($this->amazonDecode($secret));
	    }
        $name = $data[0]->{'name'};
        $image_id = $data[0]->{'image_id'};
        $instance_type = $data[0]->{'instance_type'};
        $subnet_id = $data[0]->{'subnet_id'};
        $shared_storage_id = $data[0]->{'shared_storage_id'};
        $shared_storage_mnt = $data[0]->{'shared_storage_mnt'};
        $keyFile = "../../../{$this->ssh_path}/{$ownerID}_{$id}_amz_pub.pky";
        $access_key = $data[0]->{'access_key'};
        $secret_key = $data[0]->{'secret_key'};
        $default_region = $data[0]->{'default_region'};
        $nodes = $data[0]->{'nodes'};
        $autoscale_check = $data[0]->{'autoscale_check'};
        $autoscale_maxIns = $data[0]->{'autoscale_maxIns'};
        
        $text= "cloud { \n";
        $text.= "   imageId = '$image_id'\n";
        $text.= "   instanceType = '$instance_type'\n";
        $text.= "   subnetId = '$subnet_id'\n";
        $text.= "   sharedStorageId = '$shared_storage_id'\n";
        $text.= "   sharedStorageMount = '$shared_storage_mnt'\n";
        $text.= "   keyFile = '$keyFile'\n";
        if ($autoscale_check == "true"){
        $text.= "   autoscale {\n";
        $text.= "       enabled = true \n";
        if (!empty($autoscale_maxIns)){
        $text.= "       maxInstances = $autoscale_maxIns\n";
        }
        $text.= "   }\n";
        }
        
        $text.= "}\n";
        $text.= "aws{\n";
        $text.= "   accessKey = '$access_key'\n";
        $text.= "   secretKey = '$secret_key'\n";
        $text.= "   region = '$default_region'\n";
        $text.= "}\n";
        $this->createDirFile ("../{$this->amz_path}/pro_{$id}", "nextflow.config", 'w', $text );
        //start amazon cluster
        $cmd = "cd ../{$this->amz_path}/pro_{$id} && yes | nextflow cloud create cluster{$id} -c $nodes > logAmzStart.txt 2>&1 & echo $! &";
        $log_array = $this->runCommand ($cmd, 'start_cloud', '');
        $this->updateAmazonProStatus($id, "waiting", $ownerID);
        return json_encode($log_array);
    }
    
    function stopProAmazon($id,$ownerID){
        //stop amazon cluster
        $cmd = "cd ../{$this->amz_path}/pro_{$id} && yes | nextflow cloud shutdown cluster{$id} > logAmzStop.txt 2>&1 & echo $! &";
        $log_array = $this->runCommand ($cmd, 'stop_cloud', '');
        return json_encode($log_array);
    }
    
        function runAmzCloudList($id){
        //check cloud list
        $cmd = "cd ../{$this->amz_path}/pro_$id && rm -f logAmzCloudList.txt && nextflow cloud list cluster$id >> logAmzCloudList.txt 2>&1";
        $log_array = $this->runCommand ($cmd, 'cloudlist', '');
        //read logAmzCloudList.txt
        $logPath ="../{$this->amz_path}/pro_{$id}/logAmzCloudList.txt";
        $logAmzCloudList = $this->readFile($logPath);
        $log_array['logAmzCloudList'] = $logAmzCloudList;
        return $log_array;
        
    }

    
    
    
    
    

    
//    ---------------  Users ---------------
    public function getUser($google_id) {
        $sql = "SELECT * FROM users WHERE google_id = '$google_id'";
        return self::queryTable($sql);
    }
    public function getUserLess($google_id) {
        $sql = "SELECT username, name, email, google_image FROM users WHERE google_id = '$google_id'";
        return self::queryTable($sql);
    }
    public function insertUser($google_id, $name, $email, $google_image, $username) {
        $sql = "INSERT INTO users(google_id, name, email, google_image, username, memberdate, date_created, date_modified, last_modified_user) VALUES 
			('$google_id', '$name', '$email', '$google_image', '$username', now() , now(), now(), '".$this->last_modified_user."')";
        return self::insTable($sql);
    }
    
    public function updateUser($id, $google_id, $name, $email, $google_image, $username) {
        $sql = "UPDATE users SET id='$id', google_id='$google_id', name='$name', email='$email', google_image='$google_image', username='$username', last_modified_user='".$this->last_modified_user."' WHERE id = '$id'";
        return self::runSQL($sql);
    }
//    ------------- Profiles   ------------
    public function getProfileLocal($ownerID) {
        $sql = "SELECT id, name, executor, next_path, cmd, next_time, next_queue, next_memory, next_cpu, executor_job, job_memory, job_queue, job_time, job_cpu FROM profile_local WHERE owner_id = '$ownerID'";
        return self::queryTable($sql);    
    }
    public function getProfileLocalbyID($id,$ownerID) {
        $sql = "SELECT id, name, executor, next_path, cmd, next_time, next_queue, next_memory, next_cpu, executor_job, job_memory, job_queue, job_time, job_cpu FROM profile_local WHERE owner_id = '$ownerID' and id = '$id'";
        return self::queryTable($sql);    
    }
    public function getProfileClusterbyID($id, $ownerID) {
        $sql = "SELECT id, name, executor, next_path, username, hostname, cmd, next_time, next_queue, next_memory, next_cpu, executor_job, job_memory, job_queue, job_time, job_cpu FROM profile_cluster WHERE owner_id = '$ownerID' and id = '$id'";
        return self::queryTable($sql); 
    }
    public function getProfileCluster($ownerID) {
        $sql = "SELECT id, name, executor, next_path, username, hostname, cmd, next_time, next_queue, next_memory, next_cpu, executor_job, job_memory, job_queue, job_time, job_cpu FROM profile_cluster WHERE owner_id = '$ownerID'";
        return self::queryTable($sql);    
    }
    public function getProfileAmazon($ownerID) {
        $sql = "SELECT id, name, executor, next_path, default_region, instance_type, image_id, cmd, next_time, next_queue, next_memory, next_cpu, executor_job, job_memory, job_queue, job_time, job_cpu, subnet_id, shared_storage_id, shared_storage_mnt,nodes, autoscale_check, autoscale_maxIns, status, ssh FROM profile_amazon WHERE owner_id = '$ownerID'";
        return self::queryTable($sql);    
    }
    public function getProfileAmazonbyID($id, $ownerID) {
        $sql = "SELECT id, name, executor, next_path, default_region, instance_type, image_id, secret_key, access_key, cmd, next_time, next_queue, next_memory, next_cpu, executor_job, job_memory, job_queue, job_time, job_cpu, subnet_id, shared_storage_id, shared_storage_mnt, nodes, autoscale_check, autoscale_maxIns, status, ssh FROM profile_amazon WHERE owner_id = '$ownerID' and id = '$id'";
        return self::queryTable($sql);    
    }
    
    public function insertProfileLocal($name, $executor,$next_path, $cmd, $next_memory, $next_queue, $next_time, $next_cpu, $executor_job, $job_memory, $job_queue, $job_time, $job_cpu, $ownerID) {
        $sql = "INSERT INTO profile_local (name, executor, next_path, cmd, next_memory, next_queue, next_time, next_cpu, executor_job, job_memory, job_queue, job_time, job_cpu, owner_id, perms, date_created, date_modified, last_modified_user) VALUES ('$name', '$executor','$next_path', '$cmd', '$next_memory', '$next_queue', '$next_time', '$next_cpu', '$executor_job', '$job_memory', '$job_queue', '$job_time', '$job_cpu', '$ownerID', 3, now(), now(), '$ownerID')";
        return self::insTable($sql);
    }

    public function updateProfileLocal($id, $name, $executor,$next_path, $cmd, $next_memory, $next_queue, $next_time, $next_cpu, $executor_job, $job_memory, $job_queue, $job_time, $job_cpu, $ownerID) {
        $sql = "UPDATE profile_local SET name='$name', executor='$executor', next_path='$next_path', cmd='$cmd', next_memory='$next_memory', next_queue='$next_queue', next_time='$next_time', next_cpu='$next_cpu', executor_job='$executor_job', job_memory='$job_memory', job_queue='$job_queue', job_time='$job_time', job_cpu='$job_cpu', last_modified_user ='$ownerID'  WHERE id = '$id'";
        return self::runSQL($sql);
    }
    
    public function insertProfileCluster($name, $executor,$next_path, $username, $hostname, $cmd, $next_memory, $next_queue, $next_time, $next_cpu, $executor_job, $job_memory, $job_queue, $job_time, $job_cpu, $ownerID) {
        $sql = "INSERT INTO profile_cluster(name, executor, next_path, username, hostname, cmd, next_memory, next_queue, next_time, next_cpu, executor_job, job_memory, job_queue, job_time, job_cpu, owner_id, perms, date_created, date_modified, last_modified_user) VALUES('$name', '$executor', '$next_path', '$username', '$hostname', '$cmd', '$next_memory', '$next_queue', '$next_time', '$next_cpu', '$executor_job', '$job_memory', '$job_queue', '$job_time', '$job_cpu', '$ownerID', 3, now(), now(), '$ownerID')";
        return self::insTable($sql);
    }

    public function updateProfileCluster($id, $name, $executor,$next_path, $username, $hostname, $cmd, $next_memory, $next_queue, $next_time, $next_cpu, $executor_job, $job_memory, $job_queue, $job_time, $job_cpu, $ownerID) {
        $sql = "UPDATE profile_cluster SET name='$name', executor='$executor', next_path='$next_path', username='$username', hostname='$hostname', cmd='$cmd', next_memory='$next_memory', next_queue='$next_queue', next_time='$next_time', next_cpu='$next_cpu', executor_job='$executor_job', job_memory='$job_memory', job_queue='$job_queue', job_time='$job_time', job_cpu='$job_cpu', last_modified_user ='$ownerID'  WHERE id = '$id'";
        return self::runSQL($sql);
    }
    public function insertProfileAmazon($name, $executor, $next_path, $amz_def_reg, $amz_acc_key, $amz_suc_key, $ins_type, $image_id, $cmd, $next_memory, $next_queue, $next_time, $next_cpu, $executor_job, $job_memory, $job_queue, $job_time, $job_cpu, $subnet_id, $shared_storage_id, $shared_storage_mnt, $ownerID) {
        $sql = "INSERT INTO profile_amazon(name, executor, next_path, default_region, access_key, secret_key, instance_type, image_id, cmd, next_memory, next_queue, next_time, next_cpu, executor_job, job_memory, job_queue, job_time, job_cpu, subnet_id, shared_storage_id, shared_storage_mnt, owner_id, perms, date_created, date_modified, last_modified_user) VALUES('$name', '$executor', '$next_path', '$amz_def_reg', '$amz_acc_key', '$amz_suc_key', '$ins_type', '$image_id', '$cmd', '$next_memory', '$next_queue', '$next_time', '$next_cpu', '$executor_job', '$job_memory', '$job_queue', '$job_time', '$job_cpu', '$subnet_id','$shared_storage_id','$shared_storage_mnt','$ownerID', 3, now(), now(), '$ownerID')";
        return self::insTable($sql);
    }
    public function updateProfileAmazon($id, $name, $executor, $next_path, $amz_def_reg, $amz_acc_key, $amz_suc_key, $ins_type, $image_id, $cmd, $next_memory, $next_queue, $next_time, $next_cpu, $executor_job, $job_memory, $job_queue, $job_time, $job_cpu, $subnet_id, $shared_storage_id, $shared_storage_mnt, $ownerID) {
        $sql = "UPDATE profile_amazon SET name='$name', executor='$executor', next_path='$next_path', default_region='$amz_def_reg', access_key='$amz_acc_key', secret_key='$amz_suc_key', instance_type='$ins_type', image_id='$image_id', cmd='$cmd', next_memory='$next_memory', next_queue='$next_queue', next_time='$next_time', next_cpu='$next_cpu', executor_job='$executor_job', job_memory='$job_memory', job_queue='$job_queue', job_time='$job_time', job_cpu='$job_cpu', subnet_id='$subnet_id', shared_storage_id='$shared_storage_id', shared_storage_mnt='$shared_storage_mnt', last_modified_user ='$ownerID'  WHERE id = '$id'";
        return self::runSQL($sql);
    }
    public function updateProfileAmazonNode($id, $nodes, $autoscale_check, $autoscale_maxIns, $ownerID) {
        $sql = "UPDATE profile_amazon SET nodes='$nodes', autoscale_check='$autoscale_check', autoscale_maxIns='$autoscale_maxIns', last_modified_user ='$ownerID'  WHERE id = '$id'";
        return self::runSQL($sql);
    }
    
    public function updateAmazonProStatus($id, $status, $ownerID) {
        $sql = "UPDATE profile_amazon SET status='$status', date_modified= now(), last_modified_user ='$ownerID'  WHERE id = '$id'";
        return self::runSQL($sql);
    }
    public function updateAmazonProSSH($id, $sshText, $ownerID) {
        $sql = "UPDATE profile_amazon SET ssh='$sshText', date_modified= now(), last_modified_user ='$ownerID'  WHERE id = '$id'";
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
        $sql = "SELECT id, name, qualifier, file_type FROM parameter WHERE owner_id = '$ownerID' OR perms = 63";
        return self::queryTable($sql);
    }

    public function insertParameter($name, $qualifier, $file_type, $ownerID) {
        $sql = "INSERT INTO parameter(name, qualifier, file_type, owner_id, perms, date_created, date_modified, last_modified_user) VALUES 
			('$name', '$qualifier', '$file_type', '$ownerID', 3, now(), now(), '$ownerID')";
        return self::insTable($sql);
    }

    public function updateParameter($id, $name, $qualifier, $file_type, $ownerID) {
        $sql = "UPDATE parameter SET name='$name', qualifier='$qualifier', last_modified_user ='$ownerID', file_type='$file_type'  WHERE id = '$id'";
        return self::runSQL($sql);
    }
    
    public function insertProcessGroup($group_name, $ownerID) {
        $sql = "INSERT INTO process_group (owner_id, group_name, date_created, date_modified, last_modified_user, perms) VALUES ('$ownerID', '$group_name', now(), now(), '$ownerID', 3)";
        return self::insTable($sql);
    }

    public function updateProcessGroup($id, $group_name, $ownerID) {
        $sql = "UPDATE process_group SET group_name='$group_name', owner_id='$ownerID', last_modified_user ='$ownerID'  WHERE id = '$id'";
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
        $sql = "SELECT id, group_name FROM process_group WHERE owner_id = '$ownerID' OR perms = 63";
        return self::queryTable($sql);
    }
    
    public function insertProcess($name, $process_gid, $summary, $process_group_id, $script, $rev_id, $rev_comment, $ownerID) {
        $sql = "INSERT INTO process(name, process_gid, summary, process_group_id, script, rev_id, rev_comment, owner_id, date_created, date_modified, last_modified_user, perms) VALUES ('$name', '$process_gid', '$summary', '$process_group_id', '$script', '$rev_id','$rev_comment', '$ownerID', now(), now(), '$ownerID', 3)";
        return self::insTable($sql);
    }

    public function updateProcess($id, $name, $process_gid, $summary, $process_group_id, $script, $ownerID) {
        $sql = "UPDATE process SET name= '$name', process_gid='$process_gid', summary='$summary', process_group_id='$process_group_id', script='$script', owner_id='$ownerID', last_modified_user = '$ownerID'  WHERE id = '$id'";
        return self::runSQL($sql);
    }

    public function removeProcess($id) {
        $sql = "DELETE FROM process WHERE id = '$id'";
        return self::runSQL($sql);
    }
    public function removeProject($id) {
        $sql = "DELETE FROM project WHERE id = '$id'";
        return self::runSQL($sql);
    }
    public function removeGroup($id) {
        $sql = "DELETE FROM groups WHERE id = '$id'";
        return self::runSQL($sql);
    }
    public function removeUserGroup($id) {
        $sql = "DELETE FROM user_group WHERE g_id = '$id'";
        return self::runSQL($sql);
    }
    public function removeProjectPipeline($id) {
        $sql = "DELETE FROM project_pipeline WHERE id = '$id'";
        return self::runSQL($sql);
    }
    public function removeInput($id) {
        $sql = "DELETE FROM input WHERE id = '$id'";
        return self::runSQL($sql);
    }
    public function removeProjectPipelineInput($id) {
        $sql = "DELETE FROM project_pipeline_input WHERE id = '$id'";
        return self::runSQL($sql);
    }
    public function removeProjectPipelineInputByPipe($id) {
        $sql = "DELETE FROM project_pipeline_input WHERE project_pipeline_id = '$id'";
        return self::runSQL($sql);
    }
    public function removeProjectInput($id) {
        $sql = "DELETE FROM project_input WHERE id = '$id'";
        return self::runSQL($sql);
    }
    public function removeProjectPipelinebyProjectID($id) {
        $sql = "DELETE FROM project_pipeline WHERE project_id = '$id'";
        return self::runSQL($sql);
    }
    
    public function removeProcessByProcessGroupID($process_group_id) {
        $sql = "DELETE FROM process WHERE process_group_id = '$process_group_id'";
        return self::runSQL($sql);
    }
//    ------ Groups -------
    public function getAllGroups() {
        $sql = "SELECT id, name FROM groups";
        return self::queryTable($sql);
    }
    public function getGroups($id,$ownerID) {
        $where = ""; 
		if ($id != ""){
			$where = " where g.id = '$id'";
		}
		$sql = "SELECT g.id, g.name, g.date_created, u.username, g.date_modified 
                FROM groups g 
                INNER JOIN users u ON g.owner_id = u.id $where";
		return self::queryTable($sql);
    }
    
    public function getJoinGroups($ownerID) {
        $sql = "SELECT id, name FROM groups WHERE id NOT IN (
		SELECT g_id
		FROM user_group
		WHERE u_id = '$ownerID')";
        return self::queryTable($sql);
    }
    
    public function viewGroupMembers($g_id) {
        $sql = "SELECT id, username
	           FROM users
	           WHERE id in (
		          SELECT u_id
		          FROM user_group
		          WHERE g_id = '$g_id')";
        return self::queryTable($sql);
    }
    
    public function getMemberAdd($g_id) {
        $sql = "SELECT id, username
	           FROM users
	           WHERE id NOT IN (
		          SELECT u_id
		          FROM user_group
		          WHERE g_id = '$g_id')";
        return self::queryTable($sql);
    }
    
    public function getUserGroups($ownerID) {
		$sql = "SELECT g.id, g.name, g.date_created, u.username, g.owner_id, ug.u_id
                FROM groups g 
                INNER JOIN user_group ug ON  ug.g_id =g.id 
                INNER JOIN users u ON u.id = g.owner_id 
                where ug.u_id = '$ownerID'";
		return self::queryTable($sql);
    }
    public function insertGroup($name, $ownerID) {
        $sql = "INSERT INTO groups(name, owner_id, date_created, date_modified, last_modified_user, perms) VALUES ('$name', '$ownerID', now(), now(), '$ownerID', 3)";
        return self::insTable($sql);
    }
    public function insertUserGroup($g_id, $u_id, $ownerID) {
        $sql = "INSERT INTO user_group (g_id, u_id, owner_id, date_created, date_modified, last_modified_user, perms) VALUES ('$g_id', '$u_id', '$ownerID', now(), now(), '$ownerID', 3)";
        return self::insTable($sql);
    }

    public function updateGroup($id, $name, $ownerID) {
        $sql = "UPDATE groups SET name= '$name', owner_id='$ownerID', last_modified_user = '$ownerID', date_modified = now() WHERE id = '$id'";
        return self::runSQL($sql);
    }
//    ----------- Projects   ---------
    public function getProjects($id,$ownerID) {
        $where = " where p.owner_id = '$ownerID' OR p.perms = 63"; 
		if ($id != ""){
			$where = " where p.id = '$id' AND (p.owner_id = '$ownerID' OR p.perms = 63)";
		}
		$sql = "SELECT p.id, p.name, p.summary, p.date_created, u.username, p.date_modified FROM project p INNER JOIN users u ON p.owner_id = u.id $where";
		return self::queryTable($sql);
    }
    public function insertProject($name, $summary, $ownerID) {
        $sql = "INSERT INTO project(name, summary, owner_id, date_created, date_modified, last_modified_user, perms) VALUES ('$name', '$summary', '$ownerID', now(), now(), '$ownerID', 3)";
        return self::insTable($sql);
    }

    public function updateProject($id, $name, $summary, $ownerID) {
        $sql = "UPDATE project SET name= '$name', summary= '$summary', owner_id='$ownerID', last_modified_user = '$ownerID', date_modified = now() WHERE id = '$id'";
        return self::runSQL($sql);
    }

//    ----------- Runs     ---------
    public function insertRun($project_pipeline_id, $status, $ownerID) {
        $sql = "INSERT INTO run (project_pipeline_id, run_status, owner_id, perms, date_created, date_modified, last_modified_user) VALUES 
			('$project_pipeline_id', '$status', '$ownerID', 3, now(), now(), '$ownerID')";
        return self::insTable($sql);
    }
    public function updateRunStatus($project_pipeline_id, $status, $ownerID) {
        $sql = "UPDATE run SET run_status='$status', date_modified= now(), last_modified_user ='$ownerID'  WHERE project_pipeline_id = '$project_pipeline_id'";
        return self::runSQL($sql);
    }
    public function updateRunPid($project_pipeline_id, $pid, $ownerID) {
        $sql = "UPDATE run SET pid='$pid', date_modified= now(), last_modified_user ='$ownerID'  WHERE project_pipeline_id = '$project_pipeline_id'";
        return self::runSQL($sql);
    }
    public function getServerLog($project_pipeline_id,$ownerID) {
        $path= "../{$this->run_path}/run$project_pipeline_id";
        // get contents of a file into a string
        $filename = "$path/log.txt";
        $handle = fopen($filename, "r");
        $content = fread($handle, filesize($filename));
        fclose($handle);
        return json_encode($content);
    }
    public function getRun($project_pipeline_id,$ownerID) {
        $sql = "SELECT * FROM run WHERE project_pipeline_id = '$project_pipeline_id'";
		return self::queryTable($sql);
    }
    public function getRunStatus($project_pipeline_id,$ownerID) {
        $sql = "SELECT run_status FROM run WHERE project_pipeline_id = '$project_pipeline_id'";
		return self::queryTable($sql);
    }
    public function getAmazonStatus($id,$ownerID) {
        $sql = "SELECT status FROM profile_amazon WHERE id = '$id'";
		return self::queryTable($sql);
    }


    
    public function checkAmazonStatus($id,$ownerID) {
        //check status of database
        $amzStat = json_decode($this->getAmazonStatus($id,$ownerID)); 
        $status = $amzStat[0]->{'status'};
        if ($status == "waiting"){
            //check cloud list
            $log_array = $this->runAmzCloudList($id);
            if (preg_match("/running/", $log_array['logAmzCloudList'])){
                $this->updateAmazonProStatus($id, "initiated", $ownerID);
                $log_array['status'] = "initiated";
                return json_encode($log_array);
            } else if (!preg_match("/STATUS/", $log_array['logAmzCloudList']) && (preg_match("/Missing/", $log_array['logAmzCloudList']) || preg_match("/ERROR/", $log_array['logAmzCloudList']))){
                $this->updateAmazonProStatus($id, "terminated", $ownerID);
                $log_array['status'] = "terminated";
                return json_encode($log_array);
            }else {
                //error
                $log_array['status'] = "waiting";
                return json_encode($log_array);
            }
        } else if ($status == "initiated"){
            //check cloud list
            $log_array = $this->runAmzCloudList($id);
            if (preg_match("/running/",$log_array['logAmzCloudList']) && preg_match("/STATUS/",$log_array['logAmzCloudList'])){
                //read logAmzStart.txt
                $amzStartPath ="../{$this->amz_path}/pro_{$id}/logAmzStart.txt";
                $amzStartLog = $this->readFile($amzStartPath);
                $log_array['$amzStartLog'] = $amzStartLog;
                if (preg_match("/ssh -i(.*)/",$amzStartLog)){
                    preg_match("/ssh -i <(.*)> (.*)/",$amzStartLog, $match);
                    $sshText = $match[2];
                    $log_array['sshText'] = $sshText;
                    $log_array['status'] = "running";
                    $this->updateAmazonProStatus($id, "running", $ownerID);
                    $this->updateAmazonProSSH($id, $sshText, $ownerID);
                return json_encode($log_array);
                } else {
                    $log_array['status'] = "initiated";
                return json_encode($log_array);
                }
            } else if (!preg_match("/running/",$log_array['logAmzCloudList']) && preg_match("/STATUS/",$log_array['logAmzCloudList'])){
                $this->updateAmazonProStatus($id, "terminated", $ownerID);
                $log_array['status'] = "terminated";
                return json_encode($log_array);
            } else {
                $log_array['status'] = "retry";
                return json_encode($log_array);
            }
            
            
        } else if ($status == "running"){
            //check cloud list
            $log_array = $this->runAmzCloudList($id);
            if (preg_match("/running/",$log_array['logAmzCloudList']) && preg_match("/STATUS/",$log_array['logAmzCloudList'])){
                $log_array['status'] = "running";
                return json_encode($log_array);
            } else if (!preg_match("/running/",$log_array['logAmzCloudList']) && preg_match("/STATUS/",$log_array['logAmzCloudList'])){
                $this->updateAmazonProStatus($id, "terminated", $ownerID);
                $log_array['status'] = "terminated";
                return json_encode($log_array);
            } else {
                $log_array['status'] = "retry";
                return json_encode($log_array);
            }
        } else if ($status == "terminated"){
                $log_array = array('status' => 'terminated');
                return json_encode($log_array);
        } else if ($status == ""){
                $log_array = array('status' => 'inactive');
                return json_encode($log_array);
        }
    }
        
        
    
    public function checkRunPid($pid,$profileType,$profileId,$ownerID) {
        if ($profileType == 'local'){
            if (file_exists( "/proc/$pid" )){
            return json_encode("running");
            } else {
            return json_encode("completed");  
            }
        } else if ($profileType == 'cluster'){
            $userpky = "../{$this->ssh_path}/{$ownerID}_{$profileId}.pky";
            $cluData=$this->getProfileClusterbyID($profileId, $ownerID);
            $cluDataArr=json_decode($cluData,true);
            $connect = $cluDataArr[0]["username"]."@".$cluDataArr[0]["hostname"];
            $check_run = shell_exec("ssh {$this->ssh_settings} -i $userpky $connect 'bjobs' 2>&1 &");
            if (preg_match("/$pid/",$check_run)){
            return json_encode('running');
            } else {
            return json_encode('completed');
            }
        }
    }
    
    public function getNextflowLog($project_pipeline_id,$profileType,$profileId,$ownerID) {
         if ($profileType == 'cluster'){
            $userpky = "../{$this->ssh_path}/{$ownerID}_{$profileId}.pky";
            $cluData=$this->getProfileClusterbyID($profileId, $ownerID);
            $cluDataArr=json_decode($cluData,true);
            $connect = $cluDataArr[0]["username"]."@".$cluDataArr[0]["hostname"];
            // get outputdir
            $proPipeAll = json_decode($this->getProjectPipelines($project_pipeline_id,"",$ownerID));
            $outdir = $proPipeAll[0]->{'output_dir'};
            $dolphin_path_real = "$outdir/run{$project_pipeline_id}";
            $nextflow_log = shell_exec("ssh {$this->ssh_settings} -i $userpky $connect 'cat $dolphin_path_real/log.txt' 2>&1 &");
             return json_encode($nextflow_log);
        } else if ($profileType == 'amazon'){
            $userpky = "../{$this->ssh_path}/{$ownerID}_{$profileId}_amz_pri.pky";
            $cluData=$this->getProfileAmazonbyID($profileId, $ownerID);
            $cluDataArr=json_decode($cluData,true);
            $connect = $cluDataArr[0]["ssh"];
            // get outputdir
            $proPipeAll = json_decode($this->getProjectPipelines($project_pipeline_id,"",$ownerID));
            $outdir = $proPipeAll[0]->{'output_dir'};
            $dolphin_path_real = "$outdir/run{$project_pipeline_id}";
            $nextflow_log = shell_exec("ssh {$this->ssh_settings} -i $userpky $connect 'cat $dolphin_path_real/log.txt' 2>&1 &");
             return json_encode($nextflow_log);
        }
    }
    
//    ----------- Inputs, Project Inputs   ---------
    
    public function getInputs($id,$ownerID) {
        $where = " where owner_id = '$ownerID' OR perms = 63"; 
		if ($id != ""){
			$where = " where id = '$id' AND (owner_id = '$ownerID' OR perms = 63)";
		}
		$sql = "SELECT id, name 
        FROM input $where";
		return self::queryTable($sql);
    }
    public function getProjectInputs($project_id,$ownerID) {
        $where = " where pi.project_id = '$project_id' AND (pi.owner_id = '$ownerID' OR pi.perms = 63)" ; 
		$sql = "SELECT pi.id, i.id as input_id, i.name
                FROM project_input pi
                INNER JOIN input i ON i.id = pi.input_id
                $where";
		return self::queryTable($sql);
    }
    public function getProjectInput($id,$ownerID) {
        $where = " where pi.id = '$id' AND (pi.owner_id = '$ownerID' OR pi.perms = 63)" ; 
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
        $sql = "UPDATE input SET name='$name', date_modified= now(), last_modified_user ='$ownerID'  WHERE id = '$id'";
        return self::runSQL($sql);
    }
    

    
     // ------- Project Pipelines  ------
 
    public function insertProjectPipeline($name, $project_id, $pipeline_id, $ownerID) {
        $sql = "INSERT INTO project_pipeline(name, project_id, pipeline_id, owner_id, date_created, date_modified, last_modified_user, perms) 
                VALUES ('$name', '$project_id', '$pipeline_id', '$ownerID', now(), now(), '$ownerID', 3)";
        return self::insTable($sql);
    }
    public function updateProjectPipeline($id, $name, $summary, $output_dir, $perms, $profile, $interdel, $cmd, $group_id, $exec_each, $exec_all, $exec_all_settings, $exec_each_settings, $docker_check, $docker_img, $singu_check, $singu_img, $exec_next_settings, $docker_opt, $singu_opt, $ownerID) {
        $sql = "UPDATE project_pipeline SET name='$name', summary='$summary', output_dir='$output_dir', perms='$perms', profile='$profile', interdel='$interdel', cmd='$cmd', group_id='$group_id', exec_each='$exec_each', exec_all='$exec_all', exec_all_settings='$exec_all_settings', exec_each_settings='$exec_each_settings', docker_check='$docker_check', docker_img='$docker_img', singu_check='$singu_check', singu_img='$singu_img', exec_next_settings='$exec_next_settings', docker_opt='$docker_opt', singu_opt='$singu_opt', date_modified= now(), last_modified_user ='$ownerID'  WHERE id = '$id'";
        return self::runSQL($sql);
        
    }
    
    public function getProjectPipelines($id,$project_id,$ownerID) {
		if ($id != ""){
			$where = " where pp.id = '$id' AND (pp.owner_id = '$ownerID' OR pp.perms = 63)";
            $sql = "SELECT pp.id, pp.name as pp_name, pip.id as pip_id, pip.rev_id, pip.name, u.username, pp.summary, pp.project_id, pp.pipeline_id, pp.date_created, pp.date_modified, pp.owner_id, p.name as project_name, pp.output_dir, pp.profile, pp.interdel, pp.group_id, pp.exec_each, pp.exec_all, pp.exec_all_settings, pp.exec_each_settings, pp.perms, pp.docker_check, pp.docker_img, pp.singu_check, pp.singu_img, pp.exec_next_settings, pp.cmd, pp.singu_opt, pp.docker_opt
                    FROM project_pipeline pp 
                    INNER JOIN users u ON pp.owner_id = u.id 
                    INNER JOIN project p ON pp.project_id = p.id
                    INNER JOIN biocorepipe_save pip ON pip.id = pp.pipeline_id
                    $where";    
		} else {
            $where = " where pp.project_id = '$project_id' AND (pp.owner_id = '$ownerID' OR pp.perms = 63)" ; 
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
        $where = " where ppi.project_pipeline_id = '$project_pipeline_id' AND (ppi.owner_id = '$ownerID' OR ppi.perms = 63)" ; 
        if ($g_num != ""){
			 $where = " where ppi.g_num= '$g_num' AND ppi.project_pipeline_id = '$project_pipeline_id' AND (ppi.owner_id = '$ownerID' OR ppi.perms = 63)" ; 
		}
		$sql = "SELECT ppi.id, i.id as input_id, i.name, ppi.given_name
                FROM project_pipeline_input ppi
                INNER JOIN input i ON i.id = ppi.input_id
                $where";
		return self::queryTable($sql);
    }
    public function getProjectPipelineInputsById($id,$ownerID) {
        $where = " where ppi.id= '$id' AND (ppi.owner_id = '$ownerID' OR ppi.perms = 63)" ; 
		$sql = "SELECT ppi.id, i.id as input_id, i.name
                FROM project_pipeline_input ppi
                INNER JOIN input i ON i.id = ppi.input_id
                $where";
		return self::queryTable($sql);
    }
    public function  getAllProjectPipelineInputs($project_pipeline_id,$ownerID) {
        $where = " where ppi.project_pipeline_id = '$project_pipeline_id' AND (ppi.owner_id = '$ownerID' OR ppi.perms = 63)" ; 
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
   

    public function insertProcessParameter($sname, $process_id, $parameter_id, $type, $closure, $operator, $ownerID) {
        $sql = "INSERT INTO process_parameter(sname, process_id, parameter_id, type, closure, operator, owner_id, date_created, date_modified, last_modified_user, perms) 
                VALUES ('$sname', '$process_id', '$parameter_id', '$type', '$closure', '$operator', '$ownerID', now(), now(), '$ownerID', 3)";
        return self::insTable($sql);
    }
    
    public function updateProcessParameter($id, $sname, $process_id, $parameter_id, $type, $closure, $operator, $ownerID) {
        $sql = "UPDATE process_parameter SET sname='$sname', process_id='$process_id', parameter_id='$parameter_id', type='$type', closure='$closure', operator='$operator', owner_id='$ownerID', last_modified_user ='$ownerID'  WHERE id = '$id'";
        return self::runSQL($sql);
    }

    public function removeProcessParameter($id) {
        $sql = "DELETE FROM process_parameter WHERE id = '$id'";
        return self::runSQL($sql);
    }

    public function removeProcessParameterByParameterID($parameter_id) {
        $sql = "DELETE FROM process_parameter WHERE parameter_id = '$parameter_id'";
        return self::runSQL($sql);
    }

    public function removeProcessParameterByProcessGroupID($process_group_id) {
        $sql = "DELETE process_parameter
                FROM process_parameter 
                JOIN process ON process.id = process_parameter.process_id 
                WHERE process.process_group_id = '$process_group_id'";        
        return self::runSQL($sql);
    }
    public function removeProcessParameterByProcessID($process_id) {
        $sql = "DELETE FROM process_parameter WHERE process_id = '$process_id'";
        return self::runSQL($sql);
    }

    
    // --------- Nextflow -------------
	
    public function getNextflow($id) {
        $data = array();

        $sql = "SELECT DISTINCT pi.id as pipeline_id,
                pro.id as process_id,
                pro.name as process_name,
                pro.script as process_script,
                propara.sname as process_parameter_name,
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
	
    //------- feedback ------
    
        public function savefeedback($email,$message) {
        $sql = "INSERT INTO feedback(email, message, date_created) VALUES 
			('$email', '$message', now())";
        return self::insTable($sql);
        }
	
// --------- New Pipeline -----------

	public function getProcessData($id, $ownerID) {
        if ($ownerID == ""){
            $ownerID ="''";
        }
		$where = " where owner_id = '$ownerID' OR perms = 63"; 
		if ($id != ""){
			$where = " where id = '$id' AND (owner_id = '$ownerID' OR perms = 63)";
		}
		$sql = "SELECT id, process_group_id, name, version, summary, script, rev_id FROM process $where";
		return self::queryTable($sql);
	}
    
    public function getProcessRevision($process_gid) {
		$sql = "SELECT id, rev_id, rev_comment, last_modified_user, date_created, date_modified  FROM process WHERE process_gid = '$process_gid'";
		return self::queryTable($sql);
	}
    public function getPipelineRevision($pipeline_gid) {
		$sql = "SELECT id, rev_id, rev_comment, last_modified_user, date_created, date_modified  FROM biocorepipe_save WHERE pipeline_gid = '$pipeline_gid'";
		return self::queryTable($sql);
	}
    
    public function getProcessGID($id) {
		$sql = "SELECT  process_gid FROM process WHERE id = '$id'";
		return self::queryTable($sql);
	}
    public function getPipelineGID($id) {
		$sql = "SELECT pipeline_gid FROM biocorepipe_save WHERE id = '$id'";
		return self::queryTable($sql);
	}
	public function getInputsPP($id) {
		$sql = "SELECT parameter_id, sname, id, operator, closure FROM process_parameter where process_id = '$id' and type = 'input'";
		return self::queryTable($sql);
	}
	public function checkPipeline($process_id,$process_name, $ownerID) {
		$sql = "SELECT id, name FROM biocorepipe_save WHERE (owner_id = '$ownerID' OR perms = 63) AND nodes LIKE '%\"$process_id\",\"$process_name\"%'";
		return self::queryTable($sql);
	}
    public function checkProject($pipeline_id, $ownerID) {
		$sql = "SELECT DISTINCT pp.id, p.name 
        FROM project_pipeline pp
        INNER JOIN project p ON pp.project_id = p.id
        WHERE (pp.owner_id = '$ownerID' OR pp.perms = 63) AND pp.pipeline_id = '$pipeline_id'";
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
		$sql = "SELECT process_gid FROM process WHERE id = '$process_id'";
		return self::queryTable($sql);
	}
    public function getPipeline_gid($pipeline_id) {
		$sql = "SELECT pipeline_gid FROM biocorepipe_save WHERE id = '$pipeline_id'";
		return self::queryTable($sql);
	}
    public function getMaxRev_id($process_gid) {
		$sql = "SELECT MAX(rev_id) rev_id FROM process WHERE process_gid = '$process_gid'";
		return self::queryTable($sql);
	}
    public function getMaxPipRev_id($pipeline_gid) {
		$sql = "SELECT MAX(rev_id) rev_id FROM biocorepipe_save WHERE pipeline_gid = '$pipeline_gid'";
		return self::queryTable($sql);
	}
	public function getOutputsPP($id) {
		$sql = "SELECT parameter_id, sname, id,operator, closure FROM process_parameter where process_id = '$id' and type = 'output'";
		return self::queryTable($sql);
	}
	
	public function getParametersData($ownerID) {
        if ($ownerID == ""){
        $ownerID ="''";
        }
		$sql = "SELECT * FROM parameter WHERE owner_id = '$ownerID' OR perms = 63";
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
            $sql = "UPDATE biocorepipe_save set name = '$name', edges = '$edges', summary = '$summary', mainG = '$mainG', nodes ='$nodes', date_modified = now(), last_modified_user = '$ownerID' where id = '$id'";
		}else{
            $sql = "INSERT INTO biocorepipe_save(owner_id, summary, edges, mainG, nodes, name, pipeline_gid, rev_comment, rev_id, date_created, date_modified, last_modified_user, perms) VALUES ('$ownerID', '$summary', '$edges', '$mainG', '$nodes', '$name', '$pipeline_gid', '$rev_comment', '$rev_id', now(), now(), '$ownerID', 3)";
		}
  		return self::insTable($sql);
	}
    
    
	public function getSavedPipelines($ownerID) {
        if ($ownerID == ""){
            $ownerID ="''";
        }
        $where = " where pip.owner_id = '$ownerID' OR pip.perms = 63";
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
        where pip.id = '$id'";
	   return self::queryTable($sql);
	}
    public function removePipelineById($id) {
		$sql = "DELETE FROM biocorepipe_save WHERE id = '$id'";
	   return self::runSQL($sql);
	}
    public function updatePipelineName($id, $name) {
        $sql = "UPDATE biocorepipe_save SET name='$name'  WHERE id = '$id'";
        return self::runSQL($sql);
    }
    
    public function insertPipelineName($name,$ownerID) {
        $sql = "INSERT INTO biocorepipe_save(owner_id, name) VALUES 
			('$ownerID','$name')";
        return self::insTable($sql);
    }
}
