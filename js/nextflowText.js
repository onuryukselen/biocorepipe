//creates nextflow text. Requires pipelineD3.js or runpipeline.js
function gFormat(gText) {
	      gPatt = /(.*)-(.*)/
	      gText = gText.replace(gPatt, '$1_$2')
	      return gText
	  }

function createNextflowFile() {
	      nextText = "params.outdir = 'results' " + " \n\n"
	      iniTextSecond = ""
	      //initial input data added
	      for (var key in processList) {
	          className = document.getElementById(key).getAttribute("class");
	          mainProcessId = className.split("-")[1]
	          iniText = InputParameters(mainProcessId, key)
	          iniTextSecond = iniTextSecond + iniText.secPart
	          nextText = nextText + iniText.firstPart
	      }
	      nextText = nextText + "\n" + iniTextSecond + "\n"

	      for (var key in processList) {
	          className = document.getElementById(key).getAttribute("class");
	          mainProcessId = className.split("-")[1]
	          if (mainProcessId !== "inPro" && mainProcessId !== "outPro") { //if it is not input parameter print process data
	              proText = "process " + processList[key] + " {\n\n" + OutputParameters(mainProcessId, key) + IOandScriptForNf(mainProcessId, key) + "\n\n}" + "\n\n"
	              nextText = nextText + proText
	          }
	      }
	      return nextText
	  }


//Input parameters and channels with file paths
	  function InputParameters(id, currgid) {
	      IList = d3.select("#" + currgid).selectAll("circle[kind ='input']")[0]
	      iText = {};
	      firstPart = "";
	      secPart = "";

	      for (var i = 0; i < IList.length; i++) {
	          Iid = IList[i].id
	          inputIdSplit = Iid.split("-")
	          ProId = inputIdSplit[1]
	          userEntryId = "text-" + inputIdSplit[4]

	          if (ProId === "inPro" && inputIdSplit[3] !== "inPara") {
	              qual = parametersData.filter(function (el) {
	                  return el.id == inputIdSplit[3]
	              })[0].qualifier
	              //filePath = parametersData.filter(function (el) {return el.id == inputIdSplit[3]})[0].file_path
	              inputParamName = document.getElementById(userEntryId).getAttribute('name') //input parameter name

	              for (var e = 0; e < edges.length; e++) {
	                  if (edges[e].indexOf(Iid) !== -1) { //if not exist -1, if at first position 0, if at second pos. 12
	                      nodes = edges[e].split("_")
	                      //edgeLocF = nodes[0].indexOf("o-inPro") //-1: inputparam not exist //0: first click is done on inputparam
	                      fNode = nodes[0]
	                      sNode = nodes[1]
	                      inputIdSplit = sNode.split("-")
	                      genParName = parametersData.filter(function (el) {
	                          return el.id == inputIdSplit[3]
	                      })[0].name
	                      channelName = gFormat(document.getElementById(fNode).getAttribute("parentG")) + "_" + genParName //g-0-genome



	                      if (qual === "file") {
	                          firstPartTemp = "params." + inputParamName + " =\"\" \n"
	                          secPartTemp = channelName + " = " + "file(params." + inputParamName + ") \n"
	                          firstPart = firstPart + firstPartTemp
	                          secPart = secPart + secPartTemp
	                          break
	                      } else if (qual === "set") {
	                          firstPartTemp = "params." + inputParamName + " =\"\" \n"
	                          secPartTemp = "Channel\n\t.fromFilePairs( params." + inputParamName + " , size: (params.mate != \"pair\") ? 1 : 2 )\n\t.ifEmpty { error \"Cannot find any " + genParName + " matching: ${params." + inputParamName + "}\" }\n\t.set { " + channelName + "} \n\n"
	                          firstPart = firstPart + firstPartTemp
	                          secPart = secPart + secPartTemp
	                          break
	                      } else if (qual === "val") {
	                          firstPartTemp = "params." + inputParamName + " =\"\" \n"
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


function OutputParameters(id, currgid) {
	      oText = ""
	      var closePar = false
	      oList = d3.select("#" + currgid).selectAll("circle[kind ='output']")[0]
	      for (var i = 0; i < oList.length; i++) { //search through each output node
	          oId = oList[i].id
	          for (var e = 0; e < edges.length; e++) {
	              if (edges[e].indexOf(oId) !== -1) { //if not exist -1, if at first position 0, if at second pos. 12
	                  nodes = edges[e].split("_")
	                  //edgeLocF = nodes[0].indexOf("i-inPro") //-1: inputparam not exist //0: first click is done on inputparam
	                  fNode = nodes[0] //outPro node : get userEntryId and userEntryText and parameterID
	                  sNode = nodes[1] //connected node

	                  if (fNode.split("-")[1] === "outPro" && closePar === false) {
	                      closePar = true
	                      oText = "publishDir params.outdir, mode: 'copy',\n\tsaveAs: {filename ->\n"

	                      outputName = document.getElementById(oId).getAttribute("name")
	                      outputName = outputName.replace(/\*/g, '')
	                      outputName = outputName.replace(/\?/g, '')
	                      outputName = outputName.replace(/\'/g, '')
	                      outputName = outputName.replace(/\"/g, '')
	                      //outPro node : get userEntryId and userEntryText
	                      parId = fNode.split("-")[4]
	                      userEntryId = "text-" + fNode.split("-")[4]
	                      outputParamName = document.getElementById(userEntryId).getAttribute('name') //user entered output parameter name
	                      parFile = parametersData.filter(function (el) {
	                          return el.id == fNode.split("-")[3]
	                      })[0].file_type
	                      tempText = "\tif \(filename =~ /" + outputName + "/\) filename\n"
	                      // if (filename =~ /^path.8.fastq$/) filename 
	                      oText = oText + tempText
	                      //break
	                  } else if (fNode.split("-")[1] === "outPro" && closePar === true) {
	                      outputName = document.getElementById(oId).getAttribute("name")
	                      outputName = outputName.replace(/\*/g, '')
	                      outputName = outputName.replace(/\?/g, '')
	                      outputName = outputName.replace(/\'/g, '')
	                      outputName = outputName.replace(/\"/g, '')

	                      parFile = parametersData.filter(function (el) {
	                          return el.id == fNode.split("-")[3]
	                      })[0].file_type

	                      tempText = "\telse if \(filename =~ /" + outputName + "/\) filename\n"
	                      oText = oText + tempText

	                  }
	              }
	          }
	      }
	      if (closePar === true) {
	          oText = oText + "}\n\n"
	          closePar = false
	      }
	      return oText
	  }

	  function IOandScriptForNf(id, currgid) {
	      var processData = getValues({
	          p: "getProcessData",
	          "process_id": id
	      })
	      script = processData[0].script
	      var lastLetter = script.length - 1;
	      if (script[0] === '"' && script[lastLetter] === '"') {
	          script = script.substring(1, script.length - 1); //remove first and last duble quote
	      }
          //insert """ for script if not exist
          if (script.search('"""') === -1){
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
	          inputIdSplit = Iid.split("-")
	          qual = parametersData.filter(function (el) {
	              return el.id == inputIdSplit[3]
	          })[0].qualifier
	          inputName = document.getElementById(Iid).getAttribute("name")
	          find = false
	          for (var e = 0; e < edges.length; e++) {
	              if (edges[e].indexOf(Iid) > -1) { //if not exist -1, if at first position 0, if at second pos. 12
	                  find = true
	                  nodes = edges[e].split("_")
	                  //edgeLocF = nodes[0].indexOf("o-inPro") //-1: inputparam not exist //0: first click is done on inputparam
	                  fNode = nodes[0]
	                  sNode = nodes[1]


	                  if (nodes[0][0] == o) {

	                      inputIdSplit = sNode.split("-")
	                      genParName = parametersData.filter(function (el) {
	                          return el.id == inputIdSplit[3]
	                      })[0].name
	                      channelName = gFormat(document.getElementById(sNode).getAttribute("parentG")) + "_" + genParName //g-0-genome
	                  } else {
	                      inputIdSplit = fNode.split("-")

	                      genParName = parametersData.filter(function (el) {
	                          return el.id == inputIdSplit[3]
	                      })[0].name
	                      channelName = gFormat(document.getElementById(fNode).getAttribute("parentG")) + "_" + genParName //g-0-genome
	                  }
	                  if (qual === "file") {
	                      bodyInput = bodyInput + " " + qual + " " + inputName + " from " + channelName + "\n"
	                  } else if (qual === "set") {
	                      bodyInput = bodyInput + " " + qual + " " + inputName + " from " + channelName + "\n"
	                  } else if (qual === "val") {
	                      bodyInput = bodyInput + " " + qual + " " + inputName + " from " + channelName + "\n"
	                  }
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
	          outputName = document.getElementById(Oid).getAttribute("name")
	          genParName = parametersData.filter(function (el) {
	              return el.id == outputIdSplit[3]
	          })[0].name
	          channelName = gFormat(document.getElementById(Oid).getAttribute("parentG")) + "_" + genParName

	          if (qual === "file") {
	              bodyOutput = bodyOutput + " " + qual + " " + outputName + " into " + channelName + "\n"
	          } else if (qual === "set") {
	              bodyOutput = bodyOutput + " " + qual + " " + outputName + " into " + channelName + "\n"
	          }

	      }
	      body = bodyInput + "\n" + bodyOutput + "\n" + script
	      return body
	  }