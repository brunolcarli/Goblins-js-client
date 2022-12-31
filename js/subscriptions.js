function onCharacterMovement(data){
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

function onNewChatMessage(data){
  let payload = data['payload']['data']['onNewChatMessage'];
  chat_logs = chat_logs.concat([payload]);
  if (chat_logs.length > 5) {
      chat_logs.shift();
  }
}


function onCharacterLogIn(data){
  let payload = data['payload']['data']['onCharacterLogin'];
  let player_name = payload['reference'];

  goblin = createSprite(payload["x"], payload["y"], 40, 40);
  goblin.addImage(goblin_img);
  let player_data = {
      "x": payload["x"],
      "y": payload["y"],
      "sprite": goblin
  };
  players[player_name] = player_data;
  drawSprites();
}


function onCharacterLogout(data){
  let payload = data['payload']['data']['onCharacterLogout'];
  let player_name = payload['reference'];
  let player_sprite = players[player_name].sprite;
  removeSprite(player_sprite);
  delete players[player_name];
  drawSprites();
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
      const valid_operations = {
        'onCharacterMovement': onCharacterMovement,
        'onCharacterLogout': onCharacterLogout,
        'onCharacterLogin': onCharacterLogIn,
        'onNewChatMessage': onNewChatMessage
      };

      
      console.log('Connecting to broadcaster...');
      const webSocket = new WebSocket(api_host, "graphql-ws");
      webSocket.onmessage = function(event) {
        data = JSON.parse(event.data);
        operation = Object.keys(data['payload']['data'])[0];
        package_id = data['id'].toString();

        if (operation in valid_operations){
          valid_operations[operation](data);
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
