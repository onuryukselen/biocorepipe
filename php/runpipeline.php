<style>
    .nodisp {
        display: block
    }
</style>

<div class="box-header" style=" padding-top:0px; font-size:large; ">
    <div style=" border-bottom:1px solid lightgrey;">
        <i class="fa fa-spinner " style="margin-left:0px; margin-right:0px;"></i> Pipeline:
        <input class="box-dynamic width-dynamic" type="text" projectpipelineid="<?php echo $id;?>" name="pipelineTitle" autocomplete="off" placeholder="Enter Pipeline Name" style="margin-left:0px; font-size: large; font-style:italic; align-self:center; max-width: 500px;" title="Rename" data-placement="bottom" data-toggle="tooltip" num="" id="pipeline-title"><span class="width-dynamic" style="display:none"></span></input>
        <div id="pipeActionsDiv" style="float:right; margin-right:5px;" class="dropdown">
            <button class="btn btn-default dropdown-toggle" type="button" id="pipeActions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" style="vertical-align:middle;"><div class="fa fa-ellipsis-h"></div></button>
            <ul class="dropdown-menu dropdown-menu-right" role="menu" aria-labelledby="dropdownMenu2">
                <li><a id="deleteRun" data-toggle="modal" href="#confirmModal">Delete Run</a></li>
            </ul>
        </div>
        <div id="pipeRunDiv" style="float:right; margin-right:5px;" >
<!--            <button class="btn btn-success" type="submit" id="runProPipe" onclick="runProjectPipe()" style="display:none; vertical-align:middle;">Start</button>-->
            <button class="btn btn-warning" type="submit" id="statusProPipe" onclick="runProjectPipe()" style="vertical-align:middle;" title="Waiting for input files" data-placement="bottom" data-toggle="tooltip">Waiting</button>
        </div>
    </div>
</div>




<div style="padding-left:16px; padding-right:16px; padding-bottom:20px; " id="desPipeline">
    <div class="row" id="creatorInfoPip" style="font-size:12px; display:none;"> Created by <span id="ownUserNamePip">admin</span> on <span id="datecreatedPip">Jan. 26, 2016     04:12</span> • Last edited on <span class="lasteditedPip">Feb. 8, 2017 12:15</span>
    </div>
    </br>
    <div class="row" id="desTitlePip">
        <h6><b>Description</b></h6>
    </div>
    <div class="row"><textarea id="pipelineSum" placeholder="Enter pipeline description here.." rows="3" style="min-width: 100%; max-width: 100%; border-color:lightgrey;"></textarea></div>

</div>

<div id="workDetails">
    <div style="padding-bottom:7px;">
        <h4>Pipeline Files</h4>
    </div>
    <!--
    <ul id="inOutNav" class="nav nav-tabs nav-justified">
        <li class="active"><a class="nav-item" data-toggle="tab" href="#processTab">Processes</a></li>
        <li><a class="nav-item" data-toggle="tab" href="#inputsTab">Inputs</a></li>
        <li><a class="nav-item" data-toggle="tab" href="#outputsTab">Outputs</a></li>
    </ul>
-->
    <div class="panel panel-default" style=" display:none;">
        <div id="processTab">
            </br>
            <table id="processTable" class="table">
                <thead>
                    <tr>
                        <th scope="col">Process Name</th>
                        <th scope="col">Revision</th>
                        <th scope="col">Description</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>

    <div>
        <h6><b>Inputs</b></h6>
    </div>
    <div class="panel panel-default">
        <div id="inputsTab">
            </br>
            <table id="inputsTable" class="table">
                <thead>
                    <tr>
                        <th scope="col">Given Name</th>
                        <th scope="col">Identifier</th>
                        <th scope="col">File Type</th>
                        <th scope="col">Qualifier</th>
                        <th scope="col">Process Name</th>
                        <th style="color:#D59035" scope="col">File Path</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>
    <div>
        <h6><b>Outputs</b></h6>
    </div>

    <div class="panel panel-default">
        <div id="outputsTab">
            </br>
            <table id="outputsTable" class="table">
                <thead>
                    <tr>
                        <th scope="col">Given Name</th>
                        <th scope="col">Identifier</th>
                        <th scope="col">File Type</th>
                        <th scope="col">Qualifier</th>
                        <th scope="col">Process Name</th>
                        <th scope="col">File Path</th>

                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    </div>
