<style type="text/css" media="screen">
    #editor {
        height: 300px;
    }
</style>
<style>
    .nodisp {
        display: block
    }
</style>

<div class="box-header" style=" padding-top:0px; font-size:large; ">
    <div style=" border-bottom:1px solid lightgrey;">
        <i class="fa fa-spinner " style="margin-left:0px; margin-right:0px;"></i> Pipeline:
        <input class="box-dynamic width-dynamic" type="text" pipelineid="<?php echo $id;?>" name="pipelineTitle" autocomplete="off" placeholder="Enter Pipeline Name" style="margin-left:0px; font-size: large; font-style:italic; align-self:center; max-width: 500px;" title="Rename" data-placement="bottom" data-toggle="tooltip" num="" id="pipeline-title"><span class="width-dynamic" style="display:none"></span></input>
        <button type="submit" id="savePipeline" class="btn" name="button" data-backdrop="false" onclick="save()" style=" margin:0px; padding:0px;">
                    <a data-toggle="tooltip" data-placement="bottom" data-original-title="Save Pipeline">
                        <i class="fa fa-save" style="font-size: 17px;"></i></a></button>
        <button type="submit" id="dupPipeline" class="btn" name="button" data-backdrop="false" onclick="duplicatePipeline()" style=" margin:0px; padding:0px;">
                    <a data-toggle="tooltip" data-placement="bottom" data-original-title="Duplicate Pipeline">
                        <i class="fa fa-copy" style="font-size: 16px;"></i></a></button>
        <button type="button" id="downPipeline" class="btn" name="button" onclick="download(createNextflowFile(&quot;pipeline&quot;))" data-backdrop="false" style=" margin:0px; padding:0px;">
                    <a data-toggle="tooltip" data-placement="bottom"  data-original-title="Download Pipeline">
                        <i class="glyphicon glyphicon-save"></i></a></button>
        <button type="button" id="delPipeline" class="btn" name="button" data-toggle="modal" data-backdrop="false" data-target="#confirmModal" style=" margin:0px; padding:0px;">
                    <a data-toggle="tooltip" data-placement="bottom" data-original-title="Delete Pipeline">
                        <i class="glyphicon glyphicon-trash"></i></a></button>
        <span id="autosaveDiv">
            <span id="autosave" style="font-color:#C5C5C5; font-size:15px;"></span>
        </span>

        <div id="pipeActionsDiv" style="float:right; margin-right:5px;" class="dropdown">
            <button class="btn btn-default dropdown-toggle" type="button" id="pipeActions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" style="vertical-align:middle;"><div class="fa fa-ellipsis-h"></div></button>
            <ul class="dropdown-menu dropdown-menu-right" role="menu" aria-labelledby="dropdownMenu2">
                <li><a id="deletePipeRevision" data-toggle="modal" href="#confirmModal">Delete Revision</a></li>
            </ul>
        </div>
        <div id="pipeRunDiv" style="float:right; margin-right:5px;" class="btn-group">
            <button class="btn btn-success"  type="button" id="pipeRun" data-toggle="modal" href="#mRun" style="vertical-align:middle;">Run</button>
            <button type="button" class="btn btn-success dropdown-toggle" data-toggle="dropdown" aria-expanded="true">
                    <span class="caret"></span>
                    <span class="sr-only">Toggle Dropdown</span>
                  </button>
                  <ul class="dropdown-menu" role="menu">
                    <li><a href="#">Existing Runs</a></li>
                  </ul>
        </div>
 

        <div id="pipeRevSpan" style="margin-right:5px; width:110px; float:right;">
            <select id="pipeRev" class="fbtn btn-default form-control mPipeChange" prev="-1" name="pipeline_rev_id"></select>
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



<div class="panel panel-default">
    <div style="height:500px;" id="container" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
</div>
</br>

<div id="workDetails">
    <div>
        <h4>Pipeline Details</h4>
        </br>
    </div>
    <ul id="inOutNav" class="nav nav-tabs nav-justified">
        <li class="active"><a class="nav-item" data-toggle="tab" href="#processTab">Processes</a></li>
        <li><a class="nav-item" data-toggle="tab" href="#inputsTab">Inputs</a></li>
        <li><a class="nav-item" data-toggle="tab" href="#outputsTab">Outputs</a></li>
    </ul>
    <div class="panel panel-default">

        <div id="pipeContent" class="tab-content">
            <div id="processTab" class="tab-pane fade in active">
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

            <div id="inputsTab" class="tab-pane fade ">
                </br>
                <table id="inputsTable" class="table">
                    <thead>
                        <tr>
                            <th scope="col">Given Name</th>
                            <th scope="col">Identifier</th>
                            <th scope="col">File Type</th>
                            <th scope="col">Qualifier</th>
                            <th scope="col">Process Name</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>



            <div id="outputsTab" class="tab-pane fade">
                </br>
                <table id="outputsTable" class="table">
                    <thead>
                        <tr>
                            <th scope="col">Given Name</th>
                            <th scope="col">Identifier</th>
                            <th scope="col">File Type</th>
                            <th scope="col">Qualifier</th>
                            <th scope="col">Process Name</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    </div>

