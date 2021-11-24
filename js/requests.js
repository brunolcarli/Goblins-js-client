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
    return fetch("http://104.237.1.145:11000/graphql/", {
    "method": "POST",
    "headers": {
        "cookie": "csrftoken=9YXcKsPnJSojmIXsjvqlM7TFP0tBfiU8GwVopYDWNKHSQnEUKLnPzJdsCjSb0Cfn",
        "Content-Type": "application/json",
        "Authorization": "JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImJlZWx6ZWJydW5vIiwiZXhwIjoxNjM3NzA5Mjk0LCJvcmlnSWF0IjoxNjM3NzA4OTk0fQ.pHBMpq6KbfCyVhn8Js8MAIzLfL05allONclI4s6cr1g"
    },
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
