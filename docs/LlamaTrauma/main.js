title = "Llama Trauma";

description = `  Spit on 
    your 
 adversaries
`;

characters = [
`
   ccc
   crc
C  cc
ccccc
ccccc
c   c
`,

`
cccccc
ccccrc
    cc
`,

`
bbbbb
byybb
lllll
 B  B
 B  B
ll ll
`,

`

bbbbbb
byybbb
llllll
  B  B
lll lll
`,

`
gggggg
gLgLgg
gggggg
 gg gg
lL lLL
`,

`

gggggg
gLgLgg
gggggg
 gggg
 g  g
lL  lL
`,

` 
Ccc
 CC
`,

`
lbbl
lLLl
 ll
`
];

const G = {

  WIDTH: 200,
  HEIGHT: 60,
  FLOOR_HEIGHT: 48,

  BUILDING_SPEED_MIN: 1.0,
  BUILDING_SPEED_MAX: 2.0,
  ENEMY_BASE_SPEED: .7,

  PLAYER_FIRE_RATE: 5,
  PLAYER_RELOAD_SPEED: 35,
  PLAYER_BUFFER_RATE: 10,
  PLAYER_AMMO_MAX: 5,
  SPIT_SPEED: 1.2,

};
/**
 * @typedef {{
 * pos: Vector, 
 * speed: number
 * height: number
 * }} Building
 */

/**
 * @type { Building[] }
 */
let buildings;

/**
 * @typedef {{
 * pos: Vector,
 * ammoCount: number,
 * firingCooldown: number,
 * isReloading: boolean,
 * reloadingCooldown: number,
 * buffer: number
 * }} Player
 */

/**
 * @type {Player}
 */
let player;

/**
 * @typedef {{
 * pos: Vector
 * }} Spit
 */

/**
 * @type { Spit [] }
 */
let spits;

/**
 * @type {number}
 */
let wavecount;

/**
 * @type {number}
 */
 let currentCopSpeed;

 /**
  * @type {number}
  */
 let currentCivSpeed

/**
 * @typedef {{
 * pos: Vector,
 * isJumping: Boolean
 * }} Cop
 */

/**
 * @type { Cop[] }
 */
let cops;

/**
 * @typedef {{
 * pos: Vector,
 * speed: number
 * }} Civilian
 */

/**
 * @type { Civilian[] }
 */
let civs;

/**
 * @type {number}
 */
let copRatio;

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  seed: 16,
  isPlayingBgm: true,
  isReplayEnabled: true,
  theme: "crt",
  isCapturing: true,
  isCapturingGameCanvasOnly: true,
  captureCanvasScale: 2
};

