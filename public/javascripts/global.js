// Userlist data array for filling in info box
var userListData = [];

$(document).ready(function() {
    populateTable();

    $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

    $('#btnAddUser').on('click', addUser);

    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

    $('#btnAddDefs').on('click', addDefinitions)
});

function populateTable() {
    var tableContent = '';
    $.getJSON( '/users/userlist', data => {
        userListData = data;
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });
        $('#userList table tbody').html(tableContent);
    });
};

function showUserInfo(event) {
    event.preventDefault();
    var thisUserName = $(this).attr('rel');
    var arrayPosition = userListData.map(arrayItem => arrayItem.username).indexOf(thisUserName);
    var thisUserObject = userListData[arrayPosition];

    $('#userInfoName').text(thisUserObject.fullname);
    $('#userInfoAge').text(thisUserObject.age);
    $('#userInfoGender').text(thisUserObject.gender);
    $('#userInfoLocation').text(thisUserObject.location);
};

function addUser(event) {
    event.preventDefault();

    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    if (errorCount === 0) {
        var newUser = {
            'username': $('#addUser fieldset input#inputUserName').val(),
            'email': $('#addUser fieldset input#inputUserEmail').val(),
            'fullname': $('#addUser fieldset input#inputUserFullname').val(),
            'age': $('#addUser fieldset input#inputUserAge').val(),
            'location': $('#addUser fieldset input#inputUserLocation').val(),
            'gender': $('#addUser fieldset input#inputUserGender').val()
        }

        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function(response) {
            if (response.msg === '') {
                $('#addUser fieldset input').val('');
                populateTable();
            }
            else {
                alert(`Error: ${response.msg}`);
            }
        });
    }
    else {
        alert('Please fill in all fields');
        return false;
    }
};

function deleteUser() {
    event.preventDefault();
    var confirmation = confirm('Are you sure you want to delete this user?');
    if (confirmation === true) {
        $.ajax({
            type: 'DELETE',
            url: `/users/deleteuser/${$(this).attr('rel')}`
        }).done(function(response) {
            if (response.msg === '') { }
            else {
                alert(`Error: ${resopnse.msg}`);
            }
            populateTable();
        });
    }
    else {
        return false;
    }
};

function addDefinitions() {
  event.preventDefault();
  
  var input = $('fieldset textarea#inputDefinitions').val();
  
  if(input === '') {
    alert("c'mon, I know you've got something to enter...");
    return false;
  }

  var today = new Date();
  var foo = input.split(/\r?\n/);

  foo.forEach(function(element) {
    var defn = element.split(':');
    var newdef = {
      'term': defn[0], 
      'definition': defn[1],
      'userid': 'insert id here',
      'date': `${today.getDate()}:${today.getMonth()}:${today.getFullYear()}`
    };

    $.ajax({
      type: 'POST',
      data: newdef,
      url: 'users/adddefinitions',
      dataType: 'JSON'
    }).done(function(response) {
      if (response.msg === '') {
        $('fieldset textarea').val('');
      }
      else {
        alert(`houston, we have a problem...\n${response.msg}`);
      }
    });  
  });
};