    //xxxx
    function generateKeys() {
        var genKeys = getValues({ p: "generateKeys" });
        if (genKeys) {
            if (genKeys.create_key_status === "active") {
                setTimeout(function () { readGenerateKeys() }, 500);
            } else {
                $('#mOurPriKey').val("");
                $('#mOurPubKey').val("");
                $('#mOurPriKeyDiv').css('display', 'none');
                $('#mOurPubKeyDiv').css('display', 'none');
            }
        }

    }

    function readGenerateKeys() {
        var genKeysLog = getValues({ p: "readGenerateKeys" });
        if (genKeysLog) {
            if (genKeysLog.$keyPri !== "" && genKeysLog.$keyPub !== "" && genKeysLog.$keyPri !== false && genKeysLog.$keyPub !== false) {
                $('#mOurPriKey').val($.trim(genKeysLog.$keyPri));
                $('#mOurPubKey').val($.trim(genKeysLog.$keyPub));
                $('#mOurPriKeyDiv').css('display', 'inline');
                $('#mOurPubKeyDiv').css('display', 'inline');
            } else {
                $('#mOurPriKey').val("");
                $('#mOurPubKey').val("");
                $('#mOurPriKeyDiv').css('display', 'none');
                $('#mOurPubKeyDiv').css('display', 'none');
            }
        }

    }


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

        function getAmzButModal() {
            var button = '<div style="display: inline-flex"><button type="button" class="btn btn-primary btn-sm" title="Edit" id="' + 'profile' + 'edit" data-toggle="modal" data-target="#' + "profile" + 'modal">Edit</button> &nbsp; <button type="button" class="btn btn-primary btn-sm" title="Remove" id="' + 'profile' + 'remove">Remove</button>&nbsp;<button type="button" class="btn btn-primary btn-sm" title="start/stop" id="amzStartStop" data-toggle="modal" data-target="#amzModal">Start/Stop</button> &nbsp;</div>';
            return button;


        }

        function addLocalRow(id, name, next_path, executor) {
            $('#profilesTable > thead').append('<tr id="local-' + id + '"> <td>' + name + '</td> <td>Local</td><td>Nextflow Path: ' + next_path + '<br> Executor: ' + executor + '</td><td>' + getTableButtons("profile", EDIT | REMOVE) + '</td></tr>');
        }

        function addClusterRow(id, name, next_path, executor, username, hostname) {
            $('#profilesTable > thead').append('<tr id="cluster-' + id + '"> <td>' + name + '</td> <td>Host</td><td>Nextflow Path: ' + next_path + '<br> Executor: ' + executor + '<br>  Connection: ' + username + '@' + hostname + '</td><td>' + getTableButtons("profile", EDIT | REMOVE) + '</td></tr>');
        }

        function addAmazonRow(id, name, next_path, executor, instance_type, image_id) {
            $('#profilesTable > thead').append('<tr id="amazon-' + id + '"> <td>' + name + '</td> <td>Amazon</td><td>Nextflow Path: ' + next_path + '<br> Executor: ' + executor + '<br>  Instance_type: ' + instance_type + '<br>  Image_id: ' + image_id + '</td><td>' + getAmzButModal() + '</td></tr>');
        }

        function updateLocalRow(id, name, next_path, executor) {
            $('#profilesTable > thead > #local-' + id).html('<td>' + name + '</td> <td>Local</td><td>Nextflow Path: ' + next_path + '<br> Executor: ' + executor + '</td><td>' + getTableButtons("profile", EDIT | REMOVE) + '</td>');
        }

        function updateClusterRow(id, name, next_path, executor, username, hostname) {
            $('#profilesTable > thead > #cluster-' + id).html('<td>' + name + '</td> <td>Host</td><td>Nextflow Path: ' + next_path + '<br> Executor: ' + executor + '<br>  Connection: ' + username + '@' + hostname + '</td><td>' + getTableButtons("profile", EDIT | REMOVE) + '</td>');
        }

        function updateAmazonRow(id, name, next_path, executor, instance_type, image_id) {
            $('#profilesTable > thead > #amazon-' + id).html('<td>' + name + '</td> <td>Amazon</td><td>Nextflow Path: ' + next_path + '<br> Executor: ' + executor + '<br>  Instance_type: ' + instance_type + '<br>  Image_id: ' + image_id + '</td><td>' + getAmzButModal() + '</td>');
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

                function fillFixedCol(formValues, data) {
                    $(formValues[0]).val(data[0].id);
                    $(formValues[1]).val(data[0].name);
                    $(formValues[16]).val(data[0].cmd);
                    $(formValues[17]).val(data[0].next_path);
                    $(formValues[18]).val(data[0].executor);
                    $(formValues[19]).val(data[0].next_queue);
                    $(formValues[20]).val(data[0].next_memory);
                    $(formValues[21]).val(data[0].next_cpu);
                    $(formValues[22]).val(data[0].next_time);
                    $(formValues[23]).val(data[0].executor_job);
                    $(formValues[24]).val(data[0].job_queue);
                    $(formValues[25]).val(data[0].job_memory);
                    $(formValues[26]).val(data[0].job_cpu);
                    $(formValues[27]).val(data[0].job_time);
                };
                if (proType === "local") {
                    var data = getValues({ p: "getProfileLocal", id: proId });
                    $('#chooseEnv').val('local').trigger('change');
                    fillFixedCol(formValues, data);
                    $('#mExec').trigger('change');
                } else if (proType === "cluster") {
                    var data = getValues({ p: "getProfileCluster", id: proId });
                    $('#chooseEnv').val('cluster').trigger('change');
                    fillFixedCol(formValues, data);
                    $(formValues[3]).val(data[0].username);
                    $(formValues[4]).val(data[0].hostname);
                    $(formValues[5]).val(data[0].prikey_clu);
                    $('#mExec').trigger('change');
                } else if (proType === "amazon") {
                    var data = getValues({ p: "getProfileAmazon", id: proId });
                    $('#chooseEnv').val('amazon').trigger('change');
                    fillFixedCol(formValues, data);
                    $(formValues[6]).val(data[0].prikey_amz);
                    $(formValues[7]).val(data[0].pubkey_amz);
                    $(formValues[8]).val(data[0].default_region);
                    $(formValues[9]).val(data[0].access_key);
                    $(formValues[10]).val(data[0].secret_key);
                    $(formValues[11]).val(data[0].instance_type);
                    $(formValues[12]).val(data[0].image_id);
                    $(formValues[13]).val(data[0].subnet_id);
                    $(formValues[14]).val(data[0].shared_storage_id);
                    $(formValues[15]).val(data[0].shared_storage_mnt);
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
                    var noneList = ["mEnvUsernameDiv", "mEnvHostnameDiv", "mPriKeyCluDiv", "mEnvUsernameDiv", "mEnvHostnameDiv", "mPriKeyCluDiv", "mPriKeyAmzDiv", "mPubKeyDiv", "mEnvAmzDefRegDiv", "mEnvAmzAccKeyDiv", "mEnvAmzSucKeyDiv", "mEnvInsTypeDiv", "mEnvImageIdDiv", "execJobSetDiv", "mSubnetIdDiv", "mSharedStorageIdDiv", "mSharedStorageMountDiv"];
                    var blockList = ["mExecDiv", "mEnvNextPathDiv", "mEnvCmdDiv", "execNextDiv", "mExecJobDiv"];
                    //                if ($('#mExec > .hideClu').length === 0){
                    //                $("#mExec").prepend('<option class="hideClu" value="local">Local</option>');
                    //                }
                } else if (selEnvType === "cluster") {
                    var noneList = ["mEnvAmzDefRegDiv", "mEnvAmzAccKeyDiv", "mEnvAmzSucKeyDiv", "mEnvInsTypeDiv", "mEnvImageIdDiv", "mPriKeyAmzDiv", "mPubKeyDiv", "execJobSetDiv", "mSubnetIdDiv", "mSharedStorageIdDiv", "mSharedStorageMountDiv"];
                    var blockList = ["mExecDiv", "mEnvUsernameDiv", "mEnvHostnameDiv", "mPriKeyCluDiv", "mEnvNextPathDiv", "mEnvCmdDiv", "execNextDiv", "mExecJobDiv"];
                    //                $('#mExec > .hideClu').remove();
                } else if (selEnvType === "amazon") {
                    var noneList = ["mEnvUsernameDiv", "mEnvHostnameDiv", "mPriKeyCluDiv"];
                    var blockList = ["mExecDiv", "mPriKeyAmzDiv", "mPubKeyDiv", "mEnvAmzDefRegDiv", "mEnvAmzAccKeyDiv", "mEnvAmzSucKeyDiv", "mEnvInsTypeDiv", "mEnvImageIdDiv", "mEnvNextPathDiv", "mEnvCmdDiv", "execNextDiv", "mExecJobDiv", "execJobSetDiv", "mSubnetIdDiv", "mSharedStorageIdDiv", "mSharedStorageMountDiv"];
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
                $('#mExecJob').removeAttr('disabled');
                if (mExecType === "local") {
                    $('#mExecJob').trigger('change');
                    $('#execNextDiv').css('display', 'none');
                    $('#mExecJobDiv').css('display', 'block');
                } else if (mExecType === "sge" || mExecType === "lsf" || mExecType === "slurm" || mExecType === "ignite") {
                    $('#mExecJob').val(mExecType).trigger('change');
                    $('#mExecJob').attr('disabled', "disabled");
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
                } else if (mExecJobType === "sge" || mExecJobType === "lsf" || mExecJobType === "slurm" || mExecJobType === "ignite") {
                    $('#execJobSetDiv').css('display', 'block');
                }
            })
        });

        // Dismiss parameters modal 
        $('#profilemodal').on('hide.bs.modal', function (event) {
            var noneList = ["mEnvUsernameDiv", "mEnvHostnameDiv", "mPriKeyCluDiv", "mEnvUsernameDiv", "mEnvHostnameDiv", "mPriKeyCluDiv", "mPriKeyAmzDiv", "mPubKeyDiv", "mEnvAmzDefRegDiv", "mEnvAmzAccKeyDiv", "mEnvAmzSucKeyDiv", "mEnvInsTypeDiv", "mEnvImageIdDiv", "mExecDiv", "mEnvNextPathDiv", "mEnvCmdDiv", "execNextDiv", "mExecJobDiv", "execJobSetDiv", "mSubnetIdDiv", "mSharedStorageIdDiv", "mSharedStorageMountDiv"];
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
                    data[6].value = encodeURIComponent(data[6].value);
                    data[7].value = encodeURIComponent(data[7].value);
                    data.push({ name: "p", value: "saveProfileAmazon" });
                }
                $.ajax({
                    type: "POST",
                    url: "ajax/ajaxquery.php",
                    data: data,
                    async: true,
                    success: function (s) {
                        if (savetype.length) { //edit
                            var clickedRowId = selEnvType + '-' + savetype;
                            if (selEnvType === "local") {
                                updateLocalRow(data[0].value, data[1].value, data[17].value, data[18].value)
                            } else if (selEnvType === "cluster") {
                                updateClusterRow(data[0].value, data[1].value, data[17].value, data[18].value, data[3].value, data[4].value)
                            } else if (selEnvType === "amazon") {
                                updateAmazonRow(data[0].value, data[1].value, data[17].value, data[18].value, data[11].value, data[12].value);
                            }

                        } else { //insert
                            if (selEnvType === "local") {
                                addLocalRow(s.id, data[1].value, data[17].value, data[18].value);
                            } else if (selEnvType === "cluster") {
                                addClusterRow(s.id, data[1].value, data[17].value, data[18].value, data[3].value, data[4].value);
                            } else if (selEnvType === "amazon") {
                                addAmazonRow(s.id, data[1].value, data[17].value, data[18].value, data[11].value, data[12].value);
                                $('#manageAmz').css('display', 'inline');
                                checkAmazonTimer(s.id);
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
                    // check the amazon profiles
                    if (proType === "amazon") {
                        clearInterval(window['interval_amzStatus_' + proId]);
                        var proAmzData = getValues({ p: "getProfileAmazon" });
                        if (proAmzData.length < 1) {
                            $('#manageAmz').css('display', 'none');
                        }
                    }
                },
                error: function (errorThrown) {
                    alert("Error: " + errorThrown);
                }
            });
        });

        //------------   groups section-------------
        function getGroupTableOptions(owner_id, u_id) {
            if (owner_id === u_id) {
                //if user is the owner of the group
                var button = '<div class="btn-group"><button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-expanded="true">Options <span class="fa fa-caret-down"></span></button><ul class="dropdown-menu" role="menu"><li><a href="#joinmodal" data-toggle="modal" class="viewGroupMembers">View Group Members</a></li><li class="divider"></li><li><a href="#joinmodal" data-toggle="modal" class="addUsers">Add Users</a></li><li class="divider"></li><li><a href="#" class="deleteGroup">Delete Group</a></li></ul></div>';
            } else {
                var button = '<div class="btn-group"><button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-expanded="true">Options <span class="fa fa-caret-down"></span></button><ul class="dropdown-menu" role="menu"><li><a href="#joinmodal" data-toggle="modal" class="viewGroupMembers">View Group Members</a></li></ul></div>';
            }
            return button;
        }

        var groupTable = $('#grouptable').DataTable({
            "ajax": {
                url: "ajax/ajaxquery.php",
                data: { "p": "getUserGroups" },
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
                fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).html(getGroupTableOptions(oData.owner_id, oData.u_id));
                }
            }]
        });




        $('#groupmodal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            $(this).find('form').trigger('reset');
            if (button.attr('id') === 'addgroup') {
                $('#groupmodaltitle').html('Create a New Group');
            } else {
                $('#groupmodaltitle').html('Edit Group Name');
                var clickedRow = button.closest('tr');
                var rowData = groupTable.row(clickedRow).data();
                $('#savegroup').data('clickedrow', clickedRow);
                var formValues = $('#groupmodal').find('input');
                $(formValues[0]).val(rowData.id);
                $(formValues[1]).val(rowData.name);

            }
        });

        $('#groupmodal').on('click', '#savegroup', function (event) {
            event.preventDefault();
            var formValues = $('#groupmodal').find('input');
            if ($('#mProjectName').val() !== '') {
                var savetype = $('#mGroupID').val();
                var data = formValues.serializeArray(); // convert form to array
                data.push({ name: "p", value: "saveGroup" });
                $.ajax({
                    type: "POST",
                    url: "ajax/ajaxquery.php",
                    data: data,
                    async: true,
                    success: function (s) {
                        if (savetype.length) { //edit
                            //                        var clickedRow = $('#savegroup').data('clickedrow');
                            //                        var getGroupData = [];
                            //                        getGroupData.push({ name: "id", value: savetype });
                            //                        getGroupData.push({ name: "p", value: 'getGroups' });
                            //                        $.ajax({
                            //                            type: "POST",
                            //                            url: "ajax/ajaxquery.php",
                            //                            data: getGroupData,
                            //                            async: true,
                            //                            success: function (sc) {
                            //                                var groupDat = sc;
                            //                                var rowData = {};
                            //                                var keys = groupTable.settings().init().columns;
                            //                                for (var i = 0; i < keys.length; i++) {
                            //                                    var key = keys[i].data;
                            //                                    rowData[key] = groupDat[0][key];
                            //                                }
                            //                                rowData.id = groupDat[0].id;
                            //                                groupTable.row(clickedRow).remove().draw();
                            //                                groupTable.row.add(rowData).draw();
                            //
                            //                            },
                            //                            error: function (errorThrown) {
                            //                                alert("Error: " + errorThrown);
                            //                            }
                            //                        });

                        } else { //insert
                            var getGroupData = [];
                            getGroupData.push({ name: "id", value: s.id });
                            getGroupData.push({ name: "p", value: 'getGroups' });
                            $.ajax({
                                type: "POST",
                                url: "ajax/ajaxquery.php",
                                data: getGroupData,
                                async: true,
                                success: function (sc) {
                                    var groupDat = sc;
                                    var addData = {};
                                    var keys = groupTable.settings().init().columns;
                                    for (var i = 0; i < keys.length; i++) {
                                        var key = keys[i].data;
                                        addData[key] = groupDat[0][key];
                                    }
                                    addData.id = groupDat[0].id;
                                    groupTable.row.add(addData).draw();

                                },
                                error: function (errorThrown) {
                                    alert("Error: " + errorThrown);
                                }
                            });
                        }

                        $('#groupmodal').modal('hide');

                    },
                    error: function (errorThrown) {
                        alert("Error: " + errorThrown);
                    }
                });
            }
        });



        $('#joinmodal').on('show.bs.modal', function (event) {
            $('#confirmGroupButton').css('display', 'inline');
            var button = $(event.relatedTarget);
            $(this).find('option').remove();
            if (button.attr('id') === 'joingroup') {
                $('#joinmodallabel').html('Join a Group');
                $.ajax({
                    type: "GET",
                    url: "ajax/ajaxquery.php",
                    data: {
                        p: "getJoinGroups"
                    },
                    async: false,
                    success: function (s) {
                        for (var i = 0; i < s.length; i++) {
                            var param = s[i];
                            var optionGroup = new Option(param.name, param.id);
                            $("#mGroupList").append(optionGroup);
                        }
                    },
                    error: function (errorThrown) {
                        alert("Error: " + errorThrown);
                    }
                });
            } else if (button.attr('class') === 'viewGroupMembers') {
                $('#joinmodallabel').html('View Group Members');
                $('#groupLabel').html('Group Members');
                $('#confirmGroupButton').css('display', 'none');
                $('#cancelGroupButton').html('OK');
                var clickedRow = button.closest('tr');
                var rowData = groupTable.row(clickedRow).data();
                $.ajax({
                    type: "GET",
                    url: "ajax/ajaxquery.php",
                    data: {
                        g_id: rowData.id,
                        p: "viewGroupMembers"
                    },
                    async: false,
                    success: function (s) {
                        for (var i = 0; i < s.length; i++) {
                            var param = s[i];
                            var optionGroup = new Option(param.username, param.id);
                            $("#mGroupList").append(optionGroup);
                        }
                    },
                    error: function (errorThrown) {
                        alert("Error: " + errorThrown);
                    }
                });

            } else if (button.attr('class') === 'addUsers') {
                $('#joinmodallabel').html('List of All Users');
                $('#groupLabel').html('Select a user to add to this group');
                $('#confirmGroupButton').html('Add to group');
                $('#cancelGroupButton').html('Cancel');
                var clickedRow = button.closest('tr');
                var rowData = groupTable.row(clickedRow).data();
                $('#joinmodallabel').attr('clickedrow', rowData.id);

                $.ajax({
                    type: "GET",
                    url: "ajax/ajaxquery.php",
                    data: {
                        g_id: rowData.id,
                        p: "getMemberAdd"
                    },
                    async: false,
                    success: function (s) {
                        for (var i = 0; i < s.length; i++) {
                            var param = s[i];
                            var optionGroup = new Option(param.username, param.id);
                            $("#mGroupList").append(optionGroup);
                        }
                    },
                    error: function (errorThrown) {
                        alert("Error: " + errorThrown);
                    }
                });

            }
        });

        $('#joinmodal').on('click', '#confirmGroupButton', function (event) {
            event.preventDefault();
            var label = $('#joinmodallabel').html();
            if (label === 'Join a Group') {
                var selGroup = $('#mGroupList').val();
                if (selGroup !== '') {
                    var joinGro = getValues({ p: "saveUserGroup", g_id: selGroup });
                    if (joinGro) {
                        var getGroupData = [];
                        getGroupData.push({ name: "id", value: selGroup });
                        getGroupData.push({ name: "p", value: 'getGroups' });
                        $.ajax({
                            type: "POST",
                            url: "ajax/ajaxquery.php",
                            data: getGroupData,
                            async: true,
                            success: function (sc) {
                                var groupDat = sc;
                                var addData = {};
                                var keys = groupTable.settings().init().columns;
                                for (var i = 0; i < keys.length; i++) {
                                    var key = keys[i].data;
                                    addData[key] = groupDat[0][key];
                                }
                                addData.id = groupDat[0].id;
                                groupTable.row.add(addData).draw();
                                $('#joinmodal').modal('hide');


                            },
                            error: function (errorThrown) {
                                alert("Error: " + errorThrown);
                            }
                        });

                    }
                }
            } else if (label === 'List of All Users') {
                var clickedrow = $('#joinmodallabel').attr('clickedrow');
                var selGroup = $('#mGroupList').val();
                if (selGroup !== '') {
                    var joinGro = getValues({ p: "saveUserGroup", u_id: selGroup, g_id: clickedrow });
                    if (joinGro) {
                        $('#joinmodal').modal('hide');
                    }
                }
            }

        });

        $('#grouptable').on('click', '.deleteGroup', function (e) {
            e.preventDefault();
            var clickedRow = $(this).closest('tr');
            var rowData = groupTable.row(clickedRow).data();
            $.ajax({
                type: "POST",
                url: "ajax/ajaxquery.php",
                data: {
                    id: rowData.id,
                    p: "removeGroup"
                },
                async: true,
                success: function (s) {
                    groupTable.row(clickedRow).remove().draw();
                },
                error: function (errorThrown) {
                    alert("Error: " + errorThrown);
                }
            });
        });
        //--------------- groups section ends------------------

        //------------   ssh keys section-------------
        //not allow to check both own key and our key
        $('#userKeyCheck').change(function () {
            if ($('#ourKeyCheck').is(":checked") && $('#userKeyCheck').is(":checked")) {
                $('#ourKeyCheck').trigger("click");
            }
        });
        $('#ourKeyCheck').change(function () {
            if ($('#userKeyCheck').is(":checked") && $('#ourKeyCheck').is(":checked")) {
                $('#userKeyCheck').trigger("click");
            }
        });

        function getSSHTableOptions() {
            var button = '<div class="btn-group"><button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-expanded="true">Options <span class="fa fa-caret-down"></span></button><ul class="dropdown-menu" role="menu"><li><a href="#sshKeyModal" data-toggle="modal" class="editSSHKeys">Edit</a></li><li><a href="#" data-toggle="modal" class="deleteSSHKeys">Delete</a></li></ul></div>';
            return button;
        }

        var sshTable = $('#sshKeyTable').DataTable({
            "ajax": {
                url: "ajax/ajaxquery.php",
                data: { "p": "getSSH" },
                "dataSrc": ""
            },
            "columns": [{
                "data": "name"
            }, {
                "data": "date_created"
            }, {
                data: null,
                className: "center",
                fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).html(getSSHTableOptions());
                }
            }]
        });




        $('#sshKeyModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            $(this).find('form').trigger('reset');
            if (button.attr('id') === 'addSSHKey') {
                $('#sshkeysmodaltitle').html('Add SSH Keys');
            } else {
                $('#sshkeysmodaltitle').html('Edit SSH Keys');
                var clickedRow = button.closest('tr');
                var rowData = sshTable.row(clickedRow).data();
                $('#savesshkey').data('clickedrow', clickedRow);
                var formValues = $('#sshKeyModal').find('input');
                $(formValues[0]).val(rowData.id);
                $(formValues[1]).val(rowData.name);

            }
        });
        $('#sshKeyModal').on('hide.bs.modal', function (event) {
            if ($('#userKeyCheck').is(":checked")) {
                $('#userKeyCheck').trigger("click");
            }
            if ($('#ourKeyCheck').is(":checked")) {
                $('#ourKeyCheck').trigger("click");
            }
        });
        $('#sshKeyModal').on('click', '#savesshkey', function (event) {
            event.preventDefault();
            var data = [];
            var sshName = $('#mSSHName').val();
            var savetype = $('#mSSHKeysID').val();
            if (sshName !== '' && ($('#userKeyCheck').is(":checked") || $('#ourKeyCheck').is(":checked"))) {
                if ($('#userKeyCheck').is(":checked")) {
                    data.push({ name: "check_userkey", value: "on" });
                    data.push({ name: "prikey", value: $('#mUserPriKey').val() });
                    data.push({ name: "pubkey", value: $('#mUserPubKey').val() });
                } else if ($('#ourKeyCheck').is(":checked")) {
                    data.push({ name: "check_ourkey", value: "on" });
                    data.push({ name: "prikey", value: $('#mOurPriKey').val() });
                    data.push({ name: "pubkey", value: $('#mOurPubKey').val() });
                }
                data.push({ name: "id", value: savetype });
                data.push({ name: "name", value: sshName });
                data.push({ name: "p", value: "saveSSHKeys" });
                console.log(data);
                $.ajax({
                    type: "POST",
                    url: "ajax/ajaxquery.php",
                    data: data,
                    async: true,
                    success: function (s) {
                        if (savetype.length) { //edit
                            //                        var clickedRow = $('#savegroup').data('clickedrow');
                            //                        var getGroupData = [];
                            //                        getGroupData.push({ name: "id", value: savetype });
                            //                        getGroupData.push({ name: "p", value: 'getGroups' });
                            //                        $.ajax({
                            //                            type: "POST",
                            //                            url: "ajax/ajaxquery.php",
                            //                            data: getGroupData,
                            //                            async: true,
                            //                            success: function (sc) {
                            //                                var groupDat = sc;
                            //                                var rowData = {};
                            //                                var keys = groupTable.settings().init().columns;
                            //                                for (var i = 0; i < keys.length; i++) {
                            //                                    var key = keys[i].data;
                            //                                    rowData[key] = groupDat[0][key];
                            //                                }
                            //                                rowData.id = groupDat[0].id;
                            //                                groupTable.row(clickedRow).remove().draw();
                            //                                groupTable.row.add(rowData).draw();
                            //
                            //                            },
                            //                            error: function (errorThrown) {
                            //                                alert("Error: " + errorThrown);
                            //                            }
                            //                        });

                        } else { //insert
                            //                            var getGroupData = [];
                            //                            getGroupData.push({ name: "id", value: s.id });
                            //                            getGroupData.push({ name: "p", value: 'getGroups' });
                            //                            $.ajax({
                            //                                type: "POST",
                            //                                url: "ajax/ajaxquery.php",
                            //                                data: getGroupData,
                            //                                async: true,
                            //                                success: function (sc) {
                            //                                    var groupDat = sc;
                            //                                    var addData = {};
                            //                                    var keys = groupTable.settings().init().columns;
                            //                                    for (var i = 0; i < keys.length; i++) {
                            //                                        var key = keys[i].data;
                            //                                        addData[key] = groupDat[0][key];
                            //                                    }
                            //                                    addData.id = groupDat[0].id;
                            //                                    groupTable.row.add(addData).draw();
                            //
                            //                                },
                            //                                error: function (errorThrown) {
                            //                                    alert("Error: " + errorThrown);
                            //                                }
                            //                            });
                        }

                        //                        $('#sshKeyModal').modal('hide');

                    },
                    error: function (errorThrown) {
                        alert("Error: " + errorThrown);
                    }
                });
            }
        });








    });
