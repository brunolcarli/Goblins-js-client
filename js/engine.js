let goblin;
let goblin_img;
let players = {};


// Canvas frames
var upperBuffer;  // game
var lowerBuffer;  // chat window


function set_players(data){
    players = {};  // resets the list
    console.log('data: ');
    console.log(data);
    for (let i=0; i < data.length; i++) {
        if (data[i]['logged'] == true){
            goblin = createSprite(
                data[i]['location']["x"],
                data[i]['location']["y"],
                40, 40);
            goblin.addImage(goblin_img);
            let player_data = {
                "x": data[i]['location']["x"],
                "y": data[i]['location']["y"],
                "sprite": goblin
            }
            players[data[i]['name']] = player_data;
        }
    }
}


function get_players() {
    query_entities().then((data) => {
        set_players(data);
    });
};

function preload() {
    goblin_img = loadImage('https://raw.githubusercontent.com/brunolcarli/Goblins-Client/master/static/img/goblins/goblin.png');
}

function draw_upper_buffer() {
    /*
    Draws the play screen.
    */
    upperBuffer.background('rgba(0,255,0, 0.25)');
}

function draw_lower_buffer() {
    /*
    Write messages (draw text) on chat log.
    */
    lowerBuffer.background('rgba(255, 255, 255, 0.25)');
    lowerBuffer.textSize(14);
    lowerBuffer.text("Chat log:", 0, 10);

    let ty = 25;
    var name;
    var msg;

    for (let i=0; i < chat_logs.length; i++){
        name = chat_logs[i]['player_name'];
        msg = chat_logs[i]['message'];
        lowerBuffer.text(`${name}: ${msg}` , 0, ty);
        ty = ty + 18;
    };
}


function setup() {
    var login_status = localStorage.getItem('logged');
    console.log(login_status);
    if (login_status){
        console.log('Logged in!');
        createCanvas(1000, 800);
        upperBuffer = createGraphics(1000, 500);
        lowerBuffer = createGraphics(1000, 200);
        get_players();
        console.log(players);
    }
    else{
        console.log('Not logged!');
        window.location.href = "../index.html";
    }
}


function draw() {
    var login_status = localStorage.getItem('logged');
    if (login_status){
        draw_upper_buffer();
        draw_lower_buffer();
        image(upperBuffer, 0, 0);
        image(lowerBuffer, 0, 501);
        // background('rgba(0,255,0, 0.25)');
        drawSprites();

        // Add player name as sprite label
        for (const player in players) {
            text(
                player,
                players[player]['x'] - 15,
                players[player]['y'] - 18
            );
        };
    }
}
