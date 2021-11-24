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
    createCanvas(1000, 500);
    goblin = createSprite(width/2, height/2, 40, 40);
    goblin.addImage(goblin_img);
    get_players();
    console.log(players);
}
// let character;

function draw() {
    background('rgba(0,255,0, 0.25)');
    drawSprites();
}

// function mousePressed() {
//   sprite.position.x = mouseX;
//   sprite.position.y = mouseY;
// }
