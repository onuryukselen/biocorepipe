$(document).ready(function () {
    //get profiles for user
    var proLocData = getValues({ p: "getProfileLocal" });
    var proCluData = getValues({ p: "getProfileCluster" });
    if (proLocData.length + proCluData.length !== 0) {
        $('#noProfile').css('display', 'none');
        $.each(proLocData, function (el) {
            addLocalRow(proLocData[el].id, proLocData[el].name, proLocData[el].next_path, proLocData[el].executor);
        });
        $.each(proCluData, function (el) {
            addClusterRow(proCluData[el].id, proCluData[el].name, proCluData[el].next_path, proCluData[el].executor, proCluData[el].username, proCluData[el].hostname);
        });
    }

    function addLocalRow(id, name, next_path, executor) {
        $('#profilesTable > thead').append('<tr id="local-' + id + '"> <td>' + name + '</td> <td>Local</td><td>Nextflow Path: ' + next_path +'<br> Executor: ' + executor + '</td><td>' + getTableButtons("profile", EDIT | REMOVE) + '</td></tr>');
    }

    function addClusterRow(id, name, next_path, executor, username, hostname) {
            $('#profilesTable > thead').append('<tr id="cluster-' + id + '"> <td>' + name + '</td> <td>Cluster</td><td>Nextflow Path: ' + next_path +'<br> Executor: ' + executor + '<br>  Connection: ' + username + '@' + hostname + '</td><td>' + getTableButtons("profile", EDIT | REMOVE) + '</td></tr>');
    }
    function updateLocalRow(id, name, next_path, executor) {
        $('#profilesTable > thead > #local-'+ id).html('<td>' + name + '</td> <td>Local</td><td>Nextflow Path: ' + next_path +'<br> Executor: ' + executor + '</td><td>' + getTableButtons("profile", EDIT | REMOVE) + '</td>');
    }

    function updateClusterRow(id, name, next_path, executor, username, hostname) {
            $('#profilesTable > thead > #cluster-'+ id).html('<td>' + name + '</td> <td>Cluster</td><td>Nextflow Path: ' + next_path +'<br> Executor: ' + executor + '<br>  Connection: ' + username + '@' + hostname + '</td><td>' + getTableButtons("profile", EDIT | REMOVE) + '</td>');
    }


    $('#profilemodal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        $(this).find('form').trigger('reset');
        if (button.attr('id') === 'addEnv') {
            $('#mAddEnvTitle').html('Add Environment');
        } else if (button.attr('id') === 'profileedit') {
            $('#mAddEnvTitle').html('Edit Environment');
            var clickedRowId = button.closest('tr').attr('id'); //local-20
            var patt = /(.*)-(.*)/;
            var proType = clickedRowId.replace(patt, '$1');
            var proId = clickedRowId.replace(patt, '$2');
            var formValues = $('#profilemodal').find('input, select');
            console.log(formValues);
            if (proType === "local") {
                var data = getValues({ p: "getProfileLocal" });
                $('#chooseEnv').val('local').trigger('change');
                $(formValues[0]).val(data[0].id);
                $(formValues[1]).val(data[0].name);
                $(formValues[10]).val(data[0].next_path);
                $(formValues[11]).val(data[0].executor);
            } else if (proType === "cluster") {
                var data = getValues({ p: "getProfileCluster" });
                $('#chooseEnv').val('cluster').trigger('change');
                $(formValues[0]).val(data[0].id);
                $(formValues[1]).val(data[0].name);
                $(formValues[10]).val(data[0].next_path);
                $(formValues[11]).val(data[0].executor);
                $(formValues[3]).val(data[0].username);
                $(formValues[4]).val(data[0].hostname);
            } else if (proType === "amazon") {
                $('#chooseEnv').val('amazon').trigger('change');
            }
                $('#chooseEnv').attr('disabled', "disabled");
        }
    });

    $(function () {
        $(document).on('change', '#chooseEnv', function () {
            var selEnvType = $('#chooseEnv option:selected').val();
            var noneList = [];
            var blockList = [];
            if (selEnvType === "local") {
                var noneList = ["mEnvUsernameDiv", "mEnvHostnameDiv", "mPriKeyCluDiv", "mEnvUsernameDiv", "mEnvHostnameDiv", "mPriKeyCluDiv", "mPriKeyAmzDiv", "mPubKeyDiv", "mEnvAmzDefRegDiv", "mEnvAmzAccKeyDiv", "mEnvAmzSucKeyDiv", "mEnvInsTypeDiv", "mEnvImageIdDiv"];
                var blockList = ["mExecDiv", "mEnvNextPathDiv"];
            } else if (selEnvType === "cluster") {
                var noneList = ["mEnvAmzDefRegDiv", "mEnvAmzAccKeyDiv", "mEnvAmzSucKeyDiv", "mEnvInsTypeDiv", "mEnvImageIdDiv", "mPriKeyAmzDiv", "mPubKeyDiv"];
                var blockList = ["mExecDiv", "mEnvUsernameDiv", "mEnvHostnameDiv", "mPriKeyCluDiv", "mEnvNextPathDiv"];

            } else if (selEnvType === "amazon") {
                var noneList = ["mEnvUsernameDiv", "mEnvHostnameDiv", "mPriKeyCluDiv"];
                var blockList = ["mExecDiv", "mPriKeyAmzDiv", "mPubKeyDiv", "mEnvAmzDefRegDiv", "mEnvAmzAccKeyDiv", "mEnvAmzSucKeyDiv", "mEnvInsTypeDiv", "mEnvImageIdDiv", "mEnvNextPathDiv"];
            }
            $.each(noneList, function (element) {
                $('#' + noneList[element]).css('display', 'none');
            });
            $.each(blockList, function (element) {
                $('#' + blockList[element]).css('display', 'block');
            });
        })
    });

    // Dismiss parameters modal 
    $('#profilemodal').on('hide.bs.modal', function (event) {
        var noneList = ["mEnvUsernameDiv", "mEnvHostnameDiv", "mPriKeyCluDiv", "mEnvUsernameDiv", "mEnvHostnameDiv", "mPriKeyCluDiv", "mPriKeyAmzDiv", "mPubKeyDiv", "mEnvAmzDefRegDiv", "mEnvAmzAccKeyDiv", "mEnvAmzSucKeyDiv", "mEnvInsTypeDiv", "mEnvImageIdDiv", "mExecDiv", "mEnvNextPathDiv"];
        $.each(noneList, function (element) {
            $('#' + noneList[element]).css('display', 'none');
        });
        $('#chooseEnv').removeAttr('disabled');
        
    });


    $('#profilemodal').on('click', '#saveEnv', function (event) {
        event.preventDefault();
        $('#chooseEnv').removeAttr('disabled');
        var formValues = $('#profilemodal').find('input, select, textarea');
        var savetype = $('#mEnvId').val();
        var data = formValues.serializeArray(); // convert form to array
        data[5].value = encodeURIComponent(data[5].value);
        var selEnvType = $('#chooseEnv option:selected').val();
        if (selEnvType.length) {
            if (selEnvType === "local") {
                data.push({ name: "p", value: "saveProfileLocal" });
            } else if (selEnvType === "cluster") {
                data.push({ name: "p", value: "saveProfileCluster" });
            } else if (selEnvType === "amazon") {
                data.push({ name: "p", value: "saveProfileAmazon" });
            }

            $.ajax({
                type: "POST",
                url: "ajax/ajaxquery.php",
                data: data,
                async: true,
                success: function (s) {
                    if (savetype.length) { //edit
                        console.log(data);
                        var clickedRowId = selEnvType + '-' +savetype;
                        console.log(clickedRowId);
                        if (selEnvType === "local") {
                             updateLocalRow(data[0].value, data[1].value, data[13].value, data[14].value)
                        } else if (selEnvType === "cluster") {
                            updateClusterRow(data[0].value, data[1].value, data[13].value, data[14].value, data[3].value, data[4].value)
                        } else if (selEnvType === "amazon") {

                        }
                        //                        var clickedRow = $('#saveproject').data('clickedrow');
                        //                        var getProjectData = [];
                        //                        getProjectData.push({ name: "id", value: savetype });
                        //                        getProjectData.push({ name: "p", value: 'getProjects' });
                        //                        $.ajax({
                        //                            type: "POST",
                        //                            url: "ajax/ajaxquery.php",
                        //                            data: getProjectData,
                        //                            async: true,
                        //                            success: function (sc) {
                        //                                var projectDat = sc;
                        //                                var rowData = {};
                        //                                var keys = projectTable.settings().init().columns;
                        //                                for (var i = 0; i < keys.length; i++) {
                        //                                    var key = keys[i].data;
                        //                                    rowData[key] = projectDat[0][key];
                        //                                }
                        //                                rowData.id = projectDat[0].id;
                        //                                projectTable.row(clickedRow).remove().draw();
                        //                                projectTable.row.add(rowData).draw();
                        //    
                        //                            },
                        //                            error: function (errorThrown) {
                        //                                alert("Error: " + errorThrown);
                        //                            }
                        //                        });

                    } else { //insert
                        console.log(data);
                        if (selEnvType === "local") {
                            addLocalRow(s.id, data[1].value, data[13].value, data[14].value);
                        } else if (selEnvType === "cluster") {
                            addClusterRow(s.id, data[1].value, data[13].value, data[14].value, data[3].value, data[4].value);
                        } else if (selEnvType === "amazon") {

                        }
                        var numRows = $('#profilesTable > > tr').length;
                        if (numRows > 2) {
                            $('#noProfile').css('display', 'none');
                        }

                    }

                    $('#profilemodal').modal('hide');

                },
                error: function (errorThrown) {
                    alert("Error: " + errorThrown);
                }
            });
        }

    });

    $('#profilesTable').on('click', '#profileremove', function (e) {
        e.preventDefault();

        var clickedRowId = $(this).closest('tr').attr('id'); //local-20
        var patt = /(.*)-(.*)/;
        var proType = clickedRowId.replace(patt, '$1');
        var proId = clickedRowId.replace(patt, '$2');
        var data = {};
        if (proType === "local") {
            data = { "id": proId, "p": "removeProLocal" };
        } else if (proType === "cluster") {
            data = { "id": proId, "p": "removeProCluster" };
        } else if (proType === "amazon") {
            data = { "id": proId, "p": "removeProAmazon" };
        }
        $.ajax({
            type: "POST",
            url: "ajax/ajaxquery.php",
            data: data,
            async: true,
            success: function (s) {
                $('#profilesTable > > #' + clickedRowId).remove();
                var numRows = $('#profilesTable > > tr').length;
                if (numRows === 2) {
                    $('#noProfile').css('display', 'block');
                }
            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
    });







});