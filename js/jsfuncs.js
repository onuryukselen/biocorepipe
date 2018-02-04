var SELECT = 4; // 1
var EDIT = 2; // 10
var REMOVE = 1; // 100

function getTableButtons(name, buttons) {
    //ser <- 9f 
    var selectButton = '';
    var editButton = '';
    var removeButton = '';


    if (buttons.toString(2) & SELECT) {
        selectButton = '<div style="display: inline-flex"><button type="button" class="btn btn-primary btn-sm" title="Select" id="' + name + 'select">Select</button> &nbsp; '
    }
    if (buttons.toString(2) & EDIT) {
        editButton = '<div style="display: inline-flex"><button type="button" class="btn btn-primary btn-sm" title="Edit" id="' + name + 'edit" data-toggle="modal" data-target="#' + name + 'modal">Edit</button> &nbsp;'
    }
    if (buttons.toString(2) & REMOVE) {
        removeButton = '<button type="button" class="btn btn-primary btn-sm" title="Remove" id="' + name + 'remove">Remove</button></div>'
    }

    return selectButton + editButton + removeButton
}
// eg. name:run buttons:select
function getButtonsModal(name, buttons) {
    var buttonId = buttons.split(' ')[0];
    var button = '<button type="button" class="btn btn-primary btn-sm" title="' + buttons + '" id="' + name + buttonId + '" data-toggle="modal" data-target="#' + name + 'modal">' + buttons + '</button> &nbsp;';
    return button;
}
//Default type of buttons
function getButtonsDef(name, buttons) {
    var buttonId = buttons.split(' ')[0];
    var button = '<button type="submit" class="btn btn-primary btn-sm" title="' + buttons + '" id="' + name + buttonId + '">' + buttons + '</button> &nbsp;';
    return button;
}


function getIconButtonModal(name, buttons, icon) {
    var buttonId = buttons.split(' ')[0];
    var button = '<button type="submit" style="padding:0px;" class="btn" title="' + buttons + '" id="' + name + buttonId + '" data-toggle="modal" data-target="#' + name + 'modal"><a data-toggle="tooltip" data-placement="bottom" data-original-title="' + name + '"><i class="' + icon + '" style="font-size: 17px;"></i></a></button>';
    return button;
}

function getIconButton(name, buttons, icon) {
    var buttonId = buttons.split(' ')[0];
    var button = '<button type="submit" style="padding:0px;" class="btn" title="' + buttons + '" id="' + name + buttonId + '"><a data-toggle="tooltip" data-placement="bottom" data-original-title="' + name + '"><i class="' + icon + '" style="font-size: 17px;"></i></a></button>';
    return button;
}



//SideBar menu Search Function
//$('#tags').on('keyup',function(e){
$('.main-sidebar').on('keyup', '#tags', function (e) {
    var tagElems = $('#autocompletes1').children()
    $(tagElems).hide()
    for (var i = 0; i < tagElems.length; i++) {
        var tagElems2 = $(tagElems).eq(i).children().eq(1).children()

        $(tagElems2).hide()
        $(tagElems).eq(i).closest('li').children('ul.treeview-menu').hide()
        for (var j = 0; j < tagElems2.length; j++) {
            if (($(tagElems2).eq(j).text().toLowerCase()).indexOf($(this).val().toLowerCase()) === 0) {
                $(tagElems).eq(i).show()
                if ($(this).val().toLowerCase() !== "") {
                    $(tagElems).eq(i).closest('li').addClass('menu-open')
                    $(tagElems).eq(i).closest('li').children('ul.treeview-menu').show()
                } else {
                    $(tagElems).eq(i).closest('li').removeClass('menu-open')
                    $(tagElems).show()

                }

                $(tagElems2).eq(j).show()
            }
        }
    }
    $('#inputs').show();
    $('#outputs').show();
    $('.header').show();
    $('#Pipelines').show();

});


//checklogin
var loginSuccess = false;
var userProfile = checkLogin();

function checkLogin() {
    var userLog = [];
    var userPro = [];
    userLog.push({ name: "p", value: 'checkLogin' });
    $.ajax({
        type: "POST",
        data: userLog,
        url: "ajax/ajaxquery.php",
        async: false,
        success: function (msg) {
            if (msg.error == 1) {
                loginSuccess = false;
            } else {
                userPro = msg;
                loginSuccess = true;
            }

        }
    });
    return userPro;
};

