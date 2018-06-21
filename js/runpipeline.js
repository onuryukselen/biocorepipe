/**
 * Extend the Array object
 * @param candid The string to search for
 * @returns Returns the index of the first match or -1 if not found
 */
Array.prototype.searchFor = function (candid) {
    for (var i = 0; i < this.length; i++)
        if (this[i].indexOf(candid) > -1)
            return true;
    return false;
};

function dragStart(event) {
    event.dataTransfer.setData("Text", event.target.id);
}

function dragging(event) {
    event.preventDefault();
}

function allowDrop(event) {
    event.preventDefault();
}
refreshDataset()

function refreshDataset() {
    parametersData = getValues({
        p: "getAllParameters"
    })

}
var sData = "";
var svg = "";
var mainG = "";
var autoFillJSON;

function createSVG() {
    edges = []
    w = '100%'
    h = 500
    r = 70
    cx = 0
    cy = 0
    ior = r / 6
    var dat = [{
        x: 0,
        y: 0
	      }]
    gNum = 0
    selectedgID = ""
    selectedg = ""
    diffx = 0
    diffy = 0

    processList = {}
    edges = []
    candidates = []
    saveNodes = []

    dupliPipe = false
    binding = false
    renameTextID = ""
    deleteID = ""

    d3.select("#svg").remove();
    //--Pipeline details table clean --
    $('#inputsTable').find("tr:gt(0)").remove();
    $('#outputsTable').find("tr:gt(0)").remove();
    $('#processTable').find("tr:gt(0)").remove();

    svg = d3.select("#container").append("svg")
        .attr("id", "svg")
        .attr("width", w)
        .attr("height", h)
        .on("mousedown", startzoom)
        .on("mouseup", autosave)
    //	          .call(zoom)
    mainG = d3.select("#container").select("svg").append("g")
        .attr("id", "mainG")
        .attr("transform", "translate(" + 0 + "," + 0 + ")")
}

function startzoom() {
    d3.select("#container").call(zoom)
}

$('#pipelineSum').keyup(function () {
    autosave();
});
$("#pipeline-title").keyup(function () { //Click outside of the field or enter
    autosave();
});

var timeoutId = 0;

function autosave() {}

function newPipeline() {
    createSVG()
    $('#pipeline-title').val('');
    $('#pipeline-title').attr('pipelineid', '');
    resizeForText.call($inputText, $inputText.attr('placeholder'));
}

function duplicatePipeline() {
    dupliPipe = true
    save()
}

function delPipeline() {
    var pipeID = $('#pipeline-title').attr('pipelineid');
    var s = getValues({
        p: "removePipelineById",
        'id': pipeID
    });
    window.location.replace("index.php?np=1");
}

function resetSingleParam(paramId) {
    if ($('#' + paramId).attr("connect") === "single") {
        if ($('#' + paramId).parent().attr("class") === "g-inPro") {
            resetOriginal("inPro", paramId)
        } else if ($('#' + paramId).parent().attr("class") === "g-outPro") {
            resetOriginal("outPro", paramId)
        }
    }
}

//resets input/output parameters to original state
//paramType:outPro or inPro
function resetOriginal(paramType, firstParamId) {
    var patt = /(.*)-(.*)-(.*)-(.*)-(.*)/;
    if (paramType === 'outPro') {
        var originalID = firstParamId.replace(patt, '$1-$2-$3-' + "outPara" + '-$5')
        d3.selectAll("#" + firstParamId).attr("id", originalID);
        d3.selectAll("#" + originalID).attr("class", "connect_to_output input");
    } else if (paramType === 'inPro') {
        var originalID = firstParamId.replace(patt, '$1-$2-$3-' + "inPara" + '-$5')
        d3.selectAll("#" + firstParamId).attr("id", originalID);
        d3.selectAll("#" + originalID).attr("class", "connect_to_input output");
    }
}

//edges-> all edge list, nullId-> process input/output id that not exist in the d3 diagrams 
function getNewNodeId(edges, nullId) {
    //nullId: i-24-14-20-1
    var nullProcessInOut = nullId.split("-")[0];
    var nullProcessId = nullId.split("-")[1];
    var nullProcessParId = nullId.split("-")[3];
    var nullProcessGnum = nullId.split("-")[4];
    //check is parameter is unique:
    if (nullProcessInOut === "i") {
        var nodes = getValues({ p: "getInputsPP", "process_id": nullProcessId })
        var paraData = nodes.filter(function (el) { return el.parameter_id == nullProcessParId });
    } else if (nullProcessInOut === "o") {
        var nodes = getValues({ p: "getOutputsPP", "process_id": nullProcessId })
        var paraData = nodes.filter(function (el) { return el.parameter_id == nullProcessParId });
    }
    //get newNodeID  
    if (paraData.length === 1 && nullProcessId !== "inPro" && nullProcessId !== "outPro") {
        var patt = /(.*)-(.*)-(.*)-(.*)-(.*)/;
        var nullIdRegEx = new RegExp(nullId.replace(patt, '$1-$2-' + '(.*)' + '-$4-$5'), 'g')
        var newNode = $('#g-' + nullProcessGnum).find("circle").filter(function () {
            return this.id.match(nullIdRegEx);
        })
        if (newNode.length === 1) {
            var newNodeId = newNode.attr("id");
            return newNodeId;
        }
    }
}


