title = "Horde";

description = `
SHOOT PURPLE
RUN FROM BLUE

[hold] to shoot
[release] to 
turn around
`;

characters = [
`
 yyy y
yyyyy 
 y y  
 yyyy 
  yy  
 y  y 
`,//a playerR
`
y yyy
 yyyyy
  y y
 yyyy
  yy
 y  y
`,//b playerL
`
  p
   p
pppppp
 ppppp
  p
ppppp
`,//c flashlightR
`
   p
  p
pppppp
ppppp
   p
 ppppp
`,//d flashlightL
`
   pp
  pppp
   p p
pppppp
  pppp
   p p
`,//e zomboL
`
 pppp
pppppp
 ppp p
  p  p
ppppp
 p p
`,//f skullL
`
 pppp
pppppp
p ppp
p  p
 ppppp
  p p
`,//g skullR
`
 pp
pppp
p p
pppppp
pppp
p p
`,//h zomboR
`

wwwwww
wwwwww


`,//i beam
`
bbbbbb
 bbbb
  bb
bbbbbb
b b b
b b b
`,//j skullTop
`
 b b b
 b b b
bbbbbb
bbbbbb
 bbbb
`,//k skullBot
];

const S = {
	WIDTH: 200,
	HEIGHT: 100,
  ENEM_BASE_HEALTH: 30,
  ENEM_MIN_SPD: 0.2,
  ENEM_MAX_SPD: 0.9,
  ENEM_MIN_SPAWN: 15,
  ENEM_MAX_SPAWN: 90
};

options = {
theme: 'dark',
isPlayingBgm: true,
viewSize: {x: S.WIDTH, y: S.HEIGHT}
};

/**
* @typedef {{
  * pos: Vector
  * }} Star
  */
  
  /**
  * @type  { Star [] }
  */ //from tutorial

  /**
* @typedef {{
  * pos: Vector
  * vel: Vector
  * }} Grass
  */
  
  /**
  * @type  { Grass [] }
  */

 /**
  * @typedef {{
  * pos: 0
  * speed: 0
  * hp: 0
  * }} Enemy
  */

 /**
* @type  { Enemy [] }
*/

  /**
  * @typedef {{
  * pos: Vector
  * }} Beam
  */
  
/**
* @type  { Beam [] }
*/

  let stars; 
  let grass;
  let beamsL;
  let beamsR;
  let beamTemp;
let enemies;
let enemyI1;
let enemyI2;
let enemyIT;
let enemyIB;
let player;
let scoreSkull;
let scoreShoot;
let counter;
let spawn;
let multiplier;
let combo;

