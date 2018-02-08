<section class="content" style="max-width: 1500px; ">
    <h2 class="page-header">User Profile</h2>
    <div class="row">

        <div class="col-md-12">
            <div class="nav-tabs-custom">
                <ul class="nav nav-tabs">
                    <li class="active"><a href="#runEnvDiv" data-toggle="tab" aria-expanded="true">Run Environments</a></li>
                    <li class=""><a href="#groups" data-toggle="tab" aria-expanded="false">Groups</a></li>

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
                    <div class="tab-pane" id="groups">

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
    <div class="modal-dialog modal-lg" role="document">
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
                                  <option value="cluster">Remote Machine</option>
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
                            <p style="font-size:13px;"><b style="color:blue;">* Important Information:</b> Private key will be used for submiting jobs in the cluster. Therefore, public key of the private key required to be added into '~/.ssh/authorized_keys' in the cluster by user </p>
                        </div>
                    </div>
                    <div id="mPriKeyAmzDiv" class="form-group" style="display:none">
                        <label for="mPriKeyAmz" class="col-sm-3 control-label">Private Key</label>
                        <div class="col-sm-9">
                            <textarea type="text" rows="5" class="form-control" id="mPriKeyAmz" name="prikey_amz"></textarea>
                        </div>
                    </div>
                    <div id="mPubKeyDiv" class="form-group" style="display:none">
                        <label for="mPubKey" class="col-sm-3 control-label">Public Key</label>
                        <div class="col-sm-9">
                            <textarea type="text" rows="5" class="form-control" id="mPubKey" name="pubkey"></textarea>
                        </div>
                    </div>
                    <div id="mEnvAmzDefRegDiv" class="form-group" style="display:none">
                        <label for="mEnvAmzDefReg" class="col-sm-3 control-label">Default Region</label>
                        <div class="col-sm-9">
                            <select id="mEnvAmzDefReg" class="fbtn btn-default form-control" name="amz_def_reg">
                                  <option value="us-east-2">US East (Ohio) (us-east-2) </option>
                                  <option value="us-east-1">US East (N. Virginia) (us-east-1)</option>
                                  <option value="us-west-1">US West (N. California) (us-west-1)</option>
                                  <option value="us-west-2">US West (Oregon) (us-west-2)</option>
                                  <option value="ap-northeast-1">Asia Pacific (Tokyo) (ap-northeast-1)</option>
                                  <option value="ap-northeast-2">Asia Pacific (Seoul) (ap-northeast-2)</option>
                                  <option value="ap-south-1">Asia Pacific (Mumbai) (ap-south-1)</option>
                                  <option value="ap-southeast-1">Asia Pacific (Singapore) (ap-southeast-1)</option>
                                  <option value="ap-southeast-2">Asia Pacific (Sydney) (ap-southeast-2)</option>
                                  <option value="ca-central-1">Canada (Central) (ca-central-1)</option>
                                  <option value="cn-north-1">China (Beijing) (cn-north-1)</option>
                                  <option value="cn-northwest-1">China (Ningxia) (cn-northwest-1)</option>
                                  <option value="eu-central-1">EU (Frankfurt) (eu-central-1)</option>
                                  <option value="eu-west-1">EU (Ireland) (eu-west-1)</option>
                                  <option value="eu-west-2">EU (London) (eu-west-2)</option>
                                  <option value="eu-west-3">EU (Paris) (eu-west-3)</option>
                                  <option value="sa-east-1">South America (Sao Paulo) (sa-east-1)</option>
                                  </select>
                        </div>
                    </div>
                    <div id="mEnvAmzAccKeyDiv" class="form-group" style="display:none">
                        <label for="mEnvAmzAccKey" class="col-sm-3 control-label">Access Key</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="mEnvAmzAccKey" name="amz_acc_key">
                        </div>
                    </div>
                    <div id="mEnvAmzSucKeyDiv" class="form-group" style="display:none">
                        <label for="mEnvAmzSucKey" class="col-sm-3 control-label">Secret Key</label>
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
                    <div id="mSubnetIdDiv" class="form-group" style="display:none">
                        <label for="mSubnetId" class="col-sm-3 control-label">Subnet Id</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="mSubnetId" name="subnet_id">
                        </div>
                    </div>
                    <div id="mSharedStorageIdDiv" class="form-group" style="display:none">
                        <label for="mSharedStorageId" class="col-sm-3 control-label">Shared Storage Id</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="mSharedStorageId" name="shared_storage_id">
                        </div>
                    </div>
                    <div id="mSharedStorageMountDiv" class="form-group" style="display:none">
                        <label for="mSharedStorageMount" class="col-sm-3 control-label">Shared Storage Mount</label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="mSharedStorageMount" value="/mnt/efs" name="shared_storage_mnt">
                        </div>
                    </div>
                    <div id="mEnvCmdDiv" class="form-group" style="display:none">
                        <label for="mEnvCmd" class="col-sm-3 control-label">Run command
                        <span><a data-toggle="tooltip" data-placement="bottom" title="You may run the command or commands (by seperating each command with && sign) before the nextflow job starts. (eg. source /etc/bashrc && module load java/1.8.0_31)"><i class='glyphicon glyphicon-info-sign'></i></a></span>
                        </label>
                        <div class="col-sm-9">
                            <textarea type="text" rows="2" class="form-control" id="mEnvCmd" name="cmd"></textarea>
                        </div>
                    </div>
                    <div id="mEnvNextPathDiv" class="form-group" style="display:none">
                        <label for="mEnvNextPath" class="col-sm-3 control-label">Nextflow Path
                        <span><a data-toggle="tooltip" data-placement="bottom" title="Please enter the path of the nextflow, if it is not added to $PATH environment. (eg. /project/umw_biocore/bin for ghpcc06.umassrc.org)"><i class='glyphicon glyphicon-info-sign'></i></a></span>
                        </label>
                        <div class="col-sm-9">
                            <input type="text" class="form-control" id="mEnvNextPath" name="next_path">
                        </div>
                    </div>
                    <div id="mExecDiv" class="form-group" style="display:none">
                        <label for="mExec" class="col-sm-3 control-label">Executor of Nextflow</label>
                        <div class="col-sm-9">
                            <select style=" width:150px" id="mExec" class="fbtn btn-default form-control" name="executor">
