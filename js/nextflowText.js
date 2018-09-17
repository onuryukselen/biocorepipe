//----------------------------------------------------------------
//creates nextflow text. Requires pipelineD3.js or runpipeline.js
//----------------------------------------------------------------
function gFormat(gText) {
    gPatt = /(.*)-(.*)/
    gText = gText.replace(gPatt, '$1_$2')
    return gText
}

function findFinalSubNode(node) {
    if (ccIDList[node]) {
        return findFinalSubNode(ccIDList[node]);
    } else {
        return node
    }
}

function splitEdges(edge) {
    var patt = /(.*)-(.*)-(.*)-(.*)-(.*?)_(.*)-(.*)-(.*)-(.*)-(.*)/
    var first = edge.replace(patt, '$1-$2-$3-$4-$5')
    var sec = edge.replace(patt, '$6-$7-$8-$9-$10')
    return [first, sec]
}
//check if pipeline Module Id is defined as ccID
function checkCopyId(mainEdges) {
    $.each(mainEdges, function (e) {
        //p2_7o-48-2-47-12_p2_7i-51-0-47-8 separate into p2_7o-48-2-47-12 and p2_7i-51-0-47-8 by ungreedy regex
        var firstNode = "";
        var secNode = "";
        [firstNode, secNode] = splitEdges(mainEdges[e]);
        if (ccIDList[firstNode]) {
            mainEdges[e] = findFinalSubNode(firstNode) + "_" + secNode
        }
        if (ccIDList[secNode]) {
            mainEdges[e] = firstNode + "_" + findFinalSubNode(secNode)
        }
    });
}


function checkArraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}



function getMainEdges(pObj) {
    //remove inPro, outPro from edges
    var allEdges = pObj.edges.slice();
    var mainEdges = [];
    for (var e = 0; e < allEdges.length; e++) {
        if (allEdges[e].indexOf("inPro") === -1 && allEdges[e].indexOf("outPro") === -1) { //if not exist -1,
            //swap to make sure, first node is output (for simplification)
            var firstNode = "";
            var secNode = "";
            [firstNode, secNode] = splitEdges(allEdges[e]);
            if (firstNode.match(/i/)) {
                mainEdges.push(secNode + '_' + firstNode);
            } else {
                mainEdges.push(allEdges[e]);
            }
        }
    }
    return mainEdges;
}

function getMergedProcessList() {
    var proList = $.extend(true, {}, window.processList);
    for (var p = 0; p < piGnumList.length; p++) {
        var lastpipeName = window["pObj" + piGnumList[p]].lastPipeName;
        var proListPipe = $.extend(true, {}, window["pObj" + piGnumList[p]].processList);
        for (var key in proListPipe) {
            proListPipe[key] = lastpipeName + "_" + proListPipe[key]
        }
        proList = $.extend({}, proList, proListPipe);
    }
    return proList
}

//merge Edges for each pipelineModule type=main or all
function getMergedEdges(type) {
    var edgesFinal = [];
    if (type === "main") {
        var edges = getMainEdges(window);
        for (var p = 0; p < piGnumList.length; p++) {
            edges = edges.concat(getMainEdges(window["pObj" + piGnumList[p]]));
        }
        //all edges instead of input params in pipeline modules.    
    } else if (type === "all") {
        var edges = window.edges.slice();
        for (var p = 0; p < piGnumList.length; p++) {
            var tmpEdges = window["pObj" + piGnumList[p]].edges.slice();;
            var tmpEdgesFinal = [];
            for (var e = 0; e < tmpEdges.length; e++) {
                if (tmpEdges[e].indexOf("inPro") === -1) { //if not exist -1,
                    tmpEdgesFinal.push(tmpEdges[e]);
                }
            }
            edges = edges.concat(tmpEdgesFinal);
        }

    }
    return edges
}

