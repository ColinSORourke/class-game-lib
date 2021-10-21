title = "Color Of Fortune";

description = `         [TAP] 

    Change Direction

LSide = Counter Clockwise

RSide = Clockwise


  [HOLD] Stop Rotation
`;

characters = [
// "Enemy" Shapes
  `
  bb
 bbbb
bbbbbb
bbbbbb
 bbbb
  bb
 `,
 `
  bb
 bbbb
bbbbbb
bbbbbb
 bbbb
  bb
  `,
  `
  bb
 bbbb
bbbbbb
bbbbbb
 bbbb
  bb  
  `,
  `
  bb
 bbbb
bbbbbb
bbbbbb
 bbbb
  bb
  `,
];

// Game Property Constants
const G = {
  // View size
  WIDTH: 150,
  HEIGHT: 150,
};

// Wheel Property Constants
const W = {
  // Center of the wheel (X/Y)
  CENTER: vec(G.WIDTH/2, G.HEIGHT/2),

  // Radius and Thickness
  RADIUS: 18,
  THICKNESS: 2,

  // Arc starting/ending angels
  BLUESTART: -(3*PI/4),
  BLUEEND: -(PI/4),
  REDSTART: -(PI/4),
  REDEND: PI/4,
  YELLOWSTART: (3*PI)/4,
  YELLOWEND:  PI/4,
  GREENSTART: -(3*PI/4),
  GREENEND:-(5*PI/4),

  // Speed of rotation
  SPEED: 0.083
};

options = {
  viewSize: {x: G.WIDTH, y:G.HEIGHT},
  theme: 'shapeDark',
  seed: 10,
  isPlayingBgm: true,
  isReplayEnabled: true,
  isDrawingParticleFront: false,
  isCapturing: true,
};

// Enemy Creations

// North Enemies
/** @typedef {{ pos: Vector, speed: number}[]} */
let nbEnemy;
/** @typedef {{ pos: Vector, speed: number}[]} */
let nrEnemy;
/** @typedef {{ pos: Vector, speed: number}[]} */
let nyEnemy;
/** @typedef {{ pos: Vector, speed: number}[]} */
let ngEnemy;

// West Enemies
/** @typedef {{ pos: Vector, speed: number}[]} */
let wbEnemy;
/** @typedef {{ pos: Vector, speed: number}[]} */
let wrEnemy;
/** @typedef {{ pos: Vector, speed: number}[]} */
let wyEnemy;
/** @typedef {{ pos: Vector, speed: number}[]} */
let wgEnemy;


// East Enemies
/** @typedef {{ pos: Vector, speed: number}[]} */
let ebEnemy;
/** @typedef {{ pos: Vector, speed: number}[]} */
let erEnemy;
/** @typedef {{ pos: Vector, speed: number}[]} */
let eyEnemy;
/** @typedef {{ pos: Vector, speed: number}[]} */
let egEnemy;


// South Enemies
/** @typedef {{ pos: Vector, speed: number}[]} */
let sbEnemy;
/** @typedef {{ pos: Vector, speed: number}[]} */
let srEnemy;
/** @typedef {{ pos: Vector, speed: number}[]} */
let syEnemy;
/** @typedef {{ pos: Vector, speed: number}[]} */
let sgEnemy;

// JSDoc comments for typing
/**
 * @typedef {{
 * pos: Vector,
 * speed: number
 * }} Rain
 */

/**
 * @type { Rain [] }
 */
let raining;
let rain_color
// Direction it spins
let direction;

// Handles wheel rotation
let rotation;

// Speed at which enemies spawn
let spawn;

// Speed at which enemies move
let enemySpeed;

// Chooses where the enemy will spawn
let randomSpawn;

// Stores Arc Definitions
let blueArcDef;
let redArcDef;
let greenArcDef;
let yellowArcDef;

