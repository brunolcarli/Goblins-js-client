var mqtt;
var reconnectTimeout = 2000;
var host = "104.237.1.145";
// var host = 'localhost';
// var port = 9001;
var port = 9001;


function on_connect(client) {
    const topics = [
        "foo/baz",
        "log/chat/#",
        "system/logged_players",
        "system/logout"
    ];
    console.log("connected");
    for (i in topics){
        client.subscribe(topics[i]);
        console.log(`Subscribed to ${topics[i]}`);  // TODO: remove this log
    };
}


function mqtt_connect() {
    const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8);
    const host = 'ws://104.237.1.145:8883';

    const options = {
        keepalive: 60,
        clientId: clientId,
        protocolId: 'MQTT',
        protocolVersion: 4,
        clean: true,
        useSSL: false,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
        username: "jclient",
        password: "prodmqtt",
      }
      
      console.log('Connecting mqtt client');
      const client = mqtt.connect(host, options);
      
      client.on('error', (err) => {
        console.log('Mqtt connection error: ', err)
        client.end()
      })
      
      client.on('reconnect', () => {
        console.log('Reconnecting to mqtt...')
      })

      client.on('connect', () => {
        console.log('Client connected:' + clientId)
        on_connect(client);
      })

      client.on('message', (topic, message, packet) => {
        on_message(message.toString(), topic);
      })

}


function on_message(msg, topic) {
    var out = JSON.parse(msg);

    // TODO: renomear a fila de posições
    if (topic == 'foo/baz'){
        let player_name = out["reference"];
        if (player_name in players) {
            players[player_name]['x'] = out["x"];
            players[player_name]['y'] = out["y"];
            players[player_name]['sprite'].position.x = out["x"];
            players[player_name]['sprite'].position.y = out["y"];
            drawSprites();
        }
    }
    else if (topic.includes('log/chat')){
        chat_logs = chat_logs.concat([out]);
        if (chat_logs.length > 5) {
            chat_logs.shift();
        }
    }
    else if (topic == 'system/logged_players'){
        set_players(out['data']['entities']);
        draw();
    }
    else if (topic == 'system/logout'){
        // Remove unlogged player sprite
        players[out['username']]['sprite'].remove();
        draw();
    }
}
