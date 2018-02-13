//ace editor
var editor = ace.edit("editor");
editor.setTheme("ace/theme/tomorrow");
editor.getSession().setMode("ace/mode/groovy");
editor.$blockScrolling = Infinity;
//template text for editor
templategroovy = '//groovy example: \n\n println "Hello, World!"';
templateperl = '#perl example: \n\n#!/usr/bin/perl \n print \'Hi there!\' . \'\\n\';';
templatepython = '#python example: \n\n#!/usr/bin/python \nx = \'Hello\'  \ny = \'world!\' \nprint "%s - %s" % (x,y)';
// If template text is not changed or it is blank : set the template text on change
$(function () {
    $(document).on('change', '#modeAce', function () {
        var newMode = $("#modeAce").val();
        editor.session.setMode("ace/mode/" + newMode);
        var editorText = editor.getValue();
        if (editorText === templategroovy || editorText === templateperl || editorText === templatepython || editorText === '') {
            var newTempText = 'template' + newMode;
            editor.setValue(window[newTempText]);
        }
    })
});







// cleanProcessModal when modal is closed     
function cleanProcessModal() {
    $('#mParameters').remove();
    $('#inputGroup').remove();
    $('#outputGroup').remove();
    $('#proGroup').remove();
    $('#revModalHeader').remove();
    $('#hrDiv').remove();
    var menuRevBackup = stateModule.getState("menuRevBackup");
    var menuGrBackup = stateModule.getState("menuGrBackup");
    var allBackup = stateModule.getState("allBackup");
    var inBackup = stateModule.getState("inBackup");
    var outBackup = stateModule.getState("outBackup");

    $('#addHeader').after(menuRevBackup);
    $('#describeGroup').after(menuGrBackup);
    $('#proGroup').after(allBackup);
    $('#proGroup').after('<hr id = "hrDiv">');
    $('#mParameters').after(inBackup);
    $('#inputGroup').after(outBackup);
    editor.setValue("");
    //    $('#deleteProcess').css('display', "none");
    $('#mProActionsDiv').css('display', "none");
    $('#mProRevSpan').css('display', "none");
    $('#mName').removeAttr('disabled');


}

function cleanInfoModal() {
    $('#mProRev').removeAttr('info');
    $('#mName').removeAttr('disabled');
    $('#mVersion').removeAttr('disabled');
    $('#mDescription').removeAttr('disabled');
    $('#selectProcess').removeAttr("gNum");
    editor.setReadOnly(false);
    $('#saveprocess').css('display', "inline");
    $('#selectProcess').css('display', "none");

}


function refreshProcessModal(selProId) {
    $(this).find('form').trigger('reset');
    cleanProcessModal();
    $('#mProRev').attr("prev", "-1");
    editor.setValue(templategroovy);
    loadModalProGro();
    loadModalParam();

    $('#processmodaltitle').html('Edit/Delete Process');
    //    $('#deleteProcess').css('display', "inline");
    $('#mProActionsDiv').css('display', "inline");
    $('#mProRevSpan').css('display', "inline");

    loadModalRevision(selProId);
    loadSelectedProcess(selProId);

}



function loadModalProGro() {
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
};

function loadModalParam() {
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
            $('#mParamAllIn').parent().hide();
        },
        error: function (errorThrown) {
            alert("Error: " + errorThrown);
        }
    });
};



function loadModalRevision(selProcessId) {

    //Ajax for revisions
    var revisions = getValues({
        p: "getProcessRevision",
        "process_id": selProcessId
    });
    if (revisions.length > 1) {
        $('#mName').attr('disabled', "disabled");
    }
    $('#mProRev').selectize({
        valueField: 'id',
        searchField: ['rev_id', 'rev_comment'],
        //placeholder: "Add input...",
        options: revisions,
        render: renderRev
    });

    $('#mProRev')[0].selectize.setValue(selProcessId, false);

}

function loadSelectedProcess(selProcessId) {
    $('#mIdPro').val(selProcessId);
    //Ajax for selected process
    var showProcess = getValues({
        p: "getProcessData",
        "process_id": selProcessId
    })[0];
    sMenuProGroupIdFirst = showProcess.process_group_id;

    //insert data into form
    var formValues = $('#addProcessModal').find('input, select, textarea');
    $(formValues[2]).val(showProcess.id);
    $(formValues[3]).val(showProcess.name);
    //$(formValues[2]).val(showProcess.version);
    $(formValues[5]).val(showProcess.summary);
    editorScript = removeDoubleQuote(showProcess.script);
    //            var parsedScript = JSON.parse(showProcess.script);
    //            editor.setValue(parsedScript);
    editor.setValue(editorScript);
    editor.clearSelection();
    $('#mProcessGroup')[0].selectize.setValue(showProcess.process_group_id, false);
    //Ajax for selected process input/outputs
    var inputs = getValues({
        p: "getInputsPP",
        "process_id": selProcessId
    });
    var outputs = getValues({
        p: "getOutputsPP",
        "process_id": selProcessId
    });
    for (var i = 0; i < inputs.length; i++) {
        var numForm = i + 1;
        $('#mInputs-' + numForm)[0].selectize.setValue(inputs[i].parameter_id, false);
        $('#mInName-' + numForm).val(inputs[i].sname);
        $('#mInName-' + numForm).attr('ppID', inputs[i].id);
        var closureText = decodeHtml(inputs[i].closure);
        $('#mInClosure-' + numForm).val(closureText);
        if (inputs[i].operator !== '') {
            $('#mInOpt-' + numForm).val(inputs[i].operator);
            $('#mInOptBut-' + numForm).trigger('click');
        }

    }
    for (var i = 0; i < outputs.length; i++) {
        var numForm = i + 1;
        $('#mOutputs-' + numForm)[0].selectize.setValue(outputs[i].parameter_id, false);
        $('#mOutName-' + numForm).val(outputs[i].sname);
        $('#mOutName-' + numForm).attr('ppID', outputs[i].id);
        var closureText = decodeHtml(outputs[i].closure);
        $('#mOutClosure-' + numForm).val(closureText);
        if (outputs[i].operator !== '') {
            $('#mOutOpt-' + numForm).val(outputs[i].operator);
            $('#mOutOptBut-' + numForm).trigger('click');
        }
    }
};

function removeDoubleQuote(script) {
    var lastLetter = script.length - 1;
    if (script[0] === '"' && script[lastLetter] === '"') {
        script = script.substring(1, script.length - 1); //remove first and last duble quote
    }
    return script
}

function sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key];
        var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;
    a = sortByKey(a, 'parameter_id')
    b = sortByKey(b, 'parameter_id')
    for (var i = 0; i < a.length; i++) {
        if (JSON.stringify(a[i]) !== JSON.stringify(b[i])) return false;
    }
    return true;
}

//Check if process is ever used in pipelines 
function checkPipeline(proid, proName) {
    var checkPipe = getValues({ p: "checkPipeline", "process_id": proid, "process_name": proName });
    return checkPipe
}

//Check if pipeline is ever used in projects 
function checkProject(pipeline_id) {
    var checkProj = getValues({ p: "checkProject", "pipeline_id": pipeline_id });
    return checkProj
}



//Check if process parameters are the same
//True equal
function checkProParameters(inputProParams, outputProParams, proID) {

    var pro1inputs = inputProParams;
    var pro1outputs = outputProParams;
    var pro2inputs = getValues({ p: "getInputsPP", "process_id": proID });
    var pro2outputs = getValues({ p: "getOutputsPP", "process_id": proID });
    $.each(pro2inputs, function (element) {
        delete pro2inputs[element].id;
    });
    $.each(pro2outputs, function (element) {
        delete pro2outputs[element].id;
    });
    checkEqIn = arraysEqual(pro1inputs, pro2inputs);
    checkEqOut = arraysEqual(pro1outputs, pro2outputs);

    return checkEqIn && checkEqOut //both should be true to be equal
}

