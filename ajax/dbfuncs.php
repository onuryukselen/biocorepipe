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
//        $data = array();
//        $time = "";
//        if (!empty($start)) {
//            $time = "WHERE date_created >= '$start' AND date_created < ('$end' + INTERVAL 1 DAY)";
//        }
        $sql = "SELECT id, name, qualifier, file_type FROM parameter WHERE owner_id = $ownerID";
        return self::queryTable($sql);
    }

    public function insertParameter($name, $qualifier, $file_type, $ownerID) {
        $sql = "INSERT INTO parameter(name, qualifier, file_type, owner_id, date_created, date_modified, last_modified_user) VALUES 
			('$name', '$qualifier', '$file_type', '$ownerID', now(), now(), '".$this->last_modified_user."')";
        return self::insTable($sql);
    }

    public function updateParameter($id, $name, $qualifier, $file_type, $ownerID) {
        $sql = "UPDATE parameter SET name='$name', qualifier='$qualifier', last_modified_user ='".$this->last_modified_user."', file_type='$file_type', owner_id='$ownerID'  WHERE id = $id";
        return self::runSQL($sql);
    }
    
    public function insertProcessGroup($group_name, $ownerID) {
        $sql = "INSERT INTO process_group (owner_id, group_name, date_created, date_modified, last_modified_user) VALUES ('$ownerID', '$group_name', now(), now(), '".$this->last_modified_user."')";
        return self::insTable($sql);
    }

    public function updateProcessGroup($id, $group_name, $ownerID) {
        $sql = "UPDATE process_group SET group_name='$group_name', owner_id='$ownerID', last_modified_user ='".$this->last_modified_user."'  WHERE id = $id";
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
//        $time = "";
//        if (!empty($start)) {
//            $time = "WHERE date_created >= '$start' AND date_created < ('$end' + INTERVAL 1 DAY)";
//        }
        $sql = "SELECT id, name, version, script FROM process";
        return self::queryTable($sql);
    }

    public function getAllProcessGroups($ownerID) {
        $sql = "SELECT id, group_name FROM process_group WHERE owner_id = $ownerID";
        return self::queryTable($sql);
    }
    
    public function insertProcess($name, $process_gid, $summary, $process_group_id, $script, $rev_id, $rev_comment, $ownerID) {
        $sql = "INSERT INTO process(name, process_gid, summary, process_group_id, script, rev_id, rev_comment, owner_id, date_created, date_modified, last_modified_user) VALUES ('$name', '$process_gid', '$summary', '$process_group_id', '$script', '$rev_id','$rev_comment', '$ownerID', now(), now(), '".$this->last_modified_user."')";
        return self::insTable($sql);
    }

    public function updateProcess($id, $name, $process_gid, $summary, $process_group_id, $script, $ownerID) {
        $sql = "UPDATE process SET name= '$name', process_gid='$process_gid', summary='$summary', process_group_id='$process_group_id', script='$script', owner_id='$ownerID', last_modified_user = '".$this->last_modified_user."'  WHERE id = $id";
        return self::runSQL($sql);
    }

    public function removeProcess($id) {
        $sql = "DELETE FROM process WHERE id = $id";
        return self::runSQL($sql);
    }
    
    public function removeProcessByProcessGroupID($process_group_id) {
        $sql = "DELETE FROM process WHERE process_group_id = $process_group_id";
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
 

    public function insertProcessParameter($name, $process_id, $parameter_id, $type, $ownerID) {
        $sql = "INSERT INTO process_parameter(name, process_id, parameter_id, type, owner_id, date_created, date_modified, last_modified_user) 
                VALUES ('$name', '$process_id', '$parameter_id', '$type', '$ownerID', now(), now(), '".$this->last_modified_user."')";
        return self::insTable($sql);
    }
    
    public function updateProcessParameter($id, $name, $process_id, $parameter_id, $type, $ownerID) {
        $sql = "UPDATE process_parameter SET name='$name', process_id='$process_id', parameter_id='$parameter_id', type='$type', owner_id='$ownerID', last_modified_user ='".$this->last_modified_user."'  WHERE id = $id";
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
		$where = " where owner_id = $ownerID"; 
		if ($id != ""){
			$where = " where id = $id AND owner_id = $ownerID";
		}
		$sql = "SELECT id, process_group_id, name, version, summary, script FROM process $where";
		return self::queryTable($sql);
	}
    
    public function getRevisionData($process_gid) {
		$sql = "SELECT id, rev_id, rev_comment, last_modified_user, date_created, date_modified  FROM process WHERE process_gid = $process_gid";
		return self::queryTable($sql);
	}
    public function getProcessGID($id) {
		$sql = "SELECT  process_gid FROM process WHERE id = $id";
		return self::queryTable($sql);
	}
	public function getInputs($id) {
		$sql = "SELECT parameter_id, name, id FROM process_parameter where process_id = $id and type = 'input'";
		return self::queryTable($sql);
	}
	public function checkPipeline($process_id,$process_name, $ownerID) {
		$sql = "SELECT id, name FROM biocorepipe_save WHERE owner_id = $ownerID AND nodes LIKE '%\"$process_id\",\"$process_name\"%'";
		return self::queryTable($sql);
	}
    public function getMaxProcess_gid() {
		$sql = "SELECT MAX(process_gid) process_gid FROM process";
		return self::queryTable($sql);
	}
    public function getProcess_gid($process_id) {
		$sql = "SELECT process_gid FROM process WHERE id = $process_id";
		return self::queryTable($sql);
	}
    public function getMaxRev_id($process_gid) {
		$sql = "SELECT MAX(rev_id) rev_id FROM process WHERE process_gid = $process_gid";
		return self::queryTable($sql);
	}
	public function getOutputs($id) {
		$sql = "SELECT parameter_id, name, id FROM process_parameter where process_id = $id and type = 'output'";
		return self::queryTable($sql);
	}
	
	public function getParametersData($ownerID) {
		$sql = "SELECT * FROM parameter WHERE owner_id = $ownerID";
		return self::queryTable($sql);
	}
	
	public function saveAllPipeline($dat,$ownerID) {
		$obj = json_decode($dat);
		//$user = "docker";
		$id = $obj[1]->{"id"};
		$edges = "{\'edges\':".json_encode($obj[4]->{"edges"})."}";
		$mainG = "{\'mainG\':".json_encode($obj[3]->{"mainG"})."}";
		$nodes = json_encode($obj[2]->{"nodes"});
		$name =  $obj[0]->{"name"};
	
	    if ($id > 0){
			$sql = "UPDATE biocorepipe_save set edges = '".$edges."',
			    mainG = '".$mainG."', nodes ='".$nodes."' where id = $id";
		}else{
		$sql = "INSERT INTO biocorepipe_save(owner_id, edges, mainG, nodes, name)
				VALUES ('".$ownerID."', '".$edges."', '".$mainG."', '".$nodes."', '".$name."')";
		}
  		return self::insTable($sql);
	}
	public function getSavedPipelines($ownerID) {
		$sql = "select id, name from biocorepipe_save WHERE owner_id = $ownerID";
		return self::queryTable($sql);
	}
	
	public function loadPipeline($id) {
		$sql = "select * from biocorepipe_save where id = $id";
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