function update() {
  if (!ticks) {
    // Enemy Definitions
    nbEnemy = [];
    nrEnemy = [];
    nyEnemy = [];
    ngEnemy = [];

    wbEnemy = [];
    wrEnemy = [];
    wyEnemy = [];
    wgEnemy = [];

    ebEnemy = [];
    erEnemy = [];
    eyEnemy = [];
    egEnemy = [];
    
    sbEnemy = [];
    srEnemy = [];
    syEnemy = [];
    sgEnemy = [];

    raining = times(25, () => {
      // Random number generator function
            // rnd( min, max )
            const posX = rnd(0, G.WIDTH);
            const posY = rnd(0, G.HEIGHT);
            // An object of type Star with appropriate properties
            return {
                // Creates a Vector
                pos: vec(posX, posY),
                // More RNG
                speed: rnd(0.3, 0.9)
            };
    })
    //Determining rain color
    rain_color = false
    // Speed at which wheel rotates
    rotation = 0;

    // False = Clockwise True = Counter-Clockwise
    direction = false;

    // Determines when the next enemy can spawn (When the one before it gets removed)
    spawn = true;

    // Original Enemy Speed
    enemySpeed = 0.5;
  }

  // Color of rain depends on enemy color
  if(randomSpawn == 1 || randomSpawn == 5 || randomSpawn == 9 || randomSpawn == 13){
    color("light_blue");
  }
  else if(randomSpawn == 2 || randomSpawn == 6 || randomSpawn == 10 || randomSpawn == 14){
    color("light_red");
  }
  else if(randomSpawn == 3 || randomSpawn == 7 || randomSpawn == 11 || randomSpawn == 15){
    color("light_yellow");
  }
  else if(randomSpawn == 4 || randomSpawn == 8 || randomSpawn == 12 || randomSpawn == 16){
    color("light_green");
  }
  // Update for Rain
  raining.forEach((s) => {
    // Move the star downwards
    s.pos.y += s.speed;
    // Bring the star back to top once it's past the bottom of the screen
    if (s.pos.y > G.HEIGHT) s.pos.y = 0;
 
    box(s.pos, 1);
});
 
  // Wheel Movement with Tapping
  if(input.pos.x > G.WIDTH/2 && input.isJustPressed)
  {
    rain_color = false
    direction = false;
  }
  else if(input.pos.x < G.WIDTH/2 && input.isJustPressed)
  {
    rain_color = true
    direction = true;
  }

  // Stops Wheel with Holding and Side Indicator in Middle of Wheel
  if(input.isPressed){
    rotation = rotation;
    if(direction == false){
      color("light_purple");
      arc(W.CENTER, 14, 7, PI/2 - 0.3, -PI/2 + 0.3);
      color("light_purple");
      box(G.WIDTH/2 + 6, G.HEIGHT/2 + 0.5 , 10.5, 34);
      color("black");
      text("R", G.WIDTH/2 + 7, G.HEIGHT/2 );
    }
    else{
      color("light_purple");
      arc(W.CENTER, 14, 7, PI/2 + 0.3, ((3*PI)/2) - 0.3);
      color("light_purple");
      box(G.WIDTH/2 - 4, G.HEIGHT/2 + 0.5 , 10.5, 34);
      color("black");
      text("L", G.WIDTH/2 - 8, G.HEIGHT/2 );
    }
  }
  else{
    if(direction == false){
      rotation = rotation + W.SPEED + (difficulty/150);

      color("light_purple");
      arc(W.CENTER, 14, 7, PI/2 - 0.3, -PI/2 + 0.3);
      color("light_purple");
      box(G.WIDTH/2 + 6, G.HEIGHT/2 + 0.5 , 10.5, 34);
      color("black");
      text("R", G.WIDTH/2 + 7, G.HEIGHT/2 );
    }
    else{
      rotation = rotation - W.SPEED - (difficulty/150);

      color("light_purple");
      arc(W.CENTER, 14, 7, PI/2 + 0.3, ((3*PI)/2) - 0.3);
      color("light_purple");
      box(G.WIDTH/2 - 4, G.HEIGHT/2 + 0.5 , 10.5, 34);
      color("black");
      text("L", G.WIDTH/2 - 8, G.HEIGHT/2 );
    }
  }

  // Colorful Border
  color("blue");
  box(G.WIDTH/4 - 10, 1, G.WIDTH/2, 1);
  box(1, G.HEIGHT/4 - 10, 1, G.HEIGHT/2);
  color("red");
  box(G.WIDTH, G.HEIGHT/4 - 10, 1, G.HEIGHT/2);
  box(G.WIDTH  + 10, 1, G.WIDTH, 1);
  color("yellow");
  box(G.WIDTH  + 10, G.HEIGHT, G.WIDTH, 1);
  box(G.WIDTH, G.HEIGHT + 10, 1, G.HEIGHT);
  color("green");
  box(G.WIDTH/4 - 10, G.HEIGHT, G.WIDTH/2, 1);
  box(1, G.HEIGHT + 10, 1, G.HEIGHT);

  // Spawn Enemies
  if(spawn == true){

    // Random number between 1 and 16
    randomSpawn = rndi(1,16);

    // Enemies speed up as time goes on
    enemySpeed = enemySpeed + (difficulty / 60);

    if(randomSpawn == 1){
      nbEnemy.push({
        pos: vec(G.WIDTH/2, -10),
        speed: enemySpeed
      });
      color("blue");
      particle(G.WIDTH/2,0, 200, 1.3,0, 360);
    }
    else if(randomSpawn == 2){
      nrEnemy.push({
        pos: vec(G.WIDTH/2, -10),
        speed: enemySpeed
      });
      color("red");
      particle(G.WIDTH/2, 0, 200, 1.3,0, 360);

    }
    else if(randomSpawn == 3){
      nyEnemy.push({
        pos: vec(G.WIDTH/2, -10),
        speed: enemySpeed
      });
      color("yellow");
      particle(G.WIDTH/2, 0, 200, 1.3,0, 360);

    }
    else if(randomSpawn == 4){
      ngEnemy.push({
        pos: vec(G.WIDTH/2, -10),
        speed: enemySpeed
      });
      color("green");
      particle(G.WIDTH/2, 0, 200, 1.3,0, 360);

    }
    else if(randomSpawn == 5){
      wbEnemy.push({
        pos: vec(-10, G.HEIGHT/2),
        speed: enemySpeed
      });
      color("blue");
      particle(0, G.HEIGHT/2, 200, 1.3,0, 360);
    }
    else if(randomSpawn == 6){
      wrEnemy.push({
        pos: vec(-10, G.HEIGHT/2),
        speed: enemySpeed
      });
      color("red");
      particle(0, G.HEIGHT/2, 200, 1.3,0, 360);
    }
    else if(randomSpawn == 7){
      wyEnemy.push({
        pos: vec(-10, G.HEIGHT/2),
        speed: enemySpeed
      });
      color("yellow");
      particle(0, G.HEIGHT/2, 200, 1.3,0, 360);
    }
    else if(randomSpawn == 8){
      wgEnemy.push({
        pos: vec(-10, G.HEIGHT/2),
        speed: enemySpeed
      });
      color("green");
      particle(0, G.HEIGHT/2, 200, 1.3,0, 360);
    }
    else if(randomSpawn == 9){
      ebEnemy.push({
        pos: vec(G.WIDTH + 10, G.HEIGHT/2),
        speed: enemySpeed
      });
      color("blue");
      particle(G.WIDTH, G.HEIGHT/2, 200, 1.3,0, 360);
    }
    else if(randomSpawn == 10){
      erEnemy.push({
        pos: vec(G.WIDTH + 10, G.HEIGHT/2),
        speed: enemySpeed
      });
      color("red");
      particle(G.WIDTH, G.HEIGHT/2, 200, 1.3,0, 360);
    }
    else if(randomSpawn == 11){
      eyEnemy.push({
        pos: vec(G.WIDTH + 10, G.HEIGHT/2),
        speed: enemySpeed
      });
      color("yellow");
      particle(G.WIDTH, G.HEIGHT/2, 200, 1.3,0, 360);
    }
    else if(randomSpawn == 12){
      egEnemy.push({
        pos: vec(G.WIDTH + 10, G.HEIGHT/2),
        speed: enemySpeed
      });
      color("green");
      particle(G.WIDTH, G.HEIGHT/2, 200, 1.3,0, 360);
    }
    else if(randomSpawn == 13){
      sbEnemy.push({
        pos: vec(G.WIDTH/2, G.HEIGHT + 10),
        speed: enemySpeed
      });
      color("blue");
      particle(G.WIDTH/2, G.HEIGHT, 200, 1.3,0, 360);
    }
    else if(randomSpawn == 14){
      srEnemy.push({
        pos: vec(G.WIDTH/2, G.HEIGHT + 10),
        speed: enemySpeed
      });
      color("red");
      particle(G.WIDTH/2, G.HEIGHT, 200, 1.3,0, 360);
    }
    else if(randomSpawn == 15){
      syEnemy.push({
        pos: vec(G.WIDTH/2, G.HEIGHT + 10),
        speed: enemySpeed
      });
      color("yellow");
      particle(G.WIDTH/2, G.HEIGHT, 200, 1.3,0, 360);
    }
    else if(randomSpawn == 16){
      sgEnemy.push({
        pos: vec(G.WIDTH/2, G.HEIGHT + 50),
        speed: enemySpeed
      });
      color("green");
      particle(G.WIDTH/2, G.HEIGHT, 200, 1.3,0, 360);
    }

    spawn = false;
  }

  // Move Enemies
  nbEnemy.forEach((nb) => {
    nb.pos.y += nb.speed;
    color("blue");
    char("c", nb.pos.x, nb.pos.y);
  });
  nrEnemy.forEach((nr) => {
    nr.pos.y += nr.speed;
    color("red");
    char("b", nr.pos.x, nr.pos.y);
  });
  nyEnemy.forEach((ny) => {
    ny.pos.y += ny.speed;
    color("yellow");
    char("d", ny.pos.x, ny.pos.y);
  });
  ngEnemy.forEach((ng) => {
    ng.pos.y += ng.speed;
    color("green");
    char("a", ng.pos.x, ng.pos.y);
  });
  wbEnemy.forEach((wb) => {
    wb.pos.x += wb.speed;
    color("blue");
    char("c", wb.pos.x, wb.pos.y);
  });
  wrEnemy.forEach((wr) => {
    wr.pos.x += wr.speed;
    color("red");
    char("b", wr.pos.x, wr.pos.y);
  });
  wyEnemy.forEach((wy) => {
    wy.pos.x += wy.speed;
    color("yellow");
    char("d", wy.pos.x, wy.pos.y);
  });
  wgEnemy.forEach((wg) => {
    wg.pos.x += wg.speed;
    color("green");
    char("a", wg.pos.x, wg.pos.y);
  });
  ebEnemy.forEach((eb) => {
    eb.pos.x -= eb.speed;
    color("blue");
    char("c", eb.pos.x, eb.pos.y);
  });
  erEnemy.forEach((er) => {
    er.pos.x -= er.speed;
    color("red");
    char("b", er.pos.x, er.pos.y);
  });
  eyEnemy.forEach((ey) => {
    ey.pos.x -= ey.speed;
    color("yellow");
    char("d", ey.pos.x, ey.pos.y);
  });
  egEnemy.forEach((eg) => {
    eg.pos.x -= eg.speed;
    color("green");
    char("a", eg.pos.x, eg.pos.y);
  });
  sbEnemy.forEach((sb) => {
    sb.pos.y -= sb.speed;
    color("blue");
    char("c", sb.pos.x, sb.pos.y);
  });
  srEnemy.forEach((sr) => {
    sr.pos.y -= sr.speed;
    color("red");
    char("b", sr.pos.x, sr.pos.y);
  });
  syEnemy.forEach((sy) => {
    sy.pos.y -= sy.speed;
    color("yellow");
    char("d", sy.pos.x, sy.pos.y);
  });
  sgEnemy.forEach((sg) => {
    sg.pos.y -= sg.speed;
    color("green");
    char("a", sg.pos.x, sg.pos.y);
  });

    // Color Wheel Arc Updates
    color("blue");
    blueArcDef = arc(W.CENTER, W.RADIUS, W.THICKNESS, W.BLUESTART + rotation, W.BLUEEND + rotation);

    color("red");
    redArcDef = arc(W.CENTER, W.RADIUS, W.THICKNESS, W.REDSTART + rotation, W.REDEND + rotation);

    color("yellow");
    yellowArcDef = arc(W.CENTER, W.RADIUS, W.THICKNESS, W.YELLOWSTART + rotation, W.YELLOWEND + rotation);

    color("green");
    greenArcDef = arc(W.CENTER, W.RADIUS, W.THICKNESS, W.GREENSTART + rotation, W.GREENEND + rotation);

    // Collision Detection
    if(greenArcDef.isColliding.char.a){
      addScore(10);
      spawn = true;
      play("hit");
      color("green");

      remove(ngEnemy, (ng) =>{
        particle(ng.pos.x, ng.pos.y, 20, 1,0, 360);
        return true;
      });
      remove(egEnemy, (eg) =>{
        particle(eg.pos.x, eg.pos.y, 20, 1,0, 360);
        return true;
      });
      remove(sgEnemy, (sg) =>{
        particle(sg.pos.x, sg.pos.y, 20, 1,0, 360);
        return true;
      });
      remove(wgEnemy, (wg) =>{
        particle(wg.pos.x, wg.pos.y, 20, 1,0, 360);
        return true;
      });
    }
    else if(blueArcDef.isColliding.char.a || yellowArcDef.isColliding.char.a || redArcDef.isColliding.char.a){
      play("explosion");
      end();
    }

    if(redArcDef.isColliding.char.b){
      addScore(10);
      spawn = true;
      play("hit");
      color("red");
      
      remove(nrEnemy, (nr) =>{
        particle(nr.pos.x, nr.pos.y, 20, 1,0, 360);
        return true;
      });
      remove(erEnemy, (er) =>{
        particle(er.pos.x, er.pos.y, 20, 1,0, 360);
        return true;
      });
      remove(srEnemy, (sr) =>{
        particle(sr.pos.x, sr.pos.y, 20, 1,0, 360);
        return true;
      });
      remove(wrEnemy, (wr) =>{
        particle(wr.pos.x, wr.pos.y, 20, 1,0, 360);
        return true;
      });
    }
    else if(blueArcDef.isColliding.char.b || yellowArcDef.isColliding.char.b || greenArcDef.isColliding.char.b){
      play("explosion");
      end();
    }

    if(blueArcDef.isColliding.char.c){
      addScore(10);
      spawn = true;
      play("hit");
      color("blue");

      remove(nbEnemy, (nb) =>{
        particle(nb.pos.x, nb.pos.y, 20, 1,0, 360);
        return true;
      });
      remove(ebEnemy, (eb) =>{
        particle(eb.pos.x, eb.pos.y, 20, 1,0, 360);
        return true;
      });
      remove(sbEnemy, (sb) =>{
        particle(sb.pos.x, sb.pos.y, 20, 1,0, 360);
        return true;
      });
      remove(wbEnemy, (wb) =>{
        particle(wb.pos.x, wb.pos.y, 20, 1,0, 360);
        return true;
      });
    }
    else if(redArcDef.isColliding.char.c || yellowArcDef.isColliding.char.c || greenArcDef.isColliding.char.c){
      play("explosion");
      end();
    }

    if(yellowArcDef.isColliding.char.d){
      addScore(10);
      spawn = true;
      play("hit");
      color("yellow");

      remove(nyEnemy, (ny) =>{
        particle(ny.pos.x, ny.pos.y, 20, 1,0, 360);
        return true;
      });
      remove(eyEnemy, (ey) =>{
        particle(ey.pos.x, ey.pos.y, 20, 1,0, 360);
        return true;
      });
      remove(syEnemy, (sy) =>{
        particle(sy.pos.x, sy.pos.y, 20, 1,0, 360);
        return true;
      });
      remove(wyEnemy, (wy) =>{
        particle(wy.pos.x, wy.pos.y, 20, 1,0, 360);
        return true;
      });
    }
    else if(blueArcDef.isColliding.char.d || redArcDef.isColliding.char.d || greenArcDef.isColliding.char.d){
      play("explosion");
      end();
    }  
}
