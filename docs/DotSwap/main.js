title = "DOT SWAP";

description = `[SLIDE] Move

[TAP] Swap Colors
`;

characters = [
// Background Arrow Sprite
  `
ppppp
 ppp
  p  
  `
];

// Game Properties
const G = {
  // View size
  WIDTH: 130,
  HEIGHT: 150
};

// Player Properties
const P = {
  Y: 125,
  LCLAMP: 32,
  RCLAMP: 98,
  APART: 26,
  RADIUS: 4.5,
  THICKNESS: 1.5,
}

// Barrier Properties
const B = {
  AVGWIDTH: 28,
  XONE: 15,
  XTWO: 40,
  XTHREE: 65,
  XFOUR: 90.5,
  XFIVE: 116
};

options = {
  viewSize: {x: G.WIDTH, y:G.HEIGHT},
  theme: 'shapeDark',
  seed: 4,
  isPlayingBgm: true,
  isReplayEnabled: true,
  isDrawingParticleFront: true,
  isCapturing: true
};

// Left Player Shape
/**
 * @typedef {{
 * pos: Vector,
 * }} LPlayer
 */

/**
 * @type { LPlayer }
 */
let Lplayer;

// Right Player Shape
/**
 * @typedef {{
 * pos: Vector,
 * }} RPlayer
 */

/**
 * @type { RPlayer }
 */
let Rplayer;

// Killing Barriers
/**
 * @typedef {{
 * pos: Vector,
 * speed: number
 * }} KillBarrierOne
 */

/**
 * @type { KillBarrierOne [] }
 */
let KbarrierOne;

/**
 * @typedef {{
 * pos: Vector,
 * speed: number
 * }} KillBarrierTwo
 */

/**
 * @type { KillBarrierTwo [] }
 */
let KbarrierTwo;

/**
 * @typedef {{
 * pos: Vector,
 * speed: number
 * }} KillBarrierThree
 */

/**
 * @type { KillBarrierThree [] }
 */
let KbarrierThree;

// Left Color Barrier
/**
 * @typedef {{
 * pos: Vector,
 * speed: number
 * }} LeftBarrier
 */

/**
 * @type { LeftBarrier [] }
 */
let Lbarrier;

// Right Color Barrier
/**
 * @typedef {{
 * pos: Vector,
 * speed: number
 * }} RightBarrier
 */

/**
 * @type { RightBarrier [] }
 */
let Rbarrier;

// Decides wheter the colors are swapped or not
/**
 * @type { boolean }
 */
let swapped;

// Background Arrows
/**
* @typedef {{
  * pos: Vector,
  * speed: number
  * }} ArrowsOne
  */
  
/**
* @type  { ArrowsOne [] }
*/
let arrowsOne;

/**
* @typedef {{
  * pos: Vector,
  * speed: number
  * }} ArrowsTwo
  */
  
/**
* @type  { ArrowsTwo [] }
*/
let arrowsTwo;

// Spawn rate of barriers
let spawnRate = 0;

// Randomizing barrier placement
let rBarriers;
let bOne;
let bTwo;
let bThree;
let bFour;
let bFive;

