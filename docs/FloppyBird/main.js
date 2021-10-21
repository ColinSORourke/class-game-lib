title = "Floppy Bird";

description = `
Press [SPACE] to 
  jump higher!
`;

const G = {
  WIDTH: 150,
  HEIGHT: 150,
  CENTERX: 75,
  CENTERY: 75,

  GRASSBORDER: 110,

  FALLSPEED: 3,
  JUMPHEIGHT: 1.5,

  PIPEWIDTH: 10,
  GAPSIZE: 40,
};


characters = [
  `
    r
   rry
  rrr
 rrbr
 rbr
rrr
`,
  `
    r
b  rry
rbbrr
 rrbr
 rrr
rrr
`
];


/**
 * @typedef {{
 * pos: Vector,
 * vel: Vector,
 * }} Player
 */

/**
 * @type { Player }
 */
let player;


/**
 * @typedef {{
 * pos: Vector,
 * speed: number
 * }} Star
 */

/**
* @type  { Star [] }
*/
let stars;

/**
* @typedef {{
* pos: Vector,
* topHeight: Number,
* speed: number
* }} Pipe
*/
  
/**
* @type  { Pipe [] }
*/
let pipes;

let scored = false;

options = {
  viewSize: { x: G.WIDTH, y: G.HEIGHT },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 42069,  // XD!!! 
  theme: "dark"
};

function update() {
  if (!ticks) {
    player = {
      pos: vec(G.WIDTH * 0.5 - 40, G.HEIGHT * 0.5 - 20),
      vel: vec(0, 0),//I changed it to 0,because it falls too fast at beginning-Larry
    };

    stars = [];
    for (let i = 0; i < 20; i++) {
      stars.push({
        pos: vec(rnd(0, G.WIDTH), rnd(0, G.HEIGHT)),
        speed: 0.2
      })
    }

    let i = 0;
    pipes = times(4, () => {
      const posX = 96 + i * 40;
      i++;

      const h = pipeRandomizer();

      return {
        pos: vec(posX, 0),
        topHeight: h,
        // speed: .15
        speed: 1
      };
    });
  }

  stars.forEach((s) => {
    s.pos.x -= s.speed;
    s.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);
    color("light_black");
    box(s.pos, 1);
  });
  pipes.forEach((p) => {
    p.pos.x -= p.speed;
    if (p.pos.x < -G.PIPEWIDTH) {
      p.pos.x = 150;
      p.topHeight = pipeRandomizer();
      scored = false;
    }

    if (p.pos.x < player.pos.x - 3 && !scored) {
      addScore(1,player.pos);
      play("coin");
      scored = true;
    }

    if(pipeCollisionTest(p)) {
      play("explosion");
      end();
    }

    color("blue");
    rect(p.pos.x, 0, G.PIPEWIDTH, p.topHeight);
    rect(p.pos.x, p.topHeight + G.GAPSIZE, G.PIPEWIDTH, 150);
  });

  // render bird
  color("black");
  // add animation : flapping -Larry
  if (input.isPressed) {
    char("a", player.pos).isColliding.rect.blue;
  } else {
    char("b", player.pos);
  }
  


  // grass border
  color("green");
  let grass = box(G.WIDTH / 2, G.HEIGHT, G.WIDTH, G.HEIGHT - G.GRASSBORDER)
  //added collider with player
  const isCollidingWithGrass = grass.isColliding.char.a || grass.isColliding.char.b;
  //↑↑↑                                                ↑↑
  //Since there are two characters, Make sure to check both of the collision -Larry
  if (isCollidingWithGrass) {
    // if fall on grass, end game
    console.log("hit");
    color("red");
    particle(player.pos);
    play("explosion");
    end();
  }

  // simulate gravity
  if (player.pos.y + player.vel.y >= 0) {//added border for the bird -Larry
    player.pos.y += player.vel.y;
  } else {
    player.vel.y = 0;               //now it won't fly out of the screen
  }
  player.vel.y += G.FALLSPEED / 60;

  if (input.isJustPressed) {
    player.vel.y = -G.JUMPHEIGHT;
    play("laser");
  }

}

function pipeRandomizer(){
  return Math.floor(Math.random() * (G.GRASSBORDER - G.GAPSIZE - 20)) + 20;
}

function pipeCollisionTest(pipe){
  if(pipe.pos.x < (player.pos.x + 2) && pipe.pos.x > (player.pos.x - 3)){
    if(player.pos.y <= (pipe.topHeight/* + G.GAPSIZE*/) || player.pos.y >= (pipe.topHeight + G.GAPSIZE)) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}