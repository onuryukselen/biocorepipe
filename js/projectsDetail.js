    function saveProjectIcon() {
        var data = [];
        var projectSummary = $('#projectSum').val();
        var project_id = $('#project-title').attr('projectid');
        var project_name = $('#project-title').val();
        data.push({ name: "name", value: project_name });
        data.push({ name: "id", value: project_id });
        data.push({ name: "summary", value: projectSummary });
        data.push({ name: "p", value: "saveProject" });
        console.log(data);

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
        console.log(getProjectD);
        $.ajax({
            type: "POST",
            url: "ajax/ajaxquery.php",
            data: getProjectD,
            async: true,
            success: function (s) {
                console.log(s);
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
        console.log(project_id);
        $.ajax({
            type: "POST",
            url: "ajax/ajaxquery.php",
            data: {
                p: "removeProject",
                'id': project_id
            },
            async: true,
            success: function (s) {
                console.log(s);

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
                defaultContent: getTableButtons("projectrun", REMOVE)
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
                $.ajax({
                    type: "POST",
                    url: "ajax/ajaxquery.php",
                    data: data,
                    async: true,
                    success: function (s) {}
                });

                var getProPipeData = [];
                getProPipeData.push({ name: "id", value: $pipeline_id });
                getProPipeData.push({ name: "p", value: "loadPipeline" });
                $.ajax({
                    type: "POST",
                    url: "ajax/ajaxquery.php",
                    data: getProPipeData,
                    async: true,
                    success: function (s) {
                        console.log(s);
                        var pipelineDat = s;
                        var rowData = {};
                        var keys = runsTable.settings().init().columns;
                        for (var i = 0; i < keys.length; i++) {
                            var key = keys[i].data;
                            rowData[key] = pipelineDat[0][key];
                        }
                        rowData.pip_id = pipelineDat[0].id;
                        console.log(rowData);
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





    });