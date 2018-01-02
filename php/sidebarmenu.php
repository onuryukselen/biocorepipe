<!-- sidebar menu: : style can be found in sidebar.less -->
<!--        Control Sidebar-->
<div class=" dropdown messages-menu ">

    <button type="button" id="newPipeline" class="btn btn-default btn-warning" name="button" onclick="newPipeline()" data-backdrop="false" style=" margin-left:15px;">
              <a data-toggle="tooltip" data-placement="bottom" title="" data-original-title="New Pipeline">
                  <span class="glyphicon-stack">
                    <i class="fa fa-plus-circle glyphicon-stack-2x" style="color:white;"></i>
                      <i class="fa fa-spinner glyphicon-stack-1x" style="color:white;"></i>
                  </span>
              </a>
            </button>
    <button type="button" id="addprocess" class="btn btn-default btn-success" data-toggle="modal" name="button" data-target="#addProcessModal" data-backdrop="false" style=" margin-left:0px;">
              <a data-toggle="tooltip" data-placement="bottom" title="" data-original-title="New Process">
                  <span class="glyphicon-stack">
                    <i class="fa fa-plus-circle glyphicon-stack-2x" style="color:white;"></i>
                      <i class="fa fa-circle-o glyphicon-stack-1x" style="color:white;"></i>
                  </span>
              </a>
            </button>
</div>


<?php
require_once("config/config.php");

    session_start();
$ownerID = isset($_SESSION['ownerID']) ? $_SESSION['ownerID'] : "";

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
        while(($row=$res->fetch_assoc())){$data[]=$row;}
        $res->close();
     }
     return json_encode($data);
   }
      public function getParentSideBar($ownerID)
   {
      if ($ownerID != ''){
        $sql= "SELECT DISTINCT group_name name, id FROM process_group where owner_id='$ownerID' OR perms = 63";
      } else {
        $sql= "SELECT DISTINCT group_name name, id FROM process_group where perms = 63";
      }
     return self::queryTable($sql);
   }
    
     public function getPipelineSideBar($ownerID)
   {
      if ($ownerID != ''){
        $sql= "SELECT name, id FROM biocorepipe_save where owner_id='$ownerID' OR perms = 63 ";
      } else {
        $sql= "SELECT name, id FROM biocorepipe_save where perms = 63 ";   
      }
     return self::queryTable($sql);
   }
   
   function getSubMenuFromSideBar($parent, $ownerID)
   {
       if ($ownerID != ''){
       $sql="SELECT p.id, p.name, p.owner_id, p.perms
             FROM process p
             INNER JOIN process_group pg 
             ON p.process_group_id = pg.id and pg.group_name='$parent' and ( pg.owner_id='$ownerID' OR pg.perms = 63)
             INNER JOIN (
                SELECT name, process_gid, owner_id, perms, MAX(rev_id) rev_id
                FROM process 
                GROUP BY process_gid
                ) b ON p.rev_id = b.rev_id AND p.process_gid=b.process_gid and ( b.owner_id='$ownerID' OR b.perms = 63) ";
       } else {
                  $sql="SELECT p.id, p.name, p.owner_id, p.perms
             FROM process p
             INNER JOIN process_group pg 
             ON p.process_group_id = pg.id and pg.group_name='$parent' and pg.perms = 63
             INNER JOIN (
                SELECT name, process_gid, owner_id, perms, MAX(rev_id) rev_id
                FROM process 
                GROUP BY process_gid
                ) b ON p.rev_id = b.rev_id AND p.process_gid=b.process_gid and b.perms = 63 ";
       }
      return self::queryTable($sql);
   }
}

function getSideMenuItem($obj)
{
$html="";
foreach ($obj as $item):
        $html.='<li><a data-toggle="modal" data-target="#addProcessModal" data-backdrop="false" href="" ondragstart="dragStart(event)" ondrag="dragging(event)" draggable="true" id="'.$item->{'name'}.'@'.$item->{'id'}.'"><i class="fa fa-angle-double-right"></i>'.$item->{'name'}.'</a></li>';
endforeach;
return $html;
}

function getSideMenuPipelineItem($obj)
{
$html="";
foreach ($obj as $item):
        $html.='<li><a href="" class="pipelineItems"  draggable="false" id="pipeline-'.$item->{'id'}.'"><i class="fa fa-angle-double-right"></i>'.$item->{'name'}.'</a></li>';
endforeach;
return $html;
}


$query = new dbfuncs();

$parentMenus = json_decode($query->getParentSideBar($ownerID));
$pipelinesMenu = json_decode($query->getPipelineSideBar($ownerID));


$menuhtml='<ul id="autocompletes1" class="sidebar-menu" data-widget="tree">';
//add initial input parameters
  

$menuhtml.='<li id="Pipelines" class="treeview">  <a href="" draggable="false"><i  class="fa fa-spinner"></i><span> Pipelines </span><i class="fa fa-angle-left pull-right"></i></a><ul id="allPipelines" class="treeview-menu">';    
    $items = json_decode($query->getPipelineSideBar($ownerID));
    $menuhtml.= getSideMenuPipelineItem($items);
    $menuhtml.='</ul>';
    $menuhtml.='</li>';
$menuhtml.='<li class="header">INPUT/OUTPUT PARAMETERS</li>';

$menuhtml.='<li id="inputs" >  <a ondragstart="dragStart(event)" ondrag="dragging(event)" draggable="true" id="inputparam@inPro"> <i class="fa fa-plus"></i>  <text id="text-inPro" font-family="FontAwesome" font-size="0.9em" x="-6" y="15"></text> <span> Input Parameters </span> </a></li>';  
$menuhtml.='<li id="outputs" class="treeview">  <a ondragstart="dragStart(event)" ondrag="dragging(event)" draggable="true" id="outputparam@outPro"> <i class="fa fa-plus"></i>  <text id="text-outPro" font-family="FontAwesome" font-size="0.9em" x="-6" y="15"></text> <span> Output Parameters </span> </a></li>';  
$menuhtml.='<li class="header">PROCESSES</li>';


foreach ($parentMenus as $parentitem):

    $menuhtml.='<li class="treeview">';

    $menuhtml.='<a href="" draggable="false"><i  class="fa fa-circle-o"></i> <span>'.$parentitem->{'name'}.'</span>';
    
    $items = json_decode($query->getSubMenuFromSideBar($parentitem->{'name'}, $ownerID));

    $menuhtml.='<i class="fa fa-angle-left pull-right"></i></a>';
    $menuhtml.='<ul id="side-'.$parentitem->{'id'}.'" class="treeview-menu">';
    $menuhtml.= getSideMenuItem($items);
    $menuhtml.='</ul>';
    $menuhtml.='</li>';
endforeach;
$menuhtml.='                    <ul>';

echo $menuhtml;

?>
    <!-- /.sidebar -->