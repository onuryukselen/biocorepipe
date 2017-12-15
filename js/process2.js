infoID = '';
// cleanProcessModal when modal is closed     
function cleanProcessModal() {
        $('#addProcessModal').modal('hide');
        $('#mParameters').remove();
        $('#inputGroup').remove();
        $('#outputGroup').remove();
        $('#proGroup').remove();
        $('#hrDiv').remove();

        $('#describeGroup').after(menuGrBackup);
        $('#proGroup').after(allBackup);
        $('#proGroup').after('<hr id = "hrDiv">');
        $('#mParameters').after(inBackup);
        $('#inputGroup').after(outBackup);
        editor.setValue("");
        $('#deleteProcess').css('display', "none" );
    
        if (infoID > 0) {
            $('#mIdPro').removeAttr('disabled');
            $('#mName').removeAttr('disabled');
            $('#mVersion').removeAttr('disabled');
            $('#mDescription').removeAttr('disabled');
            editor.setReadOnly(false);
            $('#saveprocess').css('display', "inline");
            infoID = '';
        }
    }

//Adjustable textwidth
    var $inputText = $('input.width-dynamic');
    // Resize based on text if text.length > 0
    // Otherwise resize based on the placeholder
function resizeForText(text) {
        var $this = $(this);
        if (!text.trim()) {
            text = $this.attr('placeholder').trim();
        }
        var $span = $this.parent().find('span');
        $span.text(text);
        var $inputSize = $span.width() + 10;
        if ($inputSize < 50) {
            $inputSize = 50;
        }
        $this.css("width", $inputSize);
    }
    $inputText.keypress(function (e) {
        if (e.which && e.charCode) {
            var c = String.fromCharCode(e.keyCode | e.charCode);
            var $this = $(this);
            resizeForText.call($this, $this.val() + c);
        }
    });
    // Backspace event only fires for keyup
    $inputText.keyup(function (e) {
        if (e.keyCode === 8 || e.keyCode === 46) {
            resizeForText.call($(this), $(this).val());
        }
    });
    $inputText.each(function () {
        var $this = $(this);
        resizeForText.call($this, $this.val())
    });


