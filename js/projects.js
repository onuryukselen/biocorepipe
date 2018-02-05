function updateSideBarProject(project_id, project_name, type) {
    if (type === 'add') {
        $('#autocompletes1').append('<li class="treeview"><a href="" draggable="false"><i  class="fa fa-circle-o"></i> <span>' + project_name +'</span><i class="fa fa-angle-left pull-right"></i></a><ul id="side-' + project_id + '" class="treeview-menu"></ul></li>');
    }
    else if (type === "edit"){
      $('#side-' + project_id).parent().find('span').html(project_name);
    } else if (type === "remove"){
      $('#side-' + project_id).parent().remove();
    }
    
}

    

$(document).ready(function () {
    var projectTable = $('#projecttable').DataTable({
        "scrollY": "500px",
        "scrollCollapse": true,
        "scrollX": true,
        "ajax": {
            url: "ajax/ajaxquery.php",
            data: { "p": "getProjects" },
            "dataSrc": ""
        },
        "columns": [{
            "data": "name",
            "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                $(nTd).html("<a href='index.php?np=2&id=" + oData.id + "'>" + oData.name + "</a>");
            }
            }, {
            "data": "username"
            }, {
            "data": "date_created"
            }, {
            data: null,
            className: "center",
            defaultContent: getTableButtons("project", EDIT | REMOVE)
            }]
    });




    $('#projectmodal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        $(this).find('form').trigger('reset');
        if (button.attr('id') === 'addproject') {
            $('#projectmodaltitle').html('Add New Project');
        } else {
            $('#projectmodaltitle').html('Edit Project');
            var clickedRow = button.closest('tr');
            var rowData = projectTable.row(clickedRow).data();
            $('#saveproject').data('clickedrow', clickedRow);
            var formValues = $('#projectmodal').find('input');
            $(formValues[0]).val(rowData.id);
            $(formValues[1]).val(rowData.name);

        }
    });

    $('#projectmodal').on('click', '#saveproject', function (event) {
        event.preventDefault();
        var formValues = $('#projectmodal').find('input');
        if ($('#mProjectName').val() !== ''){
        var savetype = $('#mProjectID').val();
        var data = formValues.serializeArray(); // convert form to array
        data.push({ name: "p", value: "saveProject" });
        $.ajax({
            type: "POST",
            url: "ajax/ajaxquery.php",
            data: data,
            async: true,
            success: function (s) {
                if (savetype.length) { //edit
                    var clickedRow = $('#saveproject').data('clickedrow');
                    var getProjectData = [];
                    getProjectData.push({ name: "id", value: savetype });
                    getProjectData.push({ name: "p", value: 'getProjects' });
                    $.ajax({
                        type: "POST",
                        url: "ajax/ajaxquery.php",
                        data: getProjectData,
                        async: true,
                        success: function (sc) {
                            var projectDat = sc;
                            var rowData = {};
                            var keys = projectTable.settings().init().columns;
                            for (var i = 0; i < keys.length; i++) {
                                var key = keys[i].data;
                                rowData[key] = projectDat[0][key];
                            }
                            rowData.id = projectDat[0].id;
                            projectTable.row(clickedRow).remove().draw();
                            projectTable.row.add(rowData).draw();
                            updateSideBarProject(projectDat[0].id, projectDat[0].name, 'edit');

                        },
                        error: function (errorThrown) {
                            alert("Error: " + errorThrown);
                        }
                    });

                } else { //insert
                    var getProjectData = [];
                    getProjectData.push({ name: "id", value: s.id });
                    getProjectData.push({ name: "p", value: 'getProjects' });
                    $.ajax({
                        type: "POST",
                        url: "ajax/ajaxquery.php",
                        data: getProjectData,
                        async: true,
                        success: function (sc) {
                            var projectDat = sc;
                            var addData = {};
                            var keys = projectTable.settings().init().columns;
                            for (var i = 0; i < keys.length; i++) {
                                var key = keys[i].data;
                                addData[key] = projectDat[0][key];
                            }
                            addData.id = projectDat[0].id;
                            projectTable.row.add(addData).draw();
                            updateSideBarProject(projectDat[0].id, projectDat[0].name, 'add');

                        },
                        error: function (errorThrown) {
                            alert("Error: " + errorThrown);
                        }
                    });
                }

                $('#projectmodal').modal('hide');

            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
    }
    });

    $('#projecttable').on('click', '#projectremove', function (e) {
        e.preventDefault();

        var clickedRow = $(this).closest('tr');
        var rowData = projectTable.row(clickedRow).data();
        console.log(rowData);

        $.ajax({
            type: "POST",
            url: "ajax/ajaxquery.php",
            data: {
                id: rowData.id,
                p: "removeProject"
            },
            async: true,
            success: function (s) {
                projectTable.row(clickedRow).remove().draw();
                updateSideBarProject(rowData.id, rowData.name, 'remove');
            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
    });


});