//-----Add input output parameters to process_parameters
// startpoint: first object in data array where inputparameters starts.
function addProParatoDB(data, startPoint, process_id) {
    console.log(data);
    console.log(startPoint);

    var ppIDinputList = [];
    var ppIDoutputList = [];
    for (var i = startPoint; i < data.length; i++) {
        var dataToProcessParam = []; //dataToProcessPram to save in process_parameters table
        var PattPar = /(.*)-(.*)/;
        var matchFPart = '';
        var matchSPart = '';
        var matchVal = '';
        var matchFPart = data[i].name.replace(PattPar, '$1')
        var matchSPart = data[i].name.replace(PattPar, '$2')
        var matchVal = data[i].value
        if (matchFPart === 'mInputs' && matchVal !== '') {
            //first check if closures are visible
            if ($("#mInClosure-" + matchSPart).css('visibility') === 'visible') {
                for (var n = startPoint; n < data.length; n++) {
                    if (data[n].name === 'mInOpt-' + matchSPart) {
                        dataToProcessParam.push({ name: "operator", value: data[n].value });
                    } else if (data[n].name === 'mInClosure-' + matchSPart) {
                        dataToProcessParam.push({ name: "closure", value: encodeURIComponent(data[n].value) });
                    }
                }
            }
            //for process parameters
            for (var k = startPoint; k < data.length; k++) {
                if (data[k].name === 'mInName-' + matchSPart && data[k].value === '') {
                    dataToProcessParam = [];
                    break;
                } else if (data[k].name === 'mInName-' + matchSPart && data[k].value !== '') {
                    var ppID = $('#' + data[k].name).attr("ppID");
                    ppIDinputList.push(ppID);
                    dataToProcessParam.push({ name: "parameter_id", value: matchVal });
                    dataToProcessParam.push({ name: "type", value: 'input' });
                    dataToProcessParam.push({ name: "sname", value: encodeURIComponent(data[k].value) });
                    dataToProcessParam.push({ name: "process_id", value: process_id });
                    dataToProcessParam.push({ name: "id", value: ppID });
                    dataToProcessParam.push({ name: "p", value: "saveProcessParameter" });
                }
            }
        } else if (matchFPart === 'mOutputs' && matchVal !== '') {
            //first check if closures are visible
            if ($("#mOutClosure-" + matchSPart).css('visibility') === 'visible') {
                for (var n = startPoint; n < data.length; n++) {
                    if (data[n].name === 'mOutOpt-' + matchSPart) {
                        dataToProcessParam.push({ name: "operator", value: data[n].value });
                    } else if (data[n].name === 'mOutClosure-' + matchSPart) {
                        dataToProcessParam.push({ name: "closure", value: encodeURIComponent(data[n].value) });
                    }
                }
            }
            //for process parameters 
            for (var k = startPoint; k < data.length; k++) {
                if (data[k].name === 'mOutName-' + matchSPart && data[k].value === '') {
                    dataToProcessParam = [];
                    break;
                } else if (data[k].name === 'mOutName-' + matchSPart && data[k].value !== '') {
                    var ppID = $('#' + data[k].name).attr("ppID");
                    ppIDoutputList.push(ppID);
                    dataToProcessParam.push({ name: "parameter_id", value: matchVal });
                    dataToProcessParam.push({ name: "type", value: 'output' });
                    dataToProcessParam.push({ name: "sname", value: encodeURIComponent(data[k].value) });
                    dataToProcessParam.push({ name: "process_id", value: process_id });
                    dataToProcessParam.push({ name: "id", value: ppID });
                    dataToProcessParam.push({ name: "p", value: "saveProcessParameter" });
                }
            }
        }
        console.log(dataToProcessParam);
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
    return [ppIDinputList, ppIDoutputList];
};

//-----Add input output parameters to process_parameters at revision
// startpoint: first object in data array where inputparameters starts.
function addProParatoDBbyRev(data, startPoint, process_id) {
    for (var i = startPoint; i < data.length; i++) {
        var dataToProcessParam = []; //dataToProcessPram to save in process_parameters table
        var PattPar = /(.*)-(.*)/;
        var matchFPart = '';
        var matchSPart = '';
        var matchVal = '';
        var matchFPart = data[i].name.replace(PattPar, '$1')
        var matchSPart = data[i].name.replace(PattPar, '$2')
        var matchVal = data[i].value
        if (matchFPart === 'mInputs' && matchVal !== '') {
            for (var k = startPoint; k < data.length; k++) {
                if (data[k].name === 'mInName-' + matchSPart && data[k].value === '') {
                    dataToProcessParam = [];
                    break;
                } else if (data[k].name === 'mInName-' + matchSPart && data[k].value !== '') {
                    dataToProcessParam.push({ name: "parameter_id", value: matchVal });
                    dataToProcessParam.push({ name: "type", value: 'input' });
                    dataToProcessParam.push({ name: "sname", value: encodeURIComponent(data[k].value) });
                    dataToProcessParam.push({ name: "process_id", value: process_id });
                    dataToProcessParam.push({ name: "p", value: "saveProcessParameter" });
                }
            }
        } else if (matchFPart === 'mOutputs' && matchVal !== '') {
            for (var k = startPoint; k < data.length; k++) {
                if (data[k].name === 'mOutName-' + matchSPart && data[k].value === '') {
                    dataToProcessParam = [];
                    break;
                } else if (data[k].name === 'mOutName-' + matchSPart && data[k].value !== '') {
                    dataToProcessParam.push({ name: "parameter_id", value: matchVal });
                    dataToProcessParam.push({ name: "type", value: 'output' });
                    dataToProcessParam.push({ name: "sname", value: encodeURIComponent(data[k].value) });
                    dataToProcessParam.push({ name: "process_id", value: process_id });
                    dataToProcessParam.push({ name: "p", value: "saveProcessParameter" });
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
};

function updateProPara(inputsBefore, outputsBefore, ppIDinputList, ppIDoutputList, proID) {

    //Find deleted input/outputs
    for (var i = 0; i < inputsBefore.length; i++) {
        if (ppIDinputList.indexOf(inputsBefore[i].id) < 0) {
            //removeProcessParameter
            $.ajax({
                type: "POST",
                url: "ajax/ajaxquery.php",
                data: {
                    id: inputsBefore[i].id,
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
    for (var i = 0; i < outputsBefore.length; i++) {
        if (ppIDoutputList.indexOf(outputsBefore[i].id) < 0) {
            //removeProcessParameter
            $.ajax({
                type: "POST",
                url: "ajax/ajaxquery.php",
                data: {
                    id: outputsBefore[i].id,
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
};

function checkDeletion(proID, proName) {
    var warnUser = false;
    var infoText = '';
    var startPoint = 6;
    //has selected process ever used in other pipelines?
    var checkPipe = checkPipeline(proID, proName);
    if (checkPipe.length > 0) {
        warnUser = true;
        infoText = infoText + 'It is not allowed to remove this revision, since this revision of process exists in the following pipelines: '
        $.each(checkPipe, function (element) {
            if (element !== 0) {
                infoText = infoText + ', ';
            }
            infoText = infoText + '"' + checkPipe[element].name + '"';
        });
        infoText = infoText + '</br></br>In order to delete this revision, you may remove the process from above pipeline/pipelines.'

    }

    return [warnUser, infoText];
}


function checkDeletionPipe(pipeline_id) {
    var warnUserPipe = false;
    var warnPipeText = '';
    //has selected pipeline ever used in projects?
    var checkProj = checkProject(pipeline_id);
    if (checkProj.length > 0) {
        warnUserPipe = true;
        warnPipeText = warnPipeText + 'It is not allowed to remove this revision, since this revision of pipeline exists in the following projects: '
        $.each(checkProj, function (element) {
            if (element !== 0) {
                warnPipeText = warnPipeText + ', ';
            }
            warnPipeText = warnPipeText + '"' + checkProj[element].name + '"';
        });
        warnPipeText = warnPipeText + '</br></br>In order to delete this revision, you may remove the pipeline from above project/projects.'

    }

    return [warnUserPipe, warnPipeText];
}

function checkRevisionPipe(pipeline_id) {
    var warnUserPipe = false;
    var warnPipeText = '';
    //has selected pipeline ever used in projects?
    var checkProj = checkProject(pipeline_id);
    console.log(checkProj);
    var numOfProject = checkProj.length;
    if (numOfProject > 1) {
        warnUserPipe = true;
        warnPipeText = warnPipeText + 'It is not allowed to save on current revision, since this revision of pipeline already used in projects.</br></br>In order to save on current revision, you may remove the pipeline from following projects: '
        $.each(checkProj, function (element) {
            if (element !== 0) {
                warnPipeText = warnPipeText + ', ';
            }
            warnPipeText = warnPipeText + '"' + checkProj[element].name + '"';
        });
        warnPipeText = warnPipeText + '</br></br>Otherwise you can save as a new revision by entering revision comment at below and clicking the save button.'
    } else if (numOfProject === 1) {
        warnUserPipe = true;
        warnPipeText = warnPipeText + 'This revision of pipeline already used in one project (' + checkProj[0].name + ').';
        warnPipeText = warnPipeText + '</br></br>Your changes may effect the current run. If you still want to save on existing revision, please click on "save on existing" button. </br></br>Otherwise you can save as a new revision by entering revision comment at below and clicking the save button.'
    }

    return [warnUserPipe, warnPipeText, numOfProject];
}

function checkRevisionProc(data, proID, proName) {
    var warnUser = false;
    var infoText = '';
    var startPoint = 6;
    var inputProParams = prepareProParam(data, startPoint, 'inputs');
    var outputProParams = prepareProParam(data, startPoint, 'outputs');
    //Check if process name is changed 
    //xx
    //Check if process parameters is changed 
    var checkResult = checkProParameters(inputProParams, outputProParams, proID);
    if (checkResult === false) {
        //has edited process ever used in other pipelines?
        var checkPipe = checkPipeline(proID, proName);
        if (checkPipe.length > 0) {
            warnUser = true;
            infoText = infoText + 'It is not allowed to save on current revision since process parameters are changed and edited process exists in pipelines.</br></br>In order to save on current revision, you may remove the process from following pipelines: '
            $.each(checkPipe, function (element) {
                if (element !== 0) {
                    infoText = infoText + ', ';
                }
                infoText = infoText + '"' + checkPipe[element].name + '"';
            });
            infoText = infoText + '</br></br>Otherwise you can save as a new revision by entering revision comment at below and clicking the save button.</br>'
        }
    }
    return [warnUser, infoText];
}

function prepareProParam(data, startPoint, typeInOut) {
    if (typeInOut === 'inputs') {
        var searchFpart = 'mInputs';
        var searchName = 'mInName-';
    } else if (typeInOut === 'outputs') {
        var searchFpart = 'mOutputs';
        var searchName = 'mOutName-';
    }
    var proParams = [];
    for (var i = startPoint; i < data.length; i++) {
        var PattPar = /(.*)-(.*)/;
        var matchFPart = '';
        var matchSPart = '';
        var matchVal = '';
        var matchFPart = data[i].name.replace(PattPar, '$1')
        var matchSPart = data[i].name.replace(PattPar, '$2')
        var matchVal = data[i].value
        if (matchFPart === searchFpart && matchVal !== '') {
            for (var k = startPoint; k < data.length; k++) {
                if (data[k].name === searchName + matchSPart && data[k].value === '') {
                    break;
                } else if (data[k].name === searchName + matchSPart && data[k].value !== '') {
                    proParams.push({
                        "parameter_id": matchVal,
                        "name": data[k].value
                    });
                    break;
                }
            }
        }
    }
    return proParams;
}

function updateSideBar(sMenuProIdFirst, sMenuProIdFinal, sMenuProGroupIdFirst, sMenuProGroupIdFinal) {

    document.getElementById(sMenuProIdFirst).setAttribute('id', sMenuProIdFinal);
    var PattMenu = /(.*)@(.*)/; //Map_Tophat2@11
    var nMenuProName = sMenuProIdFinal.replace(PattMenu, '$1');
    document.getElementById(sMenuProIdFinal).innerHTML = '<i class="fa fa-angle-double-right"></i>' + nMenuProName;
    if (sMenuProGroupIdFirst !== sMenuProGroupIdFinal) {
        document.getElementById(sMenuProIdFinal).remove();
        $('#side-' + sMenuProGroupIdFinal).append('<li> <a data-toggle="modal" data-target="#addProcessModal" data-backdrop="false" href="" ondragstart="dragStart(event)" ondrag="dragging(event)" draggable="true" id="' + sMenuProIdFinal + '"> <i class="fa fa-angle-double-right"></i>' + nMenuProName + '</a></li>');
    }
}

function disableProModal(selProcessId) {
    var formValues = $('#addProcessModal').find('input, select, textarea');
    $(formValues[3]).attr('disabled', "disabled");
    $(formValues[4]).attr('disabled', "disabled");
    $(formValues[5]).attr('disabled', "disabled");
    $('#mProcessGroup')[0].selectize.disable();
    editor.setReadOnly(true);
    //Ajax for selected process input/outputs
    var inputs = getValues({
        p: "getInputsPP",
        "process_id": selProcessId
    });
    var outputs = getValues({
        p: "getOutputsPP",
        "process_id": selProcessId
    });
    for (var i = 0; i < inputs.length; i++) {
        var numFormIn = i + 1;
        $('#mInputs-' + numFormIn)[0].selectize.disable();
        $('#mInName-' + numFormIn).attr('disabled', "disabled");
        $('#mInNamedel-' + numFormIn).remove()
    }
    //
    var delNumIn = numFormIn + 1;
    $('#mInputs-' + delNumIn + '-selectized').parent().parent().remove();
    for (var i = 0; i < outputs.length; i++) {
        var numFormOut = i + 1;
        $('#mOutputs-' + numFormOut)[0].selectize.disable();
        $('#mOutName-' + numFormOut).attr('disabled', "disabled");
        $('#mOutNamedel-' + numFormOut).remove()
        //
    }
    //
    var delNumOut = numFormOut + 1;
    $('#mOutputs-' + delNumOut + '-selectized').parent().parent().remove();
    $('#mParameters').remove();
    $('#mProcessGroupAdd').remove();
    $('#mProcessGroupEdit').remove();
    $('#mProcessGroupDel').remove();
    $('#saveprocess').css('display', "none");
    $('#selectProcess').css('display', "inline");

};

function prepareInfoModal() {
    $('#processmodaltitle').html('Select Process Revision');
    $('#mProActionsDiv').css('display', "none");
    $('#mProRevSpan').css('display', "inline");
    $('#mProRev').attr('info', "info");
}


function loadPipelineDetails(pipeline_id) {
    var getPipelineD = [];
    getPipelineD.push({ name: "id", value: pipeline_id });
    getPipelineD.push({ name: "p", value: 'loadPipeline' });
    $.ajax({
        type: "POST",
        url: "ajax/ajaxquery.php",
        data: getPipelineD,
        async: true,
        success: function (s) {
            $('#creatorInfoPip').css('display', "block");
            $('#pipeline-title').changeVal(s[0].name);
            $('#ownUserNamePip').text(s[0].username);
            $('#pipelineSum').val(s[0].summary);
            //load user groups
            var allUserGrp = getValues({ p: "getUserGroups" });
            for (var i = 0; i < allUserGrp.length; i++) {
                var param = allUserGrp[i];
                var optionGroup = new Option(param.name, param.id);
                $("#groupSel").append(optionGroup);
            }
            if (s[0].group_id !== "0") {
                $('#groupSel').val(s[0].group_id);
            }

            $('#perms').val(s[0].perms);
            $('#datecreatedPip').text(s[0].date_created);
            $('.lasteditedPip').text(s[0].date_modified);
            openPipeline(pipeline_id);

        },
        error: function (errorThrown) {
            alert("Error: " + errorThrown);
        }
    });
    //xxx
    var getRevD = [];
    getRevD.push({ name: "pipeline_id", value: pipeline_id });
    getRevD.push({ name: "p", value: 'getPipelineRevision' });
    $.ajax({
        type: "GET",
        url: "ajax/ajaxquery.php",
        data: getRevD,
        async: false,
        success: function (s) {
            if (s.length > 1) {
                $("#pipeline-title").attr('disabled', "disabled");
            } else {
                $("#pipeline-title").removeAttr('disabled');
            }
            $("#pipeRev").empty();
            for (var i = 0; i < s.length; i++) {
                var param = s[i];
                if (param.id === pipeline_id) { //selected option
                    var optionAll = new Option('Revision: ' + param.rev_id + ' ' + param.rev_comment + ' on ' + param.date_modified, param.id, false, true);
                } else {
                    var optionAll = new Option('Revision: ' + param.rev_id + ' ' + param.rev_comment + ' on ' + param.date_modified, param.id);
                }
                $("#pipeRev").append(optionAll);
            }
        }
    });

};

$(document).ready(function () {
    var pipeline_id = $('#pipeline-title').attr('pipelineid');
    if (pipeline_id !== '') {
        loadPipelineDetails(pipeline_id);
    }

    //Click on sideMenu items to Open Pipeline 
    //$('.pipelineItems').on('click', function (event) {
    //    $("#Pipelines").on('click', '.pipelineItems', function (event) {
    //        event.preventDefault();
    //        var button = $(event.currentTarget);
    //        var selPipelineId = event.currentTarget.id.replace(/(.*)-(.*)/, '$2');
    //        $('#pipeline-title').attr('pipelineid', selPipelineId);
    //        
    //        loadPipelineDetails(selPipelineId);
    //    });




    //Make modal draggable    
    $('.modal-dialog').draggable({ cancel: 'input, textarea, select, #editordiv, button, span, a' });


    function getValues(data) {
        var result = null;
        var s = null;
        $.ajax({
            url: "ajax/ajaxquery.php",
            data: data,
            async: false,
            cache: false,
            success: function (s) {
                result = s;
            }
        });
        return result;
    }

    stateModule = (function () {
        var state = {}; // Private Variable
        var pub = {}; // public object - returned at end of module
        pub.changeState = function (newstate, backNode) {
            state[newstate] = backNode;
            //selectize gives error when using copied node clone. Therefore HTML part is kept separate and replaced at getState
            state[newstate + 'HTML'] = backNode.html();

        };
        pub.getState = function (getName) {
            state[getName].html(state[getName + 'HTML']);
            return state[getName];
        }
        return pub; // expose externally
    }());






    $("#addProcessModal").on('click', '#selectProcess', function (event) {
        var gNumInfo = $('#selectProcess').attr("gNum");

        var firstProID = $('#selectProcess').attr("fProID");
        var lastProID = $('#selectProcess').attr("lastProID");
        var pName = $('#selectProcess').attr("pName");
        $('#addProcessModal').modal('hide');
        if (lastProID && lastProID !== firstProID) {
            var processDat = pName + '@' + lastProID;
            remove('del-' + gNumInfo);
            var xCor = $('#selectProcess').attr("xCoor") - 50;
            var yCor = $('#selectProcess').attr("yCoor") - 70;
            addProcess(processDat, xCor, yCor);
        }
        autosave();
    });






    renderParam = {
        option: function (data, escape) {
            if (data.qualifier === 'val') {
                return '<div class="option">' +
                    '<span class="title">' + escape(data.name) + '</span>' +
                    '<span class="url">' + 'Qualifier: ' + escape(data.qualifier) + '</span>' +
                    '</div>';
            } else {
                return '<div class="option">' +
                    '<span class="title">' + escape(data.name) + '</span>' +
                    '<span class="url">' + 'File Type: ' + escape(data.file_type) + '</span>' +
                    '<span class="url">' + 'Qualifier: ' + escape(data.qualifier) + '</span>' +
                    '</div>';
            }

        },
        item: function (data, escape) {
            if (data.qualifier === 'val') {
                return '<div class="item" data-value="' + escape(data.id) + '">' + escape(data.name) + '  <i><small>' + '  (' + escape(data.qualifier) + ')</small></i>' + '</div>';
            } else {
                return '<div class="item" data-value="' + escape(data.id) + '">' + escape(data.name) + '  <i><small>' + '  (' + escape(data.file_type) + ', ' + escape(data.qualifier) + ')</small></i>' + '</div>';
            }
        }
    };


    renderRev = {
        option: function (data, escape) {
            return '<div class="option">' +
                '<span class="title">' + escape(data.rev_id) + '<i> ' + escape(data.rev_comment) + '' + ' on ' + escape(data.date_created) + '</i></span>' +
                '</div>';
        },
        item: function (data, escape) {
            return '<div class="item" data-value="' + escape(data.id) + '">Revision: ' + escape(data.rev_id) + '</div>';
        }
    };

    $(function () {
        $(document).on('change', '.mRevChange', function (event) {
            var infoAttr = $(this).attr("info");
            var id = $(this).attr("id");
            var prevParId = $("#" + id).attr("prev");
            var selProId = $("#" + id + " option:selected").val();
            if (prevParId !== '-1' && infoAttr === 'info') {
                refreshProcessModal(selProId);
                prepareInfoModal();
                disableProModal(selProId);
                $('#selectProcess').attr("lastProID", selProId);
                $('#mProRev').attr('info', "info");
            } else if (prevParId !== '-1') {
                refreshProcessModal(selProId);
            }
            $("#" + id).attr("prev", selProId);
        })
    });

    $(function () {
        $(document).on('change', '#pipeRev', function (event) {
            var selPipeRev = $('#pipeRev option:selected').val();
            window.location.replace("index.php?np=1&id=" + selPipeRev);
        })
    });

    infoID = '';
    //Add Process Modal
    $('#addProcessModal').on('show.bs.modal', function (event) {
        $(this).find('form').trigger('reset');
        var backUpObj = {};
        backUpObj.menuRevBackup = $('#revModalHeader').clone();
        backUpObj.menuGrBackup = $('#proGroup').clone();
        backUpObj.inBackup = $('#inputGroup').clone();
        backUpObj.outBackup = $('#outputGroup').clone();
        backUpObj.allBackup = $('#mParameters').clone();
        stateModule.changeState("menuRevBackup", backUpObj.menuRevBackup);
        stateModule.changeState("menuGrBackup", backUpObj.menuGrBackup);
        stateModule.changeState("inBackup", backUpObj.inBackup);
        stateModule.changeState("outBackup", backUpObj.outBackup);
        stateModule.changeState("allBackup", backUpObj.allBackup);
        stateModule.changeState("menuRevBackup", backUpObj.menuRevBackup);

        editor.setValue(templategroovy);
        loadModalProGro();
        loadModalParam();

        var button = $(event.relatedTarget);
        if (button.attr('id') === 'addprocess') {
            $('#processmodaltitle').html('Add New Process');

        } else if (button.is('a') === true) { //Edit/Delete Process
            $('#processmodaltitle').html('Edit/Delete Process');
            $('#mProActionsDiv').css('display', "inline");
            $('#mProRevSpan').css('display', "inline");
            delProMenuID = button.attr('id');
            sMenuProIdFirst = button.attr('id');
            var PattPro = /(.*)@(.*)/; //Map_Tophat2@11
            var selProcessId = button.attr('id').replace(PattPro, '$2');
            loadModalRevision(selProcessId);
            loadSelectedProcess(selProcessId);
        } else { //Info Modal 
            prepareInfoModal();
            var selProcessId = infoID;
            $('#selectProcess').attr("fProID", selProcessId);
            $('#selectProcess').attr("gNum", gNumInfo);
            var coorProRaw = d3.select("#g-" + gNumInfo)[0][0].attributes.transform.value;
            var PattCoor = /translate\((.*),(.*)\)/; //417.6,299.6
            var xProCoor = coorProRaw.replace(PattCoor, '$1');
            var yProCoor = coorProRaw.replace(PattCoor, '$2');
            $('#selectProcess').attr("xCoor", xProCoor);
            $('#selectProcess').attr("yCoor", yProCoor);

            loadModalRevision(selProcessId);
            loadSelectedProcess(selProcessId);
            var pName = $('#mName').val();
            $('#selectProcess').attr("pName", pName);
            disableProModal(selProcessId);

        }

    });



    // Dismiss process modal 
    $('#addProcessModal').on('hide.bs.modal', function (event) {
        cleanProcessModal();
        cleanInfoModal();

    });

    // Delete process pipeline modal 
    $('#confirmModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        if (button.attr('id') === 'deleteRevision') {
            $('#deleteBtn').attr('class', 'btn btn-primary delprocess');
            $('#confirmModalText').html('Are you sure you want to delete this process?');
        } else if (button.attr('id') === 'deletePipeRevision' || button.attr('id') === 'delPipeline') {
            $('#deleteBtn').attr('class', 'btn btn-primary delpipeline');
            $('#confirmModalText').html('Are you sure you want to delete this pipeline?');
        }
    });

    $('#confirmModal').on('click', '.delpipeline', function (event) {
        var pipeline_id = $('#pipeline-title').attr('pipelineid');
        if (pipeline_id !== '') {
            var warnUserPipe = false;
            var warnPipeText = '';
            [warnUserPipe, warnPipeText] = checkDeletionPipe(pipeline_id);

            //A. If it is allowed to delete    
            if (warnUserPipe === false) {
                delPipeline();
                //            var revsPipeline = getValues({ p: "getPipelineRevision", "process_id": pipeline_id });
                //            var removedRev = [];
                //            if (revisions.length === 1) {
                //                var delSideMenuNode = document.getElementById(delProMenuID).parentNode;
                //                delSideMenuNode.parentNode.removeChild(delSideMenuNode);
                //                delProMenuID = '';
                //            } else if (revisions.length > 1) {
                //                //remove the selected revision from list
                //                for (var k = 0; k < revisions.length; k++) {
                //                    if (revisions[k].id !== processIdDel) {
                //                        removedRev.push(revisions[k]);
                //                    }
                //                }
                //                //find  the maximum rev_id in the list
                //                let max = removedRev[0].rev_id;
                //                for (let i = 1, len = removedRev.length; i < len; i++) {
                //                    let v = removedRev[i].rev_id;
                //                    max = (v > max) ? v : max;
                //                }
                //                //find the id of the process which has the maximum rev_id
                //                for (var k = 0; k < removedRev.length; k++) {
                //                    if (removedRev[k].rev_id === max) {
                //                        var revMaxId = removedRev[k].id
                //                    }
                //                }
                //                var PattPro = /(.*)@(.*)/; //Map_Tophat2@11
                //                var delProName = delProMenuID.replace(PattPro, '$1');
                //                var newMenuID = delProName + '@' + revMaxId;
                //                var delProce = getValues({ p: "removeProcess", "id": processIdDel });
                //                document.getElementById(delProMenuID).id = newMenuID;
            }
            //B. If it is not allowed to delete
            else if (warnUserPipe === true) {
                $('#warnDelete').off();
                $('#warnDelete').on('show.bs.modal', function (event) {
                    $('#warnDelText').html(warnPipeText);
                });
                $('#warnDelete').modal('show');
            }
            $('#confirmModal').modal('hide');
        }
    })


    $('#confirmModal').on('click', '.delprocess', function (event) {
        var processIdDel = $('#mIdPro').val();
        var disableCheck = $('#mName').attr('disabled');
        if (disableCheck === 'disabled') {
            $('#mName').removeAttr('disabled'); //temporary remove disabled attribute for serializeArray().
            var formValues = $('#addProcessModal').find('input, select, textarea');
            var data = formValues.serializeArray();
            $('#mName').attr('disabled', "disabled");
        } else {
            var formValues = $('#addProcessModal').find('input, select, textarea');
            var data = formValues.serializeArray();
        }

        var proID = data[1].value;
        var proName = data[2].value;
        var warnUser = false;
        var infoText = '';
        [warnUser, infoText] = checkDeletion(proID, proName);
        if (warnUser === true) {
            $('#warnDelete').off();
            $('#warnDelete').on('show.bs.modal', function (event) {
                $('#warnDelText').html(infoText);
            });
            $('#warnDelete').modal('show');





        } else if (warnUser === false) {
            var revisions = getValues({ p: "getProcessRevision", "process_id": processIdDel });
            var removedRev = [];
            if (revisions.length === 1) {
                var delSideMenuNode = document.getElementById(delProMenuID).parentNode;
                delSideMenuNode.parentNode.removeChild(delSideMenuNode);
                delProMenuID = '';
            } else if (revisions.length > 1) {
                //remove the selected revision from list
                for (var k = 0; k < revisions.length; k++) {
                    if (revisions[k].id !== processIdDel) {
                        removedRev.push(revisions[k]);
                    }
                }
                //find  the maximum rev_id in the list
                let max = removedRev[0].rev_id;
                for (let i = 1, len = removedRev.length; i < len; i++) {
                    let v = removedRev[i].rev_id;
                    max = (v > max) ? v : max;
                }
                //find the id of the process which has the maximum rev_id
                for (var k = 0; k < removedRev.length; k++) {
                    if (removedRev[k].rev_id === max) {
                        var revMaxId = removedRev[k].id
                    }
                }
                var PattPro = /(.*)@(.*)/; //Map_Tophat2@11
                var delProName = delProMenuID.replace(PattPro, '$1');
                var newMenuID = delProName + '@' + revMaxId;
                var delProce = getValues({ p: "removeProcess", "id": processIdDel });
                document.getElementById(delProMenuID).id = newMenuID;
            }
            $('#addProcessModal').modal('hide');
        }



    });



    //Add new parameter modal
    $('#parametermodal').on('click', '#mParamOpen', function (event) {
        $('#mParamsDynamic').css('display', "none");
        $('#mParamList').css('display', "inline");
    });



    // Add process modal to database
    $('#addProcessModal').on('click', '#saveprocess', function (event) {
        event.preventDefault();
        var savetype = $('#mIdPro').val();
        // A) Add New Process Starts
        if (!savetype.length) {
            var formValues = $('#addProcessModal').find('input, select, textarea');
            var data = formValues.serializeArray();
            var dataToProcess = []; //dataToProcess to save in process table
            var proID = data[0].value;
            var proName = data[1].value;
            var proGroId = data[4].value;
            for (var i = 0; i < 5; i++) {
                dataToProcess.push(data[i]);
            }
            var scripteditor = JSON.stringify(editor.getValue());
            var maxProcess_gid = getValues({ p: "getMaxProcess_gid" })[0].process_gid;
            var newProcess_gid = parseInt(maxProcess_gid) + 1;
            dataToProcess.push({ name: "process_gid", value: newProcess_gid });
            dataToProcess.push({ name: "script", value: scripteditor });
            dataToProcess.push({ name: "p", value: "saveProcess" });
            if (proName === '' || proGroId === '') {
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
                        //add process link into sidebar menu
                        $('#side-' + proGroId).append('<li> <a data-toggle="modal" data-target="#addProcessModal" data-backdrop="false" href="" ondragstart="dragStart(event)" ondrag="dragging(event)" draggable="true" id="' + proName + '@' + process_id + '"> <i class="fa fa-angle-double-right"></i>' + proName + '</a></li>');
                        var startPoint = 5; //first object in data array where inputparameters starts.
                        addProParatoDB(data, startPoint, process_id);
                        refreshDataset();
                        $('#addProcessModal').modal('hide');
                    },
                    error: function (errorThrown) {
                        alert("Error: " + errorThrown);
                    }
                });
            }
        }
        // A) Add New Process Ends----

        // B) Edit Process Starts
        if (savetype.length) {
            $('#mName').removeAttr('disabled'); //temporary remove disabled attribute for serializeArray().
            var formValues = $('#addProcessModal').find('input, select, textarea');
            var data = formValues.serializeArray();
            $('#mName').attr('disabled', "disabled");

            var proID = data[1].value;
            var proName = data[2].value;
            var warnUser = false;
            var infoText = '';
            [warnUser, infoText] = checkRevisionProc(data, proID, proName);
            //B.1)Save on current process
            if (warnUser === false) {
                var proGroId = data[5].value;
                var sMenuProIdFinal = proName + '@' + proID;
                var sMenuProGroupIdFinal = proGroId;
                var dataToProcess = []; //dataToProcess to save in process table
                for (var i = 1; i < 6; i++) {
                    dataToProcess.push(data[i]);
                }
                var scripteditor = JSON.stringify(editor.getValue());
                var process_gid = getValues({ p: "getProcess_gid", "process_id": proID })[0].process_gid;
                dataToProcess.push({ name: "process_gid", value: process_gid });
                dataToProcess.push({ name: "script", value: scripteditor });
                dataToProcess.push({ name: "p", value: "saveProcess" });
                if (proName === '' || proGroId === '') {
                    dataToProcess = [];
                }
                if (dataToProcess.length > 0) {
                    $.ajax({
                        type: "POST",
                        url: "ajax/ajaxquery.php",
                        data: dataToProcess,
                        async: true,
                        success: function (s) {
                            //update process link into sidebar menu
                            updateSideBar(sMenuProIdFirst, sMenuProIdFinal, sMenuProGroupIdFirst, sMenuProGroupIdFinal);
                            var startPoint = 6; //first object in data array where inputparameters starts.
                            var ppIDinputList;
                            var ppIDoutputList;
                            var inputsBefore = getValues({ p: "getInputsPP", "process_id": proID });
                            var outputsBefore = getValues({ p: "getOutputsPP", "process_id": proID });
                            [ppIDinputList, ppIDoutputList] = addProParatoDB(data, startPoint, proID);
                            updateProPara(inputsBefore, outputsBefore, ppIDinputList, ppIDoutputList, proID);
                            refreshDataset();
                            $('#addProcessModal').modal('hide');
                        },
                        error: function (errorThrown) {
                            alert("Error: " + errorThrown);
                        }
                    });
                }
                //B.2) Save on new revision
            } else if (warnUser === true) {
                // ConfirmYesNo process modal 
                $('#confirmRevision').off();
                $('#confirmRevision').on('show.bs.modal', function (event) {
                    $(this).find('form').trigger('reset');
                    $('#confirmYesNoText').html(infoText);
                });
                $('#confirmRevision').on('click', '#saveRev', function (event) {
                    var confirmformValues = $('#confirmRevision').find('input');
                    var revCommentData = confirmformValues.serializeArray();
                    var revComment = revCommentData[0].value;
                    if (revComment === '') { //warn user to enter comment

                    } else if (revComment !== '') {
                        var proGroId = data[5].value;
                        var sMenuProIdFinal = proName + '@' + proID;
                        var sMenuProGroupIdFinal = proGroId;
                        var dataToProcess = []; //dataToProcess to save in process table
                        for (var i = 2; i < 6; i++) { //not included by process id i=1
                            dataToProcess.push(data[i]);
                        }
                        var scripteditor = JSON.stringify(editor.getValue());
                        var process_gid = getValues({ p: "getProcess_gid", "process_id": proID })[0].process_gid;
                        var maxRev_id = getValues({ p: "getMaxRev_id", "process_gid": process_gid })[0].rev_id;
                        var newRev_id = parseInt(maxRev_id) + 1;

                        dataToProcess.push({ name: "rev_comment", value: revComment });
                        dataToProcess.push({ name: "rev_id", value: newRev_id });
                        dataToProcess.push({ name: "process_gid", value: process_gid });
                        dataToProcess.push({ name: "script", value: scripteditor });
                        dataToProcess.push({ name: "p", value: "saveProcess" });

                        if (proName === '' || proGroId === '') {
                            dataToProcess = [];
                        }
                        if (dataToProcess.length > 0) {
                            $.ajax({
                                type: "POST",
                                url: "ajax/ajaxquery.php",
                                data: dataToProcess,
                                async: true,
                                success: function (s) {
                                    var newProcess_id = s.id;
                                    //update process link into sidebar menu
                                    sMenuProIdFinal = proName + '@' + newProcess_id;
                                    updateSideBar(sMenuProIdFirst, sMenuProIdFinal, sMenuProGroupIdFirst, sMenuProGroupIdFinal);
                                    var startPoint = 6; //first object in data array where inputparameters starts.
                                    addProParatoDBbyRev(data, startPoint, newProcess_id);
                                    refreshDataset();
                                    $('#addProcessModal').modal('hide');
                                },
                                error: function (errorThrown) {
                                    alert("Error: " + errorThrown);
                                }
                            });
                        }
                        $('#confirmRevision').modal('hide');
                    }
                });
                $('#confirmRevision').modal('show');
            }
        }
        // B) Edit Process Ends----

    });

    //insert dropdown, textbox and 'remove button' for each parameters
    $(function () {
        $(document).on('change', '.mParChange', function () {

            var id = $(this).attr("id");
            var Patt = /m(.*)puts-(.*)/;
            var type = id.replace(Patt, '$1'); //In or Out
            var col1init = "m" + type + "puts"; //column1 initials
            var col2init = "m" + type + "Name";
            var col3init = "m" + type + "Namedel";
            var col4init = "m" + type + "OptBut";
            var col5init = "m" + type + "Opt";
            var col6init = "m" + type + "Closure";
            var col7init = "m" + type + "Optdel";

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
                $("#" + col1init).append('<select id="' + col1init + '-' + idRows + '" num="' + idRows + '" class="fbtn btn-default form-control mParChange" style ="margin-bottom: 5px;" prev ="-1"  name="' + col1init + '-' + idRows + '"></select>');
                $("#" + col2init).append('<input type="text" ppID="" placeholder="Enter name" class="form-control " style ="margin-bottom: 5px;" id="' + col2init + '-' + String(idRows - 1) + '" name="' + col2init + '-' + String(idRows - 1) + '">');
                $("#" + col3init).append('<button  type="submit" class="btn btn-default form-control delRow" style ="margin-bottom: 5px;" id="' + col3init + '-' + String(idRows - 1) + '" name="' + col3init + '-' + String(idRows - 1) + '"><i class="glyphicon glyphicon-remove"></i></button>');
                $("#" + col4init).append('<a href="#" data-toggle="tooltip" data-placement="bottom" data-original-title="Add/Remove operator" class="btn btn-default addOpt" style ="margin-bottom: 5px;" id="' + col4init + '-' + String(idRows - 1) + '" name="' + col4init + '-' + String(idRows - 1) + '"> <span><i class="fa fa-wrench"></i></span></a>');
                $("#" + col5init).append('<select class="form-control" style ="visibility:hidden; margin-bottom: 5px;" id="' + col5init + '-' + String(idRows - 1) + '" name="' + col5init + '-' + String(idRows - 1) + '"></button>');
                $("#" + col6init).append('<input type="text" ppID="" placeholder="Enter operator content" class="form-control " style ="visibility:hidden; margin-bottom: 5px;" id="' + col6init + '-' + String(idRows - 1) + '" name="' + col6init + '-' + String(idRows - 1) + '">');
                $("#" + col7init).append('<button type="submit" class="btn btn-default form-control delOpt" style ="visibility:hidden; margin-bottom: 5px;" id="' + col7init + '-' + String(idRows - 1) + '" name="' + col7init + '-' + String(idRows - 1) + '"><i class="glyphicon glyphicon-remove"></i></button>');
                //load closure options
                var closureOpt = $('#mOutOpt-0 option').each(function () {
                    var val = $(this).val()
                    var optionClo = new Option(val, val);
                    $('#' + col5init + '-' + String(idRows - 1)).append(optionClo);
                });
                $('#' + col5init + '-' + String(idRows - 1) + ' option:first').attr('disabled', "disabled");
                console.log('#' + col5init + '-' + String(idRows - 1) + ' option:first');
                var opt = $('#mInputs > :first-child')[0].selectize.options;
                var newOpt = [];
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

    //toggle operators section in addprocessmodal when click on wrench
    $(document).on("click", ".addOpt", function (event) {
        event.preventDefault();
        var id = $(this).attr("id");
        var Patt = /m(.*)OptBut-(.*)/;
        var type = id.replace(Patt, '$1'); //In or Out
        var num = id.replace(Patt, '$2');
        var col4init = "m" + type + "OptBut";
        var col5init = "m" + type + "Opt";
        var col6init = "m" + type + "Closure";
        var col7init = "m" + type + "Optdel";
        if ($("#" + col5init + "-" + String(num)).css('visibility') === 'visible') {
            $("#" + col4init + "-" + String(num)).css('background', '#E7E7E7');
            $("#" + col5init + "-" + String(num)).css('visibility', 'hidden');
            $("#" + col6init + "-" + String(num)).css('visibility', 'hidden');
            $("#" + col7init + "-" + String(num)).css('visibility', 'hidden');

        } else if ($("#" + col5init + "-" + String(num)).css('visibility') === 'hidden') {
            $("#" + col4init + "-" + String(num)).css('background', '#FFF');
            $("#" + col5init + "-" + String(num)).css('visibility', 'visible');
            $("#" + col6init + "-" + String(num)).css('visibility', 'visible');
            $("#" + col7init + "-" + String(num)).css('visibility', 'visible');
        }
    });
    //remove operators section in addprocessmodal when click on wrench
    $(document).on("click", ".delOpt", function (event) {
        event.preventDefault();
        var id = $(this).attr("id");
        var Patt = /m(.*)Optdel-(.*)/;
        var type = id.replace(Patt, '$1'); //In or Out
        var num = id.replace(Patt, '$2');
        var col4init = "m" + type + "OptBut";
        var col5init = "m" + type + "Opt";
        var col6init = "m" + type + "Closure";
        var col7init = "m" + type + "Optdel";
        $("#" + col4init + "-" + String(num)).css('background', '#E7E7E7');
        $("#" + col5init + "-" + String(num)).css('visibility', 'hidden');
        $("#" + col6init + "-" + String(num)).css('visibility', 'hidden');
        $("#" + col7init + "-" + String(num)).css('visibility', 'hidden');
    });



    //remove  dropdown list of parameters
    $(document).on("click", ".delRow", function (event) {
        event.preventDefault();
        var id = $(this).attr("id");
        var Patt = /m(.*)Namedel-(.*)/;
        var type = id.replace(Patt, '$1'); //In or Out
        var num = id.replace(Patt, '$2');
        var col1init = "m" + type + "puts"; //column1 initials
        var col2init = "m" + type + "Name";
        var col3init = "m" + type + "Namedel";
        var col4init = "m" + type + "OptBut";
        var col5init = "m" + type + "Opt";
        var col6init = "m" + type + "Closure";
        var col7init = "m" + type + "Optdel";
        $("#" + col1init + "-" + String(num)).next().remove();
        $("#" + col1init + "-" + String(num)).remove();
        $("#" + col2init + "-" + String(num)).remove();
        $("#" + col3init + "-" + String(num)).remove();
        $("#" + col4init + "-" + String(num)).remove();
        $("#" + col5init + "-" + String(num)).remove();
        $("#" + col6init + "-" + String(num)).remove();
        $("#" + col7init + "-" + String(num)).remove();
    });

    //parameter modal file type change:(save file type as identifier for val)
    $('#modalQualifier').change(function () {
        if ($('#modalQualifier').val() === 'val') {
            $('#mFileTypeDiv').css('display', 'none');
        } else {
            $('#mFileTypeDiv').css('display', 'block');
        }
    });

    //parameter modal 
    $('#parametermodal').on('show.bs.modal', function (event) {
        $('#mFileTypeDiv').css('display', 'block');
        var button = $(event.relatedTarget);
        $(this).find('form').trigger('reset');

        if (button.attr('id') === 'mParamAdd') {
            $('#parametermodaltitle').html('Add New Parameter');
            $('#mParamsDynamic').css('display', "inline");
            $('#mParamList').css('display', "none");
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

        } else if (button.attr('id') === 'mParamEdit') {
            $('#parametermodaltitle').html('Edit Parameter');
            $('#mParamsDynamic').css('display', "none");
            $('#mParamList').css('display', "inline");
            //ajax for parameters
            $.ajax({
                type: "GET",
                url: "ajax/ajaxquery.php",
                data: {
                    p: "getEditDelParameters"
                },
                async: false,
                success: function (s) {
                    $("#mParamListIn").empty();
                    var firstOptionSelect = new Option("Editable Parameters...", '');
                    $("#mParamListIn").append(firstOptionSelect);
                    for (var i = 0; i < s.length; i++) {
                        var param = s[i];
                        var optionAll = new Option(param.name, param.id);
                        $("#mParamListIn").append(optionAll);
                    }
                    $('#mParamListIn').selectize({});
                }
            });


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
                    p: "getEditDelParameters"
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
    // Dismiss parameters modal 
    $('#parametermodal').on('hide.bs.modal', function (event) {
        $('#mParamListIn')[0].selectize.destroy();
        $('#mParamsDynamic').css('display', "inline");
        $('#mParamList').css('display', "none");
    });

    //Delparametermodal to delete parameters
    $('#delparametermodal').on('show.bs.modal', function (event) {
        $.ajax({
            type: "GET",
            url: "ajax/ajaxquery.php",
            data: {
                p: "getEditDelParameters"
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
                var allBox = $('#addProcessModal').find('select').filter(function () { return this.id.match(/mInputs(.*)|mOutputs(.*)/); });
                for (var i = 0; i < allBox.length; i++) {
                    var parBoxId = allBox[i].getAttribute('id');
                    $('#' + parBoxId)[0].selectize.removeOption(selectParam);
                }
            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
        $('#delparametermodal').modal('hide');
        refreshDataset()
    });

    // Dismiss parameters delete modal 
    $('#delparametermodal').on('hide.bs.modal', function (event) {
        $('#mParamListDel')[0].selectize.destroy();
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
                        $('#modalQualifier').trigger("change");
                    }
                }
            });
            var modaltit = $('#parametermodaltitle').html();
            if (modaltit === 'Add New Parameter') {
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
        var selParID = data[0].value;
        var selParName = data[1].value;
        var selParQual = data[2].value;
        var selParType = data[3].value;
        if (selParQual === 'val') {
            data[3].value = selParName;
            selParType = selParName;
        }
        if (selParName !== '' && selParQual !== '' && selParType !== '') {
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
                        var allBox = $('#addProcessModal').find('select').filter(function () { return this.id.match(/mInputs(.*)|mOutputs(.*)/); });
                        for (var i = 0; i < allBox.length; i++) {
                            var parBoxId = allBox[i].getAttribute('id');
                            $('#' + parBoxId)[0].selectize.updateOption(selParID, {
                                id: selParID,
                                name: selParName,
                                qualifier: selParQual,
                                file_type: selParType
                            });
                        }

                    } else { //Add Parameter
                        //$('#mParamAllIn')[0].selectize.addOption({value: s.id, text: selParName });
                        var allBox = $('#addProcessModal').find('select').filter(function () { return this.id.match(/mInputs(.*)|mOutputs(.*)/); });
                        for (var i = 0; i < allBox.length; i++) {
                            var parBoxId = allBox[i].getAttribute('id');
                            $('#' + parBoxId)[0].selectize.addOption({
                                id: s.id,
                                name: selParName,
                                qualifier: selParQual,
                                file_type: selParType
                            });
                        }
                    }
                    //                $('#mParamListIn')[0].selectize.destroy();
                    $('#parametermodal').modal('hide');
                    refreshDataset()
                },
                error: function (errorThrown) {
                    alert("Error: " + errorThrown);
                }
            });
        }
    });
    // process group modal 
    $('#renameModal').on('show.bs.modal', function (event) {
        $('#renameModaltitle').html('Change Name');
        $('#mRenName').val(renameText);
    });
    $('#renameModal').on('click', '#renameProPara', function (event) {
        changeName();
        autosave();
        $('#renameModal').modal("hide");
    });

    // Delete process d3 modal 
    $('#confirmD3Modal').on('show.bs.modal', function (event) {
        $('#confirmD3ModalText').html('Are you sure you want to delete?');

    });
    $('#confirmD3Modal').on('click', '#deleteD3Btn', function (event) {
        if (deleteID.split("_").length == 2) {
            removeEdge();
        } else if (deleteID.split("_").length == 1) {
            remove();
        }
        autosave();
        $('#confirmD3Modal').modal("hide");
    });


    // process group modal 
    $('#processGroupModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        $(this).find('form').trigger('reset');
        $(this).find('option').remove();

        if (button.attr('id') === 'groupAdd') {
            $('#processGroupmodaltitle').html('Add Menu Group');
        } else if (button.attr('id') === 'groupEdit') {
            $('#processGroupmodaltitle').html('Edit Menu Group');
            $('#mGroupListForm').css('display', "block");
            var formValues = $('#proGroup').find('select');
            var selGroupId = "";
            var selGroupId = formValues.serializeArray()[0].value; // convert form to array
            $.ajax({
                type: "GET",
                url: "ajax/ajaxquery.php",
                data: {
                    p: "getEditDelProcessGroups"
                },
                async: false,
                success: function (s) {
                    $("#mMenuGroupList").append('<option  value="">Select menu groups to edit..</option>');
                    for (var i = 0; i < s.length; i++) {
                        var param = s[i];
                        var optionGroup = new Option(param.group_name, param.id);
                        $("#mMenuGroupList").append(optionGroup);
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
        var formValues = $('#processGroupModal').find('input');
        var savetype = 'add';
        var data = formValues.serializeArray(); // convert form to array
        var selProGroupID = $("#mMenuGroupList").val();
        if ($('#processGroupmodaltitle').html() === 'Edit Menu Group') {
            data[0].value = selProGroupID;
            savetype = "edit";
        }
        var selProGroupName = data[1].value;
        data.push({ name: "p", value: "saveProcessGroup" });
        if ((savetype === "edit" && selProGroupID !== '' && selProGroupName !== '') || (savetype === "add" && selProGroupName !== '')) {
            $.ajax({
                type: "POST",
                url: "ajax/ajaxquery.php",
                data: data,
                async: false,
                success: function (s) {
                    if (savetype === 'edit') { //Edit Process Group
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
        }
    });

    //close process group modal 
    $('#processGroupModal').on('hide.bs.modal', function (event) {
        $('#mGroupListForm').css('display', "none");
    });

    //process group remove button
    $('#delprocessGrmodal').on('show.bs.modal', function (event) {
        $.ajax({
            type: "GET",
            url: "ajax/ajaxquery.php",
            data: {
                p: "getEditDelProcessGroups"
            },
            async: false,
            success: function (s) {
                $("#mMenuGroupListDel").empty();
                var firstOptionSelect = new Option("Select Menu Group to Delete...", '');
                $("#mMenuGroupListDel").append(firstOptionSelect);
                for (var i = 0; i < s.length; i++) {
                    var param = s[i];
                    var optionAll = new Option(param.group_name, param.id);
                    $("#mMenuGroupListDel").append(optionAll);
                }
            }
        });
    });



    //process group remove button
    $('#delprocessGrmodal').on('click', '#delproGroup', function (e) {
        e.preventDefault();
        var selectProGro = $("#mMenuGroupListDel").val();
        if (selectProGro !== '') {

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
                    $('#side-' + selectProGro).parent().remove();
                    $('#delprocessGrmodal').modal('hide');
                    
                },
                error: function (errorThrown) {
                    alert("Error: " + errorThrown);
                }
            });
        }

    });


    //   ---- Run modal starts ---


    var projectTable = $('#projecttable').DataTable({
        "ajax": {
            url: "ajax/ajaxquery.php",
            data: { "p": "getProjects" },
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
                "data": "name"
            }, {
                "data": "username"
            }, {
                "data": "date_created"
            }],
        'select': {
            'style': 'single'
        },
        'order': [[1, 'asc']]
    });

    $('#mRun').on('show.bs.modal', function (event) {
        projectTable.column(0).checkboxes.deselect();
        var pipeline_id = $('#pipeline-title').attr('pipelineid');
        if (pipeline_id === '') {
            event.preventDefault();
        }

    });


    $('#mRun').on('click', '#selectProject', function (event) {
        event.preventDefault();
        var pipeline_id = $('#pipeline-title').attr('pipelineid');
        var rows_selected = projectTable.column(0).checkboxes.selected();
        if (rows_selected.length === 1 && pipeline_id !== '') {
            //            var data = [];
            //            var project_id = rows_selected[0];
            //            data.push({ name: "project_id", value: project_id });
            //            data.push({ name: "pipeline_id", value: pipeline_id });
            //            data.push({ name: "p", value: "saveProjectPipeline" });
            $('#runNameModal').modal('show');


        }
    });
    //enter run name modal
    $('#runNameModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        $(this).find('form').trigger('reset');
        if (button.attr('id') === 'selectProject') {
            $('#runNameModaltitle').html('Enter Run Name');
        } else {}
    });
    //save run on database
    $('#runNameModal').on('click', '#saveRun', function (event) {
        event.preventDefault();
        var pipeline_id = $('#pipeline-title').attr('pipelineid');
        var rows_selected = projectTable.column(0).checkboxes.selected();
        var run_name = $('#runName').val();

        if (rows_selected.length === 1 && pipeline_id !== '' && run_name !== '') {
            var data = [];
            var project_id = rows_selected[0];
            data.push({ name: "name", value: run_name });
            data.push({ name: "project_id", value: project_id });
            data.push({ name: "pipeline_id", value: pipeline_id });
            data.push({ name: "p", value: "saveProjectPipeline" });
            var proPipeGet = getValues(data);
            var projectPipelineID = proPipeGet.id;
            $('#runNameModal').modal('hide');
            $('#mRun').modal('hide');
            setTimeout(function () { window.location.replace("index.php?np=3&id=" + projectPipelineID); }, 700);
        }
    });






    $('#projectmodal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget);
        $(this).find('form').trigger('reset');
        if (button.attr('id') === 'addproject') {
            $('#projectmodaltitle').html('Add New Project');
        }
    });

    $('#projectmodal').on('click', '#saveproject', function (event) {
        event.preventDefault();
        var formValues = $('#projectmodal').find('input');
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



    //   ---- Run modal ends ---





});