$(document).ready(function () {
    //Make modal draggable    
    //    $('.modal-dialog').draggable();
    //    $('#editordiv').draggable("disable")
    

    function getValues(data) {
        var result = null;
        $.ajax({
            url: "ajax/ajaxquery.php",
            data: data,
            async: false,
            cache: false,
            success: function (data) {
                result = data;
            }
        });
        return result;
    }

    //Click on sideMenu items to Open Pipeline 
    //$('.pipelineItems').on('click', function (event) {
      $("#Pipelines").on('click', '.pipelineItems', function(event) {  
        event.preventDefault();
        
        var button = $(event.currentTarget);
        var selPipelineId = event.currentTarget.id.replace(/(.*)-(.*)/, '$2');
        $('#pipeline-title').val(event.currentTarget.text);
        $('#pipeline-title').attr('num', selPipelineId);
        resizeForText.call($inputText, event.currentTarget.text);
        openPipeline(selPipelineId);
        
    });
    
    
    
    //Update Pipeline Name 
    $("#pipeline-title").bind('blur keyup', function (e) { //Click outside of the field or enter
        if (e.type == 'blur') {
            if ($("#pipeline-title").attr('num')  !== '') {
            var el = $(this);
            var pipeName = el.val();
            var pipeID = el.attr('num');
            if (pipeName !== '') {
                var ret = getValues({
                    p: "savePipelineName",
                    'name': pipeName,
                    'id': pipeID
                });
                
                document.getElementById('pipeline-' + pipeID).innerHTML = '<i class="fa fa-angle-double-right"></i>' + pipeName; }
//                else if ($("#pipeline-title").attr('num')  === '') {
//                    $("#pipeline-title").attr('num',ret.id)
//                    $('#allPipelines').append('<li><a href="" class="pipelineItems" onclick="openPipeline(' + ret.id + ')" id="pipeline-'+ ret.id +'"><i class="fa fa-angle-double-right"></i>' + pipeName + '</a></li>'); 
//                }
            }
        } else if (e.keyCode == '13') {
            $(this).blur();
        }    
        //}
        
    });
    

    renderParam = {option: function (data, escape) {
                            return '<div class="option">' +
                                '<span class="title">' + escape(data.name) + '</span>' +
                                '<span class="url">' + 'File Type: ' + escape(data.file_type) + '</span>' +
                                '<span class="url">' + 'Qualifier: ' + escape(data.qualifier) + '</span>' +
                                '</div>';
                        },
                        item: function (data, escape) {
                            return '<div class="item" data-value="' + escape(data.id) + '">' + escape(data.name) + '  <i><small>' + '  (' + escape(data.file_type) + ', ' + escape(data.qualifier) + ')</small></i>' + '</div>';
                        }
                    };


    //Add Process Modal
    $('#addProcessModal').on('show.bs.modal', function (event) {
        $(this).find('form').trigger('reset');
        menuGrBackup = '';
        inBackup = '';
        outBackup = '';
        allBackup = '';
        menuGrBackup = $('#proGroup').clone();
        inBackup = $('#inputGroup').clone();
        outBackup = $('#outputGroup').clone();
        allBackup = $('#mParameters').clone();

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
                var firstOptionGroup = new Option("Select Menu Process Group...", '');
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
                numInputs = 1;
                numOutputs = 1;
                
                $('#mInputs-1').selectize({
                    valueField: 'id',
                    searchField: 'name',
                    placeholder: "Add input...",
                    options: s,
                    render: renderParam
                });
                $('#mOutputs-1').selectize({
                    valueField: 'id',
                    searchField: 'name',
                    placeholder: "Add output...",
                    options: s,
                    render: renderParam
                });
                console.log(s);
                $('#mParamAllIn').parent().hide();
            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
        var button = $(event.relatedTarget);
        if (button.attr('id') === 'addprocess') {
            $('#processmodaltitle').html('Add New Process');

        } 
        else if (infoID > 0) {
            $('#processmodaltitle').html('Process Details');
            var selProcessId = infoID;
            $('#mIdPro').val(selProcessId);
            //Ajax for selected process
            var showProcess = getValues({
                p: "getProcessData",
                "process_id": selProcessId
            })[0];    
            //insert data into form
            var formValues = $('#addProcessModal').find('input, select, textarea');
            $(formValues[0]).val(showProcess.id);
            $(formValues[0]).attr('disabled', "disabled");
            $(formValues[1]).val(showProcess.name);
            $(formValues[1]).attr('disabled', "disabled");
            $(formValues[2]).val(showProcess.version);
            $(formValues[2]).attr('disabled', "disabled");
            $(formValues[3]).val(showProcess.summary);
            $(formValues[3]).attr('disabled', "disabled");
            //var scriptfromDatabase = JSON.parse(showProcess.script);
            var scriptfromDatabase = showProcess.script;
            editor.setValue(scriptfromDatabase);
            editor.setReadOnly(true);
            $('#mProcessGroup')[0].selectize.setValue(showProcess.process_group_id, false);
            $('#mProcessGroup')[0].selectize.disable();
            //Ajax for selected process input/outputs
            var inputs = getValues({
                p: "getInputs",
                "process_id": selProcessId
            });
            var outputs = getValues({
                p: "getOutputs",
                "process_id": selProcessId
            });
            for (var i = 0; i < inputs.length; i++) {
                var numFormIn = i + 1;
                $('#mInputs-' + numFormIn)[0].selectize.setValue(inputs[i].parameter_id, false);
                $('#mInputs-' + numFormIn)[0].selectize.disable();
                $('#mInName-' + numFormIn).val(inputs[i].name);
                $('#mInName-' + numFormIn).attr('disabled', "disabled");
                $('#mInNamedel-' + numFormIn).remove()
                
            }
            
            var delNumIn = numFormIn + 1;
            $('#mInputs-' + delNumIn + '-selectized').parent().parent().remove();
            for (var i = 0; i < outputs.length; i++) {
                var numFormOut = i + 1;
                $('#mOutputs-' + numFormOut)[0].selectize.setValue(outputs[i].parameter_id, false);
                $('#mOutputs-' + numFormOut)[0].selectize.disable();
                
                $('#mOutName-' + numFormOut).val(outputs[i].name);
                $('#mOutName-' + numFormOut).attr('disabled', "disabled");
                $('#mOutNamedel-' + numFormOut).remove()
                
            }
            
            var delNumOut = numFormOut + 1;
            $('#mOutputs-' + delNumOut + '-selectized').parent().parent().remove();
            $('#mParameters').remove();
            $('#mProcessGroupAdd').remove();
            $('#mProcessGroupEdit').remove();
            $('#mProcessGroupDel').remove();
            $('#saveprocess').css('display', "none");

        }

        else {
            $('#processmodaltitle').html('Edit/Delete Process');
            $('#deleteProcess').css('display', "inline" );
            delProMenuID = button.attr('id');
            var PattPro = /(.*)@(.*)/; //Map_Tophat2@11
            var selProcessId = button.attr('id').replace(PattPro, '$2');
            $('#mIdPro').val(selProcessId);
            //Ajax for selected process
            var showProcess = getValues({
                p: "getProcessData",
                "process_id": selProcessId
            })[0];
            sMenuProIdFirst = button.attr('id');
            sMenuProGroupIdFirst = showProcess.process_group_id;

            //insert data into form
            var formValues = $('#addProcessModal').find('input, select, textarea');
            $(formValues[0]).val(showProcess.id);
            $(formValues[1]).val(showProcess.name);
            $(formValues[2]).val(showProcess.version);
            $(formValues[3]).val(showProcess.summary);
            //var a = JSON.parse(showProcess.script);
            editor.setValue(showProcess.script);
            editor.clearSelection();
            $('#mProcessGroup')[0].selectize.setValue(showProcess.process_group_id, false);
            //Ajax for selected process input/outputs
            var inputs = getValues({
                p: "getInputs",
                "process_id": selProcessId
            });
            var outputs = getValues({
                p: "getOutputs",
                "process_id": selProcessId
            });
            for (var i = 0; i < inputs.length; i++) {
                var numForm = i + 1;
                console.log('#mInputs-' + numForm);
                $('#mInputs-' + numForm)[0].selectize.setValue(inputs[i].parameter_id, false);
                $('#mInName-' + numForm).val(inputs[i].name);
                $('#mInName-' + numForm).attr('ppID', inputs[i].id);
            }
            for (var i = 0; i < outputs.length; i++) {
                var numForm = i + 1;
                $('#mOutputs-' + numForm)[0].selectize.setValue(outputs[i].parameter_id, false);
                $('#mOutName-' + numForm).val(outputs[i].name);
                $('#mOutName-' + numForm).attr('ppID', outputs[i].id);

            }
        }

    });
    
    // Delete process modal 
    $('#confirmModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        if (button.attr('id') === 'deleteProcess') {
            $('#confirmModalText').html('Are you sure you want to delete this process?');
        }
    });
    $('#confirmModal').on('click', '.delprocess', function (event) {
        var processIdDel = $('#mIdPro').val();
        var delProce = getValues({
                p: "removeProcess",
                "id": processIdDel
            });
        var delSideMenuNode = document.getElementById(delProMenuID).parentNode;
        delSideMenuNode.parentNode.removeChild(delSideMenuNode);
        delProMenuID='';
        cleanProcessModal();
    });


    // Dismiss process modal 
    $('#addProcessModal').on('click', '.dismissprocess', function (event) {
        cleanProcessModal();
    });
    // Dismiss parameters modal 
    $('#parametermodal').on('click', '.dismissparameter', function (event) {
        $('#mParamListIn')[0].selectize.destroy();
        $('#mParamsDynamic').css('display', "inline");
        $('#mParamList').css('display', "none");
        
    });
        // Dismiss parameters delete modal 
    $('#delparametermodal').on('click', '.dismissparameterdel', function (event) {
        $('#mParamListDel')[0].selectize.destroy();
        
    });
    
    $('#parametermodal').on('click', '#mParamOpen', function (event) {
        $('#mParamsDynamic').css('display', "none");
        $('#mParamList').css('display', "inline");
    });
    
    // Add process modal to database
    $('#addProcessModal').on('click', '#saveprocess', function (event) {
        event.preventDefault();
        var savetype = $('#mIdPro').val();
        var formValues = $('#addProcessModal').find('input, select, textarea');
        var data = formValues.serializeArray(); // convert form to array
        var dataToProcess = []; //dataToProcess to save in process table
        //id[0], name[1], version[2], and process_group_id[4] taken from data object
        var sMenuProIdFinal = data[1].value + '@' + data[0].value;
        var sMenuProGroupIdFinal = data[4].value;
        for (var i = 0; i < 5; i++) {
            dataToProcess[i] = data[i];
        }
        var proID = dataToProcess[0].value;
        var proName = dataToProcess[1].value;
        var proGroId = dataToProcess[4].value;
        //var scripteditor = JSON.stringify(editor.getValue());
        var scripteditor = editor.getValue();
        dataToProcess.push({
            name: "script",
            value: scripteditor
        });
        dataToProcess.push({
            name: "p",
            value: "saveProcess"
        });
        if (proName === '' || proGroId == '') {
            dataToProcess = [];
        }        
        if (dataToProcess.length > 0) {
            $.ajax({
                type: "POST",
                url: "ajax/ajaxquery.php",
                data: dataToProcess,
                async: true,
                success: function (s) {
                    if (savetype.length) { //Edit Process
                        var process_id = proID;
                        document.getElementById(sMenuProIdFirst).setAttribute('id', sMenuProIdFinal);
                        var PattMenu = /(.*)@(.*)/; //Map_Tophat2@11
                        var nMenuProName = sMenuProIdFinal.replace(PattMenu, '$1');
                        document.getElementById(sMenuProIdFinal).innerHTML = '<i class="fa fa-angle-double-right"></i>' + nMenuProName;
                        if (sMenuProGroupIdFirst !== sMenuProGroupIdFinal) {
                            document.getElementById(sMenuProIdFinal).remove();
                            $('#side-' + sMenuProGroupIdFinal).append('<li> <a data-toggle="modal" data-target="#addProcessModal" data-backdrop="false" href="" ondragstart="dragStart(event)" ondrag="dragging(event)" draggable="true" id="' + sMenuProIdFinal + '"> <i class="fa fa-angle-double-right"></i>' + nMenuProName + '</a></li>');
                        }
                        var inputs = getValues({
                            p: "getInputs",
                            "process_id": process_id
                        });
                        var outputs = getValues({
                            p: "getOutputs",
                            "process_id": process_id
                        });

                    } else { //Add Process
                        var process_id = s.id;
                        $('#side-' + proGroId).append('<li> <a data-toggle="modal" data-target="#addProcessModal" data-backdrop="false" href="" ondragstart="dragStart(event)" ondrag="dragging(event)" draggable="true" id="' + proName + '@' + process_id + '"> <i class="fa fa-angle-double-right"></i>' + proName + '</a></li>');
                    }

                    //-----Add input output parameters to process_parameters
                    var ppIDinputList = [];
                    var ppIDoutputList = [];
                    for (var i = 5; i < data.length; i++) {
                        var dataToProcessParam = []; //dataToProcessPram to save in process_parameters table
                        var PattPar = /(.*)-(.*)/;
                        var matchFPart = '';
                        var matchSPart = '';
                        var matchVal = '';
                        var matchFPart = data[i].name.replace(PattPar, '$1')
                        var matchSPart = data[i].name.replace(PattPar, '$2')
                        var matchVal = data[i].value
                        if (matchFPart === 'mInputs' && matchVal !== '') {
                            for (var k = 5; k < data.length; k++) {
                                if (data[k].name === 'mInName-' + matchSPart && data[k].value === '') {
                                    dataToProcessParam = [];
                                    break;
                                } else if (data[k].name === 'mInName-' + matchSPart && data[k].value !== '') {
                                    var ppID = $('#' + data[k].name).attr("ppID");
                                    ppIDinputList.push(ppID);
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
                                        name: "id",
                                        value: ppID
                                    });
                                    dataToProcessParam.push({
                                        name: "p",
                                        value: "saveProcessParameter"
                                    });
                                }
                            }
                        } else if (matchFPart === 'mOutputs' && matchVal !== '') {
                            for (var k = 5; k < data.length; k++) {
                                if (data[k].name === 'mOutName-' + matchSPart && data[k].value === '') {
                                    dataToProcessParam = [];
                                    break;
                                } else if (data[k].name === 'mOutName-' + matchSPart && data[k].value !== '') {
                                    var ppID = $('#' + data[k].name).attr("ppID");
                                    ppIDoutputList.push(ppID);
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
                                        name: "id",
                                        value: ppID
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
                    //Find deleted input/outputs
                    if (savetype.length) { //Edit Process
                        for (var i = 0; i < inputs.length; i++) {
                            if (ppIDinputList.indexOf(inputs[i].id) < 0) {
                                //removeProcessParameter
                                $.ajax({
                                    type: "POST",
                                    url: "ajax/ajaxquery.php",
                                    data: {
                                        id: inputs[i].id,
                                        p: "removeProcessParameter"
                                    },
                                    async: true,
                                    success: function () {},
                                    error: function (errorThrown) {
                                        alert("Error: " + errorThrown);
                                    }
                                });
                            }
                        }
                        for (var i = 0; i < outputs.length; i++) {
                            if (ppIDoutputList.indexOf(outputs[i].id) < 0) {
                                //removeProcessParameter
                                $.ajax({
                                    type: "POST",
                                    url: "ajax/ajaxquery.php",
                                    data: {
                                        id: outputs[i].id,
                                        p: "removeProcessParameter"
                                    },
                                    async: true,
                                    success: function () {},
                                    error: function (errorThrown) {
                                        alert("Error: " + errorThrown);
                                    }
                                });
                            }
                        }
                    }
                    cleanProcessModal();
                    refreshDataset();
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
                $("#" + col1init).append('<select id="' + col1init + '-' + idRows + '" num="' + idRows + '" class="fbtn btn-default form-control" style ="margin-bottom: 5px;" prev ="-1"  name="' + col1init + '-' + idRows + '"></select>');
                $("#" + col2init).append('<input type="text" ppID="" placeholder="Enter name" class="form-control " style ="margin-bottom: 5px;" id="' + col2init + '-' + String(idRows - 1) + '" name="' + col2init + '-' + String(idRows - 1) + '">');
                $("#" + col3init).append('<button type="submit" class="btn btn-default form-control delRow" style ="margin-bottom: 5px;" id="' + col3init + '-' + String(idRows - 1) + '" name="' + col3init + '-' + String(idRows - 1) + '"><i class="glyphicon glyphicon-remove"></i></button>');

                var opt = $('#mInputs-1')[0].selectize.options;
                var newOpt =[];
                $.each(opt, function (element) {
                    delete opt[element].$order;
                    newOpt.push(opt[element]);
                });
                $("#" + id).attr("prev", selParId)
                $("#" + col1init + "-" + idRows).selectize({
                    valueField: 'id',
                    searchField: 'name',
                    placeholder: "Add input...",
                    options: newOpt,
                    render: renderParam
                });
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

/////////parameter modal 
    $('#parametermodal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        $(this).find('form').trigger('reset');
        //ajax for parameters
            $.ajax({
                type: "GET",
                url: "ajax/ajaxquery.php",
                data: {
                    p: "getAllParameters"
                },
                async: false,
                success: function (s) {
                $("#mParamListIn").empty();
                var firstOptionSelect = new Option("Available Parameters...", '');
                $("#mParamListIn").append(firstOptionSelect);
                for (var i = 0; i < s.length; i++) {
                    var param = s[i];
                    var optionAll = new Option(param.name, param.id);
                    $("#mParamListIn").append(optionAll);
                }
                $('#mParamListIn').selectize({});
                }
            });
        
        if (button.attr('id') === 'mParamAdd') {
            $('#parametermodaltitle').html('Add New Parameter');
            $('#mParamsDynamic').css('display', "inline");
            $('#mParamList').css('display', "none");
            
        } else if (button.attr('id') === 'mParamEdit') {
            $('#parametermodaltitle').html('Edit Parameter');            $('#mParamsDynamic').css('display', "none");
            $('#mParamList').css('display', "inline");
            

            var formValues = $('#addProcessModal').find('input, select, textarea');
            var selParamId = "";
            var data = formValues.serializeArray(); // convert form to array
            data.forEach(function (element) {
                if (element.name === 'ParamAll') {
                    selParamId = element.value;
                }
            });
            $.ajax({
                type: "GET",
                url: "ajax/ajaxquery.php",
                data: {
                    p: "getAllParameters"
                },
                async: false,
                success: function (s) {
                    var showParam = {};
                    s.forEach(function (element) {
                        if (element.id === selParamId) {
                            showParam = element;
                        }
                    });
                    //insert data into form
                    var formValues = $('#parametermodal').find('input, select');
                    var keys = Object.keys(showParam);
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
    
    //Delparametermodal to delete parameters
    $('#delparametermodal').on('show.bs.modal', function (event) {
        $.ajax({
                type: "GET",
                url: "ajax/ajaxquery.php",
                data: {
                    p: "getAllParameters"
                },
                async: false,
                success: function (s) {
                $("#mParamListDel").empty();
                var firstOptionSelect = new Option("Select Parameter to Delete...", '');
                $("#mParamListDel").append(firstOptionSelect);
                for (var i = 0; i < s.length; i++) {
                    var param = s[i];
                    var optionAll = new Option(param.name, param.id);
                    $("#mParamListDel").append(optionAll);
                }
                $('#mParamListDel').selectize({});
                }
            });
        
    });
    
    //parameter delete button in Delparametermodal
    $('#delparametermodal').on('click', '#delparameter', function (e) {
        var selectParam = '';
        var formValues = $('#delparametermodal').find('#mParamListDel');
        var data = formValues.serializeArray();
        var selectParam = data[0].value;
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
                for (var i = 2; i < allBox.length; i++) { //processGroup and paramAllin are skipped at i=0 and i=1
                    var parBoxId = allBox[i].getAttribute('id');
                    $('#' + parBoxId)[0].selectize.removeOption(selectParam);
                }
            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
                $('#mParamListDel')[0].selectize.destroy();
                $('#delparametermodal').modal('hide');
                refreshDataset()
    });

    //edit parameter modal dropdown change for each parameters
    $(function () {
        $(document).on('change', '#mParamListIn', function () {
            var id = $(this).attr("id");
            var formValues = $('#parametermodal').find('select');
            var data = formValues.serializeArray(); // convert form to array
            var selectParamId = data[0].value
            $.ajax({
                type: "GET",
                url: "ajax/ajaxquery.php",
                data: {
                    p: "getAllParameters"
                },
                async: false,
                success: function (s) {
                    var showParam = {};
                    s.forEach(function (element) {
                        if (element.id === selectParamId) {
                            showParam = element;
                        }
                    });
                    //insert data into form
                    var formValuesModal = $('#parametermodal').find('input, select');
                    formValuesModal.splice(1, 2); //Remove select and input "ParamAllIn"
                    var keys = Object.keys(showParam);
                    for (var i = 0; i < keys.length; i++) {
                        $(formValuesModal[i]).val(showParam[keys[i]]);
                    }
                }
            });
            var modaltit = $('#parametermodaltitle').html();
            if (modaltit === 'Add New Parameter'){
            $('#mIdPar').val('');
            var savetype = $('#mIdPar').val();
            }
            
        })
    });
    
    
    
    
    
    //parameter modal save button
    $('#parametermodal').on('click', '#saveparameter', function (event) {
        event.preventDefault();
        var selParName = '';
        var formValues = $('#parametermodal').find('input, select');
        var savetype = $('#mIdPar').val();
        var data = formValues.serializeArray(); // convert form to array
        data.splice(1, 1); //Remove "ParamAllIn"
        console.log(data);
        var selParID = data[0].value;
        var selParName = data[1].value;
        var selParQual = data[2].value;
        var selParType = data[3].value;
        data.push({
            name: "p",
            value: "saveParameter"
        });
        $.ajax({
            type: "POST",
            url: "ajax/ajaxquery.php",
            data: data,
            async: false,
            success: function (s) {
                if (savetype.length) { //Edit Parameter
                    //$('#mParamAllIn')[0].selectize.updateOption(selParID, {value: selParID, text: selParName } );           
                    var allBox = $('#addProcessModal').find('select');
                    for (var i = 2; i < allBox.length; i++) { //processGroup and paramAllin are skipped at i=0 and i=1
                        var parBoxId = allBox[i].getAttribute('id');
                        $('#' + parBoxId)[0].selectize.updateOption(selParID, {
                            id: selParID,
                            name: selParName,
                            qualifier:selParQual,
                            file_type:selParType
                        });
                    }

                } else { //Add Parameter
                    //$('#mParamAllIn')[0].selectize.addOption({value: s.id, text: selParName });
                    var allBox = $('#addProcessModal').find('select');
                    for (var i = 2; i < allBox.length; i++) { //processGroup, and paramAllin are skipped at i=0 and i=1
                        var parBoxId = allBox[i].getAttribute('id');
                        $('#' + parBoxId)[0].selectize.addOption({
                            id: s.id,
                            name: selParName,
                            qualifier:selParQual,
                            file_type:selParType
                        });
                    }
                }
                $('#mParamListIn')[0].selectize.destroy();
                $('#parametermodal').modal('hide');
                refreshDataset()
            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
    });

    


    // process group modal 
    $('#processGroupModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        $(this).find('form').trigger('reset');
        if (button.attr('id') === 'groupAdd') {
            $('#processGroupmodaltitle').html('Add Menu Group');
        } else if (button.attr('id') === 'groupEdit') {
            $('#processGroupmodaltitle').html('Edit Menu Group');
            var formValues = $('#proGroup').find('select');
            var selGroupId = "";
            var selGroupId = formValues.serializeArray()[0].value; // convert form to array
            $.ajax({
                type: "GET",
                url: "ajax/ajaxquery.php",
                data: {
                    p: "getAllProcessGroups"
                },
                async: false,
                success: function (s) {
                    var showGroup = {};
                    s.forEach(function (element) {
                        if (element.id === selGroupId) {
                            showGroup = element;
                        }
                    });
                    //insert data into form
                    var formValues = $('#processGroupModal').find('input');
                    var keys = Object.keys(showGroup);
                    for (var i = 0; i < keys.length; i++) {
                        $(formValues[i]).val(showGroup[keys[i]]);
                    }
                },
                error: function (errorThrown) {
                    alert("Error: " + errorThrown);
                }
            });
        }
    });

    //process group modal save button
    $('#processGroupModal').on('click', '#saveProcessGroup', function (event) {
        event.preventDefault();
        var selProGroupName = '';
        var selProGroupID = '';
        var formValues = $('#processGroupModal').find('input');
        var savetype = $('#mIdProGroup').val();
        var data = formValues.serializeArray(); // convert form to array
        var selProGroupID = data[0].value;
        var selProGroupName = data[1].value;
        data.push({
            name: "p",
            value: "saveProcessGroup"
        });
        $.ajax({
            type: "POST",
            url: "ajax/ajaxquery.php",
            data: data,
            async: false,
            success: function (s) {
                if (savetype.length) { //Edit Process Group
                    var allProBox = $('#proGroup').find('select');
                    var proGroBoxId = allProBox[0].getAttribute('id');
                    $('#' + proGroBoxId)[0].selectize.updateOption(selProGroupID, {
                        value: selProGroupID,
                        text: selProGroupName
                    });
                    $('#side-' + selProGroupID).parent().find('span').html(selProGroupName);
                } else { //Add process group
                    var allProBox = $('#proGroup').find('select');
                    var proGroBoxId = allProBox[0].getAttribute('id');
                    selProGroupID = s.id;
                    $('#' + proGroBoxId)[0].selectize.addOption({
                        value: selProGroupID,
                        text: selProGroupName
                    });
                    $('#autocompletes1').append('<li class="treeview"><a href="" draggable="false"><i  class="fa fa-circle-o"></i> <span>' + selProGroupName + '</span><i class="fa fa-angle-left pull-right"></i></a><ul id="side-' + selProGroupID + '" class="treeview-menu"></ul></li>');
                }
                $('#mProcessGroup')[0].selectize.setValue(selProGroupID, false);
                $('#processGroupModal').modal('hide');

            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
    });

    //process group remove button
    $('#addProcessModal').on('click', '#groupDel', function (e) {
        e.preventDefault();
        var selectProGro = '';
        var formValues = $('#addProcessModal').find('#mProcessGroup');
        var data = formValues.serializeArray();
        selectProGro = data[0].value;
        $.ajax({
            type: "POST",
            url: "ajax/ajaxquery.php",
            data: {
                id: selectProGro,
                p: "removeProcessGroup"
            },
            async: false,
            success: function (s) {
                var allProBox = $('#proGroup').find('select');
                var proGroBoxId = allProBox[0].getAttribute('id');
                $('#' + proGroBoxId)[0].selectize.removeOption(selectProGro);

                $('#side-' + selectProGro).parent().remove()
            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
    });









});