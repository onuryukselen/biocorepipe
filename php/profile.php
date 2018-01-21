<section class="content" style="max-width: 1500px; ">
    <h2 class="page-header">User Profile</h2>
    <div class="row">

        <div class="col-md-12">
            <div class="nav-tabs-custom">
                <ul class="nav nav-tabs">
                    <li class="active"><a href="#runEnvDiv" data-toggle="tab" aria-expanded="true">Run Environments</a></li>
                    <li class=""><a href="#settings" data-toggle="tab" aria-expanded="false">Settings</a></li>

                </ul>
                <div class="tab-content">
                    <div class="tab-pane active" id="runEnvDiv">
                        <form class="form-horizontal">

                            <div class="panel-heading clearfix">
                                <button class="btn btn-primary" type="button" id="addEnv" data-toggle="modal" href="#profilemodal" style="float:right; vertical-align:middle;">Add environment</button>
                                <h6><b></b></h6>

                            </div>
                            <div class="panel panel-default">
                                <div>
                                    </br>
                                    <table id="profilesTable" class="table">
                                        <thead>
                                            <tr>
                                                <th scope="col">Profile Name</th>
                                                <th scope="col">Type</th>
                                                <th scope="col">Details</th>
                                                <th scope="col">Actions</th>
                                            </tr>
                                            <tr id="noProfile">
                                                <td>No Profile Available</td>
                                            </tr>
                                        </thead>
                                        <tbody></tbody>
                                    </table>
                                </div>
                            </div>
                        </form>
                    </div>
                    <!-- /.tab-pane ends -->

                    <!-- /.tab-pane starts -->
                    <div class="tab-pane" id="settings">

                    </div>
                    <!-- /.tab-pane ends -->
                </div>
                <!-- /.tab-content -->
            </div>
            <!-- /.nav-tabs-custom -->
        </div>

    </div>
</section>




