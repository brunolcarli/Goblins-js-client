function send_login_request(){
    var user = document.getElementById("username_input").value
    var pwd = document.getElementById("password_input").value

    login_mutation(user, pwd);

    if (localStorage.getItem('logged') == true){
        window.location.href = "../pages/game.html";
    }
}
