
function handle_action(player, input) {
    var commands = {
        "move": move
    }
    var cmd = input.split(" ")[0];
    var param = input.split(" ")[1];
    if (cmd in commands) {
        commands[cmd](player, param)
    }
}

function handle_combat(player, input){
    console.log("Not implemented");
}

function handle_say(player, input){
    console.log("Not implemented");
}


function command(){
    var command_input = document.getElementById('command_input').value;
    var handlers = {
        "/": handle_action,
        ">": handle_combat,
        "+": handle_say
    }
    var prefix = command_input[0];
    var user = localStorage.getItem('user');

    if (prefix in handlers){
        handlers[prefix](user, command_input.replace(prefix, ""));
    }
}