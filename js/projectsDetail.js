    function saveProjectIcon() {
        var data = [];
        var projectSummary = $('#projectSum').val();
        var project_id = $('#project-title').attr('projectid');
        var project_name = $('#project-title').val();
        data.push({ name: "name", value: project_name });
        data.push({ name: "id", value: project_id });
        data.push({ name: "summary", value: projectSummary });
        data.push({ name: "p", value: "saveProject" });

        $.ajax({
            type: "POST",
            url: "ajax/ajaxquery.php",
            data: data,
            async: true,
            success: function (s) {
                loadProjectDetails(project_id);
            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
    }

    function loadProjectDetails(project_id) {
        var getProjectD = [];
        getProjectD.push({ name: "id", value: project_id });
        getProjectD.push({ name: "p", value: 'getProjects' });
        $.ajax({
            type: "POST",
            url: "ajax/ajaxquery.php",
            data: getProjectD,
            async: true,
            success: function (s) {
                $('#project-title').val(s[0].name);
                $('#ownUserName').text(s[0].username);
                $('#projectSum').val(s[0].summary);

                $('#datecreatedPj').text(s[0].date_created);
                $('#lasteditedPj').text(s[0].date_modified);
                resizeForText.call($inputText, s[0].name);
            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
    };

    function delProject() {
        var project_id = $('#project-title').attr('projectid');
        $.ajax({
            type: "POST",
            url: "ajax/ajaxquery.php",
            data: {
                p: "removeProject",
                'id': project_id
            },
            async: true,
            success: function (s) {

            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
        window.location.replace("index.php?np=2");
    }



    $(document).ready(function () {
        var project_id = $('#project-title').attr('projectid');
        loadProjectDetails(project_id);

        var runsTable = $('#runtable').DataTable({
            "scrollY": "500px",
            "scrollCollapse": true,
            "scrollX": true,
            "ajax": {
                url: "ajax/ajaxquery.php",
                data: {
                    "project_id": project_id,
                    "p": "getProjectPipelines"
                },
                "dataSrc": ""
            },
            "columns": [{
                "data": "name",
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).html("<a href='index.php?np=1&id=" + oData.pip_id + "'>" + oData.name + "</a>");
                }
            }, {
                "data": "summary"
            }, {
                "data": "username"
            }, {
                "data": "date_modified"
            }, {
                data: null,
                className: "center",
                defaultContent: getButtonsDef('selectRun', 'Run') + getTableButtons("projectrun", REMOVE)
            }]

        });


        var allpipelinestable = $('#allpipelinestable').DataTable({
            "ajax": {
                url: "ajax/ajaxquery.php",
                data: { "p": "getSavedPipelines" },
                "dataSrc": ""
            },
            "columns": [
                {
                    "data": "id",
                    "checkboxes": {
                        'targets': 0,
                        'selectRow': true
                    }
            },
                {
                    "data": "name",
                    "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                        $(nTd).html("<a href='index.php?np=1&id=" + oData.id + "'>" + oData.name + "</a>");
                    }
            }, {
                    "data": "rev_id"
            }, {
                    "data": "summary"
            }, {
                    "data": "username"
            }, {
                    "data": "date_modified"
            }],
            'select': {
                'style': 'multi'
            },
            'order': [[1, 'asc']]
        });





        $('#runmodal').on('show.bs.modal', function (event) {
            allpipelinestable.column(0).checkboxes.deselect();
            $('#runmodaltitle').html('Select Pipelines to Run');

        });

        $('#runmodal').on('click', '#saverun', function (event) {
            event.preventDefault();
            var rows_selected = allpipelinestable.column(0).checkboxes.selected();
            for (var i = 0; i < rows_selected.length; i++) {
                var data = [];
                var $pipeline_id = rows_selected[i];
                data.push({ name: "project_id", value: project_id });
                data.push({ name: "pipeline_id", value: $pipeline_id });
                data.push({ name: "p", value: "saveProjectPipeline" });
                var proPipeGet = getValues(data);
                console.log(proPipeGet);
                var project_pipeline_id =proPipeGet.id;

                var getProPipeData = [];
                getProPipeData.push({ name: "id", value: $pipeline_id });
                getProPipeData.push({ name: "p", value: "loadPipeline" });
                $.ajax({
                    type: "POST",
                    url: "ajax/ajaxquery.php",
                    data: getProPipeData,
                    async: true,
                    success: function (s) {
                        var pipelineDat = s;
                        var rowData = {};
                        var keys = runsTable.settings().init().columns;
                        for (var i = 0; i < keys.length; i++) {
                            var key = keys[i].data;
                            rowData[key] = pipelineDat[0][key];
                        }
                        rowData.pip_id = pipelineDat[0].id;
                        rowData.id = project_pipeline_id;
                        console.log(rowData);
//                        console.log(keys);
                        runsTable.row.add(rowData).draw();

                    },
                    error: function (errorThrown) {
                        alert("Error: " + errorThrown);
                    }
                });
            }
            $('#runmodal').modal('hide');

        });

        $('#runtable').on('click', '#projectrunremove', function (e) {
            e.preventDefault();

            var clickedRow = $(this).closest('tr');
            var rowData = runsTable.row(clickedRow).data();
            console.log(rowData.id);
            $.ajax({
                type: "POST",
                url: "ajax/ajaxquery.php",
                data: {
                    id: rowData.id,
                    p: "removeProjectPipeline"
                },
                async: true,
                success: function (s) {
                    runsTable.row(clickedRow).remove().draw();
                },
                error: function (errorThrown) {
                    alert("Error: " + errorThrown);
                }
            });
        });
        $('#runtable').on('click', '#selectRunRun', function (e) {
            e.preventDefault();

            var clickedRow = $(this).closest('tr');
            var rowData = runsTable.row(clickedRow).data();
            console.log(rowData.id);
            var project_pipeline_id = (rowData.id);
            window.location.replace("index.php?np=3&id=" + project_pipeline_id);
            //xxx
            
        });

        var filesTable = $('#filetable').DataTable({
            "scrollY": "500px",
            "scrollCollapse": true,
            "scrollX": true,
            "ajax": {
                url: "ajax/ajaxquery.php",
                data: {
                    "project_id": project_id,
                    "p": "getProjectInputs"
                },
                "dataSrc": ""
            },
            "columns": [{
                "data": "name"
            },  {
                data: null,
                className: "center",
                defaultContent: getTableButtons("projectfile", REMOVE)
            }]

        });


        $('#fileModal').on('show.bs.modal', function (event) {
            //            allpipelinestable.column(0).checkboxes.deselect();
            $(this).find('form').trigger('reset');
            $('#filemodaltitle').html('Add Files to Project');

        });


        $('#fileModal').on('click', '#savefile', function (e) {
            e.preventDefault();
            var checkTab = $('#fileModal').find('.active');
            var checkdata = checkTab[1].getAttribute('id');
            if (checkdata === 'manualTab') {
                var formValues = $('#fileModal').find('input');
                var savetype = $('#mIdFile').val();
                var data = formValues.serializeArray(); // convert form to array
//                data.push({ name: "project_id", value: project_id });
                data.push({ name: "p", value: "saveInput" });
                //insert into input table
                var inputGet = getValues(data);
                var inputID = inputGet.id;
                //insert into project_input table
                var proInputGet = getValues({ "p": "saveProjectInput", "input_id": inputID, "project_id": project_id });
                var projectInputID = proInputGet.id;
                //get inputdata from input table
                var proInputGet = getValues({ "p": "getInputs", "id": inputID, });
                //insert into #filestable
                var rowData = {};
                var keys = filesTable.settings().init().columns;
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i].data;
                    rowData[key] = proInputGet[0][key];
                }
                rowData.id = projectInputID;
                filesTable.row.add(rowData).draw();
            }
            $('#fileModal').modal('hide');

        });

        $('#filetable').on('click', '#projectfileremove', function (e) {
            e.preventDefault();

            var clickedRow = $(this).closest('tr');
            var rowData = filesTable.row(clickedRow).data();
            //xxx check if input is used in any project_pipeline_input or project_input
            // then allow to delete
            //get input_id from project input table
	        var proInputGet = getValues({"p": "getProjectInput", id: rowData.id});
            var input_id = proInputGet[0].input_id;
            $.ajax({
                type: "POST",
                url: "ajax/ajaxquery.php",
                data: {
                    id: rowData.id,
                    input_id: input_id,
                    p: "removeProjectInput"
                },
                async: true,
                success: function (s) {
                    filesTable.row(clickedRow).remove().draw();
                },
                error: function (errorThrown) {
                    alert("Error: " + errorThrown);
                }
            });
        });








    });