function update() {
  if (!ticks) {
    // Player Shape Declaration
    Lplayer = {
      pos: vec(P.APART, P.Y),
    };
    Rplayer = {
      pos: vec(P.APART, P.Y),
    };

    // Barrier Declerations
    Lbarrier = [];
    Rbarrier = [];
    KbarrierOne = [];
    KbarrierTwo = [];
    KbarrierThree = [];

    // Decides wheter or not colors are swapped
    swapped = false;

    // Background Arrow setup
    arrowsOne = times(7, () => {
      const posX = rnd(0, G.WIDTH);
      const posY = rnd(0, G.HEIGHT);
      return {
        pos: vec(posX, posY),
        speed: rnd(0.5, 1)
      };
    });
    arrowsTwo = times(7, () => {
      const posX = rnd(0, G.WIDTH);
      const posY = rnd(0, G.HEIGHT);
      return {
        pos: vec(posX, posY),
        speed: rnd(0.5, 1)
      };
    });
  }

  if(swapped == false){
    color("blue");
  }
  else {
    color("purple");
  }
  arrowsOne.forEach((sa) => {
    sa.pos.y += sa.speed;
    sa.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);
    char("a", sa.pos);
  })
  if(swapped == false){
    color("light_blue");
  }
  else {
    color("light_purple");
  }
  arrowsTwo.forEach((sb) => {
    sb.pos.y += sb.speed;
    sb.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);
    char("a", sb.pos);
  })
   
  rBarriers = rndi(1, 6);

  if(rBarriers == 1){
    bOne = B.XFOUR; 
    bTwo = B.XONE; 
    bThree = B.XTWO; 
    bFour = B.XTHREE; 
    bFive = B.XFIVE;
  }
  else if(rBarriers == 2){
    bOne = B.XONE; 
    bTwo = B.XTWO; 
    bThree = B.XTHREE; 
    bFour = B.XFOUR; 
    bFive = B.XFIVE; 
  }
  else if(rBarriers == 3){
    bOne = B.XFOUR; 
    bTwo = B.XTHREE;
    bThree = B.XTWO;
    bFour = B.XFIVE;
    bFive = B.XONE;
  }
  else if(rBarriers == 4){
    bOne = B.XFOUR; 
    bTwo = B.XTHREE; 
    bThree = B.XTWO; 
    bFour = B.XONE; 
    bFive = B.XFIVE;
  }
  else if(rBarriers == 5){
    bOne = B.XONE; 
    bTwo = B.XFOUR; 
    bThree = B.XTHREE; 
    bFour = B.XTWO; 
    bFive = B.XFIVE; 
  }
  else if(rBarriers == 6){
    bOne = B.XFOUR; 
    bTwo = B.XFIVE;
    bThree = B.XTWO;
    bFour = B.XTHREE;
    bFive = B.XONE;
  }

  // Creation of Barriers
  spawnRate--;

  if(spawnRate <= 0){
    Lbarrier.push({
      pos: vec(bTwo, -20),
      speed: 1.5 * difficulty
    });
    Rbarrier.push({
      pos: vec(bFour, -20),
      speed: 1.5 * difficulty
    });
    KbarrierOne.push({
      pos: vec(bOne, -20),
      speed: 1.5 * difficulty
    });
    KbarrierTwo.push({
      pos: vec(bThree, -20),
      speed: 1.5 * difficulty
    });
    KbarrierThree.push({
      pos: vec(bFive, -20),
      speed: 1.5 * difficulty
    });

    spawnRate = 100 / (1.5 * difficulty)
  }

  Lbarrier.forEach((L) => {
    L.pos.y += L.speed;
    color("light_purple");
    box(L.pos.x,L.pos.y,B.AVGWIDTH-1,30)
  });
  Rbarrier.forEach((R) => {
    R.pos.y += R.speed;
    color("blue");
    box(R.pos.x,R.pos.y,B.AVGWIDTH-1,30)
  });
  KbarrierOne.forEach((Ka) => {
    Ka.pos.y += Ka.speed;
    color("light_black");
    box(Ka.pos.x,Ka.pos.y,B.AVGWIDTH-1,30)
  });
  KbarrierTwo.forEach((Kb) => {
    Kb.pos.y += Kb.speed;
    color("light_black");
    box(Kb.pos.x,Kb.pos.y,B.AVGWIDTH-1,30)
  });
  KbarrierThree.forEach((Kc) => {
    Kc.pos.y += Kc.speed;
    color("light_black");
    box(Kc.pos.x,Kc.pos.y,B.AVGWIDTH-1,30)
  });

  // Remove barriers when they go off screen
  remove(Lbarrier, (L) =>{
    return L.pos.y > G.HEIGHT + 40;
  });
  remove(Rbarrier, (R) =>{
    return R.pos.y > G.HEIGHT + 40;
  });
  remove(KbarrierOne, (Ka) =>{
    return Ka.pos.y > G.HEIGHT + 40;
  });
  remove(KbarrierTwo, (Kb) =>{
    return Kb.pos.y > G.HEIGHT + 40;
  });
  remove(KbarrierThree, (Kc) =>{
    return Kc.pos.y > G.HEIGHT + 40;
  });

  // Player Shapes follow mouse position & Clamps
  Lplayer.pos = vec(input.pos.x, P.Y);
  Lplayer.pos.clamp(P.LCLAMP, P.RCLAMP, P.Y, P.Y);
  Rplayer.pos = vec(input.pos.x, P.Y);
  Rplayer.pos.clamp(P.LCLAMP, P.RCLAMP, P.Y, P.Y);

  // Collision Detection
  color("transparent");
  if(swapped == false){
    if(box(Lplayer.pos.x - P.APART, Lplayer.pos.y + 2,1, 1).isColliding.rect.light_black || box(Rplayer.pos.x + P.APART, Rplayer.pos.y + 2, 1, 1).isColliding.rect.light_black){
      play("hit");
      end();
    }
    if(box(Lplayer.pos.x - P.APART, Lplayer.pos.y + 2,1, 1).isColliding.rect.light_purple || box(Rplayer.pos.x + P.APART, Rplayer.pos.y + 2, 1, 1).isColliding.rect.blue){
      play("hit");
      end();
    }
    if(box(Lplayer.pos.x - P.APART, Lplayer.pos.y + 2,1, 1).isColliding.rect.blue && box(Rplayer.pos.x + P.APART, Rplayer.pos.y + 2, 1, 1).isColliding.rect.light_purple){
      addScore(difficulty / 2);
      play("select");
      color("light_black");
      particle(Lplayer.pos.x - P.APART, Lplayer.pos.y, 6, 1,0, 360);
      particle(Rplayer.pos.x + P.APART, Rplayer.pos.y, 6, 1,0, 360);
    }
  } 
  else{
    if(box(Lplayer.pos.x - P.APART, Lplayer.pos.y + 2,1, 1).isColliding.rect.light_black || box(Rplayer.pos.x + P.APART, Rplayer.pos.y + 2, 1, 1).isColliding.rect.light_black){
      play("hit");
      end();
    }
    if(box(Lplayer.pos.x - P.APART, Lplayer.pos.y + 2,1, 1).isColliding.rect.blue || box(Rplayer.pos.x + P.APART, Rplayer.pos.y + 2, 1, 1).isColliding.rect.light_purple){
      play("hit");
      end();
    }
    if(box(Lplayer.pos.x - P.APART, Lplayer.pos.y + 2,1, 1).isColliding.rect.light_purple && box(Rplayer.pos.x + P.APART, Rplayer.pos.y + 2, 1, 1).isColliding.rect.blue){
      addScore(difficulty / 2);
      play("laser");
      color("light_black");
      particle(Lplayer.pos.x - P.APART, Lplayer.pos.y, 3, 1,0, 360);
      particle(Rplayer.pos.x + P.APART, Rplayer.pos.y, 3, 1,0, 360);
    }
  }

  // Player Shape Creations & Color
  if(swapped == false){
    color("cyan");
  }
  else {
    color("purple");
  }
  arc(Lplayer.pos.x - P.APART, Lplayer.pos.y, P.RADIUS, P.THICKNESS, 0, 90); 
  arc(Lplayer.pos.x - P.APART, Lplayer.pos.y, P.RADIUS, P.THICKNESS, 5, 50); 
  arc(Lplayer.pos.x - P.APART, Lplayer.pos.y, P.RADIUS, P.THICKNESS, 20, 10);

  if(swapped == false){
    color("purple");
  }
  else {
    color("cyan");
  }
  arc(Rplayer.pos.x + P.APART, Rplayer.pos.y, P.RADIUS, P.THICKNESS, 0, 360);
  arc(Rplayer.pos.x + P.APART, Rplayer.pos.y, P.RADIUS, P.THICKNESS, 5, 50);
  arc(Rplayer.pos.x + P.APART, Rplayer.pos.y, P.RADIUS, P.THICKNESS, 20, 10);

  // Screen Boundry Lines
  if(swapped == false){
    color("light_cyan");
  }
  else {
    color("light_purple");
  }
  box(0,75,2,G.HEIGHT + 20);
  box(40,0,G.WIDTH,2);
  box(40,G.HEIGHT,G.WIDTH,2);
  if(swapped == false){
    color("light_purple");
  }
  else {
    color("light_cyan");
  }
  box(G.WIDTH,75,2,G.HEIGHT + 20);
  box(100,0,G.WIDTH/2,2);
  box(100,G.HEIGHT,G.WIDTH/2,2);

  // Swap colors when pressed & Particles
  if(input.isJustPressed) {
    play("coin");
    if(swapped == false){
      swapped = true;
      color("purple");
      particle(Lplayer.pos.x - P.APART, Lplayer.pos.y, 100, 1,0, 360);
      color("cyan");
      particle(Rplayer.pos.x + P.APART, Rplayer.pos.y, 100, 1,0, 360);
    }
    else{
      swapped = false;
      color("cyan");
      particle(Rplayer.pos.x - P.APART, Rplayer.pos.y, 100, 1,0, 360);
      color("purple");
      particle(Lplayer.pos.x + P.APART, Lplayer.pos.y, 100, 1,0, 360);
    }
  }
}