<!--                                  <option value="none">None </option>-->
                                  <option class="hideClu" value="local">Local</option>
                                  <option value="sge">SGE</option>
                                  <option value="lsf">LSF</option>
                                  <option value="slurm">SLURM</option>
<!--                                  <option value="pbs">PBS/Torque</option>-->
<!--                                  <option value="nqsii">NQSII</option>-->
<!--                                  <option value="condor">HTCondor</option>-->
<!--                                  <option value="ignite">Ignite</option>-->
<!--                                  <option value="k8s">Kubernetes</option>-->
<!--                                  <option value="awsbatch">AWS Batch</option>-->
                                </select>
                        </div>
                    </div>
                    <div id="execNextDiv" class="form-group" style="display:none">
                        <label for="execNext" class="col-sm-3 control-label">Executor Settings for Nextflow</label>
                        <div id="execNextSett" class="col-sm-9">
                            <div class="panel panel-default">
                                <table id="execNextSettTable" class="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Queue</th>
                                            <th scope="col">Memory</th>
                                            <th scope="col">CPUs</th>
                                            <th scope="col">Time(min.)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><input id="next_queue" name="next_queue" class="form-control" type="text" value="short"></td>
                                            <td><input id="next_memory" class="form-control" type="text" name="next_memory" value="32024"></td>
                                            <td><input id="next_cpu" name="next_cpu" class="form-control" type="text" value="1"></td>
                                            <td><input id="next_time" name="next_time" class="form-control" type="text" value="100"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div id="mExecJobDiv" class="form-group" style="display:none">
                        <label for="mExecJob" class="col-sm-3 control-label">Executor of Nextflow Jobs</label>
                        <div class="col-sm-9">
                            <select style=" width:150px" id="mExecJob" class="fbtn btn-default form-control" name="executor_job">
<!--                                  <option value="none">None </option>-->
                                  <option value="local">Local</option>
                                  <option value="sge">SGE</option>
                                  <option value="lsf">LSF</option>
                                  <option value="slurm">SLURM</option>
<!--                                  <option value="pbs">PBS/Torque</option>-->
<!--                                  <option value="nqsii">NQSII</option>-->
<!--                                  <option value="condor">HTCondor</option>-->
<!--                                  <option value="ignite">Ignite</option>-->
<!--                                  <option value="k8s">Kubernetes</option>-->
<!--                                  <option value="awsbatch">AWS Batch</option>-->
                                </select>
                        </div>
                    </div>
                    <div id="execJobSetDiv" class="form-group" style="display:none">
                        <label for="execJobSet" class="col-sm-3 control-label">Executor Settings for Nextflow Jobs</label>
                        <div id="execJobSet" class="col-sm-9">
                            <div class="panel panel-default">
                                <table id="execJobSetTable" class="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Queue</th>
                                            <th scope="col">Memory</th>
                                            <th scope="col">CPUs</th>
                                            <th scope="col">Time(min.)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><input id="job_queue" name="job_queue" class="form-control" type="text" value="short"></td>
                                            <td><input id="job_memory" class="form-control" type="text" name="job_memory" value="32024"></td>
                                            <td><input id="job_cpu" name="job_cpu" class="form-control" type="text" value="1"></td>
                                            <td><input id="job_time" name="job_time" class="form-control" type="text" value="100"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
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