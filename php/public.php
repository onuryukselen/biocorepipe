<?php
require_once("config/config.php");

session_start();
$ownerID = isset($_SESSION['ownerID']) ? $_SESSION['ownerID'] : "";

class dbfuncsPublic {
    private $dbhost = DBHOST;
    private $db = DB;
    private $dbuser = DBUSER;
    private $dbpass = DBPASS;
    private $dbport = DBPORT;
//    private $last_modified_user = LMUSER;
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
        while(($row=$res->fetch_assoc())){$data[]=$row;}
        $res->close();
     }
     return json_encode($data);
   }
    
     public function getPublicPipelines()
   {
        $where_b = "b.perms = 63";
        $sql= "SELECT pip.id, pip.name, pip.summary
               FROM biocorepipe_save pip
               INNER JOIN (
                SELECT name, summary, pipeline_gid, owner_id, perms, MAX(rev_id) rev_id
                FROM biocorepipe_save 
                GROUP BY pipeline_gid
                ) b ON pip.rev_id = b.rev_id AND pip.pipeline_gid=b.pipeline_gid and $where_b ";
     return self::queryTable($sql);
   }
   
}

function getPublicPipeDiv($obj)
{
$html="";
foreach ($obj as $item):
    $html.='<div style="min-width:25%; padding-right:30px; padding-bottom:25px;" class="col-md-4">
        <div style=" height:300px;" class="movebox widget-user-2">
            <div style="height:100px" class="widget-user-header ">
                <div class="boxheader">
                    <i style="font-size:30px; float:left; color:orange; padding:5px;" class="fa fa-spinner"></i>
                    <h4 style="text-align:center;">'.$item->{'name'}.'</h4>
                </div>
            </div>
            <div class="box-body">
                <p style="height:110px; overflow:hidden;">'.$item->{'summary'}.'</p>
                <div style="padding-top:10px;" class="pull-right">
                    <a href="index.php?np=1&id='.$item->{'id'}.'" style="background-color:#508CB8;" class="btn btn-primary btn-sm ad-click-event">LEARN MORE</a>
                </div>
            </div>
        </div>
    </div>';
    
endforeach;
return $html;
}

$query = new dbfuncsPublic();
$publicPipelines = json_decode($query->getPublicPipelines());
$pagehtml='<section class="content" style="max-width: 1500px; ">
<h2 class="page-header">Public Pipelines</h2>
<div class="row">';
    $pagehtml.= getPublicPipeDiv($publicPipelines);
    $pagehtml.='</div></section>';
echo $pagehtml;

?>
  