function update() {
  if (!ticks) {
    //draw the floor, background
    buildings = times(12, () => {
      const posX = rnd(0, G.WIDTH);
      const posY = G.FLOOR_HEIGHT;
      return {
        pos: vec(posX, posY),
        speed: rnd(G.BUILDING_SPEED_MIN, G.BUILDING_SPEED_MAX),
        height: rnd(4, 26)
      };
    });
    //initialize the player with values
    player = {
      pos: vec(G.WIDTH * .1, G.FLOOR_HEIGHT - 3),
      ammoCount: G.PLAYER_AMMO_MAX,
      isReloading: false,
      firingCooldown: G.PLAYER_FIRE_RATE,
      reloadingCooldown: G.PLAYER_RELOAD_SPEED,
      buffer: G.PLAYER_BUFFER_RATE
    }

    //initialize values (arrays, nums like wavecount, etc)
    wavecount = 0;
    spits = [];
    currentCopSpeed = 0;
    currentCivSpeed = 0;
    civs = [];
    cops = [];
    copRatio = 0;
  }

  //Draw the floor!
  color("blue")
  rect(0, G.FLOOR_HEIGHT, G.WIDTH, G.HEIGHT);

  //spawn enemies / update waveCount
  if (cops.length === 0) {
    currentCopSpeed = (G.ENEMY_BASE_SPEED + (difficulty * .05));
    for (let i = 0; i < 5; i++) {
      const posX = (G.WIDTH + (i * 18))
      const posY = G.FLOOR_HEIGHT - 3
      cops.push({ 
        pos: vec(posX, posY), 
        isJumping: false
      })
    }

  if (civs.length === 0) {
    for (let i = 0; i < 3; i++) {
      currentCivSpeed = (G.ENEMY_BASE_SPEED - rnd(.1, .7));
      const posX = (G.WIDTH + (i * 25))
      const posY = G.FLOOR_HEIGHT - 3
      civs.push({ 
        pos: vec(posX, posY), 
        speed: currentCivSpeed
      })
    }
  }

    wavecount++;
  }

  //update for Buildings in BG 
  buildings.forEach((b) => {
    //move each building to the left
    b.pos.x -= b.speed;
    //wrap each building if it hits left edge
    b.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);

    //vaporwave buildings!
    color("light_purple");
    //draw buildings!
    rect(b.pos, 5, -b.height);
  });

  color("light_cyan");
  text("Ammo:" + player.ammoCount.toString(), 3, 10);

  //update and draw player
  //reduce cooldown for shots and reloads
  --player.firingCooldown;
  --player.reloadingCooldown;
  
  //check if player is trying to reload
  if (input.isPressed) {
    --player.buffer;
  }
  player.isReloading = ((player.buffer <= 0 && player.ammoCount < G.PLAYER_AMMO_MAX) && player.reloadingCooldown <= 0)

  //Spitting on people!
  //If player holds Lmouse and has ammo, shoot goop!
  if (input.isJustPressed && player.firingCooldown <= 0 && player.ammoCount > 0) {
    spits.push({
      pos: vec(player.pos.x + 3, player.pos.y - 2)
    });
    //reduce ammo per shot
    --player.ammoCount;
    //reset cooldown
    player.firingCooldown = G.PLAYER_FIRE_RATE;

    color("cyan");
    //generate the spittle
    particle(
      player.pos.x, //x coord
      player.pos.y, //y coord
      5, //num particles
      1.5, //speed or particles
      0, //Emmiting angle
      PI/4 //Emmiting width
    );
  }

  //Reloading!
  //If player is reloading (checked above), go into reload mode, and slowly add ammo
  if (player.isReloading) {
    player.ammoCount++;
    player.reloadingCooldown = G.PLAYER_RELOAD_SPEED;
  }
  else if (!input.isPressed) {
    player.buffer = G.PLAYER_BUFFER_RATE;
  } 

  //Draw the player!
  color("black");
  char("a", player.pos);

  //Draw the bucket!
  color("black");
  char("h", player.pos.x + 6, player.pos.y + 1);

  //Update the spit!
  spits.forEach((s) => {
    //move spit forward
    s.pos.x += G.SPIT_SPEED;
    //Drawing them
    color("black");
    char("g", s.pos);
  });

  //Update cops!
  remove(cops, (c) => {
    //move them to the left!
    c.pos.x -= currentCopSpeed;

    //Check if they hit the SPIT
    color("black");
    const copGetsSpitOn = char("c", c.pos).isColliding.char.g;

    //IF they hit the spit... KILL EM OFF
    if (copGetsSpitOn) {
      color("cyan");
      particle(c.pos);
      play("hit");
      addScore(10 * wavecount, c.pos);
    }

    //Check if cops hit you (MAYBE THEY NEED TO PASS A LINE? IDK)
    const policeBrutality = char("c", c.pos).isColliding.char.a;
    if (policeBrutality) {
      end();
      play("explosion");
    }

    return (copGetsSpitOn);
  });

  //Remove spits!
  remove(spits, (s) =>  {
    color("cyan");
    const spitHitsCop = char("g", s.pos).isColliding.char.c;
    return (spitHitsCop || s.pos.x > G.WIDTH);
  });

  //Update Civs
  remove(civs, (cv) => {
    //move them to the left!
    cv.pos.x -= cv.speed;

    //Check if they hit the SPIT
    color("black");
    const civGetsSpitOn = char("e", cv.pos).isColliding.char.g;

    //IF they hit the spit... LLAMA MUST DIE
    if (civGetsSpitOn) {
      color("cyan");
      particle(cv.pos);
      end();
      play("explosion");
    }

    //Delete sprites if they get pass by the Llama! 
    return (cv.pos.x < 0);
  });
}
