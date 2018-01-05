$(document).ready(function () {
    var selProcessID = null;
    var projectTable = $('#projecttable').DataTable({
        "scrollY": "400px",
        "scrollCollapse": true,
        "scrollX": true,
        "ajax": {
            url: "ajax/ajaxquery.php",
            data: { "p": "getProjects" },
            "dataSrc": ""
        },
        "columns": [{
            "data": "name"
            }, {
            "data": "username"
            }, {
            "data": "date_created"
            }, {
            data: null,
            className: "center",
            defaultContent: getTableButtons("project", SELECT | EDIT | REMOVE)
            }]
    });


    $('#processtable').on('click', '#projectselect', function () {
        var clickedRow = $(this).closest('tr');

        //        if (clickedRow.hasClass('selected')) {
        //            clickedRow.removeClass('selected');
        //            $("#pdetailpanel").css("display", "none");
        //        } else {
        //            processTable.$('tr.selected').removeClass('selected');
        //            clickedRow.addClass('selected');
        //
        //            var rowData = processTable.row(clickedRow).data();
        //            console.log(rowData)
        //            $('#pdetailpanelHead').html(rowData['name']);
        //            $('#pScriptWell').html(rowData['script']);
        //            selProcessID = rowData['id'];
        //
        //            inputTable = getInputTable(selProcessID)
        //            outputTable = getOutputTable(selProcessID)
        //
        //
        //            $("#pdetailpanel").removeAttr("style");
        //        }
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
            //            var keys = Object.keys(rowData);
            //            for (var i = 0; i < keys.length; i++) {
            //                $(formValues[i]).val(rowData[keys[i]]);
            //            }
            $(formValues[0]).val(rowData.id);
            $(formValues[1]).val(rowData.name);

        }
    });

    $('#projectmodal').on('click', '#saveproject', function (event) {
        event.preventDefault();
        var formValues = $('#projectmodal').find('input');
        var savetype = $('#mProjectID').val();
        var data = formValues.serializeArray(); // convert form to array
        data.push({ name: "p", value: "saveProject" });
        console.log(data);
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
                            projectTable.row(clickedRow).data(rowData).draw();
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
                            projectTable.row.add(addData).draw();

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
    });

    $('#projecttable').on('click', '#projectremove', function (e) {
        e.preventDefault();

        var clickedRow = $(this).closest('tr');
        var rowData = projectTable.row(clickedRow).data();

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
            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
    });
    
    
});