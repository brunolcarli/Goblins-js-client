let goblin;
let goblin_img;
let players = {};


function get_players() {
    query_entities().then((data) => {
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
    });
};

function preload() {
    goblin_img = loadImage('https://raw.githubusercontent.com/brunolcarli/Goblins-Client/master/static/img/goblins/goblin.png');
}


function setup() {
    var login_status = localStorage.getItem('logged');
    console.log(login_status);
    if (login_status){
        console.log('Logged in!');
        createCanvas(1000, 500);
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
        background('rgba(0,255,0, 0.25)');
        drawSprites();
    }
}
