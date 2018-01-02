var SELECT = 4; // 0001
var EDIT = 2; // 010
var REMOVE = 1; // 100

function getTableButtons(name, buttons) {
//ser <- 9f 
    var selectButton = ''
    var editButton  = ''
    var removeButton = ''
    if ( buttons.toString(2) & SELECT) {
      selectButton = '<div style="display: inline-flex"><button type="button" class="btn btn-primary btn-sm" title="Select" id="'+name+'select">Select</button> &nbsp; '
    }
    if ( buttons.toString(2) & EDIT) {
      editButton = '<div style="display: inline-flex"><button type="button" class="btn btn-primary btn-sm" title="Edit" id="'+name+'edit" data-toggle="modal" data-target="#'+name+'modal">Edit</button> &nbsp;'
    }
    if ( buttons.toString(2) & REMOVE) {
      removeButton = '<button type="button" class="btn btn-primary btn-sm" title="Remove" id="'+name+'remove">Remove</button></div>'
    }
    return selectButton + editButton + removeButton
}


//SideBar menu Search Function
//$('#tags').on('keyup',function(e){
$('.main-sidebar').on('keyup', '#tags', function(e){
    var tagElems = $('#autocompletes1').children()
      $(tagElems).hide()
      for(var i = 0; i < tagElems.length; i++){
          var tagElems2 = $(tagElems).eq(i).children().eq(1).children()
          
             $(tagElems2).hide()
             $(tagElems).eq(i).closest('li').children('ul.treeview-menu').hide()
             for(var j = 0; j < tagElems2.length; j++){              
                if(($(tagElems2).eq(j).text().toLowerCase()).indexOf($(this).val().toLowerCase()) === 0){
                    $(tagElems).eq(i).show()
                    if ($(this).val().toLowerCase() !== "") {
                        $(tagElems).eq(i).closest('li').addClass('menu-open')
                        $(tagElems).eq(i).closest('li').children('ul.treeview-menu').show()
                    }else{
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