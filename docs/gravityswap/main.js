title = "Gravity Swap";

description = `
  [Hold] Space
      
       to
  Change Gravity
      (drop)
`;

characters = [

  `
  rrr
 ll   
yrbbll
yrbbll
 ll   
  rrr
   `,
 `
 rrrr  
llllll
 bbbb
 bbbb
llllll
 rrrr
   `,
   `
 bbbb  
 yyyy
rrrrrr
rrrrrr
 yyyy
 bbbb
   `
   ,
   `
bbbb  
yyyy
rrrryyyy
rrrryyyy
yyyy
bbbb
   `
];

const G = {
	WIDTH: 100,
	HEIGHT: 100,
  STAR_SPEED_MIN: 0.5,
	STAR_SPEED_MAX: 1.0
};


options = {
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  theme:"pixel",
  isPlayingBgm: true,
  isReplayEnabled: false,
  seed: 2000,
};

/**
* @typedef {{
  * pos: Vector,
  * speed: number
  * }} Star
  */
  
  /*** @type  { Star [] }*/
  let stars;

/** @type {{x: number, height: number}[]} */
let walls;
let wallHeight;
let wallHeightVel;
let ship;
let swap;
let scrolling;

let time = 0;

//************************************* */
function update() {
  if (!ticks) {

    stars = times(40, () => {
      
      const posX = rnd(0, G.WIDTH);
      const posY = rnd(0, G.HEIGHT);
      // An object of type Star with appropriate properties
      return {
        // Creates a Vector
          pos: vec(posX, posY),
          // More RNG
          speed: rnd(G.STAR_SPEED_MIN, G.STAR_SPEED_MAX)
          
      };

    });

    walls = times(11, (i) => {
      return { x: i * 10, height: 10 };

      
    });
    wallHeight = 70;
    wallHeightVel = 20;


    ship = { pos: vec(10, 50), vy: 0 };
    scrolling = 1;
  }


  //********************************* */
  scrolling = difficulty;
  score += scrolling / 100;
  
 //********************************** */
  const scr = difficulty * 0.4;
  /** @type {Color} */
  // @ts-ignore
  const wallColor = [
    "purple", "blue", "green", "red","yellow"]
    [floor(ticks / 20) % 5];
  color(wallColor);

//Generate Walls
  walls.forEach((w) => {
    w.x -= scr;
    if (w.x < -10) {
      w.x += 110;
      wallHeight += wallHeightVel;
      if (
        (wallHeight < 20 && wallHeightVel < 0) ||
        (wallHeight > 70 && wallHeightVel > 0)
      ) {
        wallHeightVel *= -1;
        wallHeight += wallHeightVel;
      } else if (rnd() < 0.5) {
        wallHeightVel = 5;
      } else if (rnd() < 0.3) {
        wallHeightVel = rnd() < 0.5 ? -10 : 10;
      }
      w.height = wallHeight;
     
    }
    rect(w.x, 90 - w.height, 9, w.height);
    rect(w.x, 0, 9, 5);
  });
  
  //Generate players
  if (swap) {
    ship.vy -= input.isPressed ? 0.0001 : 0.004;
    ship.pos.y += ship.vy;
    }
  color("black");
  ship.vy += 0.001555 * difficulty;
  ship.vy *= 0.9855;
  ship.pos.y += ship.vy;
  if (
    char("ab ", ship.pos).isColliding.rect[
      wallColor
    ]
  ) {
    play("explosion");
    end();
  }
//ship tail praticle
  color("blue");
  particle(ship.pos.x - 2, ship.pos.y, 0.5, 0.5, PI, PI / 5);

  //Hold to change gravity
  if(!swap && input.isPressed){
    play("lucky")
    swap = true;
    ship.vy = 0.1;
  }
//Stars color
 /** @type {Color} */
  // @ts-ignore
  const s = [
    "purple", "blue", "green", "red","yellow"]
    [floor(time / 20) % 5];
  color(s);
  if(ticks != undefined && ticks >= 0) time = ticks;

  //Generate stars
  stars.forEach((s) => {
    // Move the star forward
    s.pos.x += s.speed;
    // Bring the star back to top once it's past the bottom of the screen
    if (s.pos.x > G.WIDTH) s.pos.x = 0;
    // Choose a color to draw
    char( ".", s.pos);
    // Draw the star as a square of size 1
    box(s.pos, 1);
  });

}