<!-- profilemodal  Starts-->
<div id="profilemodal" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="mAddEnvTitle">Modal title</h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal">
                    <div class="form-group" style="display:none">
                        <label for="mEnvId" class="col-sm-3 control-label">ID</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="mEnvId" name="id">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="mEnvName" class="col-sm-3 control-label">Profile Name</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="mEnvName" name="name">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="chooseEnv" class="col-sm-3 control-label">Type</label>
                        <div class="col-sm-9">
                            <select style="width:150px" id="chooseEnv" class="fbtn btn-default form-control" name="runEnv">
                                  <option value="" disabled selected>Select environment </option>
                                  <option value="local">Local</option>
                                  <option value="cluster">Cluster</option>
                                  <option value="amazon">Amazon</option>
                                </select>
                        </div>
                    </div>
                    <div id="mEnvUsernameDiv" class="form-group" style="display:none">
                        <label for="mEnvUsername" class="col-sm-3 control-label">Username
                        <span><a data-toggle="tooltip" data-placement="bottom" title="username@hostname (eg. us2r@ghpcc06.umassrc.org)"><i class='glyphicon glyphicon-info-sign'></i></a></span>
                        </label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="mEnvUsername" name="username">
                        </div>
                    </div>
                    <div id="mEnvHostnameDiv" class="form-group" style="display:none">
                        <label for="mEnvHostname" class="col-sm-3 control-label">Hostname
                        <span><a data-toggle="tooltip" data-placement="bottom" title="username@hostname (eg. us2r@ghpcc06.umassrc.org)"><i class='glyphicon glyphicon-info-sign'></i></a></span>
                        </label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="mEnvHostname" name="hostname">
                        </div>
                    </div>
                    <div id="mPriKeyCluDiv" class="form-group" style="display:none">
                        <label for="mPriKeyClu" class="col-sm-3 control-label">Private Key
                        <span><a data-toggle="tooltip" data-placement="bottom" title="Key to be added into '~/.ssh/authorized_keys' file in the cluster"><i class='glyphicon glyphicon-info-sign'></i></a></span>
                        </label>
                        <div class="col-sm-9">
                            <textarea type="text" rows="5" class="form-control" id="mPriKeyClu" name="prikey_clu"></textarea>
                            <p style ="font-size:13px;"><b style ="color:blue;">* Important Information:</b> Private key will be used for submiting jobs in the cluster. Therefore, public key of the private key required to be added into '~/.ssh/authorized_keys' in the cluster by user </p>
                        </div>
                    </div>
                    <div id="mPriKeyAmzDiv" class="form-group" style="display:none">
                        <label for="mPriKeyAmz" class="col-sm-3 control-label">Private Key</label>
                        <div class="col-sm-9">
                            <textarea type="text" rows="5" class="form-control" id="mPriKeyAmz" name="prikey_amz"></textarea>
                        </div>
                    </div>
                    <div id="mPubKeyDiv" class="form-group" style="display:none">
                        <label for="mPriKey" class="col-sm-3 control-label">Public Key</label>
                        <div class="col-sm-9">
                            <textarea type="text" rows="5" class="form-control" id="mPriKey" name="prikey"></textarea>
                        </div>
                    </div>
                    <div id="mEnvAmzDefRegDiv" class="form-group" style="display:none">
                        <label for="mEnvAmzDefReg" class="col-sm-3 control-label">Default Region</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="mEnvAmzDefReg" name="amz_def_reg">
                        </div>
                    </div>
                    <div id="mEnvAmzAccKeyDiv" class="form-group" style="display:none">
                        <label for="mEnvAmzAccKey" class="col-sm-3 control-label">Access Key</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="mEnvAmzAccKey" name="amz_acc_key">
                        </div>
                    </div>
                    <div id="mEnvAmzSucKeyDiv" class="form-group" style="display:none">
                        <label for="mEnvAmzSucKey" class="col-sm-3 control-label">Success Key</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="mEnvAmzSucKey" name="amz_suc_key">
                        </div>
                    </div>
                    <div id="mEnvInsTypeDiv" class="form-group" style="display:none">
                        <label for="mEnvInsType" class="col-sm-3 control-label">Instance Type</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="mEnvInsType" name="ins_type">
                        </div>
                    </div>
                    <div id="mEnvImageIdDiv" class="form-group" style="display:none">
                        <label for="mEnvImageId" class="col-sm-3 control-label">Image Id</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="mEnvImageId" name="image_id">
                        </div>
                    </div>
                    <div id="mEnvNextPathDiv" class="form-group" style="display:none">
                        <label for="mEnvNextPath" class="col-sm-3 control-label">Nextflow Path
                        <span><a data-toggle="tooltip" data-placement="bottom" title="Please enter the path of the nextflow, if it is not added to $PATH environment"><i class='glyphicon glyphicon-info-sign'></i></a></span>
                        </label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="mEnvNextPath" name="next_path">
                        </div>
                    </div>
                    <div id="mExecDiv" class="form-group" style="display:none">
                        <label for="mExec" class="col-sm-3 control-label">Executor</label>
                        <div class="col-sm-9">
                            <select style=" width:150px" id="mExec" class="fbtn btn-default form-control" name="executor">
                                  <option value="none">None </option>
                                  <option value="local">Local</option>
                                  <option value="sge">SGE</option>
                                  <option value="lsf">LSF</option>
                                  <option value="slurm">SLURM</option>
                                  <option value="pbs">PBS/Torque</option>
                                  <option value="nqsii">NQSII</option>
                                  <option value="condor">HTCondor</option>
                                  <option value="ignite">Ignite</option>
                                  <option value="k8s">Kubernetes</option>
                                  <option value="awsbatch">AWS Batch</option>
                                </select>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="saveEnv" data-clickedrow="">Save changes</button>
            </div>
        </div>
    </div>
</div>
<!-- profilemodal Ends-->