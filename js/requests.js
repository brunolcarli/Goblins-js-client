// const server_host = 'http://localhost:11000/graphql/';
const server_host = "http://104.237.1.145:11000/graphql/";


function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
};


function json(response) {
    return response.json()
};


function query_entities(){
    /*
    Request the entities (elements, objects, players, etc) currently
    active on the game. Receives a json containing logged users and
    their position on the map.
        - Params: None
        - Return: Object
    */
    var token = localStorage.getItem('token');
    var headers = {
        "cookie": "csrftoken=9YXcKsPnJSojmIXsjvqlM7TFP0tBfiU8GwVopYDWNKHSQnEUKLnPzJdsCjSb0Cfn",
        "Content-Type": "application/json",
        "Authorization": `JWT ${token}`
    };
    return fetch(server_host, {
        "method": "POST",
        "headers": headers,
        "body": "{\"query\":\"query{\\n  entities(logged:true){\\n    name\\n    logged\\n    location{\\n      x\\n      y\\n    }\\n  }\\n}\\n\"}"
    })
    .then(json)
    .then(data => {
        return data['data']['entities'];
    })
        .catch(err => {
            console.error(err);
    });
};


function login_mutation(username, password){
    /*
    Request a sign in to the game server. Receives a token to be used
    as session validation on backend requests.
        - Params:
            + username: string;
            + password: string
        - Return: null / undefined
    */
    return fetch(server_host, {
        "method": "POST",
        "headers": {
            "cookie": "csrftoken=9YXcKsPnJSojmIXsjvqlM7TFP0tBfiU8GwVopYDWNKHSQnEUKLnPzJdsCjSb0Cfn",
            "Content-Type": "application/json",
        },
        "body": `
        {\"query\":\"mutation{\\n  logIn(input: {username: \\\"${username}\\\" password: \\\"${password}\\\"}){\\n    token\\n  }\\n}\\n\"}`
    })
    .then(json)
    .then(data => {
        localStorage.setItem('logged', true);
        localStorage.setItem('token', data['data']['logIn']['token']);
        localStorage.setItem('user', username);
        window.location.href = "pages/game.html";
    })
        .catch(err => {
            console.error(err);
    });
};


function logout_mutation(username){
    /*
    Request to logout server.
        - Params:
            + username: string;
        - Return: null / undefined
    */
    return fetch(server_host, {
        "method": "POST",
        "headers": {
            "cookie": "csrftoken=9YXcKsPnJSojmIXsjvqlM7TFP0tBfiU8GwVopYDWNKHSQnEUKLnPzJdsCjSb0Cfn",
            "Content-Type": "application/json",
            "Authorization": `JWT ${token}`
        },
        "body": `
        {\"query\":\"mutation{\\n  logOut(input: {username: \\\"${username}\\\"}){\\n    response\\n  }\\n}\\n\"}`
    })
    .then(json)
    .then(data => {
        if (data['data']['logOut']['response'] == "Bye Bye"){
            window.location.href = "../index.html";
        }
    })
        .catch(err => {
            console.error(err);
    });
};


function update_position(player, x, y){
    /*
    Updates player position on the map.
        - Params:
            + player: string;
            + x: int;
            + y: int;
        - Return: null | undefined
    */
    var token = localStorage.getItem('token');
    var headers = {
        "cookie": "csrftoken=9YXcKsPnJSojmIXsjvqlM7TFP0tBfiU8GwVopYDWNKHSQnEUKLnPzJdsCjSb0Cfn",
        "Content-Type": "application/json",
        "Authorization": `JWT ${token}`
    };
    return fetch(server_host, {
        "method": "POST",
        "headers": headers,
        "body": `{\"query\":\"mutation { updatePosition(input: { reference: \\\"${player}\\\" location: { x: ${x} y: ${y} } }){ entity { name location { x y } } } }\"}`
    })
    .then(json)
    .then(data => {
        console.log(data);
    })
    .catch(err => {
            console.error(err);
    });
};


function send_chat_message(player_name, message, chat_zone){
    /*
    Sends a chat message.
    The chat_zone param on the backend is an enum, so the payload
    of this parameter must be ALL CAPS and without quotation marks
    around ir on the mutation input.
        - Params:
            + player_name: string;
            + message: string;
            + chat_zone: string (ALL CAPS);
        - Return: null | undefined
    */
    var token = localStorage.getItem('token');
    var headers = {
        "cookie": "csrftoken=9YXcKsPnJSojmIXsjvqlM7TFP0tBfiU8GwVopYDWNKHSQnEUKLnPzJdsCjSb0Cfn",
        "Content-Type": "application/json",
        "Authorization": `JWT ${token}`
    };
    return fetch(server_host, {
        "method": "POST",
        "headers": headers,
        "body": `{\"query\":\"mutation { sendChatMessage(input: { playerName: \\\"${player_name}\\\" message: \\\"${message}\\\" chatZone: ${chat_zone.toUpperCase()} }){ chatMessage { message } } }\"}`
    })
    .then(json)
    .then(data => {
        console.log(data);
    })
    .catch(err => {
            console.error(err);
    });
};