function sortProcessList(processList, gnumList) {
    //get merged mainEdges for each pipelineModule and window
    var mainEdges = getMergedEdges("main");
    //replace process nodes with ccID's for pipeline modules
    checkCopyId(mainEdges);

    if (gnumList == null) {
        var sortGnum = [];
    } else {
        var sortGnum = gnumList.slice();
    }
    if (mainEdges.length > 0) {
        for (var e = 0; e < mainEdges.length; e++) { //mainEdges.length
            var patt = /(.*)-(.*)-(.*)-(.*)-(.*?)_(.*)-(.*)-(.*)-(.*)-(.*)/;
            var outGnum = '';
            var inGnum = '';

            //for pipeline modules append pipeline id to gnum
            if (mainEdges[e].replace(patt, '$1').match(/p(.*)(i|o)/)) {
                var pipeID = mainEdges[e].replace(patt, '$1').match(/p(.*)(i|o)/)[1];
                var outGnum = mainEdges[e].replace(patt, '$5' + "p" + pipeID);
            } else {
                var outGnum = mainEdges[e].replace(patt, '$5');
            }
            if (mainEdges[e].replace(patt, '$6').match(/p(.*)(i|o)/)) {
                var pipeID = mainEdges[e].replace(patt, '$6').match(/p(.*)(i|o)/)[1];
                var inGnum = mainEdges[e].replace(patt, '$10' + "p" + pipeID);
            } else {
                var inGnum = mainEdges[e].replace(patt, '$10');
            }
            //for first raw insert both values
            //first can be added by push but other should be splice
            if (!sortGnum.includes(outGnum)) {
                //if output of input is exist in the array, insert before it.
                if (sortGnum.includes(inGnum)) {
                    var index = sortGnum.indexOf(inGnum);
                    sortGnum.splice(index, 0, outGnum);
                    var index = sortGnum.indexOf(outGnum);
                } else {
                    sortGnum.push(outGnum);
                    var index = sortGnum.indexOf(outGnum);
                }
            } else {
                //check if the position of outGnum if inGnum is also exist in array
                //cut inGnum and paste to indexOut position
                if (sortGnum.includes(inGnum) && sortGnum.includes(outGnum)) {
                    var indexIn = sortGnum.indexOf(inGnum);
                    var indexOut = sortGnum.indexOf(outGnum);
                    if (indexOut > indexIn) {
                        sortGnum.splice(indexIn, 1);
                        sortGnum.splice(indexOut, 0, inGnum);
                    }
                }
                var index = sortGnum.indexOf(outGnum);
            }
            if (!sortGnum.includes(inGnum)) {
                sortGnum.splice(index + 1, 0, inGnum);
                var index = sortGnum.indexOf(inGnum); //last index after insertion
            } else {
                var index = sortGnum.indexOf(inGnum);
            }
            //stop for final edge
            if (e + 1 < mainEdges.length) {
                for (var k = e + 1; k < mainEdges.length; k++) {
                    var outGnum2 = '';
                    var inGnum2 = '';
                    var outGnum2 = mainEdges[k].replace(patt, '$5');
                    var inGnum2 = mainEdges[k].replace(patt, '$10');
                    if (inGnum === outGnum2) {
                        if (!sortGnum.includes(inGnum2)) {
                            sortGnum.splice(index + 1, 0, inGnum2);
                        }
                    }
                }
            }
        }
    }
    var sortProcessList = [];
    $.each(sortGnum, function (el) {
        //convert 12p67 to g67-12 for pipeline modules
        if (sortGnum[el].match(/.*p.*/)) {
            var pipID = sortGnum[el].match(/(.*)p(.*)/)[2];
            var gID = sortGnum[el].match(/(.*)p(.*)/)[1];
            sortProcessList.push("g" + pipID + "-" + gID);
        } else {
            sortProcessList.push("g-" + sortGnum[el]);
        }
    });

    //add remaining input and output params by using processlist
    for (var key in processList) {
        if (!sortProcessList.includes(key)) {
            sortProcessList.push(key);
        }
    }
    return { processList: sortProcessList, gnumList: sortGnum };
}