</div>
</br>
<div>
    <h4>Workflow</h4>
    <div class="panel panel-default">
        <div style="height:500px;" id="container" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
    </div>
</div>


<!--Confirm Modal-->

<div id="confirmModal" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="confirmModalTitle">Confirm</h4>
            </div>
            <div class="modal-body" id="confirmModalText">Text</div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary delprocess" data-dismiss="modal" id="deleteBtn">Delete</button>
                <button type="button" class="btn btn-default" data-dismiss="modal" id="cancelButton">Cancel</button>
            </div>
        </div>
    </div>
</div>
<!--Confirm Modal Ends-->

<!--Confirm d3 Modal-->
<div id="confirmD3Modal" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="confirmD3ModalTitle">Confirm</h4>
            </div>
            <div class="modal-body" id="confirmD3ModalText">Text</div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary delprocess" data-dismiss="modal" id="deleteD3Btn">Delete</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
            </div>
        </div>
    </div>
</div>
<!--Confirm Modal Ends-->



<div id="warnDelete" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Information</h4>
            </div>
            <div class="modal-body">
                <span id="warnDelText">Text</span>
                </br>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">OK</button>
            </div>
        </div>
    </div>
</div>


<!--Select File modal-->
<div id="inputFilemodal" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="filemodaltitle">Modal title</h4>
            </div>
            <div class="modal-body">
                <div id="fileAddOptions">
                    <ul id="fileNav" class="nav nav-tabs">
                        <li class="active"><a class="nav-item" data-toggle="tab" href="#manualTab">Manually</a></li>
                        <li><a class="nav-item" data-toggle="tab" href="#publicFileTab">Public Files</a></li>
                        <li><a class="nav-item" data-toggle="tab" href="#projectFileTab">Project Files</a></li>
                    </ul>
                    <div class="panel panel-default">
                        <div id="fileContent" class="tab-content">
                            <div id="manualTab" class="tab-pane fade in active">
                                </br>
                                <form style="padding-right:10px;" class="form-horizontal">
                                    <div class="form-group" style="display:none">
                                        <label for="mIdFile" class="col-sm-2 control-label">ID</label>
                                        <div class="col-sm-10">
                                            <input type="text" class="form-control" id="mIdFile" name="id">
                                        </div>
                                    </div>
                                    <div class="form-group" style="display:none">
                                        <label for="mFileName" class="col-sm-2 control-label">File Name</label>
                                        <div class="col-sm-10">
                                            <input type="text" class="form-control" id="mFileName" name="name">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="mFilePath" class="col-sm-2 control-label">File Path</label>
                                        <div class="col-sm-10">
                                            <input type="text" class="form-control" id="mFilePath" name="file_path">
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div id="publicFileTab" class="tab-pane fade ">
                                </br>
                                <table id="publicFileTable" class="table table-striped table-bordered display" cellspacing="0" width="100%">
                                    <thead>
                                        <tr>
                                            <th scope="col">Check</th>
                                            <th scope="col">File Name</th>
                                            <th scope="col">File Type</th>
                                            <th scope="col">Sample ID</th>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>

                            <div id="projectFileTab" class="tab-pane fade">
<!--                                </br>-->
                                <div class="col-sm-3" style="border-right:1px solid lightgrey;">
                                    <table id="projecListTable" class="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">Project Name</th>
                                            </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                                <div class="col-sm-7">
                                    <table id="projectFileTable" class="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">Check</th>
                                                <th scope="col">File Name</th>
                                                <th scope="col">File Type</th>
                                                <th scope="col">Sample ID</th>
                                            </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>

                                </div>
                            </div>

                        </div>
                    </div>

                </div>



            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="selectfile" data-clickedrow="">Select File</button>
            </div>
        </div>
    </div>
</div>