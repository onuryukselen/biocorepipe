<div id="projectHeader" class="box-header" style=" padding-top:0px; font-size:large; ">
    <div style=" border-bottom:1px solid lightgrey;">
        <i class="fa fa-calendar-o " style="margin-left:0px; margin-right:0px;"></i> Project:
        <input class="box-dynamic width-dynamic" type="text" projectid="<?php echo $id;?>" name="projectTitle" autocomplete="off" placeholder="Enter Project Name" style="margin-left:0px; font-size: large; font-style:italic; align-self:center; max-width: 500px;" title="Rename" data-placement="bottom" data-toggle="tooltip" num="" id="project-title"><span class="width-dynamic" style="display:none"></span></input>
        <button type="submit" id="saveProjectIcon" class="btn" name="button" data-backdrop="false" onclick="saveProjectIcon()" style=" margin:0px; padding:0px;">
                    <a data-toggle="tooltip" data-placement="bottom" data-original-title="Save Project">
                        <i class="fa fa-save" style="font-size: 17px;"></i></a></button>
        <!--
        <button type="submit" id="dupProject" class="btn" name="button" data-backdrop="false" onclick="duplicateProject()" style=" margin:0px; padding:0px;">
                    <a data-toggle="tooltip" data-placement="bottom" data-original-title="Duplicate Project">
                        <i class="fa fa-copy" style="font-size: 16px;"></i></a></button>
-->
        <button type="button" id="delProject" class="btn" name="button" data-backdrop="false" onclick="delProject()" style=" margin:0px; padding:0px;">
                    <a data-toggle="tooltip" data-placement="bottom" data-original-title="Delete Project">
                        <i class="glyphicon glyphicon-trash"></i></a></button>
        <div id="projectActDiv" style="float:right; margin-right:5px;" class="dropdown">
            <button class="btn btn-default dropdown-toggle" type="button" id="projectAct" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" style="vertical-align:middle;"><div class="fa fa-ellipsis-h"></div></button>
            <ul class="dropdown-menu dropdown-menu-right" role="menu" aria-labelledby="dropdownMenu4">
                <li><a id="deleteProject" href="javascript:delProject()">Delete Project</a></li>
            </ul>
        </div>
    </div>
</div>

<div style="padding-left:16px; padding-right:16px; padding-bottom:20px;" id="desProject">
    <div class="row" id="creatorProject" style="font-size:12px;"> Created by <span id="ownUserName">admin</span> on <span id="datecreatedPj">Jan. 26, 2016 04:12</span> • Last edited on <span id="lasteditedPj">Feb. 8, 2017 12:15</span></div>
    </br>
    <div class="pull-left">
        <h6 class="row" id="desTitleProject"><b>Description</b> </h6>
    </div>
    </br>
    <div class="row"><textarea id="projectSum" placeholder="Enter project description here.." rows="4" style="min-width: 100%; max-width: 100%; border-color:lightgrey;"></textarea></div>
</div>



<div class="panel panel-default" id="runtablepanel">
    <div class="panel-heading clearfix">
        <div class="pull-right">
            <button type="button" class="btn btn-primary btn-sm" title="Add Project" id="addproject" data-toggle="modal" data-target="#runmodal">Add Pipeline to Run</button>
        </div>
        <div class="pull-left">
            <h5><i class="fa fa-rocket"></i> Project Runs</h5>

        </div>
    </div>
    <div class="panel panel-default">
        <div class="panel-body">
            <table id="runtable" class="table table-striped table-bordered" cellspacing="0" width="100%">
                <thead>
                    <tr>
                        <th>Run Name</th>
                        <th>Pipeline Name</th>
                        <th>Rev</th>
                        <th>Description</th>
                        <th>Owner</th>
                        <th>Modified on</th>
                        <th>Actions</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
</div>
</br>

<div class="panel panel-default" id="filetablepanel">
    <div class="panel-heading clearfix">
        <div class="pull-right">
            <button type="button" class="btn btn-primary btn-sm" title="Add Files" id="addfile" data-toggle="modal" data-target="#fileModal">Add Files to Project</button>
        </div>
        <div class="pull-left">
            <h5><i class="fa fa-folder-open-o"></i> Project Files</h5>

        </div>
    </div>
    <div class="panel panel-default">
        <div class="panel-body">
            <table id="filetable" class="table table-striped table-bordered" cellspacing="0" width="100%">
                <thead>
                    <tr>
                        <th>Files</th>
<!--                        <th>File Extention</th>-->
<!--                        <th>Sample ID</th>-->
                        <th>Actions</th>
                    </tr>
                </thead>
            </table>
        </div>
    </div>
</div>


<div id="runmodal" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="runmodaltitle">Modal title</h4>
            </div>
            <div class="modal-body">
                <div class="panel panel-default">
                    <div class="panel-body">
                        <table id="allpipelinestable" class="table  table-striped table-bordered display" cellspacing="0" width="100%">
                            <thead>
                                <tr>
                                    <th>Check</th>
                                    <th>Pipeline Name</th>
                                    <th>Rev</th>
                                    <th>Description</th>
                                    <th>Owner</th>
                                    <th>Modified On</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="selectPipe" data-clickedrow="">Select Pipelines</button>
            </div>
        </div>
    </div>
</div>

<div id="runNameModal" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="runNameModaltitle">Enter Run Name</h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal">
                    <div class="form-group" style="display:none">
                        <label for="runID" class="col-sm-2 control-label">ID</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="runID" name="id">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="runName" class="col-sm-2 control-label">Name</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="runName" name="name">
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="saveRun" data-clickedrow="">Save run</button>
            </div>
        </div>
    </div>
</div>

<div id="fileModal" class="modal fade" tabindex="-1" role="dialog">
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
                                    <div class="form-group">
                                        <label for="mFilePath" class="col-sm-2 control-label">File Path</label>
                                        <div class="col-sm-10">
                                            <input type="text" class="form-control" id="mFilePath" name="name">
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
                                </br>
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
                <button type="button" class="btn btn-primary" id="savefile" data-clickedrow="">Add Files</button>
            </div>
        </div>
    </div>
</div>




<div id="confirmModal" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Information</h4>
            </div>
            <div class="modal-body">
                <span id="confirmModalText">Text</span>
                </br>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">OK</button>
            </div>
        </div>
    </div>
</div>
