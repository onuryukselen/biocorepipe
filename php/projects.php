<div class="panel panel-default" id="projecttablepanel">
    <div class="panel-heading clearfix">
        <div class="pull-right">
            <button type="button" class="btn btn-primary btn-sm" title="Add Project" id="addproject" data-toggle="modal" data-target="#projectmodal">Add Project</button>
        </div>
        <div class="pull-left">
            <h1 class="panel-title">Projects Table</h1>
        </div>
    </div>

    <div class="panel-body">
        <table id="projecttable" class="table table-striped table-bordered" cellspacing="0" width="100%">
            <thead>
                <tr>
                    <th>Project Name</th>
                    <th>Owner</th>
                    <th>Created on</th>
                    <th>Edit/Delete</th>
                </tr>
            </thead>
            <tfoot>
                <tr>
                    <th>Project Name</th>
                    <th>Owner</th>
                    <th>Created on</th>
                    <th>Edit/Delete</th>
                </tr>
            </tfoot>
        </table>
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