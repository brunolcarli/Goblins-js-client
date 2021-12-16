var mqtt;
var reconnectTimeout = 2000;
var host = "104.237.1.145";
var port = 9001;


function on_connect() {
    console.log("connected");
    mqtt.subscribe("foo/baz");
    console.log("Subscribed to foo/baz");
    mqtt.subscribe("log/chat/#");
    console.log("Subscribed to log/chat/#");
}


function mqtt_connect() {
    mqtt = new Paho.MQTT.Client(host, port, '');
    var options = {
        timeout: 3,
        onSuccess: on_connect,
    };
    mqtt.onMessageArrived = on_message;
    mqtt.connect(options);
}


function on_message(msg) {
    var out = JSON.parse(msg.payloadString);
    console.log(out);
    let origin = msg['destinationName'];

    // TODO: renomear a fila de posições
    if (origin == 'foo/baz'){
        let player_name = out["reference"];
        if (player_name in players) {
            players[player_name]['x'] = out["x"];
            players[player_name]['y'] = out["y"];
            players[player_name]['sprite'].position.x = out["x"];
            players[player_name]['sprite'].position.y = out["y"];
            drawSprites();
        }
    }
    else if (origin.includes('log/chat')){
        chat_logs = chat_logs.concat([out]);
        if (chat_logs.length > 5) {
            chat_logs.shift();
        }
    }
}