</div>

<!-- Add Process Modal -->
<div id="addProcessModal" style="overflow-y:scroll;" class="modal fade " tabindex="-1" role="dialog">
    <div class="modal-dialog" style="width:800px;" role="document">
        <div class="modal-content">
            <span id="addHeader"></span>
            <div id="revModalHeader" class="modal-header">
                <button style="padding-top:6px;" type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <div id="mProActionsDiv" style="float:right; margin-right:15px; display:none;" class="dropdown">
                    <button class="btn btn-default dropdown-toggle" type="button" id="mProActions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" style="vertical-align:middle;"><span class="fa fa-ellipsis-h"></span></button>
                    <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
                        <li><a id="deleteRevision" data-toggle="modal" href="#confirmModal">Delete Revision</a></li>
                    </ul>
                </div>
                <span id="mProRevSpan" style="margin-right:5px; width:130px; float:right; display:none;">
                <select id="mProRev" class="fbtn btn-default form-control mRevChange" prev="-1" name="process_rev_id"></select>
                    </span>
                <h4 class="modal-title" id="processmodaltitle">Title</h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal">
                    <div class="form-group" style="display:none">
                        <label for="mIdPro" class="col-sm-2 control-label">ID</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="mIdPro" name="id">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mName" class="col-sm-2 control-label">Name</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="mName" name="name">
                        </div>
                    </div>
                    <div id="versionGroup" class="form-group" style="display:none">
                        <label for="mVersion" class="col-sm-2 control-label">Version</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="mVersion" name="version">
                        </div>
                    </div>
                    <div id="describeGroup" class="form-group">
                        <label for="mDescription" class="col-sm-2 control-label">Description</label>
                        <div class="col-sm-10">
                            <textarea rows="3" class="form-control" id="mDescription" name="summary"></textarea>
                        </div>
                    </div>
                    <div id="proGroup" class="form-group">
                        <label for="mProcessGroup" class="col-sm-2 control-label">Menu Group</label>
                        <div class="col-sm-5">
                            <select id="mProcessGroup" class="fbtn btn-default form-control" name="process_group_id"></select>
                        </div>
                        <div id="mProcessGroupAdd" class="col-sm-1" style=" width: auto; padding-left: 0; padding-right: 0;">
                            <button type="button" class="btn btn-default form-control" id="groupAdd" data-toggle="modal" data-target="#processGroupModal" data-backdrop="false"><i class="glyphicon glyphicon-plus"></i></button>
                        </div>
                        <div id="mProcessGroupEdit" class="col-sm-1" style=" width: auto; padding-left: 0; padding-right: 0;">
                            <button type="button" class="btn btn-default form-control" id="groupEdit" data-toggle="modal" data-target="#processGroupModal" data-backdrop="false"><i class="fa fa-pencil-square-o"></i></button>
                        </div>
                        <div id="mProcessGroupDel" class="col-sm-1" style=" width: auto; padding-left: 0; padding-right: 0;">
                            <button type="submit" class="btn btn-default form-control" id="groupDel"><i class="fa fa-trash-o"></i></button>
                        </div>
                    </div>
                    <hr id="hrDiv">
                    <div id="mParameters" class="form-group">
                        <label for="mParamAll" class="col-sm-2 control-label">Parameters</label>
                        <div id="mParamAll" class="col-sm-5">
                            <select id="mParamAllIn" class="fbtn btn-default form-control mParChange" name="ParamAll" style="display:none;"></select>
                        </div>
                        <div id="mParamsAdd" class="col-sm-1" style=" width: auto; padding-right: 0;">
                            <button type="button" class="btn btn-default form-control" id="mParamAdd" data-toggle="modal" data-target="#parametermodal" data-backdrop="false"><i class="glyphicon glyphicon-plus"></i></button>
                        </div>
                        <div id="mParamsEdit" class="col-sm-1" style=" width: auto; padding-left: 0; padding-right: 0;">
                            <button type="button" class="btn btn-default form-control" id="mParamEdit" data-toggle="modal" data-target="#parametermodal" data-backdrop="false"><i class="fa fa-pencil-square-o"></i></button>
                        </div>
                        <div id="mParamsDel" class="col-sm-1" style=" width: auto; padding-left: 0; padding-right: 0;">
                            <button type="button" class="btn btn-default form-control" id="mParDel" data-toggle="modal" data-target="#delparametermodal" data-backdrop="false"><i class="fa fa-trash-o"></i></button>
                        </div>
                    </div>
                    <div id="inputGroup" class="form-group">
                        <label for="mInputs-1" class="col-sm-2 control-label">Inputs</label>
                        <div id="mInputs" class="col-sm-5">
                            <select id="mInputs-1" num="1" class="fbtn btn-default form-control mParChange" prev="-1" name="mInputs-1"></select>
                        </div>
                        <div id="mInName" class="col-sm-4 " style="padding-left:0; padding-right:0;">
                            <input type="text" style="display:none; " placeholder="Enter name" class="form-control" ppID="" id="mInName-0" name="mInName-0">
                        </div>
                        <div id="mInNamedel" class="col-sm-1" style="padding-left:0;">
                            <button type="submit" style="display:none;" class="btn btn-default form-control" id="mInNamedel-0" name="mInNamedel-0"><i class="glyphicon glyphicon-remove"></i></button>
                        </div>
                    </div>

                    <div id="outputGroup" class="form-group">
                        <label for="mOutput-1" class="col-sm-2 control-label">Outputs</label>
                        <div id="mOutputs" class="col-sm-5">
                            <select id="mOutputs-1" num="1" class="fbtn btn-default form-control mParChange" prev="-1" name="mOutputs-1"></select>
                        </div>
                        <div id="mOutName" class="col-sm-4" style="padding-left:0; padding-right:0;">
                            <input type="text" style="display:none;" placeholder="Enter name" class="form-control" id="mOutName-0" name="mOutName-0">
                        </div>
                        <div id="mOutNamedel" class="col-sm-1" style="padding-left: 0;">
                            <button type="submit" style="display:none;" class="btn btn-default form-control" id="mOutNamedel-0" name="mOutNamedel-0"><i class="glyphicon glyphicon-remove"></i></button>
                        </div>
                    </div>
                    <hr>
                    <div class="form-group">
                        <label for="mScript" class="col-sm-2 control-label">Script</label>
                        <div id="editordiv" class="col-sm-10">
                            <div id="editor"></div>
                            <div class="row">
                                <p class="col-sm-3" style="padding-top:6px; padding-right:0;">Language Mode:</p>
                                <div class="col-sm-3" style="padding-left:0;">
                                    <select id="modeAce" class="form-control">
                                    <option>groovy</option>
                                    <option>perl</option>
                                    <option>python</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
            <div class="modal-footer">
                <!--                <button type="button" class="btn btn-danger" style="display:none" id="deleteProcess" data-toggle="modal" data-target="#confirmModal" data-backdrop="false">Delete Process</button>-->
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="saveprocess">Save changes</button>
                <button type="button" class="btn btn-primary" style="display:none" id="selectProcess">Select Revision</button>
                <!--               data-backdrop="false" data-toggle="modal" data-target="#mConfirmYesNo"-->

            </div>
        </div>
    </div>
