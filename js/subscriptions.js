function sleep(delay) {
  var start = new Date().getTime();
  while (new Date().getTime() < start + delay);
}


function graphql_subscribe() {
    const client_id = 'client__' + Math.random().toString(16).substr(2, 8);
    const api_host = 'wss://Goblins-Server.brunolcarli.repl.co/subscriptions/';

    const GQL = {
        CONNECTION_INIT: 'connection_init',
        CONNECTION_ACK: 'connection_ack',
        CONNECTION_ERROR: 'connection_error',
        CONNECTION_KEEP_ALIVE: 'ka',
        START: 'start',
        STOP: 'stop',
        CONNECTION_TERMINATE: 'connection_terminate',
        DATA: 'data',
        ERROR: 'error',
        COMPLETE: 'complete'
      };

      
      console.log('Connecting to broadcaster...');
      const webSocket = new WebSocket(api_host, "graphql-ws");
      webSocket.onmessage = function(event) {
        data = JSON.parse(event.data);
        package_id = data['id'].toString();
        console.log(data);
        if (package_id.endsWith('__movement')){
          let payload = data['payload']['data']['onCharacterMovement'];
          let player_name = payload['reference'];
          if (player_name in players) {
              players[player_name]['x'] = payload["x"];
              players[player_name]['y'] = payload["y"];
              players[player_name]['sprite'].position.x = payload["x"];
              players[player_name]['sprite'].position.y = payload["y"];
              drawSprites();
          }
        }
      };

      webSocket.onopen = function(){
        console.log('Connected.');
        // Subscribe to channels
        console.log('Subscribing to channels...');
        webSocket.send(JSON.stringify({
          type: GQL.START,
          id: `${client_id}__movement`,
          payload: {"query": `subscription ${client_id}__movement {onCharacterMovement{reference x y}}`}
        }));
        console.log('Subscribed to movements channel');

        webSocket.send(JSON.stringify({
          type: GQL.START,
          id: `${client_id}__chatmessages`,
          payload: {"query": `subscription ${client_id}__chatmessages { onNewChatMessage(chatroom: "global") { text sender}}`}
        }));
        console.log('Subscribed to chatmessages channel');

        webSocket.send(JSON.stringify({
          type: GQL.START,
          id: `${client_id}__characterlogin`,
          payload: {"query": `subscription ${client_id}__characterlogin { onCharacterLogin{reference x y} }`}
        }));
        console.log('Subscribed to characterlogin channel');

        webSocket.send(JSON.stringify({
          type: GQL.START,
          id: `${client_id}__characterlogout`,
          payload: {"query": `subscription ${client_id}__characterlogout { onCharacterLogout{reference} }`}
        }));
        console.log('Subscribed to characterlogout channel');

        console.log('Subscriptions completed!');
      };
}


// function on_message(msg, topic) {
//     var out = JSON.parse(msg);

//     // TODO: renomear a fila de posições
//     if (topic == 'foo/baz'){
//         let player_name = out["reference"];
//         if (player_name in players) {
//             players[player_name]['x'] = out["x"];
//             players[player_name]['y'] = out["y"];
//             players[player_name]['sprite'].position.x = out["x"];
//             players[player_name]['sprite'].position.y = out["y"];
//             drawSprites();
//         }
//     }
//     else if (topic.includes('log/chat')){
//         chat_logs = chat_logs.concat([out]);
//         if (chat_logs.length > 5) {
//             chat_logs.shift();
//         }
//     }
//     else if (topic == 'system/logged_players'){
//         set_players(out['data']['entities']);
//         draw();
//     }
//     else if (topic == 'system/logout'){
//         // Remove unlogged player sprite
//         players[out['username']]['sprite'].remove();
//         draw();
//     }
// }