if (loginSuccess === true && userProfile !== '') {
    var imgUrl = userProfile[0].google_image;
    var userName = userProfile[0].name;
    $('#googleSignIn').css('display', "none");
    $('#userAvatar').css('display', "inline");
    $('#userInfo').css('display', "inline");
    $('#userAvatarImg').attr('src', imgUrl);
    $('#userName').text(userName);
} else {
    $('#googleSignIn').css('display', "inline");
    $('#userAvatar').css('display', "none");
    $('#userInfo').css('display', "none");
}
// google sign-in
function Google_signIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.disconnect();

    var userProfile = [];
    var profile = googleUser.getBasicProfile();
    var emailUser = profile.getEmail();
    var pattEmail = /(.*)@(.*)/; //Map_Tophat2@11
    var username = emailUser.replace(pattEmail, '$1');
    userProfile.push({ name: "google_id", value: profile.getId() });
    userProfile.push({ name: "name", value: profile.getName() });
    userProfile.push({ name: "email", value: profile.getEmail() });
    userProfile.push({ name: "google_image", value: profile.getImageUrl() });
    userProfile.push({ name: "username", value: username });
    userProfile.push({ name: "p", value: 'saveUser' });
    update_user_data(userProfile);
}

function update_user_data(userProfile) {
    $.ajax({
        type: "POST",
        data: userProfile,
        url: "ajax/login.php",
        async: false,
        success: function (msg) {
            if (msg.error == 1) {
                alert('Something Went Wrong!');
            } else {
                var logInSuccess = true;
                window.location.reload('true');

            }

        }
    });
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    var userLog = [];
    userLog.push({ name: "p", value: 'logOutUser' });
    auth2.signOut().then(function () {

        $.ajax({
            type: "POST",
            data: userLog,
            url: "ajax/login.php",
            async: false,
            success: function (msg) {
                if (msg.logOut == 1) {
                    var logInSuccess = false;
                    window.location.reload('true');


                }
            }
        });
    });
}

//use changeVal to trigger change event after using val()
$.fn.changeVal = function (v) {
    return $(this).val(v).trigger("change");
}

//Adjustable textwidth
var $inputText = $('input.width-dynamic');
// Resize based on text if text.length > 0
// Otherwise resize based on the placeholder

$("input.width-dynamic").on("change", function () {
    var namePip = $('input.width-dynamic').val();
    resizeForText.call($inputText, namePip);
});

function resizeForText(text) {
    var $this = $(this);
    if (!text.trim()) {
        text = $this.attr('placeholder').trim();
    }
    var $span = $this.parent().find('span.width-dynamic');
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

function truncateName(name, type) {
    if (type === 'inOut') {
        var letterLimit = 7;
    } else if (type === 'process') {
        var letterLimit = 12;
    } else if (type === 'newTable') {
        var letterLimit = 120;
    } else if (type === 'processTable') {
        var letterLimit = 300;
    }
    if (name.length > letterLimit)
        return name.substring(0, letterLimit) + '..';
    else
        return name;
}

$('.collapseIcon').on('click', function (e) {
    var textClass = $(this).attr('class');
    if (textClass.includes('fa-plus-square-o')) {
        $(this).removeClass('fa-plus-square-o');
        $(this).addClass('fa-minus-square-o');
    } else if (textClass.includes('fa-minus-square-o')) {
        $(this).removeClass('fa-minus-square-o');
        $(this).addClass('fa-plus-square-o');
    }

});


// fills the from with the object data. find is comma separated string: 'input, p'
//eg.  fillForm('#execNextSettTable','input', exec_next_settings);
 
function fillForm(formId, find, data) {
    var formValues = $(formId).find(find);

    var keys = Object.keys(data);
    for (var i = 0; i < keys.length; i++) {
        $(formValues[i]).val(data[keys[i]]);
    console.log(data);
    console.log(keys[i]);
    console.log(data[keys[i]]);
        
    }
}



$(function() {
	$("#feedback-tab").click(function() {
		$("#feedback-form").toggle("slide right");
	});

	$("#feedback-form form").on('submit', function(event) {
		var $form = $(this);
        var data = $form.serializeArray();
        data.push({name:"p" , value:"savefeedback"}) 
        console.log(data);
		$.ajax({
			type: "POST",
			url: "ajax/ajaxquery.php",
			data: data,
			success: function() {
				$("#feedback-form").toggle("slide right").find("textarea").val('');
			}
		});
		event.preventDefault();
	});
});