function openPipeline(id) {
    createSVG()
    sData = getValues({
        p: "loadPipeline",
        id: id
    }) //all data from biocorepipe_save table

    if (Object.keys(sData).length > 0) {
        nodes = sData[0].nodes
        nodes = JSON.parse(nodes.replace(/'/gi, "\""))
        mG = sData[0].mainG
        mG = JSON.parse(mG.replace(/'/gi, "\""))["mainG"]
        zoom.translate([parseFloat(mG[0]), parseFloat(mG[1])]).scale(parseFloat(mG[2]));
        newTransform = "translate(" + (parseFloat(mG[0])) + "," + (parseFloat(mG[1])) + ")scale(" + (parseFloat(mG[2])) + ")"
        d3.select("#mainG").attr("transform", newTransform)
        for (var key in nodes) {
            x = nodes[key][0]
            y = nodes[key][1]
            pId = nodes[key][2]
            name = nodes[key][3]
            var processModules = nodes[key][4];
            gN = key.split("-")[1]
            //--Pipeline details table & ProcessPanel (where processOpt defined) is created in loadPipeline
            loadPipeline(x, y, pId, name, processModules, gN)
        }
        ed = sData[0].edges
        ed = JSON.parse(ed.replace(/'/gi, "\""))["edges"]
        for (var ee = 0; ee < ed.length; ee++) {
            eds = ed[ee].split("_")
            if (!document.getElementById(eds[0]) && document.getElementById(eds[1])) {
                //if process is updated through process modal, reconnect the uneffected one based on their parameter_id.
                var newID = getNewNodeId(ed, eds[0])
                if (newID) {
                    eds[0] = newID;
                    addCandidates2DictForLoad(eds[0])
                    createEdges(eds[0], eds[1])
                }
                //if process is updated through process modal, reset the edge of input/output parameter and reset the single circles.
                resetSingleParam(eds[1]);

            } else if (!document.getElementById(eds[1]) && document.getElementById(eds[0])) {
                var newID = getNewNodeId(ed, eds[1]);
                if (newID) {
                    eds[1] = newID;
                    addCandidates2DictForLoad(eds[0])
                    createEdges(eds[0], eds[1])
                }
                resetSingleParam(eds[0]);

            } else {
                addCandidates2DictForLoad(eds[0])
                createEdges(eds[0], eds[1])
            }
        }
    }
    checkReadytoRun();
}

d3.select("#container").style("background-image", "url(https://68.media.tumblr.com/afc0c91aac9ccc5cbe10ff6f922f58dc/tumblr_nlzk53d4IQ1tagz2no6_r1_500.png)").on("keydown", cancel).on("mousedown", cancel)

var zoom = d3.behavior.zoom()
    .translate([0, 0])
    .scale(1)
    .scaleExtent([0.15, 2])
    .on("zoom", zoomed);

createSVG()

function zoomed() {
    mainG.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function drawParam(name, process_id, id, kind, sDataX, sDataY, paramid, pName, classtoparam, init, pColor, defVal, dropDown) {
    //gnum uniqe, id same id (Written in class) in same type process
    g = d3.select("#mainG").append("g")
        .attr("id", "g-" + gNum)
        .attr("class", "g-" + id)
        .attr("transform", "translate(" + sDataX + "," + sDataY + ")")
    //	          .on("mouseover", mouseOverG)
    //	          .on("mouseout", mouseOutG)

    //gnum(written in id): uniqe, id(Written in class): same id in same type process, bc(written in type): same at all bc
    //outermost circle transparent
    g.append("circle").attr("id", "bc-" + gNum)
        .attr("class", "bc-" + id)
        .attr("type", "bc")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", ipR + ipIor)
        .attr('fill-opacity', 0)
        .attr("fill", "#E0E0E0")

    //second outermost circle visible gray
    g.append("circle")
        .datum([{
            cx: 0,
            cy: 0
                }])
        .attr("id", "sc-" + gNum)
        .attr("class", "sc-" + id)
        .attr("type", "sc")
        .attr("r", ipR + ipIor)
        .attr("fill", "#E0E0E0")
        .attr('fill-opacity', 1)
    //	          .on("mouseover", scMouseOver)
    //	          .on("mouseout", scMouseOut)
    //	          .call(drag)

    //gnum(written in id): uniqe, id(Written in class): same id in same type process, bc(written in type): same at all bc
    //inner parameter circle


    d3.select("#g-" + gNum).append("circle")
        .attr("id", init + "-" + id + "-" + 1 + "-" + paramid + "-" + gNum) //değişecek
        .attr("type", "I/O")
        .attr("kind", kind) //connection candidate=input
        .attr("parentG", "g-" + gNum)
        .attr("name", name)
        .attr("status", "standard")
        .attr("connect", "single")
        .attr("class", classtoparam)
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", ipIor)
        .attr("fill", pColor)
        .attr('fill-opacity', 0.8)
        .on("mouseover", IOmouseOver)
        .on("mousemove", IOmouseMove)
        .on("mouseout", IOmouseOut)
    //	          .on("mousedown", IOconnect)

    //gnum(written in id): unique,
    g.append("text").attr("id", "text-" + gNum)
        .datum([{
            cx: 0,
            cy: 20,
            "name": name
                }])
        .attr('font-family', "FontAwesome, sans-serif")
        .attr('font-size', '1em')
        .attr('name', name)
        .attr('class', 'inOut')
        .attr('classType', kind)
        .text(truncateName(name, 'inOut'))
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", 28)
    if (defVal) {
        $("#text-" + gNum).attr('defVal', defVal)
    }
    if (dropDown) {
        $("#text-" + gNum).attr('dropDown', dropDown)
    }
}

//inputText = "example" //* @textbox @description:"One inputbox is invented"
//selectText = "sel1" //* @dropdown @options:"none","sel1","sel2" @description:"One text is invented"
//checkBox = "true" //* @checkbox @description:"One checkbox is created"

function parseVarPart(varPart, type) {
    var splitType = type || "";
    var varName = null;
    var defaultVal = null;
    if (varPart.match(/=/)) {
        if (splitType === "condition") {
            var varSplit = varPart.split('==');
        } else {
            var varSplit = varPart.split('=');
        }
        if (varSplit.length == 2) {
            varName = $.trim(varSplit[0]);
            defaultVal = $.trim(varSplit[1]);
            // if defaultVal starts and ends with single or double quote, remove these. (keep other quotes)
            if ((defaultVal.charAt(0) === '"' || defaultVal.charAt(0) === "'") && (defaultVal.charAt(defaultVal.length - 1) === '"' || defaultVal.charAt(defaultVal.length - 1) === "'")) {
                defaultVal = defaultVal.substr(1, defaultVal.length - 2);
            }
        }
    } // if /=/ not exist then genericCond is defined   
    else {
        if (splitType === "condition") {
            varName = $.trim(varPart);
            defaultVal = null;
        }
    }
    return [varName, defaultVal]
}

//parse main categories: @checkbox, @textbox, @inputbox, @dropdown, @description, @options 
function parseRegPart(regPart) {
    var type = null;
    var desc = null;
    var tool = null;
    var opt = null;
    if (regPart.match(/@/)) {
        var regSplit = regPart.split('@');
        for (var i = 0; i < regSplit.length; i++) {
            // find type among types:checkbox|textbox|input|dropdown
            var typeCheck = regSplit[i].match(/checkbox|textbox|input|dropdown/i);
            if (typeCheck) {
                type = typeCheck[0].toLowerCase();
            }
            // find description
            var descCheck = regSplit[i].match(/description:"(.*)"|description:'(.*)'/i);
            if (descCheck) {
                if (descCheck[1]) {
                    desc = descCheck[1];
                } else if (descCheck[2]) {
                    desc = descCheck[2];
                }
            }
            // find tooltip
            var toolCheck = regSplit[i].match(/tooltip:"(.*)"|tooltip:'(.*)'/i);
            if (toolCheck) {
                if (toolCheck[1]) {
                    tool = toolCheck[1];
                } else if (toolCheck[2]) {
                    tool = toolCheck[2];
                }
            }
            // find options
            var optCheck = regSplit[i].match(/options:"(.*)"|options:'(.*)'/i);
            if (optCheck) {
                if (optCheck[1]) {
                    var allOpt = optCheck[1];
                } else if (optCheck[2]) {
                    var allOpt = optCheck[2];
                }
                //seperate options by comma
                if (allOpt) {
                    var allOpt = allOpt.split(',');
                    if (allOpt.length) {
                        for (var k = 0; k < allOpt.length; k++) {
                            allOpt[k] = $.trim(allOpt[k]);
                            allOpt[k] = allOpt[k].replace(/\"/g, '');
                            allOpt[k] = allOpt[k].replace(/\'/g, '');
                        }
                    }
                }
                opt = allOpt;
            }
        }
    }
    return [type, desc, tool, opt]
}

function addProcessPanelRow(gNum, name, varName, defaultVal, type, desc, opt, tool) {
    if (tool && tool != "") {
        var toolText = ' <span><a data-toggle="tooltip" data-placement="bottom" title="' + tool + '"><i class="glyphicon glyphicon-info-sign"></i></a></span>';
    } else {
        var toolText = "";
    }
    if (!desc) {
        var descText = "";
    } else {
        var descText = '<p style="font-size:13px">' + desc + '</p>';
    }
    var processParamDiv = '<div class="form-group">';
    var label = '<label>' + varName + toolText + ' </label>';
    if (type === "input") {
        var inputDiv = '<input type="text" class="form-control" id="var_' + gNum + '-' + varName + '" name="var_' + gNum + '-' + varName + '" value="' + defaultVal + '">';
        processParamDiv += label + inputDiv + descText + '</div>';
    } else if (type === "textbox") {
        var inputDiv = '<textarea class="form-control" id="var_' + gNum + '-' + varName + '" name="var_' + gNum + '-' + varName + '">' + defaultVal + '</textarea>';
        processParamDiv += label + inputDiv + descText + '</div>';
    } else if (type === "checkbox") {
        if (defaultVal) {
            if (defaultVal === "true") {
                defaultVal = "checked"
            } else {
                defaultVal = ""
            }
        }
        var inputDiv = '<input type="checkbox" style = "margin-right:5px;" class="form-check-input" id="var_' + gNum + '-' + varName + '" name="var_' + gNum + '-' + varName + '" ' + defaultVal + '>';
        processParamDiv += inputDiv + label + descText + '</div>';
    } else if (type === "dropdown") {
        var inputDiv = '<select class="form-control" id="var_' + gNum + '-' + varName + '" name="var_' + gNum + '-' + varName + '">';
        var optionDiv = "";
        if (opt) {
            if (opt.length) {
                for (var k = 0; k < opt.length; k++) {
                    if (defaultVal === opt[k]) {
                        optionDiv += '<option selected>' + opt[k] + ' </option>';
                    } else {
                        optionDiv += '<option>' + opt[k] + ' </option>';
                    }
                }
            }
        }
        processParamDiv += label + inputDiv + optionDiv + '</select>' + descText + '</div>';
    }
    $('#addProcessRow-' + gNum).append(processParamDiv)
}

// check if all conditions match	
function checkConds(conds) {
    var checkConditionsFalse = [];
    var checkConditionsTrue = [];
    $.each(conds, function (co) {
        //check if condtion is $HOSTNAME specific
        if (co === "$HOSTNAME") {
            var hostname = conds[co];
            var chooseEnvHost = $('#chooseEnv').find(":selected").attr("host");
            if (hostname && chooseEnvHost && hostname === chooseEnvHost) {
                checkConditionsTrue.push(true);
            } else {
                checkConditionsFalse.push(false);
            }
        } else {
            var varName = co.match(/params\.(.*)/)[1]; //variable Name
            var defName = conds[co]; // expected Value
            var checkVarName = $("#inputsTab").find("td[given_name='" + varName + "']")[0];
            if (checkVarName) {
                var varNameBut = $(checkVarName).children()[0];
                if (varNameBut) {
                    var varNameVal = $(varNameBut).val();
                }
                if (varNameVal && defName && varNameVal === defName) {
                    checkConditionsTrue.push(true)
                } else {
                    checkConditionsFalse.push(false)
                }
            }
        }
    });
    // if all conditions match, length==0 for checkConditionsFalse
    if (checkConditionsFalse.length === 0 && checkConditionsTrue.length > 0) {
        return true
    } else {
        return false
    }
}

function getInputVariables(button) {
    var rowID = button.parent().parent().attr("id"); //"inputTa-5"
    var gNumParam = rowID.split("Ta-")[1];
    var given_name = $("#input-PName-" + gNumParam).text(); //input-PName-3
    var qualifier = $('#' + rowID + ' > :nth-child(4)').text();
    var sType = "";
    if (qualifier === 'file' || qualifier === 'set') {
        sType = 'file'; //for simplification 
    } else if (qualifier === 'val') {
        sType = qualifier
    }
    return [rowID, gNumParam, given_name, qualifier, sType]
}

//fill file/Val buttons
function autoFillButton(buttonText, value) {
    var button = $(buttonText);
    var checkDropDown = button.attr("id") == "dropDown";
    var checkFileExist = button.css("display") == "none";
    //if  checkDropDown == false and checkFileExist == true then edit
    //if  checkDropDown == false and checkFileExist == false then insert
    var rowID = "";
    var gNumParam = "";
    var given_name = "";
    var qualifier = "";
    var sType = "";
		[rowID, gNumParam, given_name, qualifier, sType] = getInputVariables(button);
    var proPipeInputID = $('#' + rowID).attr('propipeinputid');
    var inputID = null;

    var data = [];
    data.push({ name: "id", value: "" });
    data.push({ name: "name", value: value });
    // insert into project pipeline input table
    if (value && value != "") {
        if (checkDropDown == false && checkFileExist == false) {
            checkInputInsert(data, gNumParam, given_name, qualifier, rowID, sType, inputID);
        } else if (checkDropDown == false && checkFileExist == true) {
            checkInputEdit(data, gNumParam, given_name, qualifier, rowID, sType, proPipeInputID, inputID);
        } else if (checkDropDown == true) {
            // if proPipeInputID exist, then first remove proPipeInputID.
            if (proPipeInputID) {
                var removeInput = getValues({ "p": "removeProjectPipelineInput", id: proPipeInputID });
            }
            checkInputInsert(data, gNumParam, given_name, qualifier, rowID, sType, inputID);
        }
    } else { // if value is empty:"" then remove from project pipeline input table
        var removeInput = getValues({ "p": "removeProjectPipelineInput", id: proPipeInputID });
        removeSelectFile(rowID, qualifier);
    }
}
// fill pipeline or process executor settings
function fillExecSettings(id, defName, type, inputName) {
    if (type === "pipeline") {
        setTimeout(function () {
            updateCheckBox('#exec_all', "true");
            fillFormById('#allProcessSettTable', id, defName);
        }, 1);
    } else if (type === "process") {
        setTimeout(function () {
            var findCheckBox = $('#processTable >tbody> tr[procproid=' + id + ']').find("input[name=check]")
            if (findCheckBox && findCheckBox[0]) {
                var checkBoxId = $(findCheckBox[0]).attr("id")
            }
            updateCheckBox("#" + checkBoxId, "true");
            updateCheckBox('#exec_each', "true");
            fillFormById('#processTable >tbody> tr[procproid=' + id + ']', "input[name=" + inputName + "]", defName)
        }, 1);
    }
}

//change propipeinputs in case all conds are true
function fillStates(states) {
    $("#inputsTab").loading('start');
    $.each(states, function (st) {
        var defName = states[st]; // expected Value
        //if variable start with "params." then check #inputsTab
        if (st.match(/params\.(.*)/)) {
            var varName = st.match(/params\.(.*)/)[1]; //variable Name
            var checkVarName = $("#inputsTab").find("td[given_name='" + varName + "']")[0];
            if (checkVarName) {
                var varNameButAr = $(checkVarName).children();
                if (varNameButAr && varNameButAr[0]) {
                    autoFillButton(varNameButAr[0], defName);
                }
            }
            //if variable starts with "$" then run parameters for pipeline are defined. Fill run parameters.
        } else if (st.match(/\$(.*)/)) {
            var varName = st.match(/\$(.*)/)[1]; //variable Name
            if (varName === "SINGULARITY_IMAGE") {
                $('#singu_img').val(defName);
                updateCheckBox('#singu_check', "true");
            } else if (varName === "DOCKER_IMAGE") {
                $('#docker_img').val(defName);
                updateCheckBox('#docker_check', "true");
            } else if (varName === "SINGULARITY_OPTIONS") {
                $('#singu_opt').val(defName);
                updateCheckBox('#singu_check', "true");
            } else if (varName === "DOCKER_OPTIONS") {
                $('#docker_opt').val(defName);
                updateCheckBox('#docker_check', "true");
            } else if (varName === "TIME") {
                fillExecSettings("#job_time", defName, "pipeline");
            } else if (varName === "QUEUE") {
                fillExecSettings("#job_queue", defName, "pipeline");
            } else if (varName === "MEMORY") {
                fillExecSettings("#job_memory", defName, "pipeline");
            } else if (varName === "CPU") {
                fillExecSettings("#job_cpu", defName, "pipeline");
            } else if (varName === "EXEC_OPTIONS") {
                fillExecSettings("#job_clu_opt", defName, "pipeline");
                //two conditions covers both process and pipeline run_commands
            } else if (varName.match(/RUN_COMMAND@(.*)/) || varName === "RUN_COMMAND") {
                setTimeout(function () {
                    var initialText = $('#runCmd').val();
                    if (initialText == "") {
                        $('#runCmd').val(defName);
                    } else {
                        $('#runCmd').val(initialText + " && " + defName);
                    }
                }, 1);
            } else if (varName.match(/TIME@(.*)/)) {
                var processId = varName.match(/TIME@(.*)/)[1];
                fillExecSettings(processId, defName, "process", "time");
            } else if (varName.match(/QUEUE@(.*)/)) {
                var processId = varName.match(/QUEUE@(.*)/)[1]
                fillExecSettings(processId, defName, "process", "queue");
            } else if (varName.match(/MEMORY@(.*)/)) {
                var processId = varName.match(/MEMORY@(.*)/)[1]
                fillExecSettings(processId, defName, "process", "memory");
            } else if (varName.match(/CPU@(.*)/)) {
                var processId = varName.match(/CPU@(.*)/)[1]
                fillExecSettings(processId, defName, "process", "cpu");
            } else if (varName.match(/EXEC_OPTIONS@(.*)/)) {
                var processId = varName.match(/EXEC_OPTIONS@(.*)/)[1]
                fillExecSettings(processId, defName, "process", "opt");
            }

        } else { //if variable not start with "params." or "$" then check pipeline options:
            var varName = st;
            var checkVarName = $("#var_pipe-" + varName)[0];
            if (checkVarName) {
                $(checkVarName).val(defName);
            }
        }
    });
    checkReadytoRun();
    $("#inputsTab").loading('stop');

}
// to execute autofill function, binds event handlers
function bindEveHandler(autoFillJSON) {
    $.each(autoFillJSON, function (el) {
        var conds = autoFillJSON[el].condition;
        var states = autoFillJSON[el].statement;
        if (conds && states && !$.isEmptyObject(conds) && !$.isEmptyObject(states)) {
            //bind eventhandler to #chooseEnv
            if (conds.$HOSTNAME) {
                $("#chooseEnv").change(function () {
                    var statusCond = checkConds(conds);
                    if (statusCond === true) {
                        fillStates(states)
                    }
                });
            }
            //if condition exist other than $HOSTNAME then bind eventhandler to #params. button (eg. dropdown or inputValEnter)
            $.each(conds, function (el) {
                if (el !== "$HOSTNAME") {
                    //if variable start with "params." then check #inputsTab
                    if (el.match(/params\.(.*)/)) {
                        var varName = el.match(/params\.(.*)/)[1]; //variable Name
                        var checkVarName = $("#inputsTab").find("td[given_name='" + varName + "']")[0];
                        if (checkVarName) {
                            var varNameButAr = $(checkVarName).children();
                            if (varNameButAr && varNameButAr[0]) {
                                //bind eventhandler to #dropdown button
                                $(varNameButAr[0]).change(function () {
                                    var statusCond = checkConds(conds);
                                    if (statusCond === true) {
                                        fillStates(states);
                                    }
                                });
                            }
                        }
                    }
                }
            });
        }
    });
}

//parses header_script and create autoFill array. 
//eg. [condition:{hostname:ghpcc, var:mm10},statement:{indexPath:"/path"}] 
//or generic condition eg. [genCondition:{hostname:null, params.genomeTypePipeline:null}, library:{_species:"human"}] 
function parseAutofill(script) {
    if (script) {
        //check if autofill comment is exist: //* autofill
        if (script.match(/\/\/\* autofill/i)) {
            var lines = script.split('\n');
            var blockStart = null; // beginning of autofill block
            var ifBlockStart = null; // beginning of if block
            var conds = {}; //keep all conditions for if block
            var genConds = {}; //keep all generic conditions for if block
            var autoFill = [];
            var states = {}; //keep all statements for if block
            var library = {}; //keep all string filling library for if block
            for (var i = 0; i < lines.length; i++) {
                var varName = null;
                var defaultVal = null;
                var cond = null; // each condition
                //first find the line of autofill
                if (lines[i].match(/\/\/\* autofill/i)) {
                    var blockStart = i;
                }
                // parse statements after first line of autofill
                if (blockStart && i > blockStart) {
                    //find if condition
                    if (lines[i].match(/.*if *\((.*)\).*/i)) {
                        if (ifBlockStart) {
                            if (conds && states && library && genConds && (!$.isEmptyObject(conds) || !$.isEmptyObject(genConds)) && (!$.isEmptyObject(states) || !$.isEmptyObject(library))) {
                                autoFill.push({ condition: conds, genCondition: genConds, statement: states, library: library })
                            }
                        }
                        conds = {};
                        genConds = {};
                        library = {}; //new library object. Will be used for filling strings. 
                        states = {}; //new statement object. It will be filled with following statements until next if condition
                        var ifBlockStart = i;
                        cond = lines[i].match(/.*if *\((.*)\).*/i)[1]
                        if (cond) {
                            var condsplit = cond.split("&&");
                            $.each(condsplit, function (el) {
									[varName, defaultVal] = parseVarPart(condsplit[el], "condition");
                                if (varName && defaultVal) {
                                    conds[varName] = defaultVal;
                                } else if (varName && !defaultVal) {
                                    genConds[varName] = defaultVal;
                                }
                            });
                        }
                        //end of the autofill block: //*
                    } else if (lines[i].match(/\/\/\*/i)) {
                        blockStart = null;
                        if (conds && states && library && genConds && (!$.isEmptyObject(conds) || !$.isEmptyObject(genConds)) && (!$.isEmptyObject(states) || !$.isEmptyObject(library))) {
                            autoFill.push({ condition: conds, genCondition: genConds, statement: states, library: library })
                        }
                        //lines of statements 
                    } else {
	  					[varName, defaultVal] = parseVarPart(lines[i]);
                        if (varName && defaultVal) {
                            if (varName.match(/^_.*$/)) {
                                library[varName] = defaultVal;
                            } else {
                                states[varName] = defaultVal;
                            }

                        }
                    }
                }
            }
        }
    }
    return autoFill
}

// get new statements for each combination of conditions
function getNewStatements(conditions, autoFillJSON, genStatement) {
    var newStateCond = { condition: {}, genCondition: {}, statement: {}, library: {} };
    if (conditions) {
        var defValLibrary = [];
        var mergedLib = {}
        // get Merged library for given conditions
        $.each(conditions, function (ele) {
            var varName = Object.keys(conditions[ele]);
            var defVal = conditions[ele][varName]
            newStateCond.condition[varName] = defVal;
            //find varName = defVal statement in autoFillJSON which has library
            $.each(autoFillJSON, function (elem) {
                if (autoFillJSON[elem].condition && autoFillJSON[elem].condition != "" && !$.isEmptyObject(autoFillJSON[elem].condition) && autoFillJSON[elem].library && autoFillJSON[elem].library != "" && !$.isEmptyObject(autoFillJSON[elem].library)) {
                    var cond = autoFillJSON[elem].condition;
                    if (cond[varName]) {
                        var originDefVal = cond[varName];
                        if (originDefVal === defVal) {
                            var library = autoFillJSON[elem].library;
                            jQuery.extend(mergedLib, library);
                        }
                    }
                }
            });
        });
        // use Merged library to fill genStatements
        $.each(genStatement, function (stateKey) {
            var stateValue = genStatement[stateKey];
            var newStateValue = fillStateValue(stateValue, mergedLib);
            newStateCond.statement[stateKey] = newStateValue;
        });
    }
    return newStateCond
}

//replacing stateValue text by using library object
function fillStateValue(stateValue, library) {
    $.each(library, function (key) {
        var replaceKey = '\\$\\{' + key + "\\}";
        var replaceVal = library[key];
        var re = new RegExp(replaceKey, "g");
        stateValue = stateValue.replace(re, replaceVal);
    });
    return stateValue;
}

//Generates combinations from n arrays with m elements
function cartesianProduct(arr) {
    return arr.reduce(function (a, b) {
        return a.map(function (x) {
            return b.map(function (y) {
                return x.concat(y);
            })
        }).reduce(function (a, b) { return a.concat(b) }, [])
    }, [[]])
}


//find each generic condition in other cond&state pairs and get their default values.
function findDefVal(genConditions, autoFillJSON) {
    var genCondDefaultVal = [];
    $.each(genConditions, function (varName) {
        var defValArray = [];
        $.each(autoFillJSON, function (elem) {
            // find conditions and library that satisfy varName
            if (autoFillJSON[elem].condition && autoFillJSON[elem].condition != "" && !$.isEmptyObject(autoFillJSON[elem].condition) && autoFillJSON[elem].library && autoFillJSON[elem].library != "" && !$.isEmptyObject(autoFillJSON[elem].library)) {
                var cond = autoFillJSON[elem].condition;
                if (cond[varName]) {
                    var defaultVal = cond[varName];
                    var obj = {};
                    obj[varName] = defaultVal;
                    defValArray.push(obj);
                }
            }
        });
        genCondDefaultVal.push(defValArray);
    });
    return genCondDefaultVal
}

//reads generic conditions and create condition&statements pairs 
//eg. [genCondition:{hostname:null, genomeType:null}, library:{_species:"human"}] to [condition:{hostname:ghpcc, genomeType:human_hg19},statement:{indexPath:"/path"}] 
function decodeGenericCond(autoFillJSON) {
    if (autoFillJSON) {
        $.each(autoFillJSON, function (el) {
            // find generic conditions
            if (autoFillJSON[el].genCondition && autoFillJSON[el].genCondition != "" && !$.isEmptyObject(autoFillJSON[el].genCondition)) {
                var genConditions = autoFillJSON[el].genCondition;
                var genStatements = autoFillJSON[el].statement;
                var newCondStatements = {};
                //find each generic condition in other cond&state pairs and get their default values.
                var genCondDefaultVal = findDefVal(genConditions, autoFillJSON);
                // get combinations array of each conditions
                var combiConditions = cartesianProduct(genCondDefaultVal);
                // get new statements for each combination of conditions
                $.each(combiConditions, function (cond) {
                    newCondStatements = getNewStatements(combiConditions[cond], autoFillJSON, genStatements);
                    autoFillJSON.push(newCondStatements)
                });
            }
        });
    }
    return autoFillJSON
}

function insertInputRow(defaultVal, opt, pipeGnum, varName, type, name) {
    var dropDownQual = false;
    var paraQualifier = "val"
    var paramGivenName = varName;
    var processName = "-";
    var paraIdentifier = "-"
    var paraFileType = "-"
    var firGnum = pipeGnum;
    var secGnum = "";
    var rowType = "input";

    // "Use default" button is added if defVal attr is defined.
    if (defaultVal && defaultVal != "") {
        var defValButton = getButtonsDef('defVal', 'Use Default', defaultVal);
    } else {
        var defValButton = "";
    }
    // dropdown is added if dropdown attr is defined.
    if (type == "dropdown" && opt && opt != "") {
        var dropDownMenu = getDropdownDef('dropDown', opt, "Choose Value");
        dropDownQual = true;
    } else {
        var dropDownMenu = "";
    }
    var selectFileButton = getSelectFileButton(paraQualifier, dropDownQual, dropDownMenu, defValButton)
    var inRow = insertRowTable(rowType, firGnum, secGnum, paramGivenName, paraIdentifier, paraFileType, paraQualifier, processName, selectFileButton);
    setTimeout(function () { $('#' + rowType + 'sTable > tbody:last-child').append(inRow); }, 1);

    //check if project_pipeline_inputs exist and fill:
    var getProPipeInputs = getValues({
        p: "getProjectPipelineInputsByGnum",
        project_pipeline_id: project_pipeline_id,
        g_num: pipeGnum
    });
    if (getProPipeInputs && getProPipeInputs != "") {
        if (getProPipeInputs.length === 1) {
            var rowID = rowType + 'Ta-' + firGnum;
            var filePath = getProPipeInputs[0].name; //value for val type
            var proPipeInputID = getProPipeInputs[0].id;
            setTimeout(function () { insertSelectInput(rowID, firGnum, filePath, proPipeInputID, paraQualifier); }, 2);
        }
    }

}




//--Insert Process and Pipeline Panel (where pipelineOpt processOpt defined)
function insertProPipePanel(script, gNum, name) {
    if (script) {
        //check if parameter comment is exist: //*
        if (script.match(/\/\/\*/)) {
            //create processHeader
            var processHeader = '<div class="panel-heading collapsible collapseIconDiv" data-toggle="collapse" href="#collapse-' + gNum + '"><h4 class="panel-title">' + name + ' options <i data-toggle="tooltip" data-placement="bottom" data-original-title="Expand/Collapse"><a style="font-size:15px; padding-left:10px;" class="fa collapseIcon fa-plus-square-o"></a></i></h4></div>';
            var processBodyInt = '<div id="collapse-' + gNum + '" class="panel-collapse collapse"><div id="addProcessRow-' + gNum + '" class="panel-body">'
            //create processPanel
            $('#ProcessPanel').append('<div id="proPanelDiv-' + gNum + '" style="display:none; "><div id="proPanel-' + gNum + '" class="panel panel-default" style=" margin-bottom:3px;">' + processHeader + processBodyInt + '</div></div></div></div>')

            var displayProDiv = false;
            var lines = script.split('\n');
            for (var i = 0; i < lines.length; i++) {
                var varName = null;
                var defaultVal = null;
                var type = null;
                var desc = null;
                var tool = null;
                var opt = null;
                var varPart = lines[i].split('\/\/\*')[0];
                var regPart = lines[i].split('\/\/\*')[1];
                if (varPart && regPart) {
	  					[varName, defaultVal] = parseVarPart(varPart);
	  					[type, desc, tool, opt] = parseRegPart(regPart);
                }
                if (type && varName) {
                    // if variable start with "params." then insert into inputs table
                    if (varName.match(/params\./)) {
                        varName = varName.match(/params\.(.*)/)[1];
                        pipeGnum = pipeGnum - 1;
                        insertInputRow(defaultVal, opt, pipeGnum, varName, type, name);
                        //if variable starts with "$" then run parameters for processes are defined. Fill run parameters for each process.
                    } else {
                        displayProDiv = true;
                        addProcessPanelRow(gNum, name, varName, defaultVal, type, desc, opt, tool)
                    }
                }
            }
            if (displayProDiv === true) {
                $('[data-toggle="tooltip"]').tooltip();
                $('#proPanelDiv-' + gNum).css('display', 'inline');
                $('#ProcessPanelTitle').css('display', 'inline');

            }
        }
    }
}


function insertRowTable(rowType, firGnum, secGnum, paramGivenName, paraIdentifier, paraFileType, paraQualifier, processName, button) {
    if (paraQualifier !== "val") {
        return '<tr id=' + rowType + 'Ta-' + firGnum + '><td id="' + rowType + '-PName-' + firGnum + '" scope="row">' + paramGivenName + '</td><td>' + paraIdentifier + '</td><td>' + paraFileType + '</td><td>' + paraQualifier + '</td><td> <span id="proGName-' + secGnum + '">' + processName + '</span></td><td given_name="' + paramGivenName + '">' + button + '</td></tr>'
    } else {
        return '<tr id=' + rowType + 'Ta-' + firGnum + '><td id="' + rowType + '-PName-' + firGnum + '" scope="row">' + paramGivenName + '</td><td>' + paraIdentifier + '</td><td>' + "-" + '</td><td>' + paraQualifier + '</td><td> <span id="proGName-' + secGnum + '">' + processName + '</span></td><td given_name="' + paramGivenName + '">' + button + '</td></tr>'
    }
}

function insertProRowTable(process_id, gNum, procName, procQueDef, procMemDef, procCpuDef, procTimeDef, procOptDef) {
    return '<tr procProId="' + process_id + '" id="procGnum-' + gNum + '"><td><input name="check" id="check-' + gNum + '" type="checkbox" </td><td>' + procName + '</td><td><input name="queue" class="form-control" type="text" value="' + procQueDef + '"></input></td><td><input class="form-control" type="text" name="memory" value="' + procMemDef + '"></input></td><td><input name="cpu" class="form-control" type="text" value="' + procCpuDef + '"></input></td><td><input name="time" class="form-control" type="text" value="' + procTimeDef + '"></input></td><td><input name="opt" class="form-control" type="text" value="' + procOptDef + '"></input></td></tr>'
}

//--Pipeline details table --
function addProPipeTab(process_id, gNum, procName) {
    var procQueDef = 'short';
    var procMemDef = '10'
    var procCpuDef = '1';
    var procTimeDef = '100';
    var procOptDef = '';
    var proRow = insertProRowTable(process_id, gNum, procName, procQueDef, procMemDef, procCpuDef, procTimeDef, procOptDef);
    $('#processTable > tbody:last-child').append(proRow);
}

function findType(id) {
    var parameter = [];
    var parameter = parametersData.filter(function (el) { return el.id == id });
    if (parameter && parameter != '') {
        return parameter[0].file_type
    } else {
        return '';
    }
}

function calculatePos(len, k, poz, type) {
    degree = (180 / (len + 1)) * (k + 1)

    inp = (270 - (180 / (len + 1)) * (k + 1)) * Math.PI / 180
    out = (270 - (-180 / (len + 1)) * (k + 1)) * Math.PI / 180

    if (type == "inputs") {
        if (poz == "cx") {
            calc = Math.cos(inp)
            result = (calc * r)
        } else {
            calc = Math.sin(inp)
            result = (calc * r)
        }
    } else {
        if (poz == "cx") {
            calc = Math.cos(out)
            result = (calc * r)
        } else {
            calc = Math.sin(out)
            result = (calc * r)
        }
    }
    return result;
}

function mouseOverG() {
    d3.select("#container").on("mousedown", null)
    if (!binding) {
        d3.select("#del-" + this.id.split("-")[1]).style("opacity", 1)
        d3.select("#info-" + this.id.split("-")[1]).style("opacity", 1)
    }
}

function mouseOutG() {
    d3.select("#container").on("mousedown", cancel)
    d3.select("#del-" + this.id.split("-")[1]).style("opacity", 0.2)
    d3.select("#info-" + this.id.split("-")[1]).style("opacity", 0.2)

}

var drag = d3.behavior.drag()
    .origin(function (d) {
        return d;
    })
    .on("dragstart", dragstarted)
    .on("drag", dragged)
    .on("dragend", dragended);

function dragstarted(d) {

    selectedg = document.getElementById(this.id).parentElement
    coor = d3.mouse(this)
    diffx = 0 - coor[0]
    diffy = 0 - coor[1]
    d3.event.sourceEvent.stopPropagation();
    d3.select(document.getElementById(this.id).parentElement).classed("dragging", true);
}

function dragged(d) {
    if (!binding) {
        coor = d3.mouse(this)
        t = d3.transform(d3.select('#' + document.getElementById(this.id).parentElement.id).attr("transform")),
            x = t.translate[0]
        y = t.translate[1]
        d3.select(selectedg).attr("transform", "translate(" + (x + coor[0] + diffx) + "," + (y + coor[1] + diffy) + ")")
        moveLine(selectedg.id, x, y, coor)
    }
}

function dragended(d) {
    d3.select(selectedg).classed("dragging", false);
}

function moveLine(gId, x, y, coor) {
    allLines = d3.selectAll("line")[0]
    for (var line = 0; line < allLines.length; line++) {
        from = allLines[line].getAttribute("g_from")
        to = allLines[line].getAttribute("g_to")

        if (from == gId) {
            lineid = allLines[line].id
            IOid = lineid.split("_")[0]
            IOx = d3.select("#" + IOid)[0][0].cx.baseVal.value
            IOy = d3.select("#" + IOid)[0][0].cy.baseVal.value
            d3.select("#" + lineid).attr("x1", coor[0] + diffx + IOx + x).attr("y1", coor[1] + diffy + IOy + y)
            moveDelCircle(lineid)
        } else if (to == gId) {
            lineid = allLines[line].id
            IOid = lineid.split("_")[1]
            IOx = d3.select("#" + IOid)[0][0].cx.baseVal.value
            IOy = d3.select("#" + IOid)[0][0].cy.baseVal.value
            d3.select("#" + lineid).attr("x2", coor[0] + diffx + IOx + x).attr("y2", coor[1] + diffy + IOy + y)
            moveDelCircle(lineid)
        }
    }
}

function moveDelCircle(lineid) {
    x1 = d3.select("#" + lineid)[0][0].x1.baseVal.value
    x2 = d3.select("#" + lineid)[0][0].x2.baseVal.value
    y1 = d3.select("#" + lineid)[0][0].y1.baseVal.value
    y2 = d3.select("#" + lineid)[0][0].y2.baseVal.value
    d3.select("#c--" + lineid).attr("cx", (x1 + x2) / 2).attr("cy", (y1 + y2) / 2)
    d3.select("#c--" + lineid).attr("transform", "translate(" + ((x1 + x2) / 2) + "," + ((y1 + y2) / 2) + ")")
}

function scMouseOver() {
    parent = document.getElementById(this.id).parentElement.id;
    if (this.id.split("-")[0] === "text") { //text üzerine gelince
        cid = "sc-" + this.id.split("-")[1]
    } else {
        cid = this.id
    }
    d3.select("#" + cid).attr("fill", "gray")
    if (!binding) {
        d3.selectAll("line").attr("status", "hide")
        d3.selectAll("line[g_from =" + parent + "]").attr("status", "standard")
        d3.selectAll("line[g_to =" + parent + "]").attr("status", "standard")
    }
    showEdges()
}

function scMouseOut() {
    if (this.id.split("-")[0] === "text") {
        cid = "sc-" + this.id.split("-")[1]
    } else {
        cid = this.id
    }
    d3.select("#" + cid).attr("fill", "#BEBEBE")
    if (!binding) {
        d3.selectAll("line").attr("status", "standard")
    }
    showEdges()
}

function remove(delID) {
    if (delID !== undefined) {
        deleteID = delID;
    }
    if (!binding) {
        g = document.getElementById(deleteID).parentElement.id //g-5

        //--delete pipeline details
        var gNum = g.split('-')[1];
        var proClass = $('#' + g).attr('class') //
        var proID = $('#' + g).attr('class').split('-')[1] //
        if (proClass === 'g-inPro') { // input param is deleted
            $('#inputTa-' + gNum).remove();
        } else if (proClass === 'g-outPro') { // output param is deleted
            $('#outputTa-' + gNum).remove();
        } else { //process is deleted
            //	              removeProPipeTab(proID)
        }
        //--delete pipeline details ends

        d3.select("#" + g).remove()
        delete processList[g]
        removeLines(g)
    }
}

function removeLines(g) {

    allLines = d3.selectAll("line")[0]
    for (var line = 0; line < allLines.length; line++) {
        from = allLines[line].getAttribute("g_from")
        to = allLines[line].getAttribute("g_to")

        if (from == g || to == g) {
            lineid = allLines[line].id
            removeEdge('c--' + lineid)
        }
    }
}

function removeDelCircle(lineid) {
    d3.select("#c--" + lineid).remove()
}
var tooltip = d3.select("body")
    .append("div").attr("class", "tooltip-svg")
    .style("position", "absolute")
    .style("max-width", "400px")
    .style("max-height", "100px")
    .style("opacity", .9)
    .style("z-index", "10")
    .style("visibility", "hidden")
    .text("Something")
    .style("color", "black");


function IOmouseOver() {
    if (binding) {
        if (d3.select("#" + this.id).attr("status") == "candidate") {
            d3.select("#" + this.id).attr("status", "posCandidate")
            showOptions()
        }
    } else {
        className = document.getElementById(this.id).className.baseVal.split(" ")
        cand = searchedType(className[1])
        parentg = d3.select("#" + this.id).attr("parentG")
        givenNamePP = document.getElementById(this.id).getAttribute("name")


        //	          d3.selectAll("circle[type ='I/O']").attr("status", "noncandidate") //I/O olanları noncandia
        if (className[0] === "connect_to_input") {
            conToInput()
            tooltip.html('Connect to input')
        } else if (className[0] === "connect_to_output") {
            conToOutput()
            tooltip.html('Connect to output')
        } else if (givenNamePP === 'inputparam') {
            //d3.selectAll("." + className[0]).filter("." + cand).attr("status", "candidate")
            var paraID = document.getElementById(this.id).id.split("-")[3];
            var paraFileType = "";
            var paraData = parametersData.filter(function (el) { return el.id == paraID });
            if (paraData && paraData != '') {
                var paraFileType = paraData[0].file_type
            }
            tooltip.html('Input parameter<br/>File Type: <em>' + paraFileType + '</em>')
        } else if (givenNamePP === 'outputparam') {
            //Since outputparam is connected, it is not allowed to connect more parameters
            //d3.selectAll("." + className[0]).filter("." + cand).attr("status", "candidate")
            var paraID = document.getElementById(this.id).id.split("-")[3]
            var paraData = parametersData.filter(function (el) { return el.id == paraID })
            var paraFileType = "";
            if (paraData & paraData !== "") {
                paraFileType = paraData[0].file_type
            }
            tooltip.html('Output parameter<br/>File Type: <em>' + paraFileType + '</em>')
        } else {
            //d3.selectAll("." + className[0]).filter("." + cand).attr("status", "candidate")
            var givenNamePP = document.getElementById(this.id).getAttribute("name")
            var paraID = document.getElementById(this.id).id.split("-")[3]
            var paraData = parametersData.filter(function (el) { return el.id == paraID })
            var paraFileType = "";
            var paraQualifier = "";
            var paraName = "";
            if (paraData && paraData !== '') {
                paraFileType = paraData[0].file_type;
                paraQualifier = paraData[0].qualifier;
                paraName = paraData[0].name;
            }

            if (paraQualifier !== 'val') {
                tooltip.html('Identifier: <em>' + paraName + '</em><br/>Name: <em>' + givenNamePP + '</em><br/>File Type: <em>' + paraFileType + '</em><br/>Qualifier: <em>' + paraQualifier + '</em>')
            } else {
                tooltip.html('Identifier: <em>' + paraName + '</em><br/>Name: <em>' + givenNamePP + '</em><br/>Qualifier: <em>' + paraQualifier + '</em>')
            }
        }
        //	          d3.selectAll("circle[parentG =" + parentg + "]").attr("status", "noncandidate")
        d3.selectAll("#" + this.id).attr("status", "mouseon")
        tooltip.style("visibility", "visible");


        d3.selectAll("line").attr("status", "hide")
        d3.selectAll("line[IO_from =" + this.id + "]").attr("status", "standard")
        d3.selectAll("line[IO_to =" + this.id + "]").attr("status", "standard")

        showOptions()
        showEdges()
    }
}

function IOmouseMove() {
    tooltip.style("top", (event.pageY - 10) + "px").style("left", (event.pageX + 10) + "px");
}

function IOmouseOut() {
    if (binding) {
        if (d3.select("#" + this.id).attr("status") == "posCandidate") {
            d3.select("#" + this.id).attr("status", "candidate")
            showOptions()
        }

    } else {
        d3.selectAll("circle[type ='I/O']").attr("status", "standard")
        d3.selectAll("line").attr("status", "standard")
        showOptions()
        showEdges()
    }
    tooltip.style("visibility", "hidden");

}

function IOconnect() {
    selectedIO = this.id //first click
    className = document.getElementById(selectedIO).className.baseVal.split(" ")
    cand = searchedType(className[1])
    var givenNamePP = document.getElementById(this.id).getAttribute("name")
    if (givenNamePP === 'outputparam' && className[0] !== 'connect_to_output') {
        //If output parameter already connected , do nothing
    } else {
        if (binding) {
            stopBinding(className, cand, selectedIO)
        } else {
            startBinding(className, cand, selectedIO)
        }

    }



}

function conToInput() {
    d3.selectAll("circle").filter("." + cand).attr("status", "candidate") //select all available inputs for inputparam circles
}

function conToOutput() {
    d3.selectAll("circle").filter("." + cand).attr("status", "candidate") //select all available outputs for outputparam circles
}

function startBinding(clasNames, cand, selectedIO) {
    parentg = d3.select("#" + selectedIO).attr("parentG")

    d3.selectAll("circle[type ='I/O']").attr("status", "noncandidate")

    if (className[0] === "connect_to_input") {
        conToInput()
    } else if (className[0] === "connect_to_output") {
        conToOutput()
    } else {
        d3.selectAll("." + className[0]).filter("." + cand).attr("status", "candidate")
    }

    d3.selectAll("circle[parentG =" + parentg + "]").attr("status", "noncandidate")
    d3.selectAll("#" + selectedIO).attr("status", "selected")
    d3.selectAll("line").attr("status", "hide")
    d3.select("#del-" + selectedIO.split("-")[4]).style("opacity", 0.2)

    for (var edge = 0; edge < edges.length; edge++) {
        if (edges[edge].indexOf(selectedIO) > -1) {
            d3.select("#" + findEdges(edges[edge], selectedIO)).attr("status", "noncandidate")
        }
    }
    addCandidates2Dict()
    binding = true
    showOptions()
    showEdges()
}

//second click selectedIO
function stopBinding() {
    firstid = d3.select("circle[status ='selected']")[0][0].id
    d3.selectAll("line").attr("status", "standard")
    if (selectedIO === firstid) {
        firstid = d3.select("#" + firstid).attr("status", "mouseon")
        d3.selectAll("." + className[0]).filter("." + cand).attr("status", "candidate")
        d3.select("#del-" + selectedIO.split("-")[4]).style("opacity", 1)
    } else {
        secondid = d3.select("circle[status ='posCandidate']")[0][0].id
        createEdges(firstid, secondid)

        d3.selectAll("circle[type ='I/O']").attr("status", "standard")
        d3.select("#del-" + secondid.split("-")[4]).style("opacity", 1)
    }
    binding = false
    showOptions()
    showEdges()
}

function showOptions() {
    d3.selectAll("circle[status ='standard']").attr("r", ior).style("stroke", "").style("stroke-width", "").style("stroke-opacity", "")
    d3.selectAll("circle[status ='mouseon']").attr("r", ior * 1.4).style("stroke", "#ff9999").style("stroke-width", 4).style("stroke-opacity", .5)
    d3.selectAll("circle[status ='selected']").attr("r", ior * 1.4).style("stroke", "#ff0000").style("stroke-width", 4).style("stroke-opacity", .5)
    d3.selectAll("circle[status ='noncandidate']").attr("r", ior * 0.5).style("stroke", "")
    d3.selectAll("circle[status ='candidate']").attr("r", ior * 1.4).style("stroke", "#ccff66").style("stroke-width", 4).style("stroke-opacity", .5)
    d3.selectAll("circle[status ='posCandidate']").attr("r", ior * 1.4).style("stroke", "#ff9999").style("stroke-width", 4).style("stroke-opacity", .5)
}
var link = d3.svg.diagonal()
    .projection(function (d) {
        return [d.y, d.x];
    });

function showEdges() {
    d3.selectAll("line[status = 'standard']").style("stroke", "#B0B0B0").style("stroke-width", 4).attr("opacity", 1);
    d3.selectAll("line[status = 'hide']").style("stroke-width", 2).attr("opacity", 0.3)
}

function searchedType(type) {
    if (type == "input") {
        return "output"
    } else {
        return "input"
    }
}

function findEdges(edge, selectedIO) {
    edgeNodes = edge.split("_")
    if (edgeNodes[0] == selectedIO) {
        return edgeNodes[1]
    } else {
        return edgeNodes[0]
    }
}

function addCandidates2Dict() {
    candidates = []
    candList = d3.selectAll(("circle[status ='candidate']"))[0]
    sel = d3.selectAll(("circle[status ='selected']"))[0][0]
    candList.push(sel)

    for (var c = 0; c < candList.length; c++) {
        currid = candList[c].id
        gid = document.getElementById(currid).parentElement.id;

        t = d3.transform(d3.select('#' + gid).attr("transform")),
            x = t.translate[0]
        y = t.translate[1]

        circx = candList[c].cx.baseVal.value + x
        circy = candList[c].cy.baseVal.value + y

        posList = [circx, circy, gid]

        candidates[currid] = posList
    }
}

function replaceNextVar(outName, inputName) {
    //search inputName as name attribute of svg elements of
    var connectedNodeId = $("circle.input[name*='" + inputName + "']").attr('id');
    //find the connected node to get gNum
    if (connectedNodeId !== "") {
        for (var e = 0; e < edges.length; e++) {
            if (edges[e].indexOf(connectedNodeId) !== -1) { //if not exist: -1
                var nodes = edges[e].split("_")
                var fNode = nodes[0]
                var gNumInputParam = fNode.split("-")[4]
                //get the given name from outputs table
                if (gNumInputParam !== '') {
                    var givenNameInParam = $('#input-PName-' + gNumInputParam).text();
                    var pattern = /(.*)\$\{(.*)\}(.*)/;
                    if (givenNameInParam !== '') {
                        outName = outName.replace(pattern, '$1' + givenNameInParam + '$3');
                    }
                    break;
                }
            }
        }
    }
    return outName;

}

function updateSecClassName(second, inputParamLocF) {
    if (inputParamLocF === 0) {
        var candi = "output"
    } else {
        var candi = "input"
    }
    secClassName = document.getElementById(second).className.baseVal.split("-")[0].split(" ")[0] + " " + candi
    return secClassName
}

function getSelectFileButton(paraQualifier, dropDownQual, dropDownMenu, defValButton) {
    var buttons = ""
    if (!dropDownQual) {
        if (paraQualifier === 'file') {
            var buttons = getButtonsModal('inputFile', 'Select File') + defValButton;
        } else if (paraQualifier === 'val') {
            var buttons = getButtonsModal('inputVal', 'Enter Value') + defValButton;
        } else {
            var buttons = getButtonsModal('inputFile', 'Select Set') + defValButton;
        }
    } else {
        var buttons = dropDownMenu + defValButton;
    }
    return buttons
}

function createEdges(first, second) {
    d3.selectAll("#" + first).attr("connect", 'mate')
    d3.selectAll("#" + second).attr("connect", 'mate')
    inputParamLocF = first.indexOf("o-inPro") //-1: inputparam not exist //0: first click is done on the inputparam
    inputParamLocS = second.indexOf("o-inPro")
    outputParamLocF = first.indexOf("i-outPro") //-1: outputparam not exist //0: first click is done on the inputparam
    outputParamLocS = second.indexOf("i-outPro")


    if (inputParamLocS === 0 || outputParamLocS === 0) { //second click is done on the circle of inputparam//outputparam
        //swap elements and treat as fırst click was done on
        tem = second
        second = first
        first = tem
        inputParamLocF = 0
        outputParamLocF = 0
    }
    //first click is done on the circle of inputparam
    if (inputParamLocF === 0 || outputParamLocF === 0) {
        //update the class of inputparam based on selected second circle
        secClassName = updateSecClassName(second, inputParamLocF)
        d3.selectAll("#" + first).attr("class", secClassName)
        //update the parameter of the inputparam based on selected second circle
        var firGnum = document.getElementById(first).id.split("-")[4] //first g-number
        var secGnum = document.getElementById(second).id.split("-")[4] //first g-number
        secPI = document.getElementById(second).id.split("-")[3] //second parameter id
        var secProI = document.getElementById(second).id.split("-")[1] //second process id
        patt = /(.*)-(.*)-(.*)-(.*)-(.*)/
        secID = first.replace(patt, '$1-$2-$3-' + secPI + '-$5')

        d3.selectAll("#" + first).attr("id", secID)
        fClickOrigin = first
        fClick = secID
        sClick = second
        var rowType = '';
        //Pipeline details table
        if (inputParamLocF === 0) {
            rowType = 'input';
        } else if (outputParamLocF === 0) {
            rowType = 'output';
        }
        var paramGivenName = document.getElementById('text-' + firGnum).getAttribute("name");
        var paraData = parametersData.filter(function (el) { return el.id == secPI });
        var paraFileType = "";
        var paraQualifier = "";
        var paraIdentifier = "";
        var dropDownQual = false;
        var paramDefVal = $('#text-' + firGnum).attr("defVal");
        var paramDropDown = $('#text-' + firGnum).attr("dropDown");

        if (paraData && paraData != '') {
            var paraFileType = paraData[0].file_type;
            var paraQualifier = paraData[0].qualifier;
            var paraIdentifier = paraData[0].name;
        }
        // "Use default" button is added if defVal attr is defined.
        if (paramDefVal) {
            var defValButton = getButtonsDef('defVal', 'Use Default', paramDefVal);
        } else {
            var defValButton = "";
        }
        // dropdown is added if dropdown attr is defined.
        if (paramDropDown && paramDropDown != "") {
            var paramDropDownArray = paramDropDown.split(",");
            if (paramDropDownArray) {
                var dropDownMenu = getDropdownDef('dropDown', paramDropDownArray, "Choose Value");
                dropDownQual = true;
            }
        } else {
            var dropDownMenu = "";
        }
        var processName = $('#text-' + secGnum).attr('name');
        var rowExist = ''
        rowExist = document.getElementById(rowType + 'Ta-' + firGnum);
        if (rowExist) {
            var preProcess = '';
            $('#' + rowType + 'Ta-' + firGnum + '> :nth-child(5)').append('<span id=proGcomma-' + secGnum + '>, </span>');
            $('#' + rowType + 'Ta-' + firGnum + '> :nth-child(5)').append('<span id=proGName-' + secGnum + '>' + processName + '</span>');
        } else {
            //inputsTable
            if (rowType === 'input') {
                var selectFileButton = getSelectFileButton(paraQualifier, dropDownQual, dropDownMenu, defValButton)
                var inRow = insertRowTable(rowType, firGnum, secGnum, paramGivenName, paraIdentifier, paraFileType, paraQualifier, processName, selectFileButton);
                $('#' + rowType + 'sTable > tbody:last-child').append(inRow);
                //get project_pipeline_inputs:
                var getProPipeInputs = getValues({
                    p: "getProjectPipelineInputsByGnum",
                    project_pipeline_id: project_pipeline_id,
                    g_num: firGnum
                });

                if (getProPipeInputs && getProPipeInputs != "") {
                    if (getProPipeInputs.length === 1) {
                        var rowID = rowType + 'Ta-' + firGnum;
                        var filePath = getProPipeInputs[0].name; //value for val type
                        var proPipeInputID = getProPipeInputs[0].id;
                        insertSelectInput(rowID, firGnum, filePath, proPipeInputID, paraQualifier);
                    }
                }
            }
            //outputsTable
            else if (rowType === 'output') {
                var outName = document.getElementById(second).getAttribute("name");
                if (outName.match(/file\((.*)\)/)) {
                    outName = outName.match(/file\((.*)\)/i)[1];
                    // if path is divided by slash replace first ${(.*)} with original variable
                    var patt = /\$\{(.*)\}/;
                    if (outName.match(/\//) && outName.match(patt)) {
                        //find input name equavalant and replace
                        var inputName = outName.match(patt)[1];
                        outName = replaceNextVar(outName, inputName);
                    }
                }
                outName = outName.replace(/\"/g, '');
                outName = outName.replace(/\'/g, '');
                outName = outName.replace(/\?/g, '')
                outName = outName.replace(/\${(.*)}/g, '*');
                outName = paramGivenName + "/" + outName;
                var outNameEl = '<span fName="' + outName + '">NA' + '</span>';
                var inRow = insertRowTable(rowType, firGnum, secGnum, paramGivenName, paraIdentifier, paraFileType, paraQualifier, processName, outNameEl);
                $('#' + rowType + 'sTable > tbody:last-child').append(inRow);
            }
        }

    } else { //process to process connection
        fClickOrigin = first
        fClick = first
        sClick = second
    }

    d3.select("#mainG").append("line")
        .attr("id", fClick + "_" + sClick)
        .attr("class", "line")
        .attr("type", "standard")
        .style("stroke", "#B0B0B0").style("stroke-width", 4)
        .attr("x1", candidates[fClickOrigin][0])
        .attr("y1", candidates[fClickOrigin][1])
        .attr("x2", candidates[sClick][0])
        .attr("y2", candidates[sClick][1])
        .attr("g_from", candidates[fClickOrigin][2])
        .attr("g_to", candidates[sClick][2])
        .attr("IO_from", fClick)
        .attr("IO_to", sClick)
        .attr("stroke-width", 2)
        .attr("stroke", "black")

    edges.push(fClick + "_" + sClick)

}

function removeEdge(delID) {
    if (delID !== undefined) {
        deleteID = delID;
    }

    d3.select("#" + deleteID).remove() //eg. c--o-inPro-1-9-0_i-10-0-9-1
    d3.select("#" + deleteID.split("--")[1]).remove()
    edges.splice(edges.indexOf(deleteID.split("--")[1]), 1);
    var firstParamId = deleteID.split("--")[1].split("_")[0];
    var secondParamId = deleteID.split("--")[1].split("_")[1];
    var paramType = firstParamId.split("-")[1] //inPro or outPro
    var delsecGnum = secondParamId.split("-")[4] //gNum
    var delGnum = firstParamId.split("-")[4] //gNum

    //input/output param has still edge/edges
    //remove process name from pipeline details table
    if (edges.searchFor(firstParamId)) {
        if (paramType === 'inPro') {
            //$('#inputTa-' + delGnum + '> :last-child').append('<span id=proGName-' + secGnum + '>' + processName + '</span>');
            $('#inputTa-' + delGnum + '> :last-child > ' + '#proGName-' + delsecGnum).remove();
            if ($('#inputTa-' + delGnum + '> :last-child > ' + '#proGcomma-' + delsecGnum)[0]) {
                $('#inputTa-' + delGnum + '> :last-child > ' + '#proGcomma-' + delsecGnum).remove();
            } else {
                $('#inputTa-' + delGnum + '> :last-child > :first-child').remove();
            }

        }
    }

    //input/output param has no edge any more
    if (!edges.searchFor(firstParamId)) {
        d3.selectAll("#" + firstParamId).attr("connect", 'single')
        //remove row from pipeline details table
        if (paramType === 'inPro') {
            $('#inputTa-' + delGnum).remove() //gNum
        } else if (paramType === 'outPro') {
            $('#outputTa-' + delGnum).remove() //gNum
        }
    }
    //process has no edge any more
    if (!edges.searchFor(secondParamId)) {
        d3.selectAll("#" + secondParamId).attr("connect", 'single')
    }
}

function delMouseOver() {
    d3.select("#del" + this.id).attr('fill-opacity', 0.8)
    d3.select("#del--" + this.id.split("--")[1]).style("opacity", 0.8)
}

function delMouseOut() {
    d3.select("#del" + this.id).attr('fill-opacity', 0.4)
    d3.select("#del--" + this.id.split("--")[1]).style("opacity", 0.4)
}

function cancel() {
    if (binding) {
        d3.selectAll("circle[type ='I/O']").attr("status", "standard")
        binding = false
        showOptions()
    }
}

function rename() {
    renameTextID = this.id;
    renameText = d3.select("#" + this.id).attr('name');
    body = document.body;
    bodyW = body.offsetWidth;
    bodyH = body.scrollHeight;
    $('#renameModal').modal("show");
}

function changeName() {
    newName = document.getElementById("mRenName").value
    d3.select("#" + renameTextID).attr('name', newName)
    newNameShow = truncateName(newName, d3.select("#" + renameTextID).attr('class'));
    d3.select("#" + renameTextID).text(newNameShow)

    //update pipeline details table
    proType = $('#' + renameTextID).parent().attr('class').split('-')[1];
    var gNumP = renameTextID.split('-')[1];
    $('span[id="proGName-' + gNumP + '\"]').text(newName);
    if (proType === 'inPro') {
        $('#input-PName-' + renameTextID.split('-')[1]).text(newName); //id=input-PName-0
    } else if (proType === 'outPro') {
        $('#output-PName-' + renameTextID.split('-')[1]).text(newName); //id=output-PName-0
    }
    processList[document.getElementById(renameTextID).parentElement.id] = newName
    document.getElementById(renameTextID).parentElement.id
}


function getInfo() {
    className = document.getElementById(this.id).className.baseVal.split("-");
    gNumInfo = this.id.split("-")[1];
    infoID = className[1];
    $('#addProcessModal').modal("show");
}

function removeElement(delID) {
    if (delID !== undefined) {
        deleteID = delID;
    } else {
        deleteID = this.id;
    }
    body = document.body
    bodyW = body.offsetWidth
    bodyH = body.offsetHeight

    if (!binding) {
        $('#confirmD3Modal').modal("show");
    }
}



function download(text) {
    var filename = $('#pipeline-title').val() + '.nf';
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function loadPipeline(sDataX, sDataY, sDatapId, sDataName, processModules, gN) {
    t = d3.transform(d3.select('#' + "mainG").attr("transform")),
        x = t.translate[0]
    y = t.translate[1]
    z = t.scale[0]

    gNum = parseInt(gN)
    var name = sDataName
    var id = sDatapId
    var process_id = id
    var defVal = null;
    var dropDown = null;
    if (processModules != null && processModules != {} && processModules != "") {
        if (processModules.defVal) {
            defVal = processModules.defVal;
        }
        if (processModules.dropDown) {
            dropDown = processModules.dropDown;
        }
    }

    //for input parameters
    if (id === "inPro") {
        ipR = 70 / 2
        ipIor = ipR / 3
        var kind = "input"

        //(A)if edges are not formed parameter_id data comes from default: process_parameter table "name" column
        var paramId = "inPara" //default
        var classtoparam = "connect_to_input output"
        var pName = "inputparam"
        var init = "o"
        var pColor = "orange"
        //(B)if edges are formed parameter_id data comes from biocorepipesave table "edges" column
        edgeIn = sData[0].edges
        edgeInP = JSON.parse(edgeIn.replace(/'/gi, "\""))["edges"] //i-10-0-9-1_o-inPro-1-9-0

        for (var ee = 0; ee < edgeInP.length; ee++) {
            patt = /(.*)-(.*)-(.*)-(.*)-(.*)_(.*)-(.*)-(.*)-(.*)-(.*)/
            edgeFirstPId = edgeInP[ee].replace(patt, '$2')
            edgeFirstGnum = edgeInP[ee].replace(patt, '$5')
            edgeSecondParID = edgeInP[ee].replace(patt, '$9')

            if (edgeFirstGnum === String(gNum) && edgeFirstPId === "inPro") {
                paramId = edgeSecondParID //if edge is found
                classtoparam = findType(paramId) + " output"
                pName = parametersData.filter(function (el) { return el.id == paramId })[0].name
                break
            }
        }

        drawParam(name, process_id, id, kind, sDataX, sDataY, paramId, pName, classtoparam, init, pColor, defVal, dropDown)
        processList[("g-" + gNum)] = name
        gNum = gNum + 1


    } else if (id === "outPro") {
        ipR = 70 / 2
        ipIor = ipR / 3
        var kind = "output"

        //(A)if edges are not formed parameter_id data comes from default: process_parameter table "name" column
        var paramId = "outPara" //default
        var classtoparam = "connect_to_output input"
        var pName = "outputparam"
        var init = "i"
        var pColor = "green"
        //(B)if edges are formed parameter_id data comes from biocorepipesave table "edges" column
        edgeOut = sData[0].edges
        edgeOutP = JSON.parse(edgeOut.replace(/'/gi, "\""))["edges"] //i-10-0-9-1_o-inPro-1-9-0

        for (var ee = 0; ee < edgeOutP.length; ee++) {
            patt = /(.*)-(.*)-(.*)-(.*)-(.*)_(.*)-(.*)-(.*)-(.*)-(.*)/
            edgeFirstPId = edgeOutP[ee].replace(patt, '$2')
            edgeFirstGnum = edgeOutP[ee].replace(patt, '$5')
            edgeSecondParID = edgeOutP[ee].replace(patt, '$9')

            if (edgeFirstGnum === String(gNum) && edgeFirstPId === "outPro") {
                paramId = edgeSecondParID //if edge is found
                classtoparam = findType(paramId) + " input"
                pName = parametersData.filter(function (el) {
                    return el.id == paramId
                })[0].name
                break
            }
        }
        drawParam(name, process_id, id, kind, sDataX, sDataY, paramId, pName, classtoparam, init, pColor, defVal, dropDown)
        processList[("g-" + gNum)] = name
        gNum = gNum + 1

    } else {
        //--Pipeline details table ---
        addProPipeTab(id, gNum, name);
        //--ProcessPanel (where process options defined)
        var processData = getValues({ p: "getProcessData", "process_id": process_id });
        if (processData) {
            if (processData[0].script_header !== "" && processData[0].script_header !== null) {
                var pro_script_header = decodeHtml(processData[0].script_header);
                insertProPipePanel(pro_script_header, gNum, name);
                //generate json for autofill by using script of process header
                var pro_autoFillJSON = parseAutofill(pro_script_header);
                // bind event handlers for autofill
                setTimeout(function () {
                    if (pro_autoFillJSON !== null && pro_autoFillJSON !== undefined) {
                        $.each(pro_autoFillJSON, function (el) {
                            var stateObj = pro_autoFillJSON[el].statement;
                            $.each(stateObj, function (old_key) {
                                var new_key = old_key + "@" + id;
                                //add process id to each statement after @ sign (eg.$CPU@52) -> will effect only process specific execution parameters.
                                if (old_key !== new_key) {
                                    Object.defineProperty(stateObj, new_key,
                                        Object.getOwnPropertyDescriptor(stateObj, old_key));
                                    delete stateObj[old_key];
                                }
                            });
                        });
                        bindEveHandler(pro_autoFillJSON);
                    }
                }, 1000);

            }
        }

        inputs = getValues({
            p: "getInputsPP",
            "process_id": id
        })

        outputs = getValues({
            p: "getOutputsPP",
            "process_id": id
        })

        //gnum uniqe, id same id (Written in class) in same type process
        g = d3.select("#mainG").append("g")
            .attr("id", "g-" + gNum)
            .attr("class", "g-" + id)
            .attr("transform", "translate(" + (sDataX) + "," + (sDataY) + ")")

        //gnum(written in id): uniqe, id(Written in class): same id in same type process, bc(written in type): same at all bc
        g.append("circle").attr("id", "bc-" + gNum)
            .attr("class", "bc-" + id)
            .attr("type", "bc")
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", r + ior)
            .attr('fill-opacity', 0.6)
            .attr("fill", "red")
            .transition()
            .delay(500)
            .duration(3000)
            .attr("fill", "#E0E0E0")
        //gnum(written in id): uniqe, id(Written in class): same id in same type process, sc(written in type): same at all bc
        g.append("circle")
            .datum([{
                cx: 0,
                cy: 0
			        }])
            .attr("id", "sc-" + gNum)
            .attr("class", "sc-" + id)
            .attr("type", "sc")
            .attr("r", r - ior)
            .attr("fill", "#BEBEBE")
            .attr('fill-opacity', 0.6)

        //gnum(written in id): uniqe,
        g.append("text").attr("id", "text-" + gNum)
            .datum([{
                cx: 0,
                cy: 0
			        }])
            .attr('font-family', "FontAwesome, sans-serif")
            .attr('font-size', '1em')
            .attr('name', name)
            .attr('class', 'process')
            .text(truncateName(name, 'process'))
            .style("text-anchor", "middle")

        // I/O id naming:[0]i = input,o = output -[1]process database ID -[2]The number of I/O of the selected process -[3]Parameter database ID- [4]uniqe number
        for (var k = 0; k < inputs.length; k++) {
            d3.select("#g-" + gNum).append("circle")
                .attr("id", "i-" + (id) + "-" + k + "-" + inputs[k].parameter_id + "-" + gNum)
                .attr("type", "I/O")
                .attr("kind", "input")
                .attr("parentG", "g-" + gNum)
                .attr("name", inputs[k].sname)
                .attr("operator", inputs[k].operator)
                .attr("closure", inputs[k].closure)
                .attr("connect", "single")
                .attr("status", "standard")
                .attr("class", findType(inputs[k].parameter_id) + " input")
                .attr("cx", calculatePos(inputs.length, k, "cx", "inputs"))
                .attr("cy", calculatePos(inputs.length, k, "cy", "inputs"))
                .attr("r", ior)
                .attr("fill", "tomato")
                .attr('fill-opacity', 0.8)
                .on("mouseover", IOmouseOver)
                .on("mousemove", IOmouseMove)
                .on("mouseout", IOmouseOut)
            //	                  .on("mousedown", IOconnect)
        }

        for (var k = 0; k < outputs.length; k++) {
            d3.select("#g-" + gNum).append("circle")
                .attr("id", "o-" + (id) + "-" + k + "-" + outputs[k].parameter_id + "-" + gNum)
                .attr("type", "I/O")
                .attr("kind", "output")
                .attr("parentG", "g-" + gNum)
                .attr("name", outputs[k].sname)
                .attr("operator", outputs[k].operator)
                .attr("closure", outputs[k].closure)
                .attr("status", "standard")
                .attr("connect", "single")
                .attr("class", findType(outputs[k].parameter_id) + " output")
                .attr("cx", calculatePos(outputs.length, k, "cx", "outputs"))
                .attr("cy", calculatePos(outputs.length, k, "cy", "outputs"))
                .attr("r", ior).attr("fill", "steelblue")
                .attr('fill-opacity', 0.8)
                .on("mouseover", IOmouseOver)
                .on("mousemove", IOmouseMove)
                .on("mouseout", IOmouseOut)
            //	                  .on("mousedown", IOconnect)
        }
        processList[("g-" + gNum)] = name
        gNum = gNum + 1


    }
}

function addCandidates2DictForLoad(fir) {
    candidates = []
    candList = d3.selectAll(("circle[type ='I/O']"))[0]
    sel = d3.select(("#" + fir))[0][0]
    candList.push(sel)
    for (var c = 0; c < candList.length; c++) {
        currid = candList[c].id
        gid = document.getElementById(currid).parentElement.id;

        t = d3.transform(d3.select('#' + gid).attr("transform")),
            x = t.translate[0]
        y = t.translate[1]

        circx = candList[c].cx.baseVal.value + x
        circy = candList[c].cy.baseVal.value + y

        posList = [circx, circy, gid]
        candidates[currid] = posList
    }
}

function saveReady() {
    document.getElementById("savePipeline").disabled = false;
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
            $('#pipeline-title').text(s[0].name);
            $('#pipeline-title').attr('href', 'index.php?np=1&id=' + pipeline_id);
            $('#project-title').attr('href', 'index.php?np=2&id=' + project_id);
            $('#pipelineSum').val(decodeHtml(s[0].summary));
            if (s[0].script_pipe_header !== null) {
                pipeGnum = 0;
                insertProPipePanel(decodeHtml(s[0].script_pipe_header), "pipe", "Pipeline");
                //generate json for autofill by using script of pipeline header
                autoFillJSON = parseAutofill(decodeHtml(s[0].script_pipe_header));
                autoFillJSON = decodeGenericCond(autoFillJSON);
            }
            openPipeline(pipeline_id);
            // activate collapse icon for process options
            refreshCollapseIconDiv()
            $('#pipelineSum').attr('disabled', "disabled");

        },
        error: function (errorThrown) {
            alert("Error: " + errorThrown);
        }
    });
};

function updateCheckBox(check_id, status) {
    if ((check_id === '#exec_all' || check_id === '#exec_each' || check_id === '#singu_check' || check_id === '#docker_check' || check_id === '#publish_dir_check') && status === "true") {
        if ($(check_id).is(":checked") === false) {
            $(check_id).trigger("click");
            $(check_id).prop('checked', true);
        }
    }
    if (status === "true") {
        $(check_id).attr('checked', true);
    } else if (status === "false") {
        $(check_id).removeAttr('checked');
    }
}

function refreshCreatorData(project_pipeline_id) {
    pipeData = getValues({ p: "getProjectPipelines", id: project_pipeline_id });
    if (pipeData && pipeData != "") {
        $('#creatorInfoPip').css('display', "block");
        $('#ownUserNamePip').text(pipeData[0].username);
        $('#datecreatedPip').text(pipeData[0].date_created);
        $('.lasteditedPip').text(pipeData[0].date_modified);
    }
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function loadProjectPipeline(pipeData) {
    loadRunOptions();
    $('#creatorInfoPip').css('display', "block");
    $('#project-title').text(pipeData[0].project_name);
    $('#run-title').changeVal(pipeData[0].pp_name);
    $('#runSum').val(decodeHtml(pipeData[0].summary));
    $('#rOut_dir').val(pipeData[0].output_dir);
    $('#publish_dir').val(pipeData[0].publish_dir);
    $('#chooseEnv').val(pipeData[0].profile);
    $('#perms').val(pipeData[0].perms);
    $('#runCmd').val(pipeData[0].cmd);
    $('#docker_img').val(pipeData[0].docker_img);
    $('#docker_opt').val(pipeData[0].docker_opt);
    $('#singu_img').val(pipeData[0].singu_img);
    $('#singu_opt').val(pipeData[0].singu_opt);
    updateCheckBox('#publish_dir_check', pipeData[0].publish_dir_check);
    updateCheckBox('#intermeDel', pipeData[0].interdel);
    updateCheckBox('#exec_each', decodeHtml(pipeData[0].exec_each));
    updateCheckBox('#exec_all', decodeHtml(pipeData[0].exec_all));
    updateCheckBox('#docker_check', pipeData[0].docker_check);
    updateCheckBox('#singu_check', pipeData[0].singu_check);
    updateCheckBox('#singu_save', pipeData[0].singu_save);
    updateCheckBox('#withTrace', pipeData[0].withTrace);
    updateCheckBox('#withReport', pipeData[0].withReport);
    updateCheckBox('#withDag', pipeData[0].withDag);
    updateCheckBox('#withTimeline', pipeData[0].withTimeline);
    checkShub()
    //load process options 
    if (pipeData[0].process_opt) {
        //wait for the process options table to load
        setTimeout(function () { loadProcessOpt(decodeHtml(pipeData[0].process_opt)); }, 1000);

    }
    // bind event handlers for autofill
    setTimeout(function () {
        if (autoFillJSON !== null && autoFillJSON !== undefined) {
            bindEveHandler(autoFillJSON);
        }
    }, 1000);
    //load amazon keys for possible s3 connection
    loadAmzKeys();
    if (pipeData[0].amazon_cre_id !== "0") {
        $('#mRunAmzKey').val(pipeData[0].amazon_cre_id);
    }
    //load user groups
    var allUserGrp = getValues({ p: "getUserGroups" });
    if (allUserGrp && allUserGrp != "") {
        for (var i = 0; i < allUserGrp.length; i++) {
            var param = allUserGrp[i];
            var optionGroup = new Option(param.name, param.id);
            $("#groupSel").append(optionGroup);
        }
    }
    if (pipeData[0].group_id !== "0") {
        $('#groupSel').val(pipeData[0].group_id);
    }

    var chooseEnv = $('#chooseEnv option:selected').val();

    if (pipeData[0].profile !== "" && chooseEnv && chooseEnv !== "") {
        var [allProSett, profileData] = getJobData("both");
        var executor_job = profileData[0].executor_job;
        if (executor_job === 'local' || executor_job === 'ignite') {
            $('#jobSettingsDiv').css('display', 'none');
        } else {
            $('#jobSettingsDiv').css('display', 'inline');
            //insert exec_all_settings data into allProcessSettTable table
            if (IsJsonString(decodeHtml(pipeData[0].exec_all_settings))) {
                var exec_all_settings = JSON.parse(decodeHtml(pipeData[0].exec_all_settings));
                fillForm('#allProcessSettTable', 'input', exec_all_settings);
            }
            //insert exec_each_settings data into #processtable
            if (IsJsonString(decodeHtml(pipeData[0].exec_each_settings))) {
                var exec_each_settings = JSON.parse(decodeHtml(pipeData[0].exec_each_settings));
                $.each(exec_each_settings, function (el) {
                    var each_settings = exec_each_settings[el];
                    //wait for the table to load
                    setTimeout(function () { fillForm('#' + el, 'input', each_settings); }, 1000);
                });
            }
        }
    } else {
        $('#jobSettingsDiv').css('display', 'none');
    }

    $('#ownUserNamePip').text(pipeData[0].username);
    $('#datecreatedPip').text(pipeData[0].date_created);
    $('.lasteditedPip').text(pipeData[0].date_modified);
}

function refreshEnv() {
    loadRunOptions();
}

function loadRunOptions() {
    $('#chooseEnv').find('option').not(':disabled').remove();
    //get profiles for user
    var proCluData = getValues({ p: "getProfileCluster" });
    var proAmzData = getValues({ p: "getProfileAmazon" });

    if (proCluData && proAmzData) {
        if (proCluData.length + proAmzData.length !== 0) {
            $.each(proCluData, function (el) {
                var option = new Option(proCluData[el].name + ' (Remote machine: ' + proCluData[el].username + '@' + proCluData[el].hostname + ')', 'cluster-' + proCluData[el].id)
                option.setAttribute("host", proCluData[el].hostname);
                $("#chooseEnv").append(option);
            });
            $.each(proAmzData, function (el) {
                var option = new Option(proAmzData[el].name + ' (Amazon: Status:' + proAmzData[el].status + ' Image id:' + proAmzData[el].image_id + ' Instance type:' + proAmzData[el].instance_type + ')', 'amazon-' + proAmzData[el].id)
                option.setAttribute("host", proAmzData[el].shared_storage_id);
                $("#chooseEnv").append(option);
            });
        }
    }
}
//insert selected input to inputs table
function insertSelectInput(rowID, gNumParam, filePath, proPipeInputID, qualifier) {
    var checkDropDown = $('#' + rowID).find('#dropDown')[0];
    if (checkDropDown) {
        $(checkDropDown).val(filePath);
        $('#' + rowID).attr('propipeinputid', proPipeInputID);
        $('#' + rowID).find('#defValUse').css('display', 'none');
    } else {
        if (qualifier === 'file' || qualifier === 'set') {
            var editIcon = getIconButtonModal('inputFile', 'Edit', 'fa fa-pencil');
            var deleteIcon = getIconButton('inputDel', 'Delete', 'fa fa-trash-o');
            $('#' + rowID).find('#inputFileSelect').css('display', 'none');
            $('#' + rowID).find('#defValUse').css('display', 'none');
        } else {
            var editIcon = getIconButtonModal('inputVal', 'Edit', 'fa fa-pencil');
            var deleteIcon = getIconButton('inputVal', 'Delete', 'fa fa-trash-o');
            $('#' + rowID).find('#inputValEnter').css('display', 'none');
            $('#' + rowID).find('#defValUse').css('display', 'none');
        }
        $('#' + rowID + '> :nth-child(6)').append('<span style="padding-right:7px;" id=filePath-' + gNumParam + '>' + filePath + '</span>' + editIcon + deleteIcon);
        $('#' + rowID).attr('propipeinputid', proPipeInputID);
    }
}
//remove for both dropdown and file/val options
function removeSelectFile(rowID, sType) {
    var checkDropDown = $('#' + rowID).find('#dropDown')[0];
    if (checkDropDown) {
        $('#' + rowID).find('#defValUse').css('display', 'inline');
        $('#' + rowID).removeAttr('propipeinputid');
    } else {
        if (sType === 'file' || sType === 'set') {
            $('#' + rowID).find('#inputFileSelect').css('display', 'inline');
            $('#' + rowID).find('#defValUse').css('display', 'inline');
        } else if (sType === 'val') {
            $('#' + rowID).find('#inputValEnter').css('display', 'inline');
            $('#' + rowID).find('#defValUse').css('display', 'inline');
        }
        $('#' + rowID + '> :nth-child(6) > span').remove();
        var buttonList = $('#' + rowID + '> :nth-child(6) > button');
        if (buttonList[3]) {
            buttonList[3].remove();
        }
        if (buttonList[2]) {
            buttonList[2].remove();
        }
        if (buttonList[1]) {
            if ($(buttonList[1]).attr("id") == "inputValEdit" || $(buttonList[1]).attr("id") == "inputFileEdit") {
                buttonList[1].remove();
            }
        }
        $('#' + rowID).removeAttr('propipeinputid');
    }
}

function checkInputInsert(data, gNumParam, given_name, qualifier, rowID, sType, inputID) {
    //check if input exist?
    if (inputID === null) {
        var nameInput = data[1].value;
        var checkInput = getValues({ name: nameInput, type: sType, p: "checkInput" });
        if (checkInput && checkInput != '') {
            var input_id = checkInput[0].id;
        } else {
            //insert into input table
            data.push({ name: "type", value: sType });
            data.push({ name: "p", value: "saveInput" });
            var inputGet = getValues(data);
            if (inputGet) {
                var input_id = inputGet.id;
            }
        }
    } else {
        var input_id = inputID;
    }
    //check if project input is exist
    var checkProjectInput = getValues({ "p": "checkProjectInput", "input_id": input_id, "project_id": project_id });
    if (checkProjectInput && checkProjectInput != '') {
        var projectInputID = checkProjectInput[0].id;
    } else {
        //insert into project_input table
        var proInputGet = getValues({ "p": "saveProjectInput", "input_id": input_id, "project_id": project_id });
        if (proInputGet) {
            var projectInputID = proInputGet.id;
        }
    }
    //insert into project_pipeline_input table
    var propipeInputGet = getValues({
        "p": "saveProPipeInput",
        "input_id": input_id,
        "project_id": project_id,
        "pipeline_id": pipeline_id,
        "project_pipeline_id": project_pipeline_id,
        "g_num": gNumParam,
        "given_name": given_name,
        "qualifier": qualifier
    });
    if (propipeInputGet && propipeInputGet != "") {
        var projectPipelineInputID = propipeInputGet.id;
    }
    //	      }
    //get inputdata from input table
    var proInputGet = getValues({ "p": "getInputs", "id": input_id });
    if (proInputGet && proInputGet != "") {
        var filePath = proInputGet[0].name;
        //insert into #inputsTab
        insertSelectInput(rowID, gNumParam, filePath, projectPipelineInputID, sType);
    }
}

function checkInputEdit(data, gNumParam, given_name, qualifier, rowID, sType, proPipeInputID, inputID) {
    if (inputID === null) {
        var nameInput = data[1].value;
        var checkInput = getValues({ name: nameInput, type: sType, p: "checkInput" });
        if (checkInput && checkInput != '') {
            var input_id = checkInput[0].id;
        } else {
            //insert into input table
            data[0].value = "";
            data.push({ name: "type", value: sType });
            data.push({ name: "p", value: "saveInput" });
            var inputGet = getValues(data);
            if (inputGet) {
                var input_id = inputGet.id;
            }
        }
    } else {
        var input_id = inputID;
        //get inputdata from input table
        var proInputGet = getValues({ "p": "getInputs", "id": input_id });
        if (proInputGet && proInputGet != "") {
            var nameInput = proInputGet[0].name;
        }
    }
    //check if project input is exist
    var checkProjectInput = getValues({ "p": "checkProjectInput", "input_id": input_id, "project_id": project_id });
    if (checkProjectInput && checkProjectInput != '') {
        var projectInputID = checkProjectInput[0].id;
    } else {
        //insert into project_input table
        var proInputGet = getValues({ "p": "saveProjectInput", "input_id": input_id, "project_id": project_id });
        if (proInputGet && proInputGet != "") {
            var projectInputID = proInputGet.id;
        }
    }
    //update project_pipeline_input table
    var propipeInputGet = getValues({
        "id": proPipeInputID,
        "p": "saveProPipeInput",
        "input_id": input_id,
        "project_id": project_id,
        "pipeline_id": pipeline_id,
        "project_pipeline_id": project_pipeline_id,
        "g_num": gNumParam,
        "given_name": given_name,
        "qualifier": qualifier
    });
    //update file table
    $('#filePath-' + gNumParam).text(nameInput);
}

function saveFileSetValModal(data, sType, inputID) {
    if (sType === 'file' || sType === 'set') {
        sType = 'file'; //for simplification 
        var rowID = $('#mIdFile').attr('rowID'); //the id of table-row to be updated #inputTa-3
    } else if (sType === 'val') {
        var rowID = $('#mIdVal').attr('rowID'); //the id of table-row to be updated #inputTa-3
    }
    var gNumParam = rowID.split('-')[1];
    var given_name = $("#input-PName-" + gNumParam).text(); //input-PName-3
    var qualifier = $('#' + rowID + ' > :nth-child(4)').text(); //input-PName-3
    //check database if file is exist, if not exist then insert
    checkInputInsert(data, gNumParam, given_name, qualifier, rowID, sType, inputID);
    checkReadytoRun();
}

function editFileSetValModal(data, sType, inputID) {
    if (sType === 'file' || sType === 'set') {
        sType = 'file';
        var rowID = $('#mIdFile').attr('rowID'); //the id of table-row to be updated #inputTa-3
    } else if (sType === 'val') {
        var rowID = $('#mIdVal').attr('rowID'); //the id of table-row to be updated #inputTa-3
    }
    var proPipeInputID = $('#' + rowID).attr('propipeinputid');
    var gNumParam = rowID.split('-')[1];
    var given_name = $("#input-PName-" + gNumParam).text(); //input-PName-3
    var qualifier = $('#' + rowID + ' > :nth-child(4)').text(); //input-PName-3
    //check database if file is exist, if not exist then insert
    checkInputEdit(data, gNumParam, given_name, qualifier, rowID, sType, proPipeInputID, inputID);
    checkReadytoRun();
}
checkType = "";
//checkType become "rerun" or "resumerun" when rerun or resume button is clicked.
function checkReadytoRun(type) {
    if (checkType === "") {
        checkType = type || "";
    }
    runStatus = getRunStatus(project_pipeline_id);
    project_pipeline_id = $('#pipeline-title').attr('projectpipelineid');
    var getProPipeInputs = getValues({
        p: "getProjectPipelineInputs",
        project_pipeline_id: project_pipeline_id,
    });
    var numInputRows = $('#inputsTable > tbody').find('tr').length;
    var profileNext = $('#chooseEnv').find(":selected").val();
    var profileNextText = $('#chooseEnv').find(":selected").html();
    if (profileNextText.match(/Amazon: Status:/)) {
        var patt = /(.*)Amazon: Status:(.*) Image(.*)/;
        var amzStatus = profileNextText.replace(patt, '$2');
    }
    var output_dir = $('#rOut_dir').val();
    var publishReady = false;
    var publish_dir_check = $('#publish_dir_check').is(":checked").toString();
    if (publish_dir_check === "true") {
        var publish_dir = $('#publish_dir').val();
        if (publish_dir !== "") {
            publishReady = true;
        } else {
            publishReady = false;
        }
    } else {
        var publish_dir = "";
        publishReady = true;
    }
    //check if s3: is defined in publish_dir and getProPipeInputs
    var s3check = checkS3(publish_dir, getProPipeInputs);
    var s3value = $('#mRunAmzKey').val();
    if (s3check === true && s3value !== null) {
        var s3status = true;
    } else if (s3check === false) {
        var s3status = true;
    } else {
        var s3status = false;
    }
    //if ready and not running/waiting
    if (publishReady && s3status && getProPipeInputs.length === numInputRows && profileNext !== '' && output_dir !== '') {
        if (((runStatus !== "NextRun" && runStatus !== "Waiting" && runStatus !== "init") && (checkType === "rerun" || checkType === "newrun" || checkType === "resumerun")) || runStatus === "") {
            if (amzStatus) {
                if (amzStatus === "running") {
                    if (checkType === "rerun" || checkType === "resumerun") {
                        runProjectPipe(runProPipeCall, checkType);
                    } else if (checkType === "newrun") {
                        displayButton('runProPipe');
                    } else {
                        displayButton('runProPipe');
                    }
                } else {
                    displayButton('statusProPipe');
                }
            } else {
                if (checkType === "rerun" || checkType === "resumerun") {
                    runProjectPipe(runProPipeCall, checkType);
                } else if (checkType === "newrun") {
                    displayButton('runProPipe');
                } else {
                    displayButton('runProPipe');
                }
            }
        }
    } else {
        if (((runStatus !== "NextRun" && runStatus !== "Waiting" && runStatus !== "init") && (checkType === "rerun" || checkType === "newrun")) || runStatus === "") {
            displayButton('statusProPipe');
        }
    }
    //reset checkType
    if (checkType === "rerun" || checkType === "newrun" || checkType === "resumerun") {
        checkType = "newrun";
    } else {
        checkType = "";
    }
}

//check if singu image path contains shub:// pattern 
$("#singu_img").keyup(function () {
    autoCheckShub();
});
var timeoutCheckShub = 0;

function autoCheckShub() {
    if (timeoutCheckShub) clearTimeout(timeoutCheck);
    timeoutCheckShub = setTimeout(function () { checkShub() }, 2000);
}

//check if singu image path contains shub:// pattern then show "save over image" checkbox
function checkShub() {
    var singuPath = $("#singu_img").val()
    var shubpattern = 'shub://';
    var pathCheck = false;
    if (singuPath !== '') {
        if (singuPath.indexOf(shubpattern) > -1) {
            $("#singu_save_div").css('display', "block");
        } else {
            $("#singu_save_div").css('display', "none");
            $("#singu_save").prop('checked', false);
        }
    } else {
        $("#singu_save_div").css('display', "none");
        $("#singu_save").prop('checked', false);
    }
}

//Autocheck the output,publish_dir,publish_dir_check for checkreadytorun
$("#rOut_dir").keyup(function () {
    autoCheck();
});
$("#publish_dir").keyup(function () {
    autoCheck();
});
$("#publish_dir_check").click(function () {
    autoCheck();
});

var timeoutCheck = 0;

function autoCheck() {
    if (timeoutCheck) clearTimeout(timeoutCheck);
    timeoutCheck = setTimeout(function () { checkReadytoRun() }, 2000);
}

//check if path contains s3:// pattern and shows aws menu
function checkS3(path, getProPipeInputs) {
    //path part
    var s3pattern = 's3:';
    var pathCheck = false;
    if (path !== '') {
        if (path.indexOf(s3pattern) > -1) {
            $("#mRunAmzKeyDiv").css('display', "inline");
            pathCheck = true;
        } else {
            pathCheck = false;
        }
    } else {
        pathCheck = false;
    }
    //getProPipeInputs part
    var nameCheck = 0;
    $.each(getProPipeInputs, function (el) {
        var inputName = getProPipeInputs[el].name;
        if (inputName.indexOf(s3pattern) > -1) {
            $("#mRunAmzKeyDiv").css('display', "inline");
            nameCheck = nameCheck + 1;
        }
    });
    if (nameCheck === 0 && pathCheck === false) {
        $("#mRunAmzKeyDiv").css('display', "none");
        return false;
    } else {
        return true;
    }
}

function loadAmzKeys() {
    var data = getValues({ p: "getAmz" });
    if (data && data != "") {
        for (var i = 0; i < data.length; i++) {
            var param = data[i];
            var optionGroup = new Option(param.name, param.id);
            $("#mRunAmzKey").append(optionGroup);
        }
    }
}

function configTextAllProcess(exec_all_settings, type, proName) {
    if (type === "each") {
        for (var keyParam in exec_all_settings) {
            if (exec_all_settings[keyParam] !== '' && (keyParam === 'time' || keyParam === 'job_time')) {
                window.configTextRaw += 'process.$' + proName + '.time' + ' = \'' + exec_all_settings[keyParam] + 'm\'\n';
            } else if (exec_all_settings[keyParam] !== '' && (keyParam === 'cpu' || keyParam === 'job_cpu')) {
                window.configTextRaw += 'process.$' + proName + '.cpus' + ' = ' + exec_all_settings[keyParam] + '\n';
            } else if (exec_all_settings[keyParam] !== '' && (keyParam === 'queue' || keyParam === 'job_queue')) {
                window.configTextRaw += 'process.$' + proName + '.queue' + ' = \'' + exec_all_settings[keyParam] + '\'\n';
            } else if (exec_all_settings[keyParam] !== '' && (keyParam === 'memory' || keyParam === 'job_memory')) {
                window.configTextRaw += 'process.$' + proName + '.memory' + ' = \'' + exec_all_settings[keyParam] + ' GB\'\n';
            } else if (exec_all_settings[keyParam] !== '' && (keyParam === 'opt' || keyParam === 'job_clu_opt')) {
                window.configTextRaw += 'process.$' + proName + '.clusterOptions' + ' = \'' + exec_all_settings[keyParam] + '\'\n';
            }
        }

    } else {
        for (var keyParam in exec_all_settings) {
            if (exec_all_settings[keyParam] !== '' && (keyParam === 'time' || keyParam === 'job_time')) {
                window.configTextRaw += 'process.' + 'time' + ' = \'' + exec_all_settings[keyParam] + 'm\'\n';
            } else if (exec_all_settings[keyParam] !== '' && (keyParam === 'cpu' || keyParam === 'job_cpu')) {
                window.configTextRaw += 'process.' + 'cpus' + ' = ' + exec_all_settings[keyParam] + '\n';
            } else if (exec_all_settings[keyParam] !== '' && (keyParam === 'queue' || keyParam === 'job_queue')) {
                window.configTextRaw += 'process.' + 'queue' + ' = \'' + exec_all_settings[keyParam] + '\'\n';
            } else if (exec_all_settings[keyParam] !== '' && (keyParam === 'memory' || keyParam === 'job_memory')) {
                window.configTextRaw += 'process.' + 'memory' + ' = \'' + exec_all_settings[keyParam] + ' GB\'\n';
            } else if (exec_all_settings[keyParam] !== '' && (keyParam === 'opt' || keyParam === 'job_clu_opt')) {
                window.configTextRaw += 'process.' + 'clusterOptions' + ' = \'' + exec_all_settings[keyParam] + ' \'\n';
            }
        }
    }
}

function displayButton(idButton) {
    var buttonList = ['runProPipe', 'errorProPipe', 'completeProPipe', 'runningProPipe', 'waitingProPipe', 'statusProPipe', 'connectingProPipe', 'terminatedProPipe'];
    for (var i = 0; i < buttonList.length; i++) {
        document.getElementById(buttonList[i]).style.display = "none";
    }
    document.getElementById(idButton).style.display = "inline";
}
//xxxxx
function terminateProjectPipe() {
    var proType = proTypeWindow;
    var proId = proIdWindow;
    if (runPid && proType == "cluster") {
        var terminateRun = getValues({ p: "terminateRun", project_pipeline_id: project_pipeline_id, profileType: proType, profileId: proId });
        console.log(terminateRun)
        var pidStatus = checkRunPid(runPid, proType, proId);
        if (pidStatus) { // if true, then it is exist in queue
            console.log("pid exist1")
        } else { //pid not exist
            console.log("give error1")
        }
    }

    var setStatus = getValues({ p: "updateRunStatus", run_status: "Terminated", project_pipeline_id: project_pipeline_id });
    if (setStatus) {
        clearInterval(interval_readNextlog);
        displayButton('terminatedProPipe');
    }

}

function parseRunPid(serverLog) {
    runPid = "";
    //for lsf: Job <203477> is submitted to queue <long>.\n"
    //for sge: Your job 2259 ("run_bowtie2") has been submitted
    if (serverLog.match(/Job <(.*)> is submitted/)) {
        runPid = serverLog.match(/Job <(.*)> is submitted/)[1];
        runPid = $.trim(runPid);
        if (runPid && runPid != "") {
            var updateRunPidComp = getValues({ p: "updateRunPid", pid: runPid, project_pipeline_id: project_pipeline_id });
        } else {
            runPid = null;
        }
    } else if (serverLog.match(/job (.*) \(.*\) .* submitted/)) {
        runPid = serverLog.match(/job (.*) \(.*\) .* submitted/)[1];
        runPid = $.trim(runPid);
        if (runPid && runPid != "") {
            var updateRunPidComp = getValues({ p: "updateRunPid", pid: runPid, project_pipeline_id: project_pipeline_id });
        } else {
            runPid = null;
        }
    } else {
        runPid = null;
    }
    return runPid
}

function checkRunPid(runPid, proType, proId) {
    var checkPid = null;
    if (runPid) {
        checkPid = getValues({ p: "checkRunPid", pid: runPid, profileType: proType, profileId: proId, project_pipeline_id: project_pipeline_id });
        if (checkPid == "running") {
            checkPid = true;
        } else if (checkPid == "done") {
            checkPid = false;
        } else {
            checkPid = null;
        }
    }
    return checkPid
}

function parseMountPath(path) {
    if (path != null && path != "") {
        if (path.match(/\//)) {
            var allDir = path.split("/");
            if (allDir.length > 1) {
                return "/" + allDir[1] + "/" + allDir[2]
            }
        }
    }
    return null;
}
//when -E is not defined add paths, If -E defined then replace the content of -E "paths"
function getNewExecOpt(oldExecOpt, newPaths) {
    var newExecAll = "";
    if (!oldExecOpt.match(/\-E/)) {
        newExecAll = oldExecOpt + newPaths;
    } else if (oldExecOpt.match(/\-E "(.*)"/)) {
        var patt = /(.*)-E \"(.*)\"(.*)/;
        newExecAll = oldExecOpt.replace(patt, '$1' + newPaths + '$3');
    }
    return newExecAll
}
//xxxxxxx
function autofillMountPath() {
    var pathArray = [];
    var workDir = $('#rOut_dir').val();
    workDir = parseMountPath(workDir);
    if (workDir) {
        pathArray.push(workDir);
    }
    //get all input paths
    var inputPaths = $('#inputsTab > table > tbody >tr').find("span[id*='filePath']");
    if (inputPaths && inputPaths != null) {
        $.each(inputPaths, function (el) {
            var inputPath = $(inputPaths[el]).text();
            var parsedPath = parseMountPath(inputPath);
            if (parsedPath) {
                if (pathArray.indexOf(parsedPath) === -1) {
                    pathArray.push(parsedPath)
                }
            }
        });
    }
    //turn into lsf command (use -E to define scripts which will be executed just before the main job)
    if (pathArray.length > 0) {
        var execOtherOpt = '-E "file ' + pathArray.join(' && file ') + '"'
    } else {
        var execOtherOpt = '';
    }

    //check if exec_all or exec_each checkboxes are clicked.
    if ($('#exec_all').is(":checked") === true) {
        var oldExecAll = $('#job_clu_opt').val();
        var newExecAll = getNewExecOpt(oldExecAll, execOtherOpt);
        $('#job_clu_opt').val(newExecAll);

    }
    if ($('#exec_each').is(":checked") === true) {
        var checkedBox = $('#processTable').find('input:checked');
        var checkedBoxArray = checkedBox.toArray();
        var formDataArr = {};
        $.each(checkedBoxArray, function (el) {
            var boxId = $(checkedBoxArray[el]).attr('id')
            var patt = /(.*)-(.*)/;
            var proGnum = boxId.replace(patt, '$2');
            var oldExecEachDiv = $('#procGnum-' + proGnum).find('input[name=opt]')[0];
            var oldExecEach = $(oldExecEachDiv).val();
            var newExecEach = getNewExecOpt(oldExecEach, execOtherOpt);
            $(oldExecEachDiv).val(newExecEach);
        });
    }
    return execOtherOpt
}

//callbackfunction to first change the status of button to connecting
function runProjectPipe(runProPipeCall, checkType) {
    execOtherOpt = "";
    displayButton('connectingProPipe');
    $('#runLogArea').val("");
    //autofill for ghpcc06 cluster to mount all directories before run executed.
    var hostname = $('#chooseEnv').find('option:selected').attr('host');
    if (hostname === "ghpcc06.umassrc.org") {
        execOtherOpt = autofillMountPath()
    }
    // Call the callback
    setTimeout(function () { runProPipeCall(checkType); }, 1000);
}

//click on run button (callback function)
function runProPipeCall(checkType) {


    saveRunIcon();
    nxf_runmode = true;
    var nextTextRaw = createNextflowFile("run");
    nxf_runmode = false;
    var nextText = encodeURIComponent(nextTextRaw);
    var delIntermediate = '';
    var profileTypeId = $('#chooseEnv').find(":selected").val(); //local-32
    var patt = /(.*)-(.*)/;
    var proType = profileTypeId.replace(patt, '$1');
    var proId = profileTypeId.replace(patt, '$2');
    proTypeWindow = proType;
    proIdWindow = proId;
    configTextRaw = '';

    //check if s3 path is defined in output or file paths
    var checkAmzKeysDiv = $("#mRunAmzKeyDiv").css('display');
    if (checkAmzKeysDiv === "inline") {
        var amazon_cre_id = $("#mRunAmzKey").val();
    } else {
        var amazon_cre_id = "";
    }


    if ($('#docker_check').is(":checked") === true) {
        var docker_img = $('#docker_img').val();
        var docker_opt = $('#docker_opt').val();
        configTextRaw += 'process.container = \'' + docker_img + '\'\n';
        configTextRaw += 'docker.enabled = true\n';
        if (docker_opt !== '') {
            configTextRaw += 'docker.runOptions = \'' + docker_opt + '\'\n';
        }
    }
    if ($('#singu_check').is(":checked") === true) {
        var singu_img = $('#singu_img').val();
        var patt = /^docker:\/\/(.*)/g;
        var patt = /^shub:\/\/(.*)/g;
        var singuPath = singu_img.replace(patt, '$1');
        if (patt.test(singu_img)) {
            singuPath = singuPath.replace(/\//g, '-')
            var downSingu_img = '//$HOME/.dolphinnext/singularity/' + singuPath + '.simg';
        } else {
            var downSingu_img = singu_img;
        }

        var singu_opt = $('#singu_opt').val();
        configTextRaw += 'process.container = \'' + downSingu_img + '\'\n';
        configTextRaw += 'singularity.enabled = true\n';
        if (singu_opt !== '') {
            configTextRaw += 'singularity.runOptions = \'' + singu_opt + '\'\n';
        }
    }
    //check executor_job if its local
    var [allProSett, profileData] = getJobData("both");
    var executor_job = profileData[0].executor_job;
    configTextRaw += 'process.executor = \'' + executor_job + '\'\n';
    if (executor_job !== 'local' && executor_job !== 'ignite') {
        //all process settings eg. process.queue = 'short'
        if ($('#exec_all').is(":checked") === true) {
            var exec_all_settingsRaw = $('#allProcessSettTable').find('input');
            var exec_all_settings = formToJson(exec_all_settingsRaw);
            configTextAllProcess(exec_all_settings);
        } else {
            if (execOtherOpt != "" && execOtherOpt != null) {
                var oldJobCluOpt = allProSett.job_clu_opt;
                var newJobCluOpt = getNewExecOpt(oldJobCluOpt, execOtherOpt);
                if (newJobCluOpt != "" && newJobCluOpt != null) {
                    allProSett.job_clu_opt = newJobCluOpt;
                }
            }
            configTextAllProcess(allProSett);
        }
        if ($('#exec_each').is(":checked") === true) {
            var exec_each_settings = decodeURIComponent(formToJsonEachPro());
            if (IsJsonString(exec_each_settings)) {
                var exec_each_settings = JSON.parse(exec_each_settings);
                $.each(exec_each_settings, function (el) {
                    var each_settings = exec_each_settings[el];
                    var processName = $("#" + el + " :nth-child(2)").text()
                    //process.$hello.queue = 'long'
                    configTextAllProcess(each_settings, "each", processName);
                });
            }
        }
    }
    console.log(configTextRaw);
    var configText = encodeURIComponent(configTextRaw);
    //save nextflow text as nextflow.nf and start job
    serverLog = '';
    var serverLogGet = getValues({
        p: "saveRun",
        nextText: nextText,
        configText: configText,
        profileType: proType,
        profileId: proId,
        amazon_cre_id: amazon_cre_id,
        project_pipeline_id: project_pipeline_id,
        runType: checkType
    });
    readNextflowLogTimer(proType, proId);
    $('#runLogs').css('display', 'inline');
    //reset the checktype
    window['checkType'] = "";
}

//#########read nextflow log file for status  ################################################
function readNextflowLogTimer(proType, proId) {
    interval_readNextlog = setInterval(function () {
        readNextLog(proType, proId, "no_reload")
    }, 10000);
}

// type= reload for reload the page
function readNextLog(proType, proId, type) {
    var pidStatus = "";
    serverLog = '';
    //get server log
    serverLog = getServerLog(project_pipeline_id);
    if (serverLog && serverLog !== null && serverLog !== false) {
        $('#runLogArea').val(serverLog);
        var runPid = parseRunPid(serverLog);
    } else {
        serverLog = "";
    }
    //get nextflow log
    nextflowLog = getNextflowLog(project_pipeline_id, proType, proId);
    // check runStatus to get status //Available Run_status States: NextErr,NextSuc,NextRun,Error,Waiting,init,Terminated
    if (runStatus === "Terminated") {
        if (nextflowLog !== null && nextflowLog !== undefined) {
            $('#runLogArea').val(serverLog + nextflowLog);
        }
        if (type !== "reload") {
            clearInterval(interval_readNextlog);
        }
        displayButton('terminatedProPipe');
        // parse nextflow file to get status
    } else if (nextflowLog !== null) {
        $('#runLogArea').val(serverLog + nextflowLog);
        if (nextflowLog.match(/N E X T F L O W/)) {
            if (nextflowLog.match(/##Success: failed/)) {
                // status completed with error
                if (runStatus !== "NextErr" || runStatus !== "NextSuc" || runStatus !== "Error" || runStatus !== "Terminated") {
                    var duration = nextflowLog.match(/##Duration:(.*)\n/)[1];
                    var setStatus = getValues({ p: "updateRunStatus", run_status: "NextErr", project_pipeline_id: project_pipeline_id, duration: duration });
                }
                if (type !== "reload") {
                    clearInterval(interval_readNextlog);
                }
                displayButton('errorProPipe');

            } else if (nextflowLog.match(/##Success: OK/)) {
                // status completed with success
                if (runStatus !== "NextErr" || runStatus !== "NextSuc" || runStatus !== "Error" || runStatus !== "Terminated") {
                    var duration = nextflowLog.match(/##Duration:(.*)\n/)[1];
                    var setStatus = getValues({ p: "updateRunStatus", run_status: "NextSuc", project_pipeline_id: project_pipeline_id, duration: duration });
                    //Save output file paths to input and project_input database
                    addOutFileDb();
                }
                if (type !== "reload") {
                    clearInterval(interval_readNextlog);
                }
                displayButton('completeProPipe');
                showOutputPath();

            } else if (nextflowLog.match(/error/gi) || nextflowLog.match(/failed/i)) {
                // status completed with error
                if (runStatus !== "NextErr" || runStatus !== "NextSuc" || runStatus !== "Error" || runStatus !== "Terminated") {
                    var setStatus = getValues({ p: "updateRunStatus", run_status: "NextErr", project_pipeline_id: project_pipeline_id });
                }
                if (type !== "reload") {
                    clearInterval(interval_readNextlog);
                }
                displayButton('errorProPipe');

            } else {
                //update status as running
                if (type === "reload") {
                    readNextflowLogTimer(proType, proId);
                }
                if (runStatus !== "NextErr" || runStatus !== "NextSuc" || runStatus !== "Error" || runStatus !== "Terminated") {
                    var setStatus = getValues({ p: "updateRunStatus", run_status: "NextRun", project_pipeline_id: project_pipeline_id });
                }
                displayButton('runningProPipe');
            }
        }
        //Nextflow log file exist but /N E X T F L O W/ not printed yet
        else {
            console.log("Nextflow not started");
            //	  			pidStatus = checkRunPid(runPid, proType, proId);
            //	  			if (pidStatus) { // if true, then it is exist in queue
            //	  				console.log("pid exist1")
            //	  			} else { //pid not exist
            //	  				console.log("give error1")
            //	  			}
            // below is need to be updated according tho pidStatus
            var setStatus = getValues({ p: "updateRunStatus", run_status: "Waiting", project_pipeline_id: project_pipeline_id });
            displayButton('waitingProPipe');
            if (type === "reload") {
                readNextflowLogTimer(proType, proId);
            }


        }
    } else {
        console.log("Nextflow log is not exist yet.")

        if (serverLog.match(/error/gi)) {
            console.log("Error");
            if (runStatus !== "NextErr" || runStatus !== "NextSuc" || runStatus !== "Error" || runStatus !== "Terminated") {
                var setStatus = getValues({ p: "updateRunStatus", run_status: "Error", project_pipeline_id: project_pipeline_id });
            }
            if (type !== "reload") {
                clearInterval(interval_readNextlog);
            }
            displayButton('errorProPipe');

        } else {
            console.log("Waiting");
            if (type === "reload") {
                readNextflowLogTimer(proType, proId);
            }
            var setStatus = getValues({ p: "updateRunStatus", run_status: "Waiting", project_pipeline_id: project_pipeline_id });
            displayButton('waitingProPipe');
            if (runPid && proType === "cluster") {
                pidStatus = checkRunPid(runPid, proType, proId);
                if (pidStatus) { // if true, then it is exist in queue
                    console.log("pid exist2")
                } else { //pid not exist
                    console.log("give error2")
                }
            }

        }

    }
}

function showOutputPath() {
    var outTableRow = $('#outputsTable > tbody > >:last-child').find('span');
    var output_dir = $('#rOut_dir').val();
    //add slash if outputdir not ends with slash
    if (output_dir && output_dir.substr(-1) !== '/') {
        output_dir = output_dir + "/";
    }
    for (var i = 0; i < outTableRow.length; i++) {
        var fname = $(outTableRow[i]).attr('fname');
        $(outTableRow[i]).text(output_dir + fname);
    }
}

function addOutFileDb() {
    var rowIdAll = $('#outputsTable > tbody').find('tr');
    for (var i = 0; i < rowIdAll.length; i++) {
        var data = [];
        var rowID = $(rowIdAll[i]).attr('id');
        var outTableRow = $('#' + rowID + ' >:last-child').find('span');
        var filePath = $(outTableRow[0]).text();
        //	          var gNumParam = rowID.split('-')[1];
        //	          var given_name = $("#input-PName-" + gNumParam).text(); //input-PName-3
        //	          var qualifier = $('#' + rowID + ' > :nth-child(4)').text(); //input-PName-3
        //	          data.push({ name: "id", value: "" });
        //	          data.push({ name: "name", value: filePath });
        //	          data.push({ name: "p", value: "saveInput" });
        //insert into input table
        //	          var inputGet = getValues(data);
        //	          if (inputGet) {
        //	              var input_id = inputGet.id;
        //	          }
        //insert into project_input table
        //bug: it adds NA named files after each run
        //	          var proInputGet = getValues({ "p": "saveProjectInput", "input_id": input_id, "project_id": project_id });
    }
}


function getNextflowLog(project_pipeline_id, proType, proId) {
    if (proType === "cluster" || proType === "amazon") {
        var logText = getValues({
            p: "getNextflowLog",
            project_pipeline_id: project_pipeline_id,
            profileType: proType,
            profileId: proId
        });
        if (logText && logText != "") {
            return logText;
        } else {
            return "";
        }
    }
}

function getServerLog(project_pipeline_id) {
    var logText = getValues({
        p: "getServerLog",
        project_pipeline_id: project_pipeline_id
    });
    if (logText && logText != "") {
        return logText;
    } else {
        return "";
    }
}

function formToJson(rawFormData, stringify) {
    var formDataSerial = rawFormData.serializeArray();
    var formDataArr = {};
    $.each(formDataSerial, function (el) {
        formDataArr[formDataSerial[el].name] = formDataSerial[el].value;
    });
    if (stringify && stringify === 'stringify') {
        return encodeURIComponent(JSON.stringify(formDataArr))
    } else {
        return formDataArr;
    }
}
//prepare JSON to save db
function getProcessOpt() {
    var processOptAll = {};
    var proOptDiv = $('#ProcessPanel').children();
    $.each(proOptDiv, function (el) {
        var boxId = $(proOptDiv[el]).attr('id')
        var patt = /(.*)-(.*)/;
        var proGnum = boxId.replace(patt, '$2');
        var formGroup = $('#addProcessRow-' + proGnum).find('.form-group');
        var formGroupArray = formGroup.toArray();
        var processOptEach = {};
        $.each(formGroupArray, function (el) {
            var labelDiv = $(formGroupArray[el]).find("label")[0];
            var inputDiv = $(formGroupArray[el]).find("input,textarea,select")[0];
            var inputDivType = $(inputDiv).attr("type");
            if (labelDiv && inputDiv) {
                // variable name stored at label
                var label = $.trim($(labelDiv).text());
                //userInput stored at inputDiv. If type of the input is checkbox different method is use to learn whether it is checked
                if (inputDivType === "checkbox") {
                    var input = $(inputDiv).is(":checked").toString();
                } else {
                    var input = $.trim($(inputDiv).val());
                }
                processOptEach[label] = input;
            }
        });
        processOptAll[proGnum] = processOptEach
    });
    return encodeURIComponent(JSON.stringify(processOptAll))
}
//get JSON from db and fill the process options
function loadProcessOpt(allProcessOpt) {
    if (allProcessOpt) {
        allProcessOpt = JSON.parse(allProcessOpt);
        $.each(allProcessOpt, function (el) {
            var proGnum = el;
            var eachProcessOpt = allProcessOpt[el];
            // find all form-groups for each process by proGnum
            var formGroup = $('#addProcessRow-' + proGnum).find('.form-group');
            var formGroupArray = formGroup.toArray();
            $.each(formGroupArray, function (el) {
                var labelDiv = $(formGroupArray[el]).find("label")[0];
                var inputDiv = $(formGroupArray[el]).find("input,textarea,select")[0];
                var inputDivType = $(inputDiv).attr("type");
                // fill each form if label exist in eachProcessOpt object
                if (labelDiv && inputDiv) {
                    var label = $.trim($(labelDiv).text());
                    if (eachProcessOpt[label] != null && eachProcessOpt[label] != undefined) {
                        if (inputDivType === "checkbox") {
                            updateCheckBox(inputDiv, eachProcessOpt[label]);
                        } else {
                            $(inputDiv).val(eachProcessOpt[label]);
                        }
                    }
                }
            });
        });
    }
}

function formToJsonEachPro() {
    var checkedBox = $('#processTable').find('input:checked');
    var checkedBoxArray = checkedBox.toArray();
    var formDataArr = {};
    $.each(checkedBoxArray, function (el) {
        var boxId = $(checkedBoxArray[el]).attr('id')
        var patt = /(.*)-(.*)/;
        var proGnum = boxId.replace(patt, '$2');
        var selectedRow = $('#procGnum-' + proGnum).find('input');
        var selectedRowJson = formToJson(selectedRow, 'stringfy');
        formDataArr['procGnum-' + proGnum] = selectedRowJson;
    });
    return encodeURIComponent(JSON.stringify(formDataArr))

}

function saveRunIcon() {
    var data = [];
    var runSummary = encodeURIComponent($('#runSum').val());
    var run_name = $('#run-title').val();
    if (dupliProPipe === false) {
        project_pipeline_id = $('#pipeline-title').attr('projectpipelineid');
    } else if (dupliProPipe === true) {
        old_project_pipeline_id = project_pipeline_id;
        project_pipeline_id = '';
        run_name = run_name + '-copy'
    }
    //checkAmzKeysDiv
    var checkAmzKeysDiv = $("#mRunAmzKeyDiv").css('display');
    if (checkAmzKeysDiv === "inline") {
        var amazon_cre_id = $("#mRunAmzKey").val();
    } else {
        var amazon_cre_id = "";
    }
    var output_dir = $('#rOut_dir').val();
    var publish_dir = $('#publish_dir').val();
    var publish_dir_check = $('#publish_dir_check').is(":checked").toString();
    var profile = $('#chooseEnv').val();
    var perms = $('#perms').val();
    var interdel = $('#intermeDel').is(":checked").toString();
    var groupSel = $('#groupSel').val();
    var cmd = encodeURIComponent($('#runCmd').val());
    var exec_each = $('#exec_each').is(":checked").toString();
    var exec_all = $('#exec_all').is(":checked").toString();
    var exec_all_settingsRaw = $('#allProcessSettTable').find('input');
    var exec_all_settings = formToJson(exec_all_settingsRaw, 'stringify');
    var exec_each_settings = formToJsonEachPro();
    var docker_check = $('#docker_check').is(":checked").toString();
    var docker_img = $('#docker_img').val();
    var docker_opt = $('#docker_opt').val();
    var singu_check = $('#singu_check').is(":checked").toString();
    var singu_save = $('#singu_save').is(":checked").toString();
    var singu_img = $('#singu_img').val();
    var singu_opt = $('#singu_opt').val();
    var withReport = $('#withReport').is(":checked").toString();
    var withTrace = $('#withTrace').is(":checked").toString();
    var withTimeline = $('#withTimeline').is(":checked").toString();
    var withDag = $('#withDag').is(":checked").toString();
    var process_opt = getProcessOpt();
    if (run_name !== '') {
        data.push({ name: "id", value: project_pipeline_id });
        data.push({ name: "name", value: run_name });
        data.push({ name: "project_id", value: project_id });
        data.push({ name: "pipeline_id", value: pipeline_id });
        data.push({ name: "amazon_cre_id", value: amazon_cre_id });
        data.push({ name: "summary", value: runSummary });
        data.push({ name: "output_dir", value: output_dir });
        data.push({ name: "publish_dir", value: publish_dir });
        data.push({ name: "publish_dir_check", value: publish_dir_check });
        data.push({ name: "profile", value: profile });
        data.push({ name: "perms", value: perms });
        data.push({ name: "interdel", value: interdel });
        data.push({ name: "cmd", value: cmd });
        data.push({ name: "group_id", value: groupSel });
        data.push({ name: "exec_each", value: exec_each });
        data.push({ name: "exec_all", value: exec_all });
        data.push({ name: "exec_all_settings", value: exec_all_settings });
        data.push({ name: "exec_each_settings", value: exec_each_settings });
        data.push({ name: "docker_check", value: docker_check });
        data.push({ name: "docker_img", value: docker_img });
        data.push({ name: "docker_opt", value: docker_opt });
        data.push({ name: "singu_check", value: singu_check });
        data.push({ name: "singu_save", value: singu_save });
        data.push({ name: "singu_img", value: singu_img });
        data.push({ name: "singu_opt", value: singu_opt });
        data.push({ name: "withReport", value: withReport });
        data.push({ name: "withTrace", value: withTrace });
        data.push({ name: "withTimeline", value: withTimeline });
        data.push({ name: "withDag", value: withDag });
        data.push({ name: "process_opt", value: process_opt });
        data.push({ name: "p", value: "saveProjectPipeline" });
        $.ajax({
            type: "POST",
            url: "ajax/ajaxquery.php",
            data: data,
            async: true,
            success: function (s) {
                if (dupliProPipe === false) {
                    checkReadytoRun();
                    refreshCreatorData(project_pipeline_id);
                    updateSideBarProPipe("", project_pipeline_id, run_name, "edit")
                } else if (dupliProPipe === true) {
                    var duplicateProPipeIn = getValues({ p: "duplicateProjectPipelineInput", new_id: s.id, old_id: old_project_pipeline_id });
                    if (duplicateProPipeIn) {
                        setTimeout(function () { window.location.replace("index.php?np=3&id=" + s.id); }, 0);
                    }
                    dupliProPipe = false;
                }
            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
    }
}

function getProfileData(proType, proId) {
    if (proType === 'cluster') {
        var profileData = getValues({ p: "getProfileCluster", id: proId });
    } else if (proType === 'amazon') {
        var profileData = getValues({ p: "getProfileAmazon", id: proId });
    }
    return profileData;
}

function getJobData(getType) {
    var chooseEnv = $('#chooseEnv option:selected').val();
    if (chooseEnv) {
        var patt = /(.*)-(.*)/;
        var proType = chooseEnv.replace(patt, '$1');
        var proId = chooseEnv.replace(patt, '$2');
        var profileData = getProfileData(proType, proId);
        var allProSett = {};
        if (profileData && profileData != '') {
            allProSett.job_queue = profileData[0].job_queue;
            allProSett.job_memory = profileData[0].job_memory;
            allProSett.job_cpu = profileData[0].job_cpu;
            allProSett.job_time = profileData[0].job_time;
            allProSett.job_clu_opt = profileData[0].job_clu_opt;
            if (getType === "job") {
                return profileData;
            } else if (getType === "both") {
                return [allProSett, profileData];
            }
        } else {
            return [allProSett, profileData];
        }
    }
}

function updateSideBarProPipe(project_id, project_pipeline_id, project_pipeline_name, type) {
    if (type === "edit") {
        $('#propipe-' + project_pipeline_id).html('<i class="fa fa-angle-double-right"></i>' + truncateName(project_pipeline_name, 'sidebarMenu'));
    }
}

function getRunStatus(project_pipeline_id) {
    var runStatusGet = getValues({ p: "getRunStatus", project_pipeline_id: project_pipeline_id });
    if (runStatusGet[0]) {
        runStatus = runStatusGet[0].run_status;
    } else {
        runStatus = '';
    }
    return runStatus;
}
dupliProPipe = false;

function duplicateProPipe() {
    dupliProPipe = true;
    saveRunIcon();
}

$(document).ready(function () {
    project_pipeline_id = $('#pipeline-title').attr('projectpipelineid');
    pipeData = getValues({ p: "getProjectPipelines", id: project_pipeline_id });
    projectpipelineOwn = pipeData[0].own;
    runPid = "";
    // if user not own it, cannot change or delete run
    if (projectpipelineOwn === "0") {
        $('#deleteRun').remove();
        $('#delRun').remove();
        $('#saveRunIcon').remove();
        $('#pipeRunDiv').remove();
    }
    pipeline_id = pipeData[0].pipeline_id;
    project_id = pipeData[0].project_id;
    $('#pipeline-title').attr('pipeline_id', pipeline_id);
    if (project_pipeline_id !== '' && pipeline_id !== '') {
        loadPipelineDetails(pipeline_id);
        loadProjectPipeline(pipeData);
        runStatus = "";
        if (projectpipelineOwn === "1") {
            runStatus = getRunStatus(project_pipeline_id);
        }
    }
    if (runStatus !== "") {
        $('#runLogs').css('display', 'inline');
        //Available Run_status States: NextErr,NextSuc,NextRun,Error,Waiting,init
        var profileTypeId = $('#chooseEnv').find(":selected").val(); //local-32
        var patt = /(.*)-(.*)/;
        var profileType = profileTypeId.replace(patt, '$1');
        var profileId = profileTypeId.replace(patt, '$2');
        proTypeWindow = profileType;
        proIdWindow = profileId;
        setTimeout(function () { readNextLog(profileType, profileId, "reload"); }, 100);
    }
    //not allow to check both docker and singularity
    $('#docker_imgDiv').on('show.bs.collapse', function () {
        if ($('#singu_check').is(":checked") && $('#docker_check').is(":checked")) {
            $('#singu_check').trigger("click");
        }
        $('#docker_check').attr('onclick', "return false;");
    });
    $('#singu_imgDiv').on('show.bs.collapse', function () {
        if ($('#singu_check').is(":checked") && $('#docker_check').is(":checked")) {
            $('#docker_check').trigger("click");
        }
        $('#singu_check').attr('onclick', "return false;");
    });
    $('#docker_imgDiv').on('shown.bs.collapse', function () {
        if ($('#singu_check').is(":checked") && $('#docker_check').is(":checked")) {
            $('#singu_check').trigger("click");
        }
        $('#docker_check').removeAttr('onclick');
    });
    $('#singu_imgDiv').on('shown.bs.collapse', function () {
        if ($('#singu_check').is(":checked") && $('#docker_check').is(":checked")) {
            $('#docker_check').trigger("click");
        }
        $('#singu_check').removeAttr('onclick');
    });
    $('#singu_imgDiv').on('hide.bs.collapse', function () {
        $('#singu_check').attr('onclick', "return false;");
    });
    $('#docker_imgDiv').on('hide.bs.collapse', function () {
        $('#docker_check').attr('onclick', "return false;");
    });
    $('#docker_imgDiv').on('hidden.bs.collapse', function () {
        $('#docker_check').removeAttr('onclick');
    });
    $('#singu_imgDiv').on('hidden.bs.collapse', function () {
        $('#singu_check').removeAttr('onclick');
    });



    //click on "use default" button
    $('#inputsTab').on('click', '#defValUse', function (e) {
        var button = $(this);
        var rowID = "";
        var gNumParam = "";
        var given_name = "";
        var qualifier = "";
        var sType = "";
			[rowID, gNumParam, given_name, qualifier, sType] = getInputVariables(button);
        var value = $(button).attr('defVal');
        var data = [];
        data.push({ name: "id", value: "" });
        data.push({ name: "name", value: value });
        var inputID = null;
        //check database if file is exist, if not exist then insert
        checkInputInsert(data, gNumParam, given_name, qualifier, rowID, sType, inputID);
        button.css("display", "none");
        checkReadytoRun();
    });
    //change on dropDown button
    $(function () {
        $(document).on('change', '#dropDown', function () {
            var button = $(this);
            var value = $(this).val();
            var rowID = "";
            var gNumParam = "";
            var given_name = "";
            var qualifier = "";
            var sType = "";
				[rowID, gNumParam, given_name, qualifier, sType] = getInputVariables(button);
            var proPipeInputID = $('#' + rowID).attr('propipeinputid');
            // if proPipeInputID exist, then first remove proPipeInputID.
            if (proPipeInputID) {
                var removeInput = getValues({ "p": "removeProjectPipelineInput", id: proPipeInputID });
            }
            // insert into project pipeline input table
            if (value && value != "") {
                var data = [];
                data.push({ name: "id", value: "" });
                data.push({ name: "name", value: value });
                var inputID = null;
                checkInputInsert(data, gNumParam, given_name, qualifier, rowID, sType, inputID);
            } else { // remove from project pipeline input table
                var removeInput = getValues({ "p": "removeProjectPipelineInput", id: proPipeInputID });
                removeSelectFile(rowID, qualifier);
            }
            checkReadytoRun();
        });
    });

    $(function () {
        $(document).on('change', '#mRunAmzKey', function () {
            checkReadytoRun();
        })
    });
    $(function () {
        $(document).on('change', '#chooseEnv', function () {
            //reset before autofill feature actived for #runCmd
            $('#runCmd').val("");
            var [allProSett, profileData] = getJobData("both");
            var executor_job = profileData[0].executor_job;
            if (executor_job === 'local' || executor_job === 'ignite') {
                $('#jobSettingsDiv').css('display', 'none');
            } else {
                $('#jobSettingsDiv').css('display', 'inline');
            }
            if ($('#exec_all').is(":checked") === true) {
                $('#exec_all').trigger("click");
            }
            if ($('#exec_each').is(":checked") === true) {
                $('#exec_each').trigger("click");
            }
            fillForm('#allProcessSettTable', 'input', allProSett);
            checkReadytoRun();
        });
    });


    $('#inputFilemodal').on('show.bs.modal', function (e) {
        var button = $(e.relatedTarget);
        $(this).find('form').trigger('reset');
        $('.nav-tabs a[href="#manualTab"]').tab('show');
        var clickedRow = button.closest('tr');
        var rowID = clickedRow[0].id; //#inputTa-3
        var gNumParam = rowID.split('-')[1];

        if (button.attr('id') === 'inputFileSelect') {
            $('#filemodaltitle').html('Select/Add Input File');
            $('#mIdFile').attr('rowID', rowID);
        } else if (button.attr('id') === 'inputFileEdit') {
            $('#filemodaltitle').html('Change Input File');
            $('#mIdFile').attr('rowID', rowID);
            var proPipeInputID = $('#' + rowID).attr('propipeinputid');
            $('#mIdFile').val(proPipeInputID);
            // Get the input id of proPipeInput;
            var proInputGet = getValues({ "p": "getProjectPipelineInputs", "id": proPipeInputID });
            if (proInputGet) {
                var input_id = proInputGet[0].input_id;
                var inputGet = getValues({ "p": "getInputs", "id": input_id })[0];
                if (inputGet) {
                    //insert data into form
                    var formValues = $('#inputFilemodal').find('input');
                    var keys = Object.keys(inputGet);
                    for (var i = 0; i < keys.length; i++) {
                        $(formValues[i]).val(inputGet[keys[i]]);
                    }
                }
            }
        }
    });

    $('#inputFilemodal').on('click', '#savefile', function (e) {
        $('#inputFilemodal').loading({
            message: 'Working...'
        });
        e.preventDefault();
        var savetype = $('#mIdFile').val();
        var checkdata = $('#inputFilemodal').find('.active.tab-pane')[0].getAttribute('id');
        if (!savetype.length) { //add item
            if (checkdata === 'manualTab') {
                var formValues = $('#inputFilemodal').find('input');
                var data = formValues.serializeArray(); // convert form to array
                // check if name is entered
                data[1].value = $.trim(data[1].value);
                if (data[1].value !== '') {
                    saveFileSetValModal(data, 'file', null);
                    $('#inputFilemodal').loading("stop");
                    $('#inputFilemodal').modal('hide');
                }
            } else if (checkdata === 'projectFileTab') {
                var rows_selected = projectFileTable.column(0).checkboxes.selected();
                if (rows_selected.length === 1) {
                    var input_id = rows_selected[0];
                    saveFileSetValModal(null, 'file', input_id);
                }
                $('#inputFilemodal').loading("stop");
                $('#inputFilemodal').modal('hide');
            } else if (checkdata === 'publicFileTab') {
                var rows_selected = publicFileTable.column(0).checkboxes.selected();
                if (rows_selected.length === 1) {
                    var input_id = rows_selected[0];
                    saveFileSetValModal(null, 'file', input_id);
                }
                $('#inputFilemodal').loading("stop");
                $('#inputFilemodal').modal('hide');
            }
        } else { //edit item
            if (checkdata === 'manualTab') {
                var formValues = $('#inputFilemodal').find('input');
                var data = formValues.serializeArray(); // convert form to array
                // check if file_path is entered 
                data[1].value = $.trim(data[1].value);
                if (data[1].value !== '') {
                    editFileSetValModal(data, 'file', null);
                    $('#inputFilemodal').loading("stop");
                    $('#inputFilemodal').modal('hide');
                }
            } else if (checkdata === 'projectFileTab') {
                var rows_selected = projectFileTable.column(0).checkboxes.selected();
                if (rows_selected.length === 1) {
                    var input_id = rows_selected[0];
                    editFileSetValModal(null, 'file', input_id);
                    $('#inputFilemodal').loading("stop");
                    $('#inputFilemodal').modal('hide');
                }
            } else if (checkdata === 'publicFileTab') {
                var rows_selected = publicFileTable.column(0).checkboxes.selected();
                if (rows_selected.length === 1) {
                    var input_id = rows_selected[0];
                    editFileSetValModal(null, 'file', input_id);
                    $('#inputFilemodal').loading("stop");
                    $('#inputFilemodal').modal('hide');
                }
            }
        }
    });

    //clicking on tabs of select files table
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        // header fix of datatabes in add to files/values tab
        $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
        var activatedTab = $(e.target).attr("href")
        if (activatedTab === "#projectFileTab") {
            var projectRows = $('#projectListTable > tbody >');
            // if project is exist click on the first one to show files
            if (projectRows && projectRows.length > 0) {
                $('#projectListTable > tbody > tr > td ').find('[projectid="' + project_id + '"]').trigger("click")
            }
        } else if (activatedTab === "#projectValTab") {
            var projectRows = $('#projectListTableVal > tbody >');
            // if project is exist click on the first one to show files
            if (projectRows && projectRows.length > 0) {
                $('#projectListTableVal > tbody > tr > td ').find('[projectid="' + project_id + '"]').trigger("click")
            }
        } else if (activatedTab === "#publicFileTab") {
            var host = $('#chooseEnv').find(":selected").attr("host");
            if (host != undefined) {
                if (host != "") {
                    $("#publicFileTabWarn").html("")
                    $("#publicFileTable").show();
                    var table_id = "publicFileTable";
                    var ajax = { "host": host, "p": "getPublicFiles" }
                    $('#' + table_id).dataTable().fnDestroy();
                    createFileTable(table_id, ajax);
                }
            } else {
                $("#publicFileTabWarn").html("</br> Please select run environments to see public files.")
                $("#publicFileTable").hide();

            }
        } else if (activatedTab === "#publicValTab") {
            var host = $('#chooseEnv').find(":selected").attr("host");
            if (host != undefined) {
                if (host != "") {
                    $("#publicValTabWarn").html("")
                    $("#publicValTable").show();

                    var table_id = "publicValTable";
                    var ajax = { "host": host, "p": "getPublicValues" }
                    $('#' + table_id).dataTable().fnDestroy();
                    createFileTable(table_id, ajax);
                }
            } else {
                $("#publicValTabWarn").html("</br> Please select run environments to see public files.")
                $("#publicValTable").hide();

            }
        }
    });


    function createFileTable(table_id, ajax) {
        window[table_id] = $('#' + table_id).DataTable({
            scrollY: '42vh',
            "dom": '<"top"i>rt<"pull-left"f><"bottom"p><"clear">',
            "bInfo": false,
            "autoWidth": false,
            "ajax": {
                url: "ajax/ajaxquery.php",
                data: ajax,
                "dataSrc": ""
            },
            "columns": [{
                "width": "25px",
                "data": "input_id",
                "checkboxes": {
                    'targets': 0,
                    'selectRow': true
                }
                }, {
                "data": "name"
                }, {
                "data": "date_modified",
                "width": "130px"
                }],
            'select': {
                'style': 'single'
            },
            'order': [[2, 'desc']]
        });

    }

    function createProjectListTable(table_id) {
        table_id = $('#' + table_id).DataTable({
            scrollY: '42vh',
            "pagingType": "simple",
            "dom": '<"top"i>rt<"pull-left"f><"bottom"p><"clear">',
            "bInfo": false,
            "searching": false,
            "ajax": {
                url: "ajax/ajaxquery.php",
                data: {
                    "p": "getProjects"
                },
                "dataSrc": ""
            },
            "columns": [{
                "data": "name",
                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).html('<a class="clickproject" projectid="' + oData.id + '">' + oData.name + '</a>');
                }
            }],
            'select': {
                'style': 'single'
            }
        });
    }
    //left side project list table on add File/value modals
    createProjectListTable('projectListTable');
    createProjectListTable('projectListTableVal');

    //add file modal projectListTable click on project name
    $('#projectListTable').on('click', 'td', function (e) {
        var sel_project_id = $(this).children().attr("projectid");
        var table_id = "projectFileTable";
        var ajax = { "project_id": sel_project_id, "p": "getProjectFiles" }
        $('#' + table_id).dataTable().fnDestroy();
        createFileTable(table_id, ajax);
    });

    //add val modal projectListTableVal click on project name
    $('#projectListTableVal').on('click', 'td', function (e) {
        var sel_project_id = $(this).children().attr("projectid");
        var table_id = "projectValTable";
        var ajax = { "project_id": sel_project_id, "p": "getProjectValues" }
        $('#' + table_id).dataTable().fnDestroy();
        createFileTable(table_id, ajax);
    });

    $('#inputsTab').on('click', '#inputDelDelete, #inputValDelete', function (e) {
        var clickedRow = $(this).closest('tr');
        var rowID = clickedRow[0].id; //#inputTa-3
        var gNumParam = rowID.split('-')[1];
        var proPipeInputID = $('#' + rowID).attr('propipeinputid');
        var removeInput = getValues({ "p": "removeProjectPipelineInput", id: proPipeInputID });
        var qualifier = $('#' + rowID + ' > :nth-child(4)').text();
        removeSelectFile(rowID, qualifier);
        checkReadytoRun();
    });


    $('#inputValmodal').on('show.bs.modal', function (e) {
        var button = $(e.relatedTarget);
        $(this).find('form').trigger('reset');
        $('.nav-tabs a[href="#manualTabV"]').tab('show');
        var clickedRow = button.closest('tr');
        var rowID = clickedRow[0].id; //#inputTa-3
        var gNumParam = rowID.split('-')[1];
        if (button.attr('id') === 'inputValEnter') {
            $('#valmodaltitle').html('Add Value');
            $('#mIdVal').attr('rowID', rowID);
        } else if (button.attr('id') === 'inputValEdit') {
            $('#valmodaltitle').html('Edit Value');
            $('#mIdVal').attr('rowID', rowID);
            var proPipeInputID = $('#' + rowID).attr('propipeinputid');
            $('#mIdVal').val(proPipeInputID);
            // Get the input id of proPipeInput;
            var proInputGet = getValues({ "p": "getProjectPipelineInputs", "id": proPipeInputID });
            if (proInputGet) {
                var input_id = proInputGet[0].input_id;
                var inputGet = getValues({ "p": "getInputs", "id": input_id })[0];
                if (inputGet) {
                    //insert data into form
                    var formValues = $('#inputValmodal').find('input');
                    var keys = Object.keys(inputGet);
                    for (var i = 0; i < keys.length; i++) {
                        $(formValues[i]).val(inputGet[keys[i]]);
                    }
                }
            }
        }
    });

    $('#inputValmodal').on('click', '#saveValue', function (e) {
        e.preventDefault();
        $('#inputValmodal').loading({
            message: 'Working...'
        });
        var savetype = $('#mIdVal').val();
        var checkdata = $('#inputValmodal').find('.active.tab-pane')[0].getAttribute('id');
        if (!savetype.length) { //add item
            if (checkdata === 'manualTabV') {
                var formValues = $('#inputValmodal').find('input');
                var data = formValues.serializeArray(); // convert form to array
                // check if name is entered
                data[1].value = $.trim(data[1].value);
                if (data[1].value !== '') {
                    saveFileSetValModal(data, 'val', null);
                    $('#inputValmodal').loading("stop");
                    $('#inputValmodal').modal('hide');
                }
            } else if (checkdata === 'projectValTab') {
                var rows_selected = projectValTable.column(0).checkboxes.selected();
                if (rows_selected.length === 1) {
                    var input_id = rows_selected[0];
                    saveFileSetValModal(null, 'val', input_id);
                }
                $('#inputValmodal').loading("stop");
                $('#inputValmodal').modal('hide');
            } else if (checkdata === 'publicValTab') {
                var rows_selected = publicValTable.column(0).checkboxes.selected();
                if (rows_selected.length === 1) {
                    var input_id = rows_selected[0];
                    saveFileSetValModal(null, 'val', input_id);
                }
                $('#inputValmodal').loading("stop");
                $('#inputValmodal').modal('hide');
            }
        } else { //edit item
            if (checkdata === 'manualTabV') {
                var formValues = $('#inputValmodal').find('input');
                var data = formValues.serializeArray(); // convert form to array
                // check if file_path is entered 
                data[1].value = $.trim(data[1].value);
                if (data[1].value !== '') {
                    editFileSetValModal(data, 'val', null);
                    $('#inputValmodal').loading("stop");
                    $('#inputValmodal').modal('hide');
                }
            } else if (checkdata === 'projectValTab') {
                var rows_selected = projectValTable.column(0).checkboxes.selected();
                if (rows_selected.length === 1) {
                    var input_id = rows_selected[0];
                    editFileSetValModal(null, 'val', input_id);
                    $('#inputValmodal').loading("stop");
                    $('#inputValmodal').modal('hide');
                }
            } else if (checkdata === 'publicValTab') {
                var rows_selected = publicValTable.column(0).checkboxes.selected();
                if (rows_selected.length === 1) {
                    var input_id = rows_selected[0];
                    editFileSetValModal(null, 'val', input_id);
                    $('#inputValmodal').loading("stop");
                    $('#inputValmodal').modal('hide');
                }
            }
        }
    });



    $('#confirmModal').on('show.bs.modal', function (e) {
        var button = $(e.relatedTarget);
        if (button.attr('id') === 'deleteRun' || button.attr('id') === 'delRun') {
            $('#confirmModalText').html('Are you sure you want to delete this run?');
        }
    });

    $('#confirmModal').on('click', '#deleteBtn', function (e) {
        e.preventDefault();
        project_pipeline_id = $('#pipeline-title').attr('projectpipelineid');
        $.ajax({
            type: "POST",
            url: "ajax/ajaxquery.php",
            data: {
                id: project_pipeline_id,
                p: "removeProjectPipeline"
            },
            async: true,
            success: function (s) {
                window.location.replace("index.php?np=2&id=" + project_id);
            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
    });
});
