<?php
require_once("../config/config.php");

class dbfuncs {

    private $dbhost = DBHOST;
    private $db = DB;
    private $dbuser = DBUSER;
    private $dbpass = DBPASS;
    private $dbport = DBPORT;
    private $last_modified_user = LMUSER;
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
    
//    ------------- Parameters ------------
    
    public function getAllParameters($ownerID) {
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
    public function removeProjectFile($id) {
        $sql = "DELETE FROM project_file WHERE id = $id";
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
    public function getProjectPipelines($id,$project_id,$ownerID) {
		if ($id != ""){
			$where = " where pp.id = $id AND (pp.owner_id = $ownerID OR pp.perms = 63)";
            $sql = "SELECT pp.id, pp.project_id, pp.pipeline_id, pp.date_created, pp.date_modified, pp.owner_id, u.username
                    FROM project_pipeline pp 
                    INNER JOIN users u ON pp.owner_id = u.id 
                    $where";    
		} else {
            $where = " where pp.project_id = $project_id AND (pp.owner_id = $ownerID OR pp.perms = 63)" ; 
            $sql = "SELECT pp.id, pip.id as pip_id, pip.name, u.username, pip.summary, pip.date_modified 
                    FROM project_pipeline pp 
                    INNER JOIN biocorepipe_save pip ON pip.id = pp.pipeline_id
                    INNER JOIN users u ON pip.owner_id = u.id 
                    $where";    
        }
		
		return self::queryTable($sql);
    }
    
//    ----------- Files   ---------
    
    public function getFiles($id,$ownerID) {
        $where = " where owner_id = $ownerID OR perms = 63"; 
		if ($id != ""){
			$where = " where id = $id AND (owner_id = $ownerID OR perms = 63)";
		}
		$sql = "SELECT id, sample_id, file_path, file_ext 
        FROM file $where";
		return self::queryTable($sql);
    }
    public function getProjectFiles($project_id,$ownerID) {
        $where = " where pf.project_id = $project_id AND (pf.owner_id = $ownerID OR pf.perms = 63)" ; 
		$sql = "SELECT pf.id, f.id as file_id, f.file_path, f.file_ext, f.sample_id
                FROM project_file pf
                INNER JOIN file f ON f.id = pf.file_id
                $where";
		return self::queryTable($sql);

    }
    public function getProjectPipelineFiles($g_num, $project_pipeline_id,$ownerID) {
        $where = " where ppf.g_num= $g_num AND ppf.project_pipeline_id = $project_pipeline_id AND (ppf.owner_id = $ownerID OR ppf.perms = 63)" ; 
		$sql = "SELECT ppf.id, f.id as file_id, f.file_path
                FROM project_pipeline_file ppf
                INNER JOIN file f ON f.id = ppf.file_id
                $where";
		return self::queryTable($sql);
    }
    public function  getAllProjectPipelineFiles($project_pipeline_id,$ownerID) {
        $where = " where ppf.project_pipeline_id = $project_pipeline_id AND (ppf.owner_id = $ownerID OR pf.perms = 63)" ; 
		$sql = "SELECT ppf.id, f.id as file_id, f.file_path
                FROM project_pipeline_file ppf
                INNER JOIN file f ON f.id = ppf.file_id
                $where";
		return self::queryTable($sql);
    }
    
    public function insertProjectFile($project_id, $file_id, $ownerID) {
        $sql = "INSERT INTO project_file(project_id, file_id, owner_id, perms, date_created, date_modified, last_modified_user) VALUES 
			('$project_id', '$file_id', '$ownerID', 3, now(), now(), '$ownerID')";
        return self::insTable($sql);
    }
    public function insertFile($name, $file_path, $file_ext, $sample_id, $ownerID) {
        $sql = "INSERT INTO file(name, file_path, file_ext, sample_id, owner_id, perms, date_created, date_modified, last_modified_user) VALUES 
			('$name', '$file_path', '$file_ext', '$sample_id', '$ownerID', 3, now(), now(), '$ownerID')";
        return self::insTable($sql);
    }

    public function updateFile($id, $name, $file_path, $file_ext, $sample_id, $ownerID) {
        $sql = "UPDATE file SET name='$name', file_path='$file_path', file_ext='$file_ext', sample_id='$sample_id', last_modified_user ='$ownerID'  WHERE id = $id";
        return self::runSQL($sql);
    }
    
    public function insertProPipeFile($project_pipeline_id, $file_id, $project_id, $pipeline_id, $g_num, $ownerID) {
        $sql = "INSERT INTO project_pipeline_file(project_pipeline_id, file_id, project_id, pipeline_id, g_num, owner_id, perms, date_created, date_modified, last_modified_user) VALUES 
			('$project_pipeline_id', '$file_id', '$project_id', '$pipeline_id', '$g_num', '$ownerID', 3, now(), now(), '$ownerID')";
        return self::insTable($sql);
    }

    public function updateProPipeFile($id, $project_pipeline_id, $file_id, $project_id, $pipeline_id, $gNum, $ownerID) {
        $sql = "UPDATE project_pipeline_file SET project_pipeline_id='$project_pipeline_id', file_id='$file_id', project_id='$project_id', pipeline_id='$pipeline_id', g_num='$g_num', last_modified_user ='$ownerID'  WHERE id = $id";
        return self::runSQL($sql);
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
 
    public function insertProjectPipeline($project_id, $pipeline_id, $ownerID) {
        $sql = "INSERT INTO project_pipeline( project_id, pipeline_id, owner_id, date_created, date_modified, last_modified_user, perms) 
                VALUES ('$project_id', '$pipeline_id', '$ownerID', now(), now(), '$ownerID', 3)";
        return self::insTable($sql);
    }

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
	public function getInputs($id) {
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
	public function getOutputs($id) {
		$sql = "SELECT parameter_id, name, id FROM process_parameter where process_id = $id and type = 'output'";
		return self::queryTable($sql);
	}
	
	public function getParametersData($ownerID) {
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
		$sql = "select pip.id, pip.rev_id, pip.name, pip.summary, pip.date_modified, u.username 
        FROM biocorepipe_save pip
        INNER JOIN users u ON pip.owner_id = u.id
        WHERE pip.owner_id = $ownerID OR pip.perms = 63";
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
//        $user = "docker";
        $sql = "INSERT INTO biocorepipe_save(owner_id, name) VALUES 
			('$ownerID','$name')";
        return self::insTable($sql);
    }
}
