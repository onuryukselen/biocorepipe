$(document).ready(function () {
    //get profiles for user
    var proLocData = getValues({ p: "getProfileLocal" });
    var proCluData = getValues({ p: "getProfileCluster" });
    var proAmzData = getValues({ p: "getProfileAmazon" });
    if (proLocData.length + proCluData.length + proAmzData.length !== 0) {
        $('#noProfile').css('display', 'none');
        $.each(proLocData, function (el) {
            addLocalRow(proLocData[el].id, proLocData[el].name, proLocData[el].next_path, proLocData[el].executor);
        });
        $.each(proCluData, function (el) {
            addClusterRow(proCluData[el].id, proCluData[el].name, proCluData[el].next_path, proCluData[el].executor, proCluData[el].username, proCluData[el].hostname);
        });
        $.each(proAmzData, function (el) {
            addAmazonRow(proAmzData[el].id, proAmzData[el].name, proAmzData[el].next_path, proAmzData[el].executor, proAmzData[el].instance_type, proAmzData[el].image_id);
        });
    }

    function addLocalRow(id, name, next_path, executor) {
        $('#profilesTable > thead').append('<tr id="local-' + id + '"> <td>' + name + '</td> <td>Local</td><td>Nextflow Path: ' + next_path +'<br> Executor: ' + executor + '</td><td>' + getTableButtons("profile", EDIT | REMOVE) + '</td></tr>');
    }

    function addClusterRow(id, name, next_path, executor, username, hostname) {
            $('#profilesTable > thead').append('<tr id="cluster-' + id + '"> <td>' + name + '</td> <td>Remote Machine</td><td>Nextflow Path: ' + next_path +'<br> Executor: ' + executor + '<br>  Connection: ' + username + '@' + hostname + '</td><td>' + getTableButtons("profile", EDIT | REMOVE) + '</td></tr>');
    }
    function addAmazonRow(id, name, next_path, executor, instance_type, image_id) {
            $('#profilesTable > thead').append('<tr id="amazon-' + id + '"> <td>' + name + '</td> <td>Amazon</td><td>Nextflow Path: ' + next_path +'<br> Executor: ' + executor + '<br>  Instance_type: ' + instance_type + '<br>  Image_id: ' + image_id + '</td><td>' + getTableButtons("profile", EDIT | REMOVE) + '</td></tr>');
    }
    function updateLocalRow(id, name, next_path, executor) {
        $('#profilesTable > thead > #local-'+ id).html('<td>' + name + '</td> <td>Local</td><td>Nextflow Path: ' + next_path +'<br> Executor: ' + executor + '</td><td>' + getTableButtons("profile", EDIT | REMOVE) + '</td>');
    }

    function updateClusterRow(id, name, next_path, executor, username, hostname) {
            $('#profilesTable > thead > #cluster-'+ id).html('<td>' + name + '</td> <td>Remote Machine</td><td>Nextflow Path: ' + next_path +'<br> Executor: ' + executor + '<br>  Connection: ' + username + '@' + hostname + '</td><td>' + getTableButtons("profile", EDIT | REMOVE) + '</td>');
    }
    function updateAmazonRow(id, name, next_path, executor, instance_type, image_id) {
            $('#profilesTable > thead > #amazon-'+ id).html('<td>' + name + '</td> <td>Amazon</td><td>Nextflow Path: ' + next_path +'<br> Executor: ' + executor + '<br>  Instance_type: ' + instance_type + '<br>  Image_id: ' + image_id + '</td><td>' + getTableButtons("profile", EDIT | REMOVE) + '</td>');
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
            var formValues = $('#profilemodal').find('input, select, textarea');
            function fillFixedCol(formValues,data){
                $(formValues[0]).val(data[0].id);
                $(formValues[1]).val(data[0].name);
                $(formValues[13]).val(data[0].cmd);
                $(formValues[14]).val(data[0].next_path);
                $(formValues[15]).val(data[0].executor);
                $(formValues[16]).val(data[0].next_queue);
                $(formValues[17]).val(data[0].next_memory);
                $(formValues[18]).val(data[0].next_cpu);
                $(formValues[19]).val(data[0].next_time);
                $(formValues[20]).val(data[0].executor_job);
                $(formValues[21]).val(data[0].job_queue);
                $(formValues[22]).val(data[0].job_memory);
                $(formValues[23]).val(data[0].job_cpu);
                $(formValues[24]).val(data[0].job_time);
            };
            console.log(formValues);
            if (proType === "local") {
                var data = getValues({ p: "getProfileLocal", id: proId });
                $('#chooseEnv').val('local').trigger('change');
                fillFixedCol(formValues,data);
                $('#mExec').trigger('change');
            } else if (proType === "cluster") {
                var data = getValues({ p: "getProfileCluster", id: proId });
                $('#chooseEnv').val('cluster').trigger('change');
                fillFixedCol(formValues,data);
                $(formValues[3]).val(data[0].username);
                $(formValues[4]).val(data[0].hostname);
                $(formValues[5]).val(data[0].prikey_clu);
                $('#mExec').trigger('change');
            } else if (proType === "amazon") {
                var data = getValues({ p: "getProfileAmazon", id: proId });
                console.log(data);
                $('#chooseEnv').val('amazon').trigger('change');
                fillFixedCol(formValues,data);
                $(formValues[8]).val(data[0].default_region);
                $(formValues[9]).val(data[0].access_key);
                $(formValues[10]).val(data[0].secret_key);
                $(formValues[11]).val(data[0].instance_type);
                $(formValues[12]).val(data[0].image_id);
                $('#mExec').trigger('change');
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
                var noneList = ["mEnvUsernameDiv", "mEnvHostnameDiv", "mPriKeyCluDiv", "mEnvUsernameDiv", "mEnvHostnameDiv", "mPriKeyCluDiv", "mPriKeyAmzDiv", "mPubKeyDiv", "mEnvAmzDefRegDiv", "mEnvAmzAccKeyDiv", "mEnvAmzSucKeyDiv", "mEnvInsTypeDiv", "mEnvImageIdDiv", "execJobSetDiv"];
                var blockList = ["mExecDiv", "mEnvNextPathDiv", "mEnvCmdDiv","execNextDiv","mExecJobDiv"];
//                if ($('#mExec > .hideClu').length === 0){
//                $("#mExec").prepend('<option class="hideClu" value="local">Local</option>');
//                }
            } else if (selEnvType === "cluster") {
                var noneList = ["mEnvAmzDefRegDiv", "mEnvAmzAccKeyDiv", "mEnvAmzSucKeyDiv", "mEnvInsTypeDiv", "mEnvImageIdDiv", "mPriKeyAmzDiv", "mPubKeyDiv", "execJobSetDiv"];
                var blockList = ["mExecDiv", "mEnvUsernameDiv", "mEnvHostnameDiv", "mPriKeyCluDiv", "mEnvNextPathDiv", "mEnvCmdDiv","execNextDiv","mExecJobDiv"];
//                $('#mExec > .hideClu').remove();
            } else if (selEnvType === "amazon") {
                var noneList = ["mEnvUsernameDiv", "mEnvHostnameDiv", "mPriKeyCluDiv"];
                var blockList = ["mExecDiv", "mPriKeyAmzDiv", "mPubKeyDiv", "mEnvAmzDefRegDiv", "mEnvAmzAccKeyDiv", "mEnvAmzSucKeyDiv", "mEnvInsTypeDiv", "mEnvImageIdDiv", "mEnvNextPathDiv", "mEnvCmdDiv","execNextDiv","mExecJobDiv", "execJobSetDiv"];
//                if ($('#mExec > .hideClu').length === 0){
//                $("#mExec").prepend('<option class="hideClu" value="local">Local</option>');
//                }
            }
            $.each(noneList, function (element) {
                $('#' + noneList[element]).css('display', 'none');
            });
            $.each(blockList, function (element) {
                $('#' + blockList[element]).css('display', 'block');
            });
            $('#mExec').trigger('change');
            
        })
    });
    $(function () {
        $(document).on('change', '#mExec', function () {
            var mExecType = $('#mExec option:selected').val();
            $('#mExecJob').val(mExecType).trigger('change');
            $('#mExecJob').attr('disabled',"disabled");
            if (mExecType === "local") {
                $('#execNextDiv').css('display', 'none');
                $('#mExecJobDiv').css('display', 'block');
            } else if (mExecType === "sge" ||mExecType === "lsf" || mExecType === "slurm") {
                $('#execNextDiv').css('display', 'block');
                $('#mExecJobDiv').css('display', 'block');
            }
        })
    });
    
        $(function () {
        $(document).on('change', '#mExecJob', function () {
            var mExecJobType = $('#mExecJob option:selected').val();
            if (mExecJobType === "local") {
                $('#execJobSetDiv').css('display', 'none');
            } else if (mExecJobType === "sge" ||mExecJobType === "lsf" || mExecJobType === "slurm") {
                $('#execJobSetDiv').css('display', 'block');
            }
        })
    });

    // Dismiss parameters modal 
    $('#profilemodal').on('hide.bs.modal', function (event) {
        var noneList = ["mEnvUsernameDiv", "mEnvHostnameDiv", "mPriKeyCluDiv", "mEnvUsernameDiv", "mEnvHostnameDiv", "mPriKeyCluDiv", "mPriKeyAmzDiv", "mPubKeyDiv", "mEnvAmzDefRegDiv", "mEnvAmzAccKeyDiv", "mEnvAmzSucKeyDiv", "mEnvInsTypeDiv", "mEnvImageIdDiv", "mExecDiv", "mEnvNextPathDiv", "mEnvCmdDiv","execNextDiv", "mExecJobDiv", "execJobSetDiv"];
        $.each(noneList, function (element) {
            $('#' + noneList[element]).css('display', 'none');
        });
        $('#chooseEnv').removeAttr('disabled');
        $('#mExecJob').removeAttr('disabled');
        
    });


    

    $('#profilemodal').on('click', '#saveEnv', function (event) {
        event.preventDefault();
        $('#chooseEnv').removeAttr('disabled');
        $('#mExecJob').removeAttr('disabled');
        var formValues = $('#profilemodal').find('input, select, textarea');
        var savetype = $('#mEnvId').val();
        var data = formValues.serializeArray(); // convert form to array
        var selEnvType = $('#chooseEnv option:selected').val();
        if (selEnvType.length) {
            if (selEnvType === "local") {
                data.push({ name: "p", value: "saveProfileLocal" });
            } else if (selEnvType === "cluster") {
                data[5].value = encodeURIComponent(data[5].value);
                data.push({ name: "p", value: "saveProfileCluster" });
            } else if (selEnvType === "amazon") {
                data[5].value = encodeURIComponent(data[6].value);
                data[5].value = encodeURIComponent(data[7].value);
                data.push({ name: "p", value: "saveProfileAmazon" });
            }
        console.log(data)
            $.ajax({
                type: "POST",
                url: "ajax/ajaxquery.php",
                data: data,
                async: true,
                success: function (s) {
                    if (savetype.length) { //edit
                        var clickedRowId = selEnvType + '-' +savetype;
                        if (selEnvType === "local") {
                             updateLocalRow(data[0].value, data[1].value, data[14].value, data[15].value)
                        } else if (selEnvType === "cluster") {
                            updateClusterRow(data[0].value, data[1].value, data[14].value, data[15].value, data[3].value, data[4].value)
                        } else if (selEnvType === "amazon") {
                            updateAmazonRow(data[0].value, data[1].value, data[14].value, data[15].value, data[11].value, data[12].value); 
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
                            addLocalRow(s.id, data[1].value, data[14].value, data[15].value);
                        } else if (selEnvType === "cluster") {
                            addClusterRow(s.id, data[1].value, data[14].value, data[15].value, data[3].value, data[4].value);
                        } else if (selEnvType === "amazon") {
                            addAmazonRow(s.id, data[1].value, data[14].value, data[15].value, data[11].value, data[12].value); 
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