// CMPM 170 One Button Duo Project
// Robert Radzville
// Ivan Martinez-Arias

title = "Button Mash";

description = `
Match Your Shape
----------
[Tap]
Turn Right
`;

characters = [
  // Player Cursor (a)
`
     
     
  y  
     
     
`,
  // Square (b)
  `
bbbbb
b   b
b   b
b   b
bbbbb
`
  // Cross (c)
,`
R   R
 R R
  R
 R R
R   R
`,
  // Triangle (d)
`
  g
 ggg
 g g
gg gg
ggggg
`,
  // Circle (e)
`
 ppp
p   p
p   p
p   p
 ppp
`,
  // Transparent Hitbox (f)
`
lllll
lllll
lllll
lllll
lllll
`
,
];

const G = {
  WIDTH: 100,
  HEIGHT: 100
};

options = {
  theme: 'pixel',
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 100// 214
};

let player;
const playerSpeed = 0.75;
let shapes = [];

class shape {
  constructor() {
    this.reset(); 
  }

  reset() {
    // Decide the shape
    let shapeNum = Math.floor(Math.random() * 4);
    if (shapeNum == 0) {
      this.shapeChar = 'b';
    } else if (shapeNum == 1) {
      this.shapeChar = 'c';
    } else if (shapeNum == 2) {
      this.shapeChar = 'd';
    } else {
      this.shapeChar = 'e';
    }
    
    // Decide spawn location
    this.y =  -5;
    this.x = Math.random() * G.WIDTH;
    this.shapeSpeed = Math.random() * 0.5 + .25;
    if (this.x <= 5) {
      this.x += 5;
    } else if (this.x >= G.WIDTH - 5) {
      this.x -= 5;
    }
  }

  move() {
    this.y += this.shapeSpeed;
    color("black");
    char(this.shapeChar, this.x, this.y);
  }

  checkScreen() {
    if (this.y > 100) {
      this.reset();
    }
  }

  checkCollision() {
    // Checks collision with the hitbox of the player
    if (char(this.shapeChar, this.x, this.y).isColliding.char.f) {
      if (player.shapeChar == this.shapeChar) {
        score += 10;
        play("hit");
        player.setPlayerShape();
        this.reset();
      } else {
        play("lucky");
        end();
      }
    }
  }
}

class PlayerShape {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.direction = 'north'
    this.setPlayerShape();
  }

  // Player will be moving in a clockwise motion when pressing button
  update_Direction() {
    play("jump");
    if(this.direction == 'north') { this.direction = 'east'; }   // Head East
    else if(this.direction == 'east') { this.direction = 'south'; }  // Head South
    else if(this.direction == 'south') { this.direction = 'west'; }   // Head West
    else { this.direction = 'north'; }   // Head North
  }

  // Updates the player's movement given a direction
  movement() {
    // checks to see where the player is heading towards && conditions are to check whether it has reached the boundary or not
    if(this.direction == 'north' && this.y >= 5) {
      this.y -= playerSpeed;
    } else if(this.direction == 'east' && this.x <= G.WIDTH - 5) {
      this.x += playerSpeed
    } else if(this.direction == 'south' && this.y <= G.HEIGHT - 5) {
      this.y += playerSpeed
    } else if(this.direction == 'west' && this.x >= 5) {
      this.x -= playerSpeed
    }

    let offset_X = 0;
    let offset_Y = 0;
    // adjusts the offsets for x and y
    if(this.direction == 'west') {offset_X = 2.5} else if(this.direction == 'east') {offset_X = -2.5} else {offset_X = 0}
    if(this.direction == 'north') {offset_Y = 2.5} else if(this.direction == 'south') {offset_Y = -2.5} else {offset_Y = 0}  

    color("light_yellow");
    particle(
      this.x + offset_X, // x coordinate
      this.y + offset_Y, // y coordinate
      0.5, // The number of particles
      0.25, // The speed of the particles
      -PI/2, // The emitting angle
      PI/2  // The emitting width
    );
  }

  setPlayerShape () {
    let shapeNum = Math.floor(Math.random() * 4);
    if (shapeNum == 0) {
      this.shapeChar = 'b';
    } else if (shapeNum == 1) {
      this.shapeChar = 'c';
    } else if (shapeNum == 2) {
      this.shapeChar = 'd';
    } else {
      this.shapeChar = 'e';
    }
  }
}

function update() {
  if (!ticks) {
    shapes = [];
    player = new PlayerShape(G.WIDTH * 0.5, G.HEIGHT - 5);
  }

  // Player changes direction
  if(input.isJustPressed) {
    player.update_Direction()
  }

  // Movement
  player.movement()
  
  if (shapes.length < difficulty * 5) {
    let newShape = new shape();
    shapes.push(newShape);
  }

  // transparent hitbox
  color("white");
  char("f", player.x, player.y);
  // player
  color("black");
  char(player.shapeChar, player.x, player.y);
  // cursor
  char("a", player.x, player.y);  // Move all shapes
  shapes.forEach(s => s.move());
  // Check if any shapes went off screen
  shapes.forEach(s => s.checkScreen());
  // Check if any shape
  shapes.forEach(s => s.checkCollision());
}
