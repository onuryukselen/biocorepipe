$(document).ready(function () {
    var getProjectD = [];
    var project_id = $('#pipeline-title').attr('projectid');
    getProjectD.push({ name: "id", value: project_id });
    getProjectD.push({ name: "p", value: 'getProjects' });
    $.ajax({
        type: "POST",
        url: "ajax/ajaxquery.php",
        data: getProjectD,
        async: true,
        success: function (s) {
            $('#pipeline-title').val(s[0].name);
            $('#ownUserName').text(s[0].username);
            $('#datecreatedPj').text(s[0].date_created);
            $('#lasteditedPj').text(s[0].date_modified);
        resizeForText.call($inputText, s[0].name);
            
            console.log(s);
        },
        error: function (errorThrown) {
            alert("Error: " + errorThrown);
        }
    });



});