</div>
<!-- Add Process Modal Ends-->

<!-- Add Parameter Modal Starts-->
<div id="parametermodal" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close dismissparameter" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="parametermodaltitle">Modal title</h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal">
                    <div class="form-group" style="display:none">
                        <label for="mIdPar" class="col-sm-2 control-label">ID</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="mIdPar" name="id">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mParamList" class="col-sm-2 control-label">Parameters</label>
                        <div id="mParamsDynamic" class="col-sm-1" style=" display:none; width: auto;  ">
                            <button type="button" class="btn btn-default form-control" id="mParamOpen"><a data-toggle="tooltip" data-placement="bottom" title="" data-original-title="Show Parameters"><i class="fa fa-eye" ></i></a></button>
                        </div>
                        <div id="mParamList" class="col-sm-10" style=" ">
                            <select id="mParamListIn" class="fbtn btn-default form-control" name="ParamAllIn"></select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="mName" class="col-sm-2 control-label">Identifier</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="modalName" name="name">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mQualifier" class="col-sm-2 control-label">Qualifier</label>
                        <div class="col-sm-10">
                            <select class="form-control" id="modalQualifier" name="qualifier">
                                            <option value="file">file</option>
                                            <option value="set">set</option>
                                            <option value="val">val</option>
                                        </select>
                        </div>
                    </div>
                    <div class="form-group" id="mFileTypeDiv">
                        <label for="mFileType" class="col-sm-2 control-label">File Type</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="mFileType" name="file_type">
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default dismissparameter" id="dismissparameter" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="saveparameter" data-clickedrow="">Save changes</button>
            </div>
        </div>
    </div>