// gnum numbers used for process header.  gNum="pipe" is used for pipeline header
function getNewScriptHeader(script_header, process_opt, gNum) {
    var newScriptHeader = "";
    var lines = script_header.split('\n');
    for (var i = 0; i < lines.length; i++) {
        var varName = null;
        // check if process opt is defined in line
        var pattern = /(.*)=(.*)\/\/\*(.*)/;
        var re = new RegExp(pattern);
        var checkParam = lines[i].match(re);
        if (checkParam && checkParam[0] && checkParam[1]) {
            var checkArrFill = false;
            var newLine = "";
            var varName = $.trim(checkParam[1]);
            console.log(varName)
            console.log(gNum)
            console.log(process_opt)
            var oldDefVal = $.trim(checkParam[2]);
            var quoteType = "";
            if (oldDefVal[0] === "'") {
                quoteType = "'";
            } else if (oldDefVal[0] === '"') {
                quoteType = '"';
            }
            //check if varName_indx is defined in eachProcessOpt for form arrays
            //then fill as array format
            var re = new RegExp(varName + "_ind" + "(.*)$", "g");
            var filt_keys = filterKeys(process_opt[gNum], re);
            var num_filt_keys = parseInt(filt_keys.length);
            if (num_filt_keys != 0) {
                var fillValArray = [];
                for (var k = 0; k < num_filt_keys; k++) {
                    fillValArray.push(process_opt[gNum][filt_keys[k]]);
                }
                var fillVal = "[" + quoteType + fillValArray.join(quoteType + "," + quoteType) + quoteType + "]";
                fillVal = fillVal.replace(/(\r\n|\n|\r)/gm, "\\n");
                var newLine = lines[i].replace(pattern, varName + ' = ' + fillVal + ' //*' + '$3' + '\n');
                newScriptHeader += newLine;
                checkArrFill = true;
            }
            //fill original format in not filled as array format
            if (!checkArrFill) {
                if (process_opt[gNum][varName]) {
                    var fillVal = process_opt[gNum][varName];
                    fillVal = fillVal.replace(/(\r\n|\n|\r)/gm, "\\n");
                    var newLine = lines[i].replace(pattern, '$1' + ' = ' + quoteType + fillVal + quoteType + ' //*' + '$3' + '\n');
                    newScriptHeader += newLine;
                } else {
                    newScriptHeader += lines[i] + "\n";
                }
            }
        } else {
            newScriptHeader += lines[i] + "\n";
        }
    }
    return newScriptHeader
}

// in case error occured, use recursiveCounter to stop recursive loop
var recursiveCounter = 0;

function recursiveSort(sortedProcessList, initGnumList) {
    recursiveCounter++;
    var sortResult = {};
    sortResult = sortProcessList(processList, initGnumList);
    if (checkArraysEqual(initGnumList, sortResult.gnumList)) {
        recursiveCounter = 0;
        return { processList: sortResult.processList, gnumList: sortResult.gnumList }
    } else {
        if (recursiveCounter > 50) {
            return { processList: sortResult.processList, gnumList: sortResult.gnumList }
        } else {
            return recursiveSort(sortResult.processList, sortResult.gnumList)
        }
    }
}