function update() {
  if (!ticks) {
    //initial
    stars = times(50, () => {
      const posX =rnd(0,S.WIDTH);
      const posY = rnd(0,S.HEIGHT/2);
      return {
        // Creates a Vector
          pos: vec(posX, posY)
      };
    }
    ); //from tutorial

    grass = times(30, () => {
      const posX =rnd(0,S.WIDTH);
      const posY = rnd(S.HEIGHT/2+3,S.HEIGHT);
      return {
        // Creates a Vector
          pos: vec(posX, posY),
          vel: -1
      };
    }
    );

    counter = 0;
    combo = 0;
    multiplier = 1;

    beamTemp = S.WIDTH/2;

    beamsR = times(16, ()=> {
      const posY = 50;
      const posX = beamTemp+10;
      beamTemp+=6;
      return{
        pos: vec(posX, posY)
      };
    });

    beamTemp = S.WIDTH/2;

    beamsL = times(16, ()=> {
      const posY = 50;
      const posX = beamTemp-10;
      beamTemp-=6;
      return{
        pos: vec(posX, posY)
      };
    });

    beamTemp = S.WIDTH/2;

    player = {
      pos:vec(S.WIDTH/2,S.HEIGHT/2),
      spd:  1,
      faceRight: true,
    }

    enemies = [];

    spawn = rndi(S.ENEM_MIN_SPAWN,S.ENEM_MAX_SPAWN);

    enemyI1 ={
      pos: S.WIDTH+100,
      spd: -0.1
    }
    enemyI2 = {
      pos: -100,
      spd: 0.1
    }
    enemyIT = {
      pos: vec(S.WIDTH/2,3),
      spd:0.5
    }
    enemyIB = {
      pos: S.HEIGHT-3 //only need vertical, otherwise copies enemyIT
    }

    scoreSkull = 0;
    scoreShoot = 0;
  }
  counter++;
  spawn--;
  if (combo>0){combo--;}
  if(combo==0&&multiplier>1){
    multiplier--;
    combo = 32-2*multiplier;
  }
  console.log(difficulty);

  stars.forEach((s) => {
    // Choose a color to draw
    color("light_black");
    // Draw the star as a square of size 1
    box(s.pos, 1);
});

color("yellow");
  text("x"+multiplier.toString(), 3, 10);

color("light_green")
rect(0,S.HEIGHT/2+3,S.WIDTH,S.HEIGHT/2-3)

grass.forEach((g) => {
  g.vel = -1*player.spd;
  g.pos.x += g.vel;
  // Bring the grass back to top once it's past the bottom of the screen
  g.pos.wrap(0, S.WIDTH, 0, S.HEIGHT);

  // Choose a color to draw
  color("green");
  // Draw the grass as a square of size 1
  box(g.pos, 1);
});

if(spawn == 0){
  play("hit");

  const sideCheck = rndi(0,2);
  const right = Boolean(sideCheck);
  var side;
  if (right){side=S.WIDTH+6;}
  else{side=(-6);}

  var run = rnd(S.ENEM_MIN_SPD,S.ENEM_MAX_SPD);
  if(right){run *= (-1);}

  const health = S.ENEM_BASE_HEALTH*(1.3-abs(run));
  
  run*=difficulty;

  enemies.push({
    pos: side,
    speed: run,
    hp: health
  })
  spawn = rndi(S.ENEM_MIN_SPAWN/difficulty,S.ENEM_MAX_SPAWN/difficulty)
}


  if(input.isPressed){   
    player.spd = 0;
    color("light_black")
    if(player.faceRight){
      char("c", player.pos.x+5, player.pos.y)
      //for loop each enemy
      //if x within given delete enemy
      beamsR.forEach((r) => {
        color("yellow");
        char("i", r.pos);
    });

      enemies.forEach((e)=>{
        if(e.pos>S.WIDTH/2){
          e.hp--;
          e.speed *= 0.9;
        }
      });
      
      enemyI1.spd=1;
    }
    else if(!player.faceRight){
      char("d", player.pos.x-5,player.pos.y)
      //for loop each enemy
      //if x within given delete enemy
      beamsL.forEach((l) => {
        color("yellow");
        char("i", l.pos);
    });

    enemies.forEach((e)=>{
      if(e.pos<S.WIDTH/2){
        e.hp--;
        e.speed *= 0.99;
      }
    });

      enemyI2.spd=-1;
    }
    
  }

  if(input.isJustReleased){
    player.faceRight = !player.faceRight;
    if(player.faceRight){player.spd = 1}
    else if (!player.faceRight){player.spd = -1}
    enemyI1.spd=-0.1;//reset Skull speed
    enemyI2.spd=0.1;
  }

  color("light_yellow")
  if(player.faceRight){char("a", player.pos)}
  else if (!player.faceRight){char("b", player.pos)}

  enemies.forEach((e)=>{
    const truSpd = e.speed - player.spd;
    e.pos += truSpd;
    color("purple");
    if(e.pos<S.WIDTH+6&&e.pos>-6){
      if (e.speed < 0){char("e",e.pos,S.HEIGHT/2);}
      else{char("h",e.pos,S.HEIGHT/2);}
    }
  });
  remove(enemies, (e) =>{
      if(e.hp<=0){
        play("powerUp");
        color("light_yellow");
        particle(e.pos,S.HEIGHT/2);
        const points = 10*multiplier;
        scoreShoot +=points;
        multiplier++;
        combo +=32-2*multiplier;
        color("yellow");
        text(points.toString(), e.pos, S.HEIGHT/2-9);
      }
    return (e.hp<=0);
  });

  enemyI1.pos += enemyI1.spd-player.spd;
  enemyI2.pos += enemyI2.spd-player.spd;

  color("purple")
  if(enemyI1.pos<=S.WIDTH+6){char("f",enemyI1.pos, S.HEIGHT/2)}
  if(enemyI2.pos>=-6){char("g",enemyI2.pos, S.HEIGHT/2)}

  if(enemyIT.pos.x > player.pos.x){enemyIT.spd = -0.5;}
  else if(enemyIT.pos.x<player.pos.x){enemyIT.spd = 0.5;}
  else if (enemyIT.pos.y<player.pos.y-3){
    enemyIT.spd = 0;
    enemyIT.pos.y+=0.2*difficulty;
    enemyIB.pos-=0.2*difficulty;
  }
  else{
    enemyIT.spd = 0;
    enemyIT.pos = vec(S.WIDTH/2,S.HEIGHT/2-2);
    enemyIB.pos = S.HEIGHT/2+1;
  }

  if(enemyIT.pos.y>3&&enemyIT.pos.x != player.pos.x){
    enemyIT.pos.y-=0.02/difficulty;
    enemyIB.pos+=0.02/difficulty;
  }

  enemyIT.pos.x += enemyIT.spd-player.spd;

  if(enemyIT.pos.x>-3&&enemyIT.pos.x<S.WIDTH+3){
    color("cyan")
    char("j",enemyIT.pos)
    char("k", enemyIT.pos.x,enemyIB.pos)
  }

  //set game over to enemy in player area, no hitbox necessary

  //score += 0.1;
  if(scoreSkull*10<(enemyI1.pos-S.WIDTH/2)){scoreSkull=(enemyI1.pos-S.WIDTH/2)/10;}
  if(scoreSkull*10<abs(enemyI2.pos)-S.WIDTH/2){scoreSkull=(abs(enemyI2.pos)-S.WIDTH/2)/10;}

  score = scoreSkull + scoreShoot;

color("transparent");
  const playerEnemyCollisionL = box(player.pos, 4).isColliding.char.h;
  const playerEnemyCollisionR = box(player.pos, 4).isColliding.char.e;

  if(enemyI1.pos<S.WIDTH/2+3||enemyI2.pos>S.WIDTH/2-3||enemyIT.pos.y>=player.pos.y-2||playerEnemyCollisionL||playerEnemyCollisionR){
    play("explosion");
    end();
}
}
