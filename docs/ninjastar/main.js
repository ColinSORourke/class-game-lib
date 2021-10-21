title = "NINJA STAR";

description = `
  [Hold]    Angle
  [Release] Throw
`;

characters = [
`
 ll
  l l
ll ll
l l
  ll
`,
`
    ll
 llll
l  l l
llll
llll
 ll
`
];
const G = {
	WIDTH: 100,
	HEIGHT: 150,
  ENEMY_MIN_BASE_SPEED: .15,
  ENEMY_MAX_BASE_SPEED: .4
};

/**
 * @typedef {{
 * pos: Vector,
 * lives: number,
 * angle: number
 * }} Player
 */

/**
 * @type { Player }
 */
let player;

/**
 * @typedef {{
 * pos: Vector
 * }} Enemy
 */

/**
 * @type { Enemy [] }
 */
let enemies;

/**
 * @type { number }
 */
let currentEnemySpeed;

/**
 * @type { number }
 */
let waveCount;

let playerCollision;
let isMoving;
let v;
let bounces;
let combo;
let multiplier;

options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 3,
  theme:"simple"
};

function update() {
  // init
  if (!ticks) {

    player = {
      pos: vec(G.WIDTH * 0.5 , G.HEIGHT - 20),
      angle: 0,
      lives: 3,
    };

    enemies = [];
    bounces = 1;
    waveCount = 0;
    combo = 1;
    currentEnemySpeed = 0;
    multiplier = 1;

    // Another update loop
    // This time, with remove()
    /*remove(enemies, (e) => {
        e.pos.y += currentEnemySpeed;
        color("black");
        char("b", e.pos);

        return (e.pos.y > G.HEIGHT);
    });*/
    
  }
  //player.pos = vec(input.pos.x, input.pos.y);
  //player.pos.clamp(1, G.WIDTH, 1, G.HEIGHT);

  color("black");
  char("a", player.pos);
  if (isMoving) {
    player.pos.add(v);



    
  
    if (player.pos.x > G.WIDTH || player.pos.x < 0) {
      player.angle = 3 - player.angle;
      v = vec(4).rotate(player.angle);
      bounces++;
      player.pos.add(v);

    }


    //reset
    if (player.pos.y < 0 || player.pos.y > G.HEIGHT) {
      isMoving = 0;
      player.angle = 0;
      bounces = 1;
      combo = 1;
      player.pos = vec(input.pos.x , G.HEIGHT - 20);
    }
  }
  
  else {
    
    player.pos.x = input.pos.x;
    player.pos.clamp(2, G.WIDTH-3, 0, G.HEIGHT);
  if (input.isPressed) {
    bar(player.pos, 20, 1, (player.angle -= .075), 0);
  }
  if (input.isJustReleased) {
    play("jump");
    isMoving = 1;
    v = vec(4).rotate(player.angle);
  }
}

  if (enemies.length == 0) {
    currentEnemySpeed =
        rnd(G.ENEMY_MIN_BASE_SPEED, G.ENEMY_MAX_BASE_SPEED) * (difficulty);
    for (let i = 0; i < 6; i++) {
        const posX = rnd(0, G.WIDTH);
        const posY = -rnd(i * G.HEIGHT * 0.1);
        enemies.push({ pos: vec(posX, posY) })
    }
    waveCount++;
}

multiplier = (waveCount * (1.1 * bounces) * (1.1 * combo)).toFixed(1);
text("x" + multiplier, 3, 10);


remove(enemies, (e) => {
  e.pos.y += currentEnemySpeed;
  color("black");
  //char("b", e.pos);

  const isCollidingWithStar = char("b", e.pos).isColliding.char.a;
  //console.log(char("b", e.pos).isColliding.char.a);
  
  // Check whether to make a small particle explosion at the position
  if (isCollidingWithStar && isMoving) {
      //console.log("collision");
      play("explosion");
      color("red");
      particle(e.pos);
      combo++;
      //console.log(bounces);
      addScore(10 * multiplier, e.pos);
  }

  if (e.pos.y > G.HEIGHT) {
    end();
    play("hit");
  }
  return ((isCollidingWithStar && isMoving));
});
 
}