</div>
<!-- Add Parameter Modal Ends-->

<!-- Delete Parameter Modal Starts-->
<div id="delparametermodal" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close dismissparameterdel" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Delete Parameter</h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal">
                    <div class="form-group">
                        <label for="mParamList" class="col-sm-2 control-label">Parameters</label>
                        <div id="mParamListDelDiv" class="col-sm-10" style=" ">
                            <select id="mParamListDel" class="fbtn btn-default form-control" name="ParamAllIn"></select>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default dismissparameterdel" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-danger" id="delparameter">Delete Parameter</button>
            </div>
        </div>
    </div>
</div>
<!-- Delete Parameter Modal Ends-->

<!-- Process Group Modal Starts-->
<div id="processGroupModal" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="processGroupmodaltitle">Modal title</h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal">
                    <div class="form-group" style="display:none">
                        <label for="mIdProGroup" class="col-sm-2 control-label">ID</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="mIdProGroup" name="id">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mProGroupName" class="col-sm-2 control-label">Name</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="mGroName" name="group_name">
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="saveProcessGroup" data-clickedrow="">Save changes</button>
            </div>
        </div>
    </div>
</div>
<!-- Process Group Modal Ends-->

<!-- Rename Modal Starts-->
<div id="renameModal" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="renameModaltitle">Modal title</h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal">
                    <div class="form-group" style="display:none">
                        <label for="mRenameID" class="col-sm-2 control-label">ID</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="mRenameID" name="id">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="md3Name" class="col-sm-2 control-label">Name</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="mRenName" name="d3_name">
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="renameProPara" data-clickedrow="">Submit</button>
            </div>
        </div>
    </div>
</div>
<!-- Process Group Modal Ends-->



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

<div id="confirmRevision" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close cancelRev" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="confirmYesNoTitle">Confirm revision</h4>
            </div>
            <div class="modal-body">
                <span id="confirmYesNoText">Text</span>
                </br>
                <form class="form-horizontal">
                    <div class="form-group">
                        <label for="mRevComment" class="col-sm-2 control-label">Comment</label>
                        <div class="col-sm-4">
                            <input type="text" maxlength="20" class="form-control" id="mRevComment" name="rev_comment">
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-warning" style="display:none;" id="saveOnExist">Save on Existing</button>
                <button type="button" class="btn btn-default cancelRev" data-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="saveRev">Save</button>
            </div>
        </div>
    </div>
</div>


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

<!--Run Modal-->

<div id="mRun" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="mRuntitle"> Add Pipeline to Project</h4>
            </div>
            <div class="modal-body">
                <div class="panel panel-default" id="projecttablepanel">
                    <div class="panel-heading clearfix">
                        <div class="pull-right">
                            <button type="button" class="btn btn-primary btn-sm" title="Add Project" id="addproject" data-toggle="modal" data-target="#projectmodal">Create a Project</button>
                        </div>
                        <div class="pull-left">
                            <h5><i class="fa fa-calendar-o " style="margin-left:0px; margin-right:0px;"></i> Select Project</h5>
                        </div>
                    </div>

                    <div class="panel-body">
                        <table id="projecttable" class="table table-striped table-bordered" cellspacing="0" width="100%">
                            <thead>
                                <tr>
                                    <th>Check</th>
                                    <th>Project Name</th>
                                    <th>Owner</th>
                                    <th>Created on</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="selectProject" data-clickedrow="">Select Project</button>
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

<div id="projectmodal" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="projectmodaltitle">Modal title</h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal">
                    <div class="form-group" style="display:none">
                        <label for="mProjectID" class="col-sm-2 control-label">ID</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="mProjectID" name="id">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mProjectName" class="col-sm-2 control-label">Name</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="mProjectName" name="name">
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="saveproject" data-clickedrow="">Save changes</button>
            </div>
        </div>
    </div>
</div>

<!--Run Modal ends-->



<div id="id01" class="w3-modal">
    <div class="w3-modal-content w3-card-4 w3-animate-zoom">
        <header class="w3-container w3-blue">
            <span onclick="document.getElementById('id01').style.display='none'" class="w3-button w3-green w3-xlarge w3-display-topright">&times;</span>
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
            <button class="w3-btn w3-right w3-white w3-border" onclick="document.getElementById('id01').style.display='none'">Close</button>
        </div>
    </div>
</div>