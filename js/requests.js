
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
    var token = localStorage.getItem('token');
    var headers = {
        "cookie": "csrftoken=9YXcKsPnJSojmIXsjvqlM7TFP0tBfiU8GwVopYDWNKHSQnEUKLnPzJdsCjSb0Cfn",
        "Content-Type": "application/json",
        "Authorization": `JWT ${token}`
    }
    return fetch("http://104.237.1.145:11000/graphql/", {
    // return fetch("http://localhost:11000/graphql/", {
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
    return fetch("http://104.237.1.145:11000/graphql/", {
    // return fetch("http://localhost:11000/graphql/", {
    "method": "POST",
    "headers": {
        "cookie": "csrftoken=9YXcKsPnJSojmIXsjvqlM7TFP0tBfiU8GwVopYDWNKHSQnEUKLnPzJdsCjSb0Cfn",
        "Content-Type": "application/json",
    },
    "body": `
    {\"query\":\"mutation{\\n  logIn(username: \\\"${username}\\\" password: \\\"${password}\\\"){\\n    token\\n  }\\n}\\n\"}`
    })
    .then(json)
    .then(data => {
        localStorage.setItem('logged', true);
        localStorage.setItem('token', data['data']['logIn']['token']);
        window.location.href = "pages/game.html";
    })
        .catch(err => {
            console.error(err);
    });
};
