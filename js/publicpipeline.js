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


//	  function drop(event) {
//	      event.preventDefault();
//	      var processDat = event.dataTransfer.getData("Text");
//	      var posX = 0;
//	      var posY = 0;
//
//
//	      var svgA = document.getElementById("svg")
//	      var pt = svgA.createSVGPoint();
//	      pt.x = event.clientX
//	      pt.y = event.clientY
//	      var svgGlobal = pt.matrixTransform(svgA.getScreenCTM().inverse())
//	      posX = svgGlobal.x - 50
//	      posY = svgGlobal.y - 70
//	      addProcess(processDat, posX, posY);
//	      autosave();
//	      event.stopPropagation();
//	      return false;
//	  }

	  //	  function getValues(data) {
	  //	      var result = null;
	  //	      $.ajax({
	  //	          url: "ajax/ajaxquery.php",
	  //	          data: data,
	  //	          async: false,
	  //	          cache: false,
	  //	          success: function (data) {
	  //	              result = data;
	  //	          }
	  //	      });
	  //	      return result;
	  //	  }

	  refreshDataset()

	  function refreshDataset() {
	      processData = getValues({
	          p: "getProcessData"
	      })
	      savedData = getValues({
	          p: "getSavedPipelines"
	      })
	      parametersData = getValues({
	          p: "getAllParameters"
	      })

	  }
	  var sData = "";
	  var svg = "";
	  var mainG = "";

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

	      //	      $('#' + 'pipeline-' + pipeID).remove();
	      //	      $('#pipeline-title').val('');
	      //	      $('#pipeline-title').attr('pipelineid', '');
	      //	      createSVG();
	      //	      resizeForText.call($inputText, $inputText.attr('placeholder'));
	      //          $('#creatorInfoPip').css('display', "none");
	      //          $('#pipelineSum').val('');

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
	              gN = key.split("-")[1]
	              loadPipeline(x, y, pId, name, gN)
	          }

	          ed = sData[0].edges
	          ed = JSON.parse(ed.replace(/'/gi, "\""))["edges"]
	          for (var ee = 0; ee < ed.length; ee++) {
	              eds = ed[ee].split("_")
	              addCandidates2DictForLoad(eds[0])
	              createEdges(eds[0], eds[1])
	          }
	      }
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
	      //d3.select("#startArea").attr("width", 2*(r+ior)* d3.event.scale).attr("height",2*(r+ior)* d3.event.scale)
	  }



	  //kind=input/output
	  function drawParam(name, process_id, id, kind, sDataX, sDataY, paramid, pName, classtoparam, init, pColor) {
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
	  }

	  function insertRowTable(rowType, firGnum, secGnum, paramGivenName, paraIdentifier, paraFileType, paraQualifier, processName) {
	      return '<tr id=' + rowType + 'Ta-' + firGnum + '><td id="' + rowType + '-PName-' + firGnum + '" scope="row">' + paramGivenName + '</td><td>' + paraIdentifier + '</td><td>' + paraFileType + '</td><td>' + paraQualifier + '</td><td> <span id="proGName-' + secGnum + '">' + processName + '</span></td></tr>'
	  }

	  function insertProRowTable(process_id, procName, procDesc, procRev) {
	      return '<tr id=procTa-' + process_id + '><td scope="row">' + procName + '</td><td>' + procRev + '</td><td>' + procDesc + '</td></tr>'
	  }

	  //--Pipeline details table --
	  function addProPipeTab(id) {
	      var procData = processData.filter(function (el) { return el.id == id });
	      var procName = procData[0].name;
	      var procDesc = truncateName(procData[0].summary, 'processTable');
	      var procRev = procData[0].rev_id;
	      var proRow = insertProRowTable(id, procName, procDesc, procRev);
	      var rowExistPro = '';
	      var rowExistPro = document.getElementById('procTa-' + id);
	      if (!rowExistPro) {
	          $('#processTable > tbody:last-child').append(proRow);
	      }
	  }

	  function removeProPipeTab(id) {
	      var proExist = '';
	      var proExist = $(".g-" + id)[1];
	      //there should be at least 2 process before delete, otherwise delete
	      if (!proExist) {
	          $('#procTa-' + id).remove();
	      }
	  }

	  function addProcess(processDat, xpos, ypos) {
	      t = d3.transform(d3.select('#' + "mainG").attr("transform")),
	          x = (xpos - t.translate[0])
	      y = (ypos - t.translate[1])
	      z = t.scale[0]


	      //var process_id = processData[index].id;

	      //for input parameters:  
	      if (processDat === "inputparam@inPro") {
	          var name = processDat.split('@')[0]
	          var process_id = processDat.split('@')[1]
	          var id = process_id
	          ipR = 70 / 2
	          ipIor = ipR / 3
	          var kind = "input"
	          var sDataX = (5 + x + ipR + ipIor) / z
	          var sDataY = (20 + y + ipR + ipIor) / z
	          var pName = pName || "inputparam"
	          var paramId = paramId || "inPara"
	          var classtoparam = classtoparam || "connect_to_input output"
	          var init = "o"
	          var pColor = "orange"

	          drawParam(name, process_id, id, kind, sDataX, sDataY, paramId, pName, classtoparam, init, pColor)
	          processList[("g-" + gNum)] = name
	          gNum = gNum + 1
	      }
	      //for output parameters:  
	      else if (processDat === "outputparam@outPro") {
	          var name = processDat.split('@')[0]
	          var process_id = processDat.split('@')[1]
	          var id = process_id
	          ipR = 70 / 2
	          ipIor = ipR / 3
	          var kind = "output"
	          var sDataX = (5 + x + ipR + ipIor) / z
	          var sDataY = (20 + y + ipR + ipIor) / z
	          var pName = pName || "outputparam"
	          var paramId = paramId || "outPara"
	          var classtoparam = classtoparam || "connect_to_output input"
	          var init = "i"
	          var pColor = "green"
	          drawParam(name, process_id, id, kind, sDataX, sDataY, paramId, pName, classtoparam, init, pColor)

	          processList[("g-" + gNum)] = name
	          gNum = gNum + 1
	      }

	      //for processes:
	      else {
	          var name = processDat.split('@')[0]
	          var process_id = processDat.split('@')[1]
	          var id = process_id

	          //--Pipeline details table add process--
	          addProPipeTab(id)

	          var inputs = getValues({
	              p: "getInputsPP",
	              "process_id": process_id
	          })

	          var outputs = getValues({
	              p: "getOutputsPP",
	              "process_id": process_id
	          })
	          //gnum uniqe, id same id (Written in class) in same type process
	          g = d3.select("#mainG").append("g")
	              .attr("id", "g-" + gNum)
	              .attr("class", "g-" + id)
	              .attr("transform", "translate(" + (-30 + x + r + ior) / z + "," + (-10 + y + r + ior) / z + ")")

	              .on("mouseover", mouseOverG)
	              .on("mouseout", mouseOutG)
	          //gnum(written in id): uniqe, id(Written in class): same id in same type process, bc(written in type): same at all bc
	          g.append("circle").attr("id", "bc-" + gNum)
	              .attr("class", "bc-" + id)
	              .attr("type", "bc")
	              .attr("cx", cx)
	              .attr("cy", cy)
	              .attr("r", r + ior)
	              //  .attr('fill-opacity', 0.6)
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
	              .on("mouseover", scMouseOver)
	              .on("mouseout", scMouseOut)
	              .call(drag)
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
	              .on("mouseover", scMouseOver)
	              .on("mouseout", scMouseOut)
	              .call(drag)

	          g.append("text").attr("id", "text-" + gNum)
	              .datum([{
	                  cx: 0,
	                  cy: 0
                }])
	              .attr('font-family', "FontAwesome, sans-serif")
	              .attr('font-size', '0.9em')
	              .attr("x", -6)
	              .attr("y", 15)
	              .text('\uf040')
	              .on("mousedown", rename)

	          //gnum(written in id): uniqe,
	          g.append("text")
	              .attr("id", "del-" + gNum)
	              .attr('font-family', "FontAwesome, sans-serif")
	              .attr('font-size', '1em')
	              .attr("x", -6)
	              .attr("y", r + ior / 2)
	              .text('\uf014')
	              .style("opacity", 0.2)
	              .on("mousedown", removeElement)

	          g.append("text")
	              .attr("id", "info-" + gNum)
	              .attr("class", "info-" + id)
	              .attr('font-family', "FontAwesome, sans-serif")
	              .attr('font-size', '1em')
	              .attr("x", -6)
	              .attr("y", -1 * (r + ior / 2 - 10))
	              .text('\uf013')
	              .style("opacity", 0.2)
	              .on("mousedown", getInfo)

	          // I/O id naming:[0]i = input,o = output -[1]process database ID -[2]The number of I/O of the selected process -[3]Parameter database ID- [4]uniqe number
	          for (var k = 0; k < inputs.length; k++) {
	              d3.select("#g-" + gNum).append("circle")
	                  .attr("id", "i-" + (id) + "-" + k + "-" + inputs[k].parameter_id + "-" + gNum)
	                  .attr("type", "I/O")
	                  .attr("kind", "input")
	                  .attr("parentG", "g-" + gNum)
	                  .attr("name", inputs[k].sname)
	                  .attr("status", "standard")
	                  .attr("connect", "single")
	                  .attr("class", findType(inputs[k].parameter_id) + " input")
	                  .attr("cx", calculatePos(inputs.length, k, "cx", "inputs"))
	                  .attr("cy", calculatePos(inputs.length, k, "cy", "inputs"))
	                  .attr("r", ior)
	                  .attr("fill", "tomato")
	                  .attr('fill-opacity', 0.8)
	                  .on("mouseover", IOmouseOver)
	                  .on("mousemove", IOmouseMove)
	                  .on("mouseout", IOmouseOut)
	                  .on("mousedown", IOconnect)
	          }
	          for (var k = 0; k < outputs.length; k++) {
	              d3.select("#g-" + gNum).append("circle")
	                  .attr("id", "o-" + (id) + "-" + k + "-" + outputs[k].parameter_id + "-" + gNum)
	                  .attr("type", "I/O")
	                  .attr("kind", "output")
	                  .attr("parentG", "g-" + gNum)
	                  .attr("name", outputs[k].sname)
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
	                  .on("mousedown", IOconnect)
	          }
	          processList[("g-" + gNum)] = name
	          gNum = gNum + 1
	      }

	  }

	  function findType(id) {
	      parameter = parametersData.filter(function (el) {
	          return el.id == id
	      })
	      return parameter[0].file_type
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
	              removeProPipeTab(proID)
	          }
	          //--delete pipeline details ends

	          d3.select("#" + g).remove()
	          delete processList[g]
	          removeLines(g)
	          //	          cancelRemove()
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
	              //	              d3.select("#" + lineid).remove()
	              //	              edges.splice(edges.indexOf("lineid"), 1);
	              //	              removeDelCircle(lineid)
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
	              //	              d3.selectAll("." + className[0]).filter("." + cand).attr("status", "candidate")
	              var paraID = document.getElementById(this.id).id.split("-")[3]
	              var paraData = parametersData.filter(function (el) {
	                  return el.id == paraID
	              })
	              var paraFileType = paraData[0].file_type
	              tooltip.html('Input parameter<br/>File Type: <em>' + paraFileType + '</em>')
	          } else if (givenNamePP === 'outputparam') {
	              //Since outputparam is connected, it is not allowed to connect more parameters
	              //              d3.selectAll("." + className[0]).filter("." + cand).attr("status", "candidate")
	              var paraID = document.getElementById(this.id).id.split("-")[3]
	              var paraData = parametersData.filter(function (el) {
	                  return el.id == paraID
	              })
	              var paraFileType = paraData[0].file_type
	              tooltip.html('Output parameter<br/>File Type: <em>' + paraFileType + '</em>')
	          } else {
	              //	              d3.selectAll("." + className[0]).filter("." + cand).attr("status", "candidate")
	              var givenNamePP = document.getElementById(this.id).getAttribute("name")
	              var paraID = document.getElementById(this.id).id.split("-")[3]
	              var paraData = parametersData.filter(function (el) {
	                  return el.id == paraID
	              })
	              var paraFileType = paraData[0].file_type
	              var paraQualifier = paraData[0].qualifier
	              var paraName = paraData[0].name
	              tooltip.html('Identifier: <em>' + paraName + '</em><br/>Name: <em>' + givenNamePP + '</em><br/>File Type: <em>' + paraFileType + '</em><br/>Qualifier: <em>' + paraQualifier + '</em>')
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

	  function updateSecClassName(second, inputParamLocF) {
	      if (inputParamLocF === 0) {
	          var candi = "output"
	      } else {
	          var candi = "input"
	      }
	      secClassName = document.getElementById(second).className.baseVal.split("-")[0].split(" ")[0] + " " + candi
	      return secClassName
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
	          var procData = processData.filter(function (el) { return el.id == secProI });
	          var paraFileType = paraData[0].file_type;
	          var paraQualifier = paraData[0].qualifier;
	          var paraIdentifier = paraData[0].name;
	          //var processName = procData[0].name;
	          var processName = $('#text-' + secGnum).attr('name');

	          //var givenNamePP = document.getElementById(second).getAttribute("name")
	          var rowExist = ''
	          rowExist = document.getElementById(rowType + 'Ta-' + firGnum);
	          if (rowExist) {
	              var preProcess = '';
	              $('#' + rowType + 'Ta-' + firGnum + '> :last-child').append('<span id=proGcomma-' + secGnum + '>, </span>');
	              $('#' + rowType + 'Ta-' + firGnum + '> :last-child').append('<span id=proGName-' + secGnum + '>' + processName + '</span>');
	          } else {
	              var inRow = insertRowTable(rowType, firGnum, secGnum, paramGivenName, paraIdentifier, paraFileType, paraQualifier, processName);
	              $('#' + rowType + 'sTable > tbody:last-child').append(inRow);
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

	      //	      d3.select("#mainG").append("g")
	      //	          .attr("id", "c--" + fClick + "_" + sClick)
	      //	          .attr("transform", "translate(" + (candidates[fClickOrigin][0] + candidates[sClick][0]) / 2 + "," + (candidates[fClickOrigin][1] + candidates[sClick][1]) / 2 + ")")
	      //	          .attr("g_from", candidates[fClickOrigin][2])
	      //	          .attr("g_to", candidates[sClick][2])
	      //	          .attr("IO_from", fClick)
	      //	          .attr("IO_to", sClick)
	      //	          .on("mousedown", removeElement)
	      //	          .on("mouseover", delMouseOver)
	      //	          .on("mouseout", delMouseOut)
	      //	          .append("circle")
	      //	          .attr("id", "delc--" + fClick + "_" + sClick)
	      //	          .attr("class", "del")
	      //	          .attr("cx", 0)
	      //	          .attr("cy", 0)
	      //	          .attr("r", ior)
	      //	          .attr("fill", "#E0E0E0")
	      //	          .attr('fill-opacity', 0.4)

	      //	      d3.select("#c--" + fClick + "_" + sClick)
	      //	          .append("text")
	      //	          .attr("id", "del--" + fClick + "_" + sClick)
	      //	          .attr('font-family', "FontAwesome, sans-serif")
	      //	          .attr('font-size', '1em')
	      //	          .attr("x", -5)
	      //	          .attr("y", 5)
	      //	          .text('\uf014')
	      //	          .style("opacity", 0.4)

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
	      //	      cancelRemove()
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

	  function truncateName(name, type) {
	      if (type === 'inOut') {
	          var letterLimit = 7;
	      } else if (type === 'process') {
	          var letterLimit = 12;
	      } else if (type === 'processTable') {
	          var letterLimit = 300;
	      }
	      if (name.length > letterLimit)
	          return name.substring(0, letterLimit) + '..';
	      else
	          return name;
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

	          //	          d3.select("#container").append('div')
	          //	              .attr('id', 'removeElement')
	          //	              .style('position', 'absolute')
	          //	              .style('top', 0)
	          //	              .style('left', 0)
	          //	              .style("width", bodyW + "px")
	          //	              .style("height", bodyH + "px")
	          //	              .style("background-color", "gray")
	          //	              .style("opacity", 0.8)
	          //	              .on("mousedown", cancelRemove)
	          //
	          //	          d3.select("#container").append('div')
	          //	              .attr('id', 'removeElementCont')
	          //	              .style('position', 'absolute')
	          //	              .style('top', 100 + "px")
	          //	              .style('left', 300 + "px")
	          //	              .style("width", "500px")
	          //	              .style("height", "200px")
	          //	              .style("background-color", "white")
	          //	              .style("opacity", 1)
	          //
	          //	          d3.select("#removeElementCont").append("div")
	          //	              .attr("id", "removeTextCont")
	          //	              .attr("class", "col-md-12")
	          //	              .append("div")
	          //	              .attr("class", "col-md-3")
	          //
	          //	          d3.select("#removeTextCont").append("div")
	          //	              .attr("class", "col-md-6")
	          //	              .style("margin-top", "40px")
	          //	              .style("text-align", "center")
	          //	              .append("text")
	          //	              .attr("id", "warning")
	          //	              .text("Are you sure you want to delete?")
	          //
	          //	          d3.select("#removeTextCont").append("div")
	          //	              .attr("id", "removeButtonContainer")
	          //	              .attr("class", "col-md-12")
	          //	              .append("div")
	          //	              .attr("class", "col-md-6")
	          //	              .append("button")
	          //	              .attr("class", "form-control btn-info")
	          //	              .attr("onclick", "cancelRemove()")
	          //	              .style("margin-top", "40px")
	          //	              .text("No")
	          //	          if (deleteID.split("_").length == 2) {
	          //	              d3.select("#removeButtonContainer")
	          //	                  .append("div")
	          //	                  .attr("class", "col-md-6")
	          //	                  .append("button")
	          //	                  .attr("class", "form-control btn-success")
	          //	                  .attr("onclick", "removeEdge()")
	          //	                  .style("margin-top", "40px")
	          //	                  .text("Yes")
	          //	          } else if (deleteID.split("_").length == 1) {
	          //	              d3.select("#removeButtonContainer")
	          //	                  .append("div")
	          //	                  .attr("class", "col-md-6")
	          //	                  .append("button")
	          //	                  .attr("class", "form-control btn-success")
	          //	                  .attr("onclick", "remove()")
	          //	                  .style("margin-top", "40px")
	          //	                  .text("Yes")
	          //	          }
	      }
	  }

	  //	  function cancelRemove() {
	  //	      d3.select("#removeElement").remove()
	  //	      d3.select("#removeElementCont").remove()
	  //
	  //	  }

	  //	  function cancelRename() {
	  //	      d3.select("#renameContainer").remove()
	  //	      d3.select("#rename").remove()
	  //
	  //	  }
	  //nextflow variable must not contain "-", replaced by "_"
	  function gFormat(gText) {
	      gPatt = /(.*)-(.*)/
	      gText = gText.replace(gPatt, '$1_$2')
	      return gText
	  }

//	  function createNextflowFile() {
//	      nextText = "params.outdir = 'results' " + " \n\n"
//	      iniTextSecond = ""
//	      //initial input data added
//	      for (var key in processList) {
//	          className = document.getElementById(key).getAttribute("class");
//	          mainProcessId = className.split("-")[1]
//	          iniText = InputParameters(mainProcessId, key)
//	          iniTextSecond = iniTextSecond + iniText.secPart
//	          nextText = nextText + iniText.firstPart
//	      }
//	      nextText = nextText + "\n" + iniTextSecond + "\n"
//
//	      for (var key in processList) {
//	          className = document.getElementById(key).getAttribute("class");
//	          mainProcessId = className.split("-")[1]
//	          if (mainProcessId !== "inPro" && mainProcessId !== "outPro") { //if it is not input parameter print process data
//	              proText = "process " + processList[key] + " {\n\n" + OutputParameters(mainProcessId, key) + IOandScriptForNf(mainProcessId, key) + "\n\n}" + "\n\n"
//	              nextText = nextText + proText
//	          }
//	      }
//	      return nextText
//	  }

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
	      if (script.search('"""') === -1) {
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

	  function resetPos() {
	      d3.select("#mainG").attr("transform", "translate(0,0)scale(1)")
	  }

	  function refreshCreatorData(pipeline_id) {
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
	              $('#ownUserNamePip').text(s[0].username);
	              $('#datecreatedPip').text(s[0].date_created);
	              $('.lasteditedPip').text(s[0].date_modified);

	          },
	          error: function (errorThrown) {
	              alert("Error: " + errorThrown);
	          }
	      });

	  }



	  function loadPipeline(sDataX, sDataY, sDatapId, sDataName, gN) {
	      t = d3.transform(d3.select('#' + "mainG").attr("transform")),
	          x = t.translate[0]
	      y = t.translate[1]
	      z = t.scale[0]

	      gNum = parseInt(gN)
	      var name = sDataName
	      var name = sDataName
	      var id = sDatapId
	      var process_id = id

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
	                  pName = parametersData.filter(function (el) {
	                      return el.id == paramId
	                  })[0].name
	                  break
	              }
	          }

	          drawParam(name, process_id, id, kind, sDataX, sDataY, paramId, pName, classtoparam, init, pColor)
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
	          drawParam(name, process_id, id, kind, sDataX, sDataY, paramId, pName, classtoparam, init, pColor)
	          processList[("g-" + gNum)] = name
	          gNum = gNum + 1

	      } else {
	          addProPipeTab(id)


	          //--Pipeline details table ends---

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
	          //	              .on("mouseover", mouseOverG)
	          //	              .on("mouseout", mouseOutG)
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
	          //	              .on("mouseover", scMouseOver)
	          //	              .on("mouseout", scMouseOut)
	          //	              .call(drag)
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
	          //	              .on("mouseover", scMouseOver)
	          //	              .on("mouseout", scMouseOut)
	          //	              .call(drag)

	          // I/O id naming:[0]i = input,o = output -[1]process database ID -[2]The number of I/O of the selected process -[3]Parameter database ID- [4]uniqe number
	          for (var k = 0; k < inputs.length; k++) {
	              d3.select("#g-" + gNum).append("circle")
	                  .attr("id", "i-" + (id) + "-" + k + "-" + inputs[k].parameter_id + "-" + gNum)
	                  .attr("type", "I/O")
	                  .attr("kind", "input")
	                  .attr("parentG", "g-" + gNum)
	                  .attr("name", inputs[k].sname)
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
                  if (s[0]){
                  $('#pipeline-title').text(s[0].name);
	              $('#pipelineSum').val(s[0].summary);
	              $('#creatorInfoPip').css('display', "block");
	              $('#ownUserNamePip').text(s[0].username);
	              $('#datecreatedPip').text(s[0].date_created);
	              $('.lasteditedPip').text(s[0].date_modified);
	              openPipeline(pipeline_id);
	              $('#pipelineSum').attr('disabled', "disabled");
                      
                  }
	              

	          },
	          error: function (errorThrown) {
	              alert("Error: " + errorThrown);
	          }
	      });
	  };



	  $(document).ready(function () {
	      var pipeline_id = $('#pipeline-title').attr('pipelineid');
	      if (pipeline_id !== '') {
	          loadPipelineDetails(pipeline_id);
	      }





	  });