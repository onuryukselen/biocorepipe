$(document).ready(function () {

    //Make modal draggable    
//    $('.modal-dialog').draggable();
//    $('#editordiv').draggable("disable")

    //Add Process Modal
    $('#addProcessModal').on('show.bs.modal', function () {
        $(this).find('form').trigger('reset');
        //   $('#mioProcess').val(selProcessID);
        
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
                var firstOptionGroup = new Option("--- Select Process Group ---", -1);
                $("#mProcessGroup").append(firstOptionGroup);

                for (var i = 0; i < s.length; i++) {
                    var param = s[i];
                    var optionGroup = new Option(param.group_name, param.id);
                    $("#mProcessGroup").append(optionGroup);
                }

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
                var firstOptionIn = new Option("--- Add Input ---", -1);
                var firstOptionOut = new Option("--- Add Output ---", -1);
                $("#mInputs-1").append(firstOptionIn);
                $("#mOutputs-1").append(firstOptionOut);

                for (var i = 0; i < s.length; i++) {
                    var param = s[i];
                    var optionIn = new Option(param.name, param.id);
                    var optionOut = new Option(param.name, param.id);
                    $("#mInputs-1").append(optionIn);
                    $("#mOutputs-1").append(optionOut);

                }
                dropDownInputs = $("#mInputs-1").html()
                dropDownOutputs = $("#mOutputs-1").html()
                numInputs = 1;
                numOutputs = 1;

            },
            error: function (errorThrown) {
                alert("Error: " + errorThrown);
            }
        });
    });

    //insert dropdown, textbox and remove button for each parameters
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
                $("#" + col1init + "-" + String(idRows - 1) + " option[value='-1']").remove();
                $("#" + col1init).append('<select id="' + col1init + '-' + idRows + '" num="' + idRows + '" class="fbtn btn-default form-control" prev ="-1"  name="' + col1init + '-' + idRows + '"></select>');
                $("#" + col2init).append('<input type="text" placeholder="Enter name" class="form-control" id="' + col2init + '-' + String(idRows - 1) + '" name="' + col2init + '-' + String(idRows - 1) + '">');
                $("#" + col3init).append('<button type="submit" class="btn btn-default form-control delRow" id="' + col3init + '-' + String(idRows - 1) + '" name="' + col3init + '-' + String(idRows - 1) + '"><i class="glyphicon glyphicon-remove"></i></button>');

                $("#" + col1init + "-" + idRows).append(eval('dropDown' + type + 'puts'));
                $("#" + id).attr("prev", selParId)
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
        $("#" + col1init + "-" + String(num)).remove()
        $("#" + col2init + "-" + String(num)).remove()
        $("#" + col3init + "-" + String(num)).remove()


    });




    // Add process modal to database
        $('#addProcessModal').on('click', '#saveprocess', function (event) {
            event.preventDefault();
            var formValues = $('#addProcessModal').find('input, select');
            //type = $('#mioType').val();
            data = formValues.serializeArray(); // convert form to array
            
            //dataToProcess to save in process table
            var dataToProcess={};
            //id name version process_group_id taken from data object
            for (var i = 0; i < 4; i++) {
            dataToProcess[i] = data[i]; 
            console.log(dataToProcess);
            }
            
            dataToProcess.push({name: "p", value: "saveProcess"});
            
            
            
            
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
            
            
//            $.ajax({
//                type: "POST",
//                url: "ajax/ajaxquery.php",
//                data: data,
//                async: true,
//                success: function (s) {
//                    var addData = {};
//                    var keys = inputTable.settings().init().columns;
//                    for (var i = 0; i < keys.length; i++) {
//    
//                        var key = keys[i].data;
//                        if (key === 'id') {
//                            addData[key] = s.id;
//                        } else if (key !== null) {
//                            addData[key] = $(formValues[i]).val();
//                        }
//                    }
//    
//                    if (type === 'input') {
//                        inputTable.row.add(addData).draw();
//                    } else {
//                        outputTable.row.add(addData).draw();
//                    }
//    
//                    $('#pinoutmodal').modal('hide');
//    
//                },
//                error: function (errorThrown) {
//                    alert("Error: " + errorThrown);
//                }
//            });
        });




});