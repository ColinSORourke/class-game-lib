title = "oooOOOooo";

description = `
[Tap]
    Turn on/off 
    flashlight
Beware of hands
`;

characters = [
  `
yyyyy
BBBBB
 BBB 
 BRB
 BBB
 BBB
  `
  ,
  `
 CC
CCCC
CccC
CCCC
CCCC
CCCC
  `
  ,
  `
 bbb
b b b
bbbbb
b   b
bbbbb
b b b
  `
  ,
  `
 bbb
b   b
  bb
  b
  
  b
  `
  ,
  `
pp  pp
 pppp
  pp
  pp
 pppp
pp  pp
  `
];

const G = {
  WIDTH: 120,
  HEIGHT: 90,
  GHOST_SPEED_MAX: 1.2,
  GHOST_SPEED_MIN: 0.3,
  LAST_MOUSE_X: 0
  //SECONDS: 60,
  //TIMER: 0
}

options = {
  theme:'shapeDark',
  seed: 53, //9 is good, 46 is ok, 53 is good
  isPlayingBgm: true,
  isReplayEnabled: true,
  viewSize: {x: G.WIDTH, y: G.HEIGHT}
};

//Defining ghosts/character

/**
 * @typedef {{
 * pos: Vector
 * }} Ghost
 */
/**
 * @type { Ghost [] }
 */
let ghosts;

/**
 * @type {number}
 */
let ghostSpeed

/**
 * @type {number}
 */
 let waveCount

/**
 * @typedef {{
 * pos: Vector
 * }} Hand
 */
let hand

/**
 * @typedef {{
 * pos: Vector,
 * lightOn: boolean
 * }} flashlight
 */
/**
 * @type { flashlight }
 */
 let flashLight;


function update() {

  if (!ticks){  //Initialize
    ghosts = [];
    waveCount = 0;
    ghostSpeed = 0;

    flashLight = {
      pos: vec(G.WIDTH / 2, G.HEIGHT - 3),
      lightOn: false
    }

    hand = {
      pos: vec(G.WIDTH + 10, G.HEIGHT / 2)
    }
    //G.SECONDS = 60
  }

  if(ghosts.length === 0){
    ghostSpeed = rnd(G.GHOST_SPEED_MIN, G.GHOST_SPEED_MAX) *  difficulty
    for (let i = 0; i < 7; i++){
      const posX = rnd(3, G.WIDTH - 4);
      const posY = -rnd(i * G.HEIGHT * 0.1);
      ghosts.push({ pos: vec(posX, posY)})
    }
  }

  //Gravestone
  //color("black")
  //char("b", 25, 25);

  //keeps track of mouse location
  flashLight.pos = vec(input.pos.x - 1, input.pos.y);
  
  //Flashlight
  color("black");
  char("a", flashLight.pos);

  //Hand
  color("black");
  char("e", hand.pos);

  //Flashlight light
  if(flashLight.lightOn){
    color("yellow")
    box(flashLight.pos.x + 1, flashLight.pos.y - 53, 10, 100)
    color("black")
    box(flashLight.pos.x + 1, flashLight.pos.y - 53, 4, 100)

    color("yellow")
    particle(
      flashLight.pos.x + 1,
      flashLight.pos.y - 5,
      2,  //number of particles
      0.5,  //speed of particles
      PI/2,  //emitting angle
      PI/1    // emmitting width
    )

    //Set hand to launch toward player
    hand.pos.x += 1.5 * Math.cos(hand.pos.angleTo(flashLight.pos)) * difficulty
    hand.pos.y += 1.5 * Math.sin(hand.pos.angleTo(vec(flashLight.pos.x, flashLight.pos.y - 5))) * difficulty
    const isCollidingWithLight = char("e", hand.pos).isColliding.rect.black;
    if(isCollidingWithLight){
      end()
    }
  }
  else{
    //Question
    color("black");
    char("d", vec(hand.pos.x, hand.pos.y - 7));
  }

  //turn on flashlight
  if(input.isJustPressed){
    if(flashLight.lightOn){
      play("select")
    }
    else{
      play("coin")
    }
    flashLight.lightOn = !flashLight.lightOn
  }

  //update ghosts
  remove(ghosts, (e) => {
    e.pos.y += ghostSpeed;
    color("black");
    const isCollidingWithLight = char("c", e.pos).isColliding.rect.yellow;
  
    if(isCollidingWithLight){
      color("light_green");
      particle(e.pos, 10, 0.8, 1, 10);
      play("lucky")
    }
    if(e.pos.y > G.HEIGHT){
      end()
    }
    if(isCollidingWithLight){
      addScore(1, e.pos)
    }
    return( isCollidingWithLight || e.pos.y > G.HEIGHT);
  })
  //G.SECONDS = G.SECONDS - 1

  //if(G.SECONDS <= 0){
  //  G.SECONDS = 60
  //  G.TIMER = G.TIMER + 1
  //}
  //text(G.TIMER.toString(), 3, 10);
}
