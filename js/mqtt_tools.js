var mqtt;
var reconnectTimeout = 2000;
var host = "104.237.1.145";
var port = 9001;


function on_connect() {
    console.log("connected");
    mqtt.subscribe("foo/baz");
    console.log("Subscribed to foo/baz");
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
    let player_name = out["reference"];
    if (player_name in players) {
        players[player_name]['sprite'].position.x = out["x"];
        players[player_name]['sprite'].position.y = out["y"];
        drawSprites();
    }
}