function createNextflowFile(nxf_runmode) {
    nextText = "";
    createPiGnumList();
    if (nxf_runmode === "run") {
        var hostname = $('#chooseEnv').find('option:selected').attr('host');
        if (hostname) {
            nextText += '$HOSTNAME = "' + hostname + '"\n';
        }
        var publish_dir_check = $('#publish_dir_check').is(":checked").toString();
        if (publish_dir_check === "true") {
            var output_dir = $('#publish_dir').val();
        } else {
            var output_dir = $('#rOut_dir').val();
        }
        if (output_dir) {
            nextText += "params.outdir = '" + output_dir + "' " + " \n\n";
        }
        var proOptDiv = $('#ProcessPanel').children()[0];
        if (proOptDiv) {
            var process_opt = getProcessOpt();
            process_opt = JSON.parse(decodeURIComponent(process_opt))
        }
        //get all the proPipeInputs to check glob(*,?{,} characters)
        var getProPipeInputs = getValues({ p: "getProjectPipelineInputs", project_pipeline_id: project_pipeline_id });
    } else {
        nextText = "params.outdir = 'results' " + " \n\n";
        var getProPipeInputs = null;
    }

    //pipeline scripts
    var header_pipe_script = "";
    var footer_pipe_script = "";
    [header_pipe_script, footer_pipe_script] = getPipelineScript(pipeline_id);
    if (process_opt != undefined && process_opt != null) {
        if (header_pipe_script.match(/\/\/\*/) && process_opt["pipe"]) {
            header_pipe_script = getNewScriptHeader(header_pipe_script, process_opt, "pipe");
        }
    }
    nextText += header_pipe_script + "\n";

    iniTextSecond = ""
    //sortProcessList
    var initialSort = {};
    var lastSort = {};
    // recursive sorting to sort distant nodes.
    initialSort = sortProcessList(processList, null);
    lastSort = recursiveSort(initialSort.processList, initialSort.gnumList)
    var sortedProcessList = lastSort.processList;
    //initial input data added
    sortedProcessList.forEach(function (key) {
        className = document.getElementById(key).getAttribute("class");
        mainProcessId = className.split("-")[1];
        iniText = InputParameters(mainProcessId, key, getProPipeInputs);
        iniTextSecond = iniTextSecond + iniText.secPart;
        nextText = nextText + iniText.firstPart;
    });

    nextText += "\n" + iniTextSecond + "\n";
    sortedProcessList.forEach(function (key) {
        className = document.getElementById(key).getAttribute("class");
        mainProcessId = className.split("-")[1]
        console.log(key)
        var gNum = key.match(/g(.*)/)[1]; //g7 or g4-3 for pipeline module
        if (gNum[0] === "-"){
            gNum = gNum.substring(1); //eq 7
        }
        if (gNum.match(/-/)){
            gNum = gNum.replace("-","_") //eq 4_3
        }
        console.log(key)
        console.log(gNum)
        if (mainProcessId !== "inPro" && mainProcessId !== "outPro" && !mainProcessId.match(/p.*/)) { //if it is not input parameter print process data
            var body = "";
            var script_header = "";
            var script_footer = "";

            [body, script_header, script_footer] = IOandScriptForNf(mainProcessId, key);
            // add process options after the process script_header to overwite them
            if (nxf_runmode === "run" && process_opt) {
                //check if parameter comment  //* and process_opt[gNum] are exist:
                if (script_header.match(/\/\/\*/) && process_opt[gNum]) {
                    console.log(process_opt[gNum])
                    script_header = getNewScriptHeader(script_header, process_opt, gNum);
                }
            }
            var mergedProcessList = getMergedProcessList();
            proText = script_header + "\nprocess " + mergedProcessList[key].replace(" ","_") + " {\n\n" + publishDir(mainProcessId, key) + body + "\n}\n" + script_footer + "\n"
            nextText += proText;
        }
    });

    var endText = footer_pipe_script + '\nworkflow.onComplete {\n';
    endText += 'println "##Pipeline execution summary##"\n';
    endText += 'println "---------------------------"\n';
    endText += 'println "##Completed at: $workflow.complete"\n';
    endText += 'println "##Duration: ${workflow.duration}"\n';
    endText += 'println "##Success: ${workflow.success ? \'OK\' : \'failed\' }"\n';
    endText += 'println "##Exit status: ${workflow.exitStatus}"\n';
    endText += '}\n';

    return nextText + endText
}


function getChannelNameAll(channelName, Iid) {
    var channelNameAll = "";
    for (var c = 0; c < edges.length; c++) {
        if (edges[c].indexOf(Iid) !== -1) {
            var firstNode = "";
            var secNode = "";
            [firstNode, secNode] = splitEdges(edges[c]);
            if (channelNameAll === "") {
                channelNameAll = channelNameAll + channelName + "_" + gFormat(document.getElementById(secNode).getAttribute("parentG"));
            } else {
                channelNameAll = channelNameAll + "; " + channelName + "_" + gFormat(document.getElementById(secNode).getAttribute("parentG"));
            }

        }
    }
    return channelNameAll
}

//Input parameters and channels with file paths
function InputParameters(id, currgid, getProPipeInputs) {
    IList = d3.select("#" + currgid).selectAll("circle[kind ='input']")[0];
    iText = {};
    firstPart = "";
    secPart = "";
    for (var i = 0; i < IList.length; i++) {
        Iid = IList[i].id
        inputIdSplit = Iid.split("-")
        ProId = inputIdSplit[1]
        userEntryId = "text-" + inputIdSplit[4];

        if (ProId === "inPro" && inputIdSplit[3] !== "inPara") {
            qual = parametersData.filter(function (el) {
                return el.id == inputIdSplit[3]
            })[0].qualifier
            inputParamName = document.getElementById(userEntryId).getAttribute('name')

            for (var e = 0; e < edges.length; e++) {
                if (edges[e].indexOf(Iid) !== -1) { //if not exist: -1
                    var fNode = "";
                    var sNode = "";
                    [fNode, sNode] = splitEdges(edges[e]);
                    inputIdSplit = sNode.split("-")
                    genParName = parametersData.filter(function (el) {
                        return el.id == inputIdSplit[3]
                    })[0].name;
                    var gTxt = document.getElementById(fNode).getAttribute("parentG"); //g-0 
                    var gNumIn = gTxt.replace(/(.*)-(.*)/, '$2'); //6
                    channelName = gFormat(gTxt) + "_" + genParName; //g_0_genome
                    //check if input has glob(*,?{,}) characters
                    var checkRegex = false;
                    if (getProPipeInputs) {
                        var inputName = getProPipeInputs.filter(function (el) {
                            return el.g_num == gNumIn
                        })[0]
                        if (inputName) {
                            checkRegex = /(\{|\*|\?|\})/.test(inputName.name);
                        }
                    }

                    //check proId had a mate inputparameter
                    if (qual === "set") {
                        var sNodeProId = inputIdSplit[1];
                        var inputParAll = getValues({ p: "getInputsPP", "process_id": sNodeProId });
                        var inputParMate = inputParAll.filter(function (el) {
                            return el.sname == "mate"
                        }).length
                    }

                    firstPartTemp = 'if (!params.' + inputParamName + '){params.' + inputParamName + ' = ""} \n'
                    if (qual === "file") {
                        if (checkRegex === false) {
                            secPartTemp = channelName + " = " + "file(params." + inputParamName + ") \n";
                        } else if (checkRegex === true) {
                            secPartTemp = channelName + " = " + "Channel.fromPath(params." + inputParamName + ") \n";
                        }
                        firstPart = firstPart + firstPartTemp
                        secPart = secPart + secPartTemp
                        break
                        //if mate defined in process use fromFilePairs
                    } else if (qual === "set" && inputParMate > 0) {
                        //all processes that are connected to
                        var channelNameAll = "";
                        channelNameAll = getChannelNameAll(channelName, Iid);
                        secPartTemp = "Channel\n\t.fromFilePairs( params." + inputParamName + " , size: (params.mate != \"pair\") ? 1 : 2 )\n\t.ifEmpty { error \"Cannot find any " + genParName + " matching: ${params." + inputParamName + "}\" }\n\t.into { " + channelNameAll + "} \n\n";
                        firstPart = firstPart + firstPartTemp
                        secPart = secPart + secPartTemp
                        break
                    }
                    //if mate not defined in process use fromPath
                    else if (qual === "set" && inputParMate === 0) {
                        //all processes that are connected to
                        var channelNameAll = "";
                        channelNameAll = getChannelNameAll(channelName, Iid);
                        secPartTemp = channelNameAll + " = " + "Channel.fromPath(params." + inputParamName + ").toSortedList() \n"
                        firstPart = firstPart + firstPartTemp
                        secPart = secPart + secPartTemp
                        break
                    } else if (qual === "val") {
                        secPartTemp = channelName + " = " + "params." + inputParamName + "\n"
                        firstPart = firstPart + firstPartTemp
                        secPart = secPart + secPartTemp
                        break
                    }

                }
            }
        }
    }
    iText.firstPart = firstPart
    iText.secPart = secPart

    return iText
}

function getParamOutdir(outParUserEntry) {
    return '"' + outParUserEntry + '/$filename"';
    // "paired/$filename"
}

