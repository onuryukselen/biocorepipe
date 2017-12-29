<!-- sidebar menu: : style can be found in sidebar.less -->
<?php
require_once("config/config.php");
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
      public function getParentSideBar()
   {
     $sql= "SELECT DISTINCT group_name name, id FROM process_group";
     return self::queryTable($sql);
   }
    
     public function getPipelineSideBar()
   {
     $sql= "SELECT name, id FROM biocorepipe_save";
     return self::queryTable($sql);
   }
   
   function getSubMenuFromSideBar($parent)
   {
//      $sql="SELECT DISTINCT p.id, p.name from process p, process_group pg where p.process_group_id = pg.id and pg.group_name='$parent'";
//      return self::queryTable($sql); 
       $sql="SELECT p.id, p.name
             FROM process p
             INNER JOIN process_group pg 
             ON p.process_group_id = pg.id and pg.group_name='$parent' 
             INNER JOIN (
                SELECT name, process_gid, MAX(rev_id) rev_id
                FROM process 
                GROUP BY process_gid
                ) b ON p.rev_id = b.rev_id AND p.process_gid=b.process_gid";
      return self::queryTable($sql);
   }
}

function getSideMenuItem($obj )
{
$html="";
foreach ($obj as $item):
        $html.='<li><a data-toggle="modal" data-target="#addProcessModal" data-backdrop="false" href="" ondragstart="dragStart(event)" ondrag="dragging(event)" draggable="true" id="'.$item->{'name'}.'@'.$item->{'id'}.'"><i class="fa fa-angle-double-right"></i>'.$item->{'name'}.'</a></li>';
endforeach;
return $html;
}

function getSideMenuPipelineItem($obj )
{
$html="";
foreach ($obj as $item):
        $html.='<li><a href="" class="pipelineItems"  draggable="false" id="pipeline-'.$item->{'id'}.'"><i class="fa fa-angle-double-right"></i>'.$item->{'name'}.'</a></li>';
endforeach;
return $html;
}


$query = new dbfuncs();

$parentMenus = json_decode($query->getParentSideBar());
$pipelinesMenu = json_decode($query->getPipelineSideBar());


$menuhtml='<ul id="autocompletes1" class="sidebar-menu" data-widget="tree">';
//add initial input parameters
  

$menuhtml.='<li id="Pipelines" class="treeview">  <a href="" draggable="false"><i  class="fa fa-spinner"></i><span> Pipelines </span><i class="fa fa-angle-left pull-right"></i></a><ul id="allPipelines" class="treeview-menu">';    
    $items = json_decode($query->getPipelineSideBar($pipelinesMenu->{'name'}));
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
    
    $items = json_decode($query->getSubMenuFromSideBar($parentitem->{'name'}));

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
