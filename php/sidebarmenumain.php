<?php
if (!isset($_SESSION) || !is_array($_SESSION)) session_start();
$ownerID = isset($_SESSION['ownerID']) ? $_SESSION['ownerID'] : "";
require_once(__DIR__."/../ajax/dbfuncs.php");
$db = new dbfuncs();


function getSideMenuPipelineItem($obj)
{
$html="";
foreach ($obj as $item):
    $nameSub = substr($item->{'name'}, 0, 20);
    $html.='<li pin="'.$item->{'pin'}.'" p="'.$item->{'perms'}.'" g="'.$item->{'group_id'}.'"><a href="index.php?np=1&id='.$item->{'id'}.'" class="pipelineItems"  draggable="false" id="pipeline-'.$item->{'id'}.'" ><i class="fa fa-angle-double-right"></i>'.$nameSub.'</a></li>';
endforeach;
return $html;
}

$parentMenus = json_decode($db->getParentSideBar($ownerID));
$menuhtml='<ul id="autocompletes1" class="sidebar-menu" data-widget="tree">';
//add initial input parameters
$menuhtml.='<li id="Pipelines" class="treeview">  <a href="" draggable="false"><i  class="fa fa-spinner"></i><span> Pipelines </span><i class="fa fa-angle-left pull-right"></i></a><ul id="allPipelines" class="treeview-menu">';    
    $items = json_decode($db->getPipelineSideBar($ownerID));
    $menuhtml.= getSideMenuPipelineItem($items);
    $menuhtml.='</ul>';
    $menuhtml.='</li>';
$menuhtml.='<ul>';
echo $menuhtml;
?>
    <!-- /.sidebar -->