//if name contains regular expression with curly brackets: {a,b,c} then turn into (a|b|c) format
function fixCurlyBrackets(outputName) {
    if (outputName.match(/(.*){(.*?),(.*?)}(.*)/)) {
        var patt = /(.*){(.*?),(.*?)}(.*)/;
        var insideBrackets = outputName.replace(patt, '$2' + "," + '$3');
        insideBrackets = insideBrackets.replace(/\,/g, '|')
        var outputNameFix = outputName.replace(patt, '$1' + "(" + insideBrackets + ")" + '$4');
        if (outputNameFix.match(/(.*){(.*?),(.*?)}(.*)/)) {
            return fixCurlyBrackets(outputNameFix);
        } else {
            return outputNameFix;
        }
    } else {
        return outputName;
    }
}

//
function getPublishDirRegex(outputName) {
    //eg. set val(name), file("${params.wdir}/validfastq/*.fastq") then take inside of the file(x)
    if (outputName.match(/file\((.*)\)/)) {
        var outputName = outputName.match(/file\((.*)\)/)[1];
    }
    //if name contains path and separated by '/' then replace with escape character '\/'
    outputName = outputName.replace(/\//g, '\\\/')
    //if name contains regular expression with curly brackets: {a,b,c} then turn into (a|b|c) format
    var outputName = fixCurlyBrackets(outputName);
    outputName = outputName.replace(/\*/g, '.*')
    outputName = outputName.replace(/\?/g, '.?')
    outputName = outputName.replace(/\'/g, '')
    outputName = outputName.replace(/\"/g, '')
    outputName = outputName + "$";
    return outputName;
}

function publishDir(id, currgid) {
    oText = ""
    var closePar = false
    oList = d3.select("#" + currgid).selectAll("circle[kind ='output']")[0]
    var mainPipeEdges = edges.slice();
    //replace process nodes with ccID's for pipeline modules
    checkCopyId(mainPipeEdges);
    for (var i = 0; i < oList.length; i++) {
        oId = oList[i].id
        for (var e = 0; e < mainPipeEdges.length; e++) {
            if (mainPipeEdges[e].indexOf(oId) > -1) {
                var fNode = "";
                var sNode = "";
                [fNode, sNode] = splitEdges(mainPipeEdges[e]);
                //publishDir Section
                if (fNode.split("-")[1] === "outPro" && closePar === false) {
                    closePar = true
                    //outPro node : get userEntryId and userEntryText
                    var parId = fNode.split("-")[4]
                    var userEntryId = "text-" + fNode.split("-")[4]
                    outParUserEntry = document.getElementById(userEntryId).getAttribute('name');
                    reg_ex = document.getElementById(oId).getAttribute("reg_ex");
                    if (reg_ex !== "" && reg_ex !== null) {
                        reg_ex = decodeHtml(reg_ex);
                        if (reg_ex.length > 0) {
                            var lastLetter = reg_ex.length - 1;
                            if (reg_ex[0] === "\/" && reg_ex[lastLetter] === "\/") {
                                outputName = reg_ex;
                            } else {
                                outputName = "\/" + reg_ex + "\/";
                            }
                        }

                    } else {
                        outputName = document.getElementById(oId).getAttribute("name")
                        outputName = "/" + getPublishDirRegex(outputName) + "/";
                    }
                    oText = "publishDir params.outdir, mode: 'copy',\n\tsaveAs: {filename ->\n"
                    tempText = "\tif \(filename =~ " + outputName + "\) " + getParamOutdir(outParUserEntry) + "\n"
                    // if (filename =~ /^path.8.fastq$/) filename
                    oText = oText + tempText
                } else if (fNode.split("-")[1] === "outPro" && closePar === true) {
                    reg_ex = document.getElementById(oId).getAttribute("reg_ex");
                    if (reg_ex !== "" && reg_ex !== null) {
                        reg_ex = decodeHtml(reg_ex);
                        if (reg_ex.length > 0) {
                            var lastLetter = reg_ex.length - 1;
                            if (reg_ex[0] === "\/" && reg_ex[lastLetter] === "\/") {
                                outputName = reg_ex;
                            } else {
                                outputName = "\/" + reg_ex + "\/";
                            }
                        }
                    } else {
                        outputName = document.getElementById(oId).getAttribute("name")
                        outputName = "/" + getPublishDirRegex(outputName) + "/";
                    }
                    var parId = fNode.split("-")[4]
                    var userEntryId = "text-" + fNode.split("-")[4]
                    outParUserEntry = document.getElementById(userEntryId).getAttribute('name');
                    tempText = "\telse if \(filename =~ " + outputName + "\) " + getParamOutdir(outParUserEntry) + "\n"
                    oText = oText + tempText

                }
            }
        }
    }
    if (closePar === true) {
        oText = oText + "}\n\n";
        if (outputName === '' && reg_ex === "") {
            oText = "publishDir \"${params.outdir}/" + outParUserEntry + "\", mode: 'copy'\n\n";
        }
        closePar = false
    }

    return oText
}

function getPipelineScript(pipeline_id) {
    var pipelineData = getValues({ p: "loadPipeline", "id": pipeline_id });
    if (pipelineData[0] && pipelineData[0].script_pipe_header !== null) {
        var script_pipe_header = decodeHtml(pipelineData[0].script_pipe_header);
    } else {
        var script_pipe_header = "";
    }
    if (pipelineData[0] && pipelineData[0].script_pipe_footer !== null) {
        var script_pipe_footer = decodeHtml(pipelineData[0].script_pipe_footer);
    } else {
        var script_pipe_footer = "";
    }
    return [script_pipe_header, script_pipe_footer]
}

function IOandScriptForNf(id, currgid) {
    //get mainEdges for each pipelineModule
    var allEdges = getMergedEdges("all");
    //replace process nodes with ccID's for pipeline modules
    checkCopyId(allEdges);
    var processData = getValues({ p: "getProcessData", "process_id": id });
    script = decodeHtml(processData[0].script);
    if (processData[0].script_header !== null) {
        var script_header = decodeHtml(processData[0].script_header);
    } else {
        var script_header = "";
    }
    if (processData[0].script_footer !== null) {
        var script_footer = decodeHtml(processData[0].script_footer);
    } else {
        var script_footer = "";
    }
    var lastLetter = script.length - 1;
    if (script[0] === '"' && script[lastLetter] === '"') {
        script = script.substring(1, script.length - 1); //remove first and last duble quote
    }
    //insert """ for script if not exist
    if (script.search('"""') === -1 && script.search('\'\'\'') === -1) {
        script = '"""\n' + script + '\n"""'
    }

    bodyInput = ""
    bodyOutput = ""
    IList = d3.select("#" + currgid).selectAll("circle[kind ='input']")[0]
    OList = d3.select("#" + currgid).selectAll("circle[kind ='output']")[0]
    for (var i = 0; i < IList.length; i++) {
        if (bodyInput == "") {
            bodyInput = "input:\n"
        }
        Iid = IList[i].id //i-11-0-9-0
        var inputIdSplit = Iid.split("-")
        var qual = parametersData.filter(function (el) {
            return el.id == inputIdSplit[3]
        })[0].qualifier

        var inputName = document.getElementById(Iid).getAttribute("name");
        var inputClosure = document.getElementById(Iid).getAttribute("closure");
        var inputOperator = document.getElementById(Iid).getAttribute("operator");
        inputClosure = decodeHtml(inputClosure);
        var inputOperatorText = '';
        if (inputOperator === 'mode flatten') {
            inputOperatorText = ' ' + inputOperator + inputClosure;
        } else if (inputOperator !== '') {
            if (inputClosure !== '') {
                inputOperatorText = '.' + inputOperator + inputClosure;
            } else if (inputClosure === '') {
                inputOperatorText = '.' + inputOperator + "()";
            }
        }
        find = false
        for (var e = 0; e < allEdges.length; e++) {
            if (allEdges[e].indexOf(Iid) > -1) { //if not exist: -1
                find = true
                var fNode = "";
                var sNode = "";
                [fNode, sNode] = splitEdges(allEdges[e]);
                //output node clicked first
                if (fNode.indexOf('o') > -1) {
                    var inputIdSplit = fNode.split("-")
                    var genParName = parametersData.filter(function (el) { return el.id == inputIdSplit[3] })[0].name;
                    var qualNode = parametersData.filter(function (el) { return el.id == inputIdSplit[3] })[0].qualifier;

                    if (qualNode === 'set') {
                        var channelName = gFormat(document.getElementById(fNode).getAttribute("parentG")) + "_" + genParName + "_" + gFormat(document.getElementById(sNode).getAttribute("parentG"));
                    } else {
                        var channelName = gFormat(document.getElementById(fNode).getAttribute("parentG")) + "_" + genParName;
                    }

                } else {
                    var inputIdSplit = sNode.split("-");
                    var genParName = parametersData.filter(function (el) { return el.id == inputIdSplit[3] })[0].name;
                    var qualNode = parametersData.filter(function (el) { return el.id == inputIdSplit[3] })[0].qualifier;
                    if (qualNode === 'set') {
                        var channelName = gFormat(document.getElementById(sNode).getAttribute("parentG")) + "_" + genParName + "_" + gFormat(document.getElementById(fNode).getAttribute("parentG"));
                    } else {
                        var channelName = gFormat(document.getElementById(sNode).getAttribute("parentG")) + "_" + genParName;
                    }
                }
                bodyInput = bodyInput + " " + qual + " " + inputName + " from " + channelName + inputOperatorText + "\n";
            }
        }
        if (find == false) {
            bodyInput = bodyInput + " " + qual + " " + inputName + " from " + "param" + "\n"
        }
    }

    for (var o = 0; o < OList.length; o++) {
        if (bodyOutput == "") {
            bodyOutput = "output:\n"
        }
        Oid = OList[o].id
        outputIdSplit = Oid.split("-")
        qual = parametersData.filter(function (el) {
            return el.id == outputIdSplit[3]
        })[0].qualifier
        outputName = document.getElementById(Oid).getAttribute("name");
        var outputClosure = document.getElementById(Oid).getAttribute("closure");
        var outputOperator = document.getElementById(Oid).getAttribute("operator");
        outputClosure = decodeHtml(outputClosure);
        var outputOperatorText = '';
        if (outputOperator === 'mode flatten') {
            outputOperatorText = ' ' + outputOperator + outputClosure;
        } else if (outputOperator !== '') {
            if (outputClosure !== '') {
                outputOperatorText = '.' + outputOperator + outputClosure;
            } else if (outputClosure === '') {
                outputOperatorText = '.' + outputOperator + "()";
            }
        }
        genParName = parametersData.filter(function (el) {
            return el.id == outputIdSplit[3]
        })[0].name
        channelName = gFormat(document.getElementById(Oid).getAttribute("parentG")) + "_" + genParName;

        //find all edges emerges from this output
        if (qual === "set") {
            var channelNameAll = "";
            for (var c = 0; c < allEdges.length; c++) {
                if (allEdges[c].indexOf(Oid) == 0) {
                    var fNode = "";
                    var secNode = "";
                    [fNode, secNode] = splitEdges(allEdges[c]);
                    var secProType = secNode.split("-")[1];
                    if (secProType !== "outPro") {
                        if (channelNameAll === "") {
                            channelNameAll = channelNameAll + channelName + "_" + gFormat(document.getElementById(secNode).getAttribute("parentG"));
                        } else {
                            channelNameAll = channelNameAll + ", " + channelName + "_" + gFormat(document.getElementById(secNode).getAttribute("parentG"));
                        }
                    }

                } else if (allEdges[c].indexOf(Oid) > 0) {
                    var fstNode = "";
                    var secNode = "";
                    [fstNode, secNode] = splitEdges(allEdges[c]);
                    var fstProType = fstNode.split("-")[1];
                    if (fstProType !== "outPro") {
                        if (channelNameAll === "") {
                            channelNameAll = channelNameAll + channelName + "_" + gFormat(document.getElementById(fstNode).getAttribute("parentG"));
                        } else {
                            channelNameAll = channelNameAll + ", " + channelName + "_" + gFormat(document.getElementById(fstNode).getAttribute("parentG"));
                        }
                    }
                }
            }
            // if output node is not connected to input node.
            if (channelNameAll === '') {
                channelNameAll = channelName;
            }
        } else if (qual !== "set") {
            channelNameAll = channelName;
        }
        bodyOutput = bodyOutput + " " + qual + " " + outputName + " into " + channelNameAll + outputOperatorText + "\n"

    }
    body = bodyInput + "\n" + bodyOutput + "\n" + script
    return [body, script_header, script_footer]
}
