<!--<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>-->
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
    .nodisp {
        display: block
    }
</style>



<div style="padding-left:16px; padding-right:16px; padding-bottom:20px;" id="desPipeline">
    <div class="row" id="creatorInfo" style="font-size:12px;"> Created by admin on Jan. 26, 2016 04:12 • Last edited by admin on Feb. 8, 2017 12:15</div>
    </br>
    <div class="row" id="desTitle"><b>Description</b></div>
    </br>
    <div class="row"><textarea placeholder="Enter pipeline description here.." rows="3" style="min-width: 100%; border-color:lightgrey;"></textarea></div>

</div>




<div class="panel panel-default">
    <div id="container" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
</div>
</br>

<div id="workDetails">
    <h4>Process Details</h4>
    <ul id="inOutNav" class="nav nav-tabs   nav-justified">
        <li class="active "><a class="nav-item" data-toggle="tab" href="#inputsTab">Inputs</a></li>
        <li><a class="nav-item" data-toggle="tab" href="#outputsTab">Outputs</a></li>
    </ul>
    <div class="panel panel-default">

        <div class="tab-content">
            <div id="inputsTab" class="tab-pane fade in active">
                </br>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Identifier</th>
                            <th scope="col">File Type</th>
                            <th scope="col">Qualifier</th>
                            <th scope="col">Upload File</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                            <td> <button class="browse btn btn-default " type="button"><i class="glyphicon glyphicon-search"></i> Browse</button></td>
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                            <td> <button class="browse btn btn-default " type="button"><i class="glyphicon glyphicon-search"></i> Browse</button></td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>Larry</td>
                            <td>the Bird</td>
                            <td>@twitter</td>
                            <td> <button class="browse btn btn-default" type="button"><i class="glyphicon glyphicon-search"></i> Browse</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div id="outputsTab" class="tab-pane fade">
                </br>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Identifier</th>
                            <th scope="col">File Type</th>
                            <th scope="col">Qualifier</th>
                            <th scope="col">Upload File</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                            <td><button class="browse btn btn-default" type="button"><i class="glyphicon glyphicon-search"></i> Browse</button></td>
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            <td>'genome.index*'</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                            <td><button class="browse btn btn-default" type="button"><i class="glyphicon glyphicon-search"></i> Browse</button></td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>Larry</td>
                            <td>the Bird</td>
                            <td>@twitter</td>
                            <td><button class="browse btn btn-default" type="button"><i class="glyphicon glyphicon-search"></i> Browse</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</div>

<!-- Add Process Modal -->
<div id="addProcessModal" style="overflow-y:scroll;" class="modal fade " tabindex="-1" role="dialog">
    <div class="modal-dialog" style="width:800px;" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close dismissprocess" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
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
                    <div id="versionGroup" class="form-group">
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
                            <select id="mParamAllIn" class="fbtn btn-default form-control" name="ParamAll" style="display:none;"></select>
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
                            <select id="mInputs-1" num="1" class="fbtn btn-default form-control" prev="-1" name="mInputs-1"></select>
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
                            <select id="mOutputs-1" num="1" class="fbtn btn-default form-control" prev="-1" name="mOutputs-1"></select>
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
                <button type="button" class="btn btn-danger" style="display:none" id="deleteProcess" data-toggle="modal" data-target="#confirmModal" data-backdrop="false">Delete Process</button>
                <button type="button" class="btn btn-default dismissprocess" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="saveprocess">Save changes</button>
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
                    <div class="form-group">
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
<!--Confirm Modal-->
<!--
<div id="confirmModal" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-body">
        Are you sure?
    </div>
    <div class="modal-footer">
        <button type="button" data-dismiss="modal" class="btn btn-primary" id="delete">Delete</button>
        <button type="button" data-dismiss="modal" class="btn">Cancel</button>
    </div>
</div>
-->

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
                <button type="button" class="btn" data-dismiss="modal" id="cancelButton">Cancel</button>
            </div>
        </div>
    </div>
</div>



<!--Confirm Modal Ends-->


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





<script src="js/pipeline.js"></script>
<script src="js/process2.js"></script>
