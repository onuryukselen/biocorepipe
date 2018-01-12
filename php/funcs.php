<?php



function getTitle($np)
{
  $ret="";
  if ($np==1){$ret = "Pipeline";}
  else if ($np==2){$ret = "Project";}
  else if ($np==3){$ret = "Run";}
//  else if ($np==3){$ret = "Pipelines";}
//  else if ($np==4){$ret = "New params";}
//  else if ($np==5){$ret = "New pipelines";}
  return $ret; 
}

function getPage($np, $login, $id)
{
  if ($np==1 && $login==1){include("php/pipeline.php"); }
  else if ($np==2 && $login==1 && empty($id)){include("php/projects.php");}
  else if ($np==2 && $login==1 && !empty($id)){include("php/projectsDetail.php");}
  else if ($np==3 && $login==1 && !empty($id)){include("php/runpipeline.php");}
//  else if ($np==3){include("php/pipelines.php");}
//  else if ($np==4){include("php/newparams.php");}
//  else if ($np==5){include("php/pipeline3.php");}
  else {include("php/public.php");}
}

function getJS($np, $login, $id)
{
  $js = "<script src=\"js/jsfuncs.js\"></script>";
    
  if ($np==1 && $login==1){$js .= "<script src=\"//d3js.org/d3.v3.min.js\" charset=\"utf-8\"></script> 
  <script src=\"./dist/ace/ace.js\" type=\"text/javascript\" charset=\"utf-8\"></script>
  <script src=\"js/pipelineModal.js\"></script>
  <script src=\"js/pipelineD3.js\"></script>
  <script src=\"//cdn.datatables.net/select/1.2.4/js/dataTables.select.min.js\" charset=\"utf-8\"></script>
  <script type=\"text/javascript\" src=\"./dist/js/dataTables.checkboxes.js\"></script>";}
  else if ($np==2 && $login==1 && empty($id)){$js .= "<script src=\"js/projects.js\"></script>"; }
  else if ($np==2 && $login==1 && !empty($id)){$js .= "<script src=\"js/projectsDetail.js\"></script><script src=\"//cdn.datatables.net/select/1.2.4/js/dataTables.select.min.js\" charset=\"utf-8\"></script>
  <script type=\"text/javascript\" src=\"./dist/js/dataTables.checkboxes.js\"></script>"; }
  else if ($np==3 && $login==1 && !empty($id)){$js .= "<script src=\"//d3js.org/d3.v3.min.js\" charset=\"utf-8\"></script> 
  <script src=\"js/runpipeline.js\"></script>
  <script src=\"//cdn.datatables.net/select/1.2.4/js/dataTables.select.min.js\" charset=\"utf-8\"></script>
  <script type=\"text/javascript\" src=\"./dist/js/dataTables.checkboxes.js\"></script>";}
    
//  else if ($np==3){
//      $js .= "   <script src=\"js/cytoscape.min.js\"></script>
//            <script src=\"js/cytoscape-cxtmenu.js\"></script>
//            <script src=\"js/cytoscape-panzoom.js\"></script>
//            <script src=\"js/FileSaver.js\"></script>
//            <script src=\"https://cdn.rawgit.com/cpettitt/dagre/v0.7.4/dist/dagre.min.js\"></script>
//            <script src=\"https://cdn.rawgit.com/cytoscape/cytoscape.js-dagre/1.5.0/cytoscape-dagre.js\"></script>
//            <script src=\"js/pipeline.js\"></script>";
//  }else{
//  }
  return $js;
}


?>
