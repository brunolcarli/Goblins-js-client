function send_login_request(){
    var user = document.getElementById("username_input").value
    var pwd = document.getElementById("password_input").value

    login_mutation(user, pwd);

    if (localStorage.getItem('logged') == true){
        window.location.href = "../pages/character.html";
    }
}


function send_logout_request(){
    // var user = document.getElementById("username_input").value;
    console.log(user);
    logout_mutation(user);

}
