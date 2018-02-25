<?php
//require_once("config/config.php");
//
//session_start();
//$ownerID = isset($_SESSION['ownerID']) ? $_SESSION['ownerID'] : "";
//
//class dbfuncsPublic {
//    private $dbhost = DBHOST;
//    private $db = DB;
//    private $dbuser = DBUSER;
//    private $dbpass = DBPASS;
//    private $dbport = DBPORT;
////    private $last_modified_user = LMUSER;
//    private static $link;
//
//    function __construct() {
//        if (!isset(self::$link)) {
//            self::$link = new mysqli($this->dbhost, $this->dbuser, $this->dbpass, $this->db, $this->dbport);
//            // check connection
//            if (mysqli_connect_errno()) {
//                exit('Connect failed: ' . mysqli_connect_error());
//            }
//        }
//    }
//
//    function __destruct() {
//        if (isset(self::$link)) {
//            self::$link->close();
//        }
//    }
//   function runSQL($sql)
//   {
//        $link = new mysqli($this->dbhost, $this->dbuser, $this->dbpass, $this->db);
//        // check connection
//        if (mysqli_connect_errno()) {
//                exit('Connect failed: '. mysqli_connect_error());
//        }
//        $result=self::$link->query($sql);
//		if (!$result) {
//            trigger_error('Database Error: ' . self::$link->error);
//        }
//        if ($result && $result!="1")
//        {
//            return $result;
//        }
//        return json_encode (json_decode ("{}"));
//   }
//   function queryTable($sql)
//   {
//     $data = array();
//     if ($res = $this->runSQL($sql))
//     {
//        while(($row=$res->fetch_assoc())){$data[]=$row;}
//        $res->close();
//     }
//     return json_encode($data);
//   }
//    
//     public function getPublicPipelines()
//   {
//        $sql= "SELECT pip.id, pip.name, pip.summary, pip.pin, pip.pin_order
//               FROM biocorepipe_save pip
//               INNER JOIN (
//                SELECT name, summary, pipeline_gid, owner_id, perms, MAX(rev_id) rev_id
//                FROM biocorepipe_save 
//                WHERE pin = 'true' and perms = 63
//                GROUP BY pipeline_gid
//                ) b ON pip.rev_id = b.rev_id AND pip.pipeline_gid=b.pipeline_gid and b.perms = 63 and pip.pin = 'true' ";
//     return self::queryTable($sql);
//   }
//   
//}
//
//function getPublicPipeDiv($obj)
//{
//$html="";
//foreach ($obj as $item):
//    $html.='<div style="min-width:25%; padding-right:30px; padding-bottom:25px;" class="col-md-4">
//        <div style=" height:300px;" class="movebox widget-user-2">
//            <div style="height:100px" class="widget-user-header ">
//                <div class="boxheader">
//                    <i style="font-size:30px; float:left; color:orange; padding:5px;" class="fa fa-spinner"></i>
//                    <h4 style="text-align:center;">'.$item->{'name'}.'</h4>
//                </div>
//            </div>
//            <div class="box-body">
//                <p style="height:110px; overflow:hidden;">'.$item->{'summary'}.'</p>
//                <div style="padding-top:10px;" class="pull-right">
//                    <a href="index.php?np=1&id='.$item->{'id'}.'" style="background-color:#508CB8;" class="btn btn-primary btn-sm ad-click-event">LEARN MORE</a>
//                </div>
//            </div>
//        </div>
//    </div>';
//    
//endforeach;
//return $html;
//}
//
//$query = new dbfuncsPublic();
//$publicPipelines = json_decode($query->getPublicPipelines());
//
//usort($publicPipelines, function($a, $b) { //Sort the array by pin_order 
//    if ($a->pin_order == "0"){
//        return 1 ; 
//    } else if ($b->pin_order == "0"){
//        return -1 ; 
//    } else {
//        return $a->pin_order < $b->pin_order ? -1 : 1; 
//    }
//});  
//
//$pagehtml='<section class="content" style="max-width: 1500px; ">
//<h2 class="page-header">Public Pipelines</h2>
//<div class="row">';
//    $pagehtml.= getPublicPipeDiv($publicPipelines);
//    $pagehtml.='</div></section>';
//echo $pagehtml;

?>


<div id="wrapper">
    <section>
        <div style="height:750px;" class="data-container"></div>
        <div id="pagination-public"></div>
<!--
        <div class="data-container"></div>
        <div id="pagination-demo2"></div>
-->
    </section>
</div>
