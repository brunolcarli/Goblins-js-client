function send_login_request(){
    var user = document.getElementById("username_input").value
    var pwd = document.getElementById("password_input").value

    login_mutation(user, pwd);

    if (localStorage.getItem('logged') == true){
        window.location.href = "../pages/character.html";
    }
}


function send_logout_request(){
    let token = localStorage.getItem('token');
    let char_name = localStorage.getItem('char_name');
    let input_data = `{characterName: \\\"${char_name}\\\"}`;
    character_logout_mutation(input_data, `JWT ${token}`);
    logout_mutation(user);
}

function sign_up(){
    let newUsername = localStorage.getElementById("newUserName").value;
    let newUserPass = localStorage.getElementById("newUserPass").value;
    let newUserEmail = localStorage.getElementById("newUserEmail").value;

    new_user_sign_up(newUsername, newUserPass, newUserEmail);

    if (localStorage.getItem('logged') == true){
        window.location.href = "../pages/character.html";
    }
}