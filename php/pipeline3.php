<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
<script src="//d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script src="https://cdn.datatables.net/1.10.13/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.10.13/js/dataTables.bootstrap.min.js"></script>
<script src="./dist/ace/ace.js" type="text/javascript" charset="utf-8"></script>

<script src="js/jsfuncs.js"></script>
<script src="js/process.js"></script>

<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<style type="text/css" media="screen">
    #editor { 
        height: 300px;
    }
</style>
<style>
.nodisp {display:block}

</style>
    <div class="container">
      <div class="row">
        <div class="col-md-1">
          <button type="button" class="btn btn-default btn-success" data-toggle="modal"  name="button" data-target="#addProcessModal" data-backdrop="false" style="width: auto; margin-top:15px;"><a data-toggle="tooltip" data-placement="bottom" title="Add Process"><i class="glyphicon glyphicon-plus"></i></a></button>
        </div>
        <div class="col-md-2"></div>
		<div class="col-md-2"></div>
		<div class="col-md-2">
			  <input id = "saveNameInput" class="form-control" type="text" name="saveNameInput" onkeyup="saveReady()" style="width: 100%; margin-top:15px;" placeholder="Enter Name For Save">
		</div>
		<div class="col-md-2">
			<select id = "pipelines" class ="btn btn-default form-control" name = "pipelines" style="width: 100%; margin-top:15px;"></select>
		 </div>
		<div class="col-md-2">
		    <button type="submit" class="btn btn-default btn-success" name="openButton" onclick="openPipeline()" style="width: auto; margin-top:15px;"><i class="glyphicon glyphicon-refresh"></i></button>
            <button id = "saveButton" type="submit" class="btn btn-default btn-danger" name="button" onclick="save()" style="width: auto; margin-top:15px;"><i class="glyphicon glyphicon-ok"></i></button>
            <button type="button" class="btn btn-default btn-info" name="button" onclick="download('nextflow.nf',createNextflowFile())" style="width: auto; margin-top:15px;"><i class="glyphicon glyphicon-save"></i></button>
	    </div>
		</div>
    </div>

<!-- Add Process Modal -->
<div id="addProcessModal" class="modal fade " tabindex="-1" role="dialog">
    <div class="modal-dialog" style="width:800px;" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="processmodaltitle">Add Process</h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal">
                    <div class="form-group" style="display:none">
                        <label for="mID" class="col-sm-2 control-label">ID</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="mID" name="id">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mName" class="col-sm-2 control-label">Name</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="mName" name="name">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mVersion" class="col-sm-2 control-label">Version</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="mVersion" name="version">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mProcessGroup" class="col-sm-2 control-label">Group</label>
                        <div class="col-sm-5">
                            <select id="mProcessGroup" class="fbtn btn-default form-control"  name="process_group_id"></select>
                        </div>
                    </div>
                    
                    <div id="inputGroup" class="form-group">
                        <label for="mInputs-1" class="col-sm-2 control-label">Inputs</label>
                        <div id="mInputs" class="col-sm-5">
                            <select id="mInputs-1" num = "1" class="fbtn btn-default form-control"  prev ="-1"  name="mInputs-1"></select>
                        </div>
                        <div id="mInName" class="col-sm-5" style=" width: auto; padding-left: 0; padding-right: 0;">    
                            <input type="text" style="display:none;" placeholder="Enter name" class="form-control" id="mInName-0" name="mInName-0">
                        </div>
                        <div id="mInNamedel" class="col-sm-1" style="padding-left: 0;">   
                            <button type="submit" style="display:none;" class="btn btn-default form-control" id="mInNamedel-0" name="mInNamedel-0"  ><i class="glyphicon glyphicon-remove"></i></button>
                        </div>
                    </div>                    
                    
                    <div id="outputGroup" class="form-group">
                        <label for="mOutput-1" class="col-sm-2 control-label">Outputs</label>
                        <div id="mOutputs" class="col-sm-5">
                            <select id="mOutputs-1" num = "1" class="fbtn btn-default form-control"  prev ="-1"  name="mOutputs-1"></select>
                        </div>
                        <div id="mOutName" class="col-sm-5" style=" width: auto; padding-left: 0; padding-right: 0;">    
                            <input type="text" style="display:none;" placeholder="Enter name" class="form-control" id="mOutName-0" name="mOutName-0">
                        </div>
                        <div id="mOutNamedel" class="col-sm-1" style="padding-left: 0;">   
                            <button type="submit" style="display:none;" class="btn btn-default form-control" id="mOutNamedel-0" name="mOutNamedel-0"  ><i class="glyphicon glyphicon-remove"></i></button>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="mScript" class="col-sm-2 control-label">Script</label>
                        <div id ="editordiv" class="col-sm-10">
                            <div id="editor"> script:
  if ( end == "pair" ) {
      """
      tophat2 -o . genome.index $reads 
      mv accepted_hits.bam ${name}.bam
      mv unmapped.bam ${name}_unmapped.bam
      """
} 
    else if  ( end == "single" ){
      """
      tophat2 -o . genome.index $reads
      mv accepted_hits.bam ${name}.bam
      mv unmapped.bam ${name}_unmapped.bam
      """
} </div>
                    </div>
</div>
                    
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="saveprocess" data-clickedrow="">Save changes</button>
            </div>
        </div>
    </div>
</div>
<!-- Add Process Modal Ends-->



	
	<div id="id01" class="w3-modal">
	<div class="w3-modal-content w3-card-4 w3-animate-zoom">
	 <header class="w3-container w3-blue"> 
	  <span onclick="document.getElementById('id01').style.display='none'" 
	  class="w3-button w3-green w3-xlarge w3-display-topright">&times;</span>
	  <h2>Process</h2>
	 </header>
   
	 <div class="w3-bar w3-border-bottom">
	  <button class="tablink w3-bar-item w3-button" onclick="openPage(event, 'process')">Process</button>
	  <button class="tablink w3-bar-item w3-button" onclick="openPage(event, 'inputs')">Inputs</button>
	  <button class="tablink w3-bar-item w3-button" onclick="openPage(event, 'outputs')">Outputs</button>
	 </div>
   
	 <div id="process" class="w3-container nodisp">
	  <h1 id="process_name"></h1>
	  <div id="process_summary"></div>
	  <div id="process_script"></div>
	 </div>

	 <div id="inputs" class="w3-container nodisp">
		  <div class="panel panel-default" id="pinputpanel">
                        <div class="panel-body">
                            <h4>Input List</h4>
                            <table id="pinputtable" class="table table-striped" cellspacing="0" width="100%">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Process Name</th>
                                        <th>Version</th>
                                        <th>Type</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Process Name</th>
                                        <th>Version</th>
                                        <th>Type</th>
                                        <th>Delete</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
	 </div>
   
	 <div id="outputs" class="w3-container nodisp">
				  <div class="panel-body">
                            <h4>Output List</h4>
                            <table id="poutputtable" class="table table-striped" cellspacing="0" width="100%">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Process Name</th>
                                        <th>Version</th>
                                        <th>Type</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tfoot>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Process Name</th>
                                        <th>Version</th>
                                        <th>Type</th>
                                        <th>Delete</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
	 </div>
   
	 <div class="w3-container w3-light-grey w3-padding">
	  <button class="w3-btn w3-right w3-white w3-border" 
	  onclick="document.getElementById('id01').style.display='none'">Close</button>
	 </div>
	</div>
   </div>
<div id="container" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
<script src="js/pipeline.js"></script>
<script src="js/process2.js"></script>
<script>
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/tomorrow");
    editor.getSession().setMode("ace/mode/groovy");
</script>
