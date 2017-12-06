$(document).ready(function () {

    //Make modal draggable    
    //    $('.modal-dialog').draggable();
    //    $('#editordiv').draggable("disable")

    //Add Process Modal
    $('#addProcessModal').on('show.bs.modal', function () {
        $(this).find('form').trigger('reset');
        
        menuGrBackup = $('#proGroup').clone();
        inBackup = $('#inputGroup').clone();
        outBackup = $('#outputGroup').clone();
        allBackup = $('#mParameters').clone();
        //   $('#mioProcess').val(selProcessID);
        //        var button = $(event.relatedTarget);
        //        if (button.attr('id') === 'addprocess') {
        //            $('#processmodaltitle').html('Add New Process');
        //        } else {
        //            $('#processmodaltitle').html('Edit Process');
        //
        //            var clickedRow = button.closest('tr');
        //            var rowData = processTable.row(clickedRow).data();
        //
        //            $('#saveprocess').data('clickedrow', clickedRow);
        //
        //            var formValues = $('#processmodal').find('input, textarea');
        //
        //            var keys = Object.keys(rowData);
        //            for (var i = 0; i < keys.length; i++) {
        //                $(formValues[i]).val(rowData[keys[i]]);
        //            }
        //        }

        //ajax for Process Group
        $.ajax({
            type: "GET",
            url: "ajax/ajaxquery.php",
            data: {
                p: "getAllProcessGroups"
            },
            async: false,
            success: function (s) {
                $("#mProcessGroup").empty();
                var firstOptionGroup = new Option("--- Select Menu Process Group ---", '');
                $("#mProcessGroup").append(firstOptionGroup);

                for (var i = 0; i < s.length; i++) {
                    var param = s[i];
                    var optionGroup = new Option(param.group_name, param.id);
                    $("#mProcessGroup").append(optionGroup);
                }
                $('#mProcessGroup').selectize({});
                

            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });

        //ajax for parameters
        $.ajax({
            type: "GET",
            url: "ajax/ajaxquery.php",
            data: {
                p: "getAllParameters"
            },
            async: false,
            success: function (s) {
                $("#mInputs-1").empty();
                $("#mOutputs-1").empty();
                $("#mParamAllIn").empty();
                var firstOptionIn = new Option("--- Add Input ---", '');
                var firstOptionOut = new Option("--- Add Output ---", '');
                var firstOptionSelect = new Option("--- All Parameters ---", '');
                $("#mInputs-1").append(firstOptionIn);
                $("#mOutputs-1").append(firstOptionOut);
                $("#mParamAllIn").append(firstOptionSelect);

                for (var i = 0; i < s.length; i++) {
                    var param = s[i];
                    var optionIn = new Option(param.name, param.id);
                    var optionOut = new Option(param.name, param.id);
                    var optionAll = new Option(param.name, param.id);
                    $("#mInputs-1").append(optionIn);
                    $("#mOutputs-1").append(optionOut);
                    $("#mParamAllIn").append(optionAll);

                }
                dropDownInputs = $("#mInputs-1").html()
                dropDownOutputs = $("#mOutputs-1").html()
                //dropDownAll = $("#mOutputs-1").html()
                numInputs = 1;
                numOutputs = 1;
                $('#mInputs-1').selectize({});
                $('#mOutputs-1').selectize({});
                $('#mParamAllIn').selectize({});
            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });

    });


    //0:{name: "id", value: ""}
    //1:{name: "name", value: "Map_bowtie"}
    //2:{name: "version", value: "1.0.0"}
    //3:{name: "process_group_id", value: "2"}
    //3:{name: "mInputs-1", value: "10"}
    //4:{name: "mInputs-2", value: "11"}
    //5:{name: "mInputs-3", value: "-1"}
    //6:{name: "mInName-0", value: ""}
    //7:{name: "mInName-1", value: "genome"}
    //8:{name: "mInName-2", value: "222"}
    //9:{name: "mOutputs-1", value: "11"}
    //10:{name: "mOutputs-2", value: "-1"}
    //11:{name: "mOutName-0", value: ""}
    //12:{name: "mOutName-1", value: "333"}            
    function cleanProcessModal() {
        $('#addProcessModal').modal('hide');
        $('#mParameters').remove();
        $('#inputGroup').remove();
        $('#outputGroup').remove();
        $('#proGroup').remove();
        $('#hrDiv').remove();
        
        $('#versionGroup').after(menuGrBackup);
        $('#proGroup').after(allBackup);
        $('#proGroup').after('<hr id = "hrDiv">');
        $('#mParameters').after(inBackup);
        $('#inputGroup').after(outBackup);
        editor.setValue("");
    }

    // Add process modal to database
    $('#addProcessModal').on('click', '#dismissprocess', function (event) {
      cleanProcessModal();
    });
    
    // Add process modal to database
    $('#addProcessModal').on('click', '#saveprocess', function (event) {
        event.preventDefault();
        var formValues = $('#addProcessModal').find('input, select');
        //type = $('#mioType').val();
        var data = formValues.serializeArray(); // convert form to array
        var dataToProcess = []; //dataToProcess to save in process table

        //id[0], name[1], version[2], and process_group_id[3] taken from data object
        for (var i = 0; i < 4; i++) {
            dataToProcess[i] = data[i];
        }
        var proName = dataToProcess[1].value;
        var proGroId = dataToProcess[3].value;
        scripteditor = editor.getValue();
        dataToProcess.push({
            name: "script",
            value: scripteditor
        });
        dataToProcess.push({
            name: "p",
            value: "saveProcess"
        });
        if (proName === '' || proGroId == '-1') {
            dataToProcess = [];
        }
        if (dataToProcess.length > 0) {
            $.ajax({
                type: "POST",
                url: "ajax/ajaxquery.php",
                data: dataToProcess,
                async: true,
                success: function (s) {
                    var process_id = s.id;
                    $('#side-' + proGroId).append('<li> <a href="" ondragstart="dragStart(event)" ondrag="dragging(event)" draggable="true" id="' + proName + '@' + process_id + '"> <i class="fa fa-angle-double-right"></i>' + proName + '</a></li>');
                    //-----Add input output parameters to process_parameters
                    for (var i = 4; i < data.length; i++) {
                        var dataToProcessParam = []; //dataToProcessPram to save in process_parameters table
                        var PattPar = /(.*)-(.*)/;
                        var matchFPart = '';
                        var matchSPart = '';
                        var matchVal = '';
                        var matchFPart = data[i].name.replace(PattPar, '$1')
                        var matchSPart = data[i].name.replace(PattPar, '$2')
                        var matchVal = data[i].value
                        if (matchFPart === 'mInputs' && matchVal !== '-1') {
                            for (var k = 4; k < data.length; k++) {
                                if (data[k].name === 'mInName-' + matchSPart && data[k].value === '') {
                                    dataToProcessParam = [];
                                    break;
                                } else if (data[k].name === 'mInName-' + matchSPart && data[k].value !== '') {
                                    dataToProcessParam.push({
                                        name: "parameter_id",
                                        value: matchVal
                                    });
                                    dataToProcessParam.push({
                                        name: "type",
                                        value: 'input'
                                    });
                                    dataToProcessParam.push({
                                        name: "name",
                                        value: data[k].value
                                    });
                                    dataToProcessParam.push({
                                        name: "process_id",
                                        value: process_id
                                    });
                                    dataToProcessParam.push({
                                        name: "p",
                                        value: "saveProcessParameter"
                                    });
                                }
                            }
                        } else if (matchFPart === 'mOutputs' && matchVal !== '-1') {
                            for (var k = 4; k < data.length; k++) {
                                if (data[k].name === 'mOutName-' + matchSPart && data[k].value === '') {
                                    dataToProcessParam = [];
                                    break;
                                } else if (data[k].name === 'mOutName-' + matchSPart && data[k].value !== '') {
                                    dataToProcessParam.push({
                                        name: "parameter_id",
                                        value: matchVal
                                    });
                                    dataToProcessParam.push({
                                        name: "type",
                                        value: 'output'
                                    });
                                    dataToProcessParam.push({
                                        name: "name",
                                        value: data[k].value
                                    });
                                    dataToProcessParam.push({
                                        name: "process_id",
                                        value: process_id
                                    });
                                    dataToProcessParam.push({
                                        name: "p",
                                        value: "saveProcessParameter"
                                    });


                                }
                            }
                        }
                        if (dataToProcessParam.length > 0) {
                            $.ajax({
                                type: "POST",
                                url: "ajax/ajaxquery.php",
                                data: dataToProcessParam,
                                async: true,
                                success: function (s) {},
                                error: function (errorThrown) {
                                    alert("Error: " + errorThrown);
                                }
                            });



                        }
                    }
                    
                    cleanProcessModal();

                },
                error: function (errorThrown) {
                    alert("Error: " + errorThrown);
                }
            });
        }


    });

    //insert dropdown, textbox and 'remove button' for each parameters
    $(function () {
        $(document).on('change', 'select', function () {
            var id = $(this).attr("id");
            var Patt = /m(.*)puts-(.*)/;
            var type = id.replace(Patt, '$1'); //In or Out
            var col1init = "m" + type + "puts"; //column1 initials
            var col2init = "m" + type + "Name";
            var col3init = "m" + type + "Namedel";

            var num = id.replace(Patt, '$2');
            var prevParId = $("#" + id).attr("prev");
            var selParId = $("#" + id + " option:selected").val();

            if (prevParId === '-1' && selParId !== '-1') {
                if (type === 'In') {
                    numInputs++
                    var idRows = numInputs; // numInputs or numOutputs
                } else if (type === 'Out') {
                    numOutputs++
                    var idRows = numOutputs; // numInputs or numOutputs
                }
                $("#" + col1init).append('<select id="' + col1init + '-' + idRows + '" num="' + idRows + '" class="fbtn btn-default form-control" prev ="-1"  name="' + col1init + '-' + idRows + '"></select>');
                $("#" + col2init).append('<input type="text" placeholder="Enter name" class="form-control " style ="margin-bottom: 5px;" id="' + col2init + '-' + String(idRows - 1) + '" name="' + col2init + '-' + String(idRows - 1) + '">');
                $("#" + col3init).append('<button type="submit" class="btn btn-default form-control delRow" style ="margin-bottom: 5px;" id="' + col3init + '-' + String(idRows - 1) + '" name="' + col3init + '-' + String(idRows - 1) + '"><i class="glyphicon glyphicon-remove"></i></button>');
                
//                var $select = $('#mParamAllIn').selectize(options);
                var opt = $('#mParamAllIn')[0].selectize.options;
                console.log(opt);
                var parList = ''; 
                parList = parList + '<option value="">--- Add ' + type +'put ---</option>';     
                
                $.each(opt, function(element){
                    console.log(opt[element]);
                    parList = parList + '<option value="' + opt[element].value + '">' + opt[element].text + '</option>';
                });
                
                
                
                console.log(parList);
                console.log(eval('dropDown' + type + 'puts'));
                $("#" + col1init + "-" + idRows).append(parList);
                $("#" + id).attr("prev", selParId)
                $("#" + col1init+ '-' + idRows).selectize({});
                
            }
        })

    });


    //remove  dropdown list of parameters
    $(document).on("click", ".delRow", function (event) {
        event.preventDefault();
        var id = $(this).attr("id");
        var Patt = /m(.*)Namedel-(.*)/;
        var type = id.replace(Patt, '$1'); //In or Out
        var col1init = "m" + type + "puts"; //column1 initials
        var col2init = "m" + type + "Name";
        var col3init = "m" + type + "Namedel";
        var num = id.replace(Patt, '$2');
        $("#" + col1init + "-" + String(num)).next().remove()
        
        $("#" + col1init + "-" + String(num)).remove()
        
        $("#" + col2init + "-" + String(num)).remove()
        $("#" + col3init + "-" + String(num)).remove()
    
        
    });
        //parameter remove button
        $('#addProcessModal').on('click', '#mParamDel', function (e) {
        e.preventDefault();
            var selectParam = '';
            var formValues = $('#addProcessModal').find('#mParamAllIn');
            var data = formValues.serializeArray(); 
            selectParam = data[0].value;
            
        $.ajax({
            type: "POST",
            url: "ajax/ajaxquery.php",
            data: {
                id: selectParam,
                p: "removeParameter"
            },
            async: false,
            success: function (s) {
                var allBox = $('#addProcessModal').find('select');
                for (var i = 1; i < allBox.length; i++) {//processGroup is skipped at i=0
                    var parBoxId = allBox[i].getAttribute('id');
                    console.log(parBoxId);
                    $('#' + parBoxId)[0].selectize.removeOption(selectParam); 
                }               
            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
    });


    
    
    
    //parameter modal 
    $('#parametermodal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        $(this).find('form').trigger('reset');
        if (button.attr('id') === 'mParamAdd') {
            $('#parametermodaltitle').html('Add New Parameter');

        } else if (button.attr('id') === 'mParamEdit') {
            $('#parametermodaltitle').html('Edit Parameter');
                    var formValues = $('#addProcessModal').find('input, select');
                    var selParamId = "";
                    var data = formValues.serializeArray(); // convert form to array
                    data.forEach(function (element) {
                        if (element.name === 'ParamAll') {
                            selParamId = element.value;
                        }
                    });
                    console.log(selParamId); 
            
            $.ajax({
            type: "GET",
            url: "ajax/ajaxquery.php",
            data: {
                p: "getAllParameters"
            },
            async: false,
            success: function (s) {
                var showParam= {};
                s.forEach(function (element) {
                    if (element.id === selParamId) {
                        showParam = element; 
                    }
                });
                //insert data into form
                var formValues = $('#parametermodal').find('input, select');
                console.log(formValues);
                
                var keys = Object.keys(showParam);
                console.log(keys);
                for (var i = 0; i < keys.length; i++) {
                    $(formValues[i]).val(showParam[keys[i]]);
                }
 
            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
        }
    });
            
//        //add Process Group
//    $(document).on("click", "#groupAdd", function (event) {
//        event.preventDefault();
//        var id = $(this).attr("id");
//        $("#mProcessGroupAdd").remove()
//        $("#proGroup").append('<div id="mProcessGroupAdd" class="col-sm-3" style=" padding-left: 0; padding-right: 0;"><input type="text" placeholder="Enter new group name" class="form-control" id="proGroupNew" name="process_group"></div>');
//        $("#proGroup").append('<div id="mProcessGroupDel" class="col-sm-1" style=" width: auto; padding-left: 0; padding-right: 0;"><button type="submit" class="btn btn-default form-control" id="GroupDel"  ><i class="glyphicon glyphicon-remove"></i></div>');
//    });
//            //remove Process Group
//    $(document).on("click", "#groupDel", function (event) {
//        event.preventDefault();
//        var id = $(this).attr("id");
//        $("#mProcessGroupAdd").remove()
//        $("#mProcessGroupDel").remove()
//        $("#proGroup").append('<div id="mProcessGroupAdd" class="col-sm-1" style=" width: auto; padding-left: 0; padding-right: 0;"><button type="submit" class="btn btn-default form-control" id="groupAdd"><i class="glyphicon glyphicon-plus"></i></button></div>'); 
//    });            
            
    // process group modal 
    $('#processGroupModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        $(this).find('form').trigger('reset');
        if (button.attr('id') === 'groupAdd') {
            $('#processGroupmodaltitle').html('Add Menu Group');

        } else if (button.attr('id') === 'groupEdit') {
            $('#processGroupmodaltitle').html('Edit Menu Group');
                    var formValues = $('#processGroupModal').find('input');
                    var selParamId = "";
                    var data = formValues.serializeArray(); // convert form to array
                    console.log(data); 
            
                    data.forEach(function (element) {
                        if (element.name === 'ParamAll') {
                            selParamId = element.value;
                        }
                    });
                    console.log(selParamId); 
            
            $.ajax({
            type: "GET",
            url: "ajax/ajaxquery.php",
            data: {
                p: "getAllParameters"
            },
            async: false,
            success: function (s) {
                var showParam= {};
                s.forEach(function (element) {
                    if (element.id === selParamId) {
                        showParam = element; 
                    }
                });
                //insert data into form
                var formValues = $('#parametermodal').find('input, select');
                console.log(formValues);
                
                var keys = Object.keys(showParam);
                console.log(keys);
                for (var i = 0; i < keys.length; i++) {
                    $(formValues[i]).val(showParam[keys[i]]);
                }
 
            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
            
        
        }
    });
    
    //parameter modal save button
    $('#parametermodal').on('click', '#saveparameter', function (event) {
        event.preventDefault();
        var selParName ='';
        var formValues = $('#parametermodal').find('input, select');
        var savetype = $('#mIdPar').val();
        var data = formValues.serializeArray(); // convert form to array
        var selParID = data[0].value;
        var selParName = data[1].value;
        data.push({name: "p", value: "saveParameter"});
        $.ajax({
            type: "POST",
            url: "ajax/ajaxquery.php",
            data: data,
            async: false,
            success: function (s) {
                if (savetype.length) { //Edit Parameter
                    //$('#mParamAllIn')[0].selectize.updateOption(selParID, {value: selParID, text: selParName } );           
                    var allBox = $('#addProcessModal').find('select');
                    for (var i = 1; i < allBox.length; i++) {//processGroup is skipped at i=0
                        var parBoxId = allBox[i].getAttribute('id');
                        $('#' + parBoxId)[0].selectize.updateOption(selParID, {value: selParID, text: selParName } );  
                    } 
                    
                } else { //Add Parameter
                    //$('#mParamAllIn')[0].selectize.addOption({value: s.id, text: selParName });
                    var allBox = $('#addProcessModal').find('select');
                    for (var i = 1; i < allBox.length; i++) {//processGroup is skipped at i=0
                        var parBoxId = allBox[i].getAttribute('id');
                        $('#' + parBoxId)[0].selectize.addOption({value: s.id, text: selParName });
                    }                    
                }
                $('#parametermodal').modal('hide');

            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
    });
    
    


    
    
    






});
