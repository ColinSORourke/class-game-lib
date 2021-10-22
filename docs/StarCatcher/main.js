title = "Star Catcher";

description = `
    [Click]
 Grapple onto 
   a Start
  
Don't let them
   get past!
`;

characters = [   //Custom Sprites
  `
  y
 yby
ybyby
 yby
  y
  `
  ,
  `
  pppp
  pppp
  pppp
  pppp
  `
];

const G = {   //Data we can call later
  WIDTH: 120,
  HEIGHT: 180
}

options = {
  theme:'shapeDark',
  //seed: 53, //9 is good, 46 is ok, 53 is good
  //isPlayingBgm: true,
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 17
};


let hooks
let player
let nextHookTicks;
let hooklaneSpeeds
const hooklaneCount = 4;
const hooklaneWidth = 20;
let spawnLocation
let bgStars


function update() {
  if (!ticks) {
    player = vec(0, 0); 
    hooks = []
    nextHookTicks = 0;
    hooklaneSpeeds = times(hooklaneCount, () => 1);
    bgStars = times(100, () => vec(rnd(0, G.WIDTH), rnd(0, G.HEIGHT)));
     
    
  }
  // code for the background stars
  color("light_black")
  bgStars.forEach((s) => {
    box(s, 1, 1);
  });
  nextHookTicks--;
  if (nextHookTicks < 0) {
    //play("select");
    const hooklaneIndex = rndi(hooklaneCount);
    hooks.push({
      pos: vec(rnd(10, 110), 0),
      //Messes with the speed
      vx: -rnd(1, sqrt(difficulty)) * 0.5,
      hooklaneIndex,
    });
    nextHookTicks = rnd(1, 60) / difficulty;
  }
  color("cyan")
  let playerChar = box(player, 5, 5)
  color("light_black")
  box(G.WIDTH/2, 10, 30, 30)

  
  remove(hooks, (e) => {
    e.pos.y -= e.vx * hooklaneSpeeds[e.hooklaneIndex] * difficulty;
    color("black")
    const hook = char("a", e.pos.x, e.pos.y)
    if(input.isJustPressed){
      if((input.pos.x > e.pos.x - 4  && input.pos.x < e.pos.x + 4) && (input.pos.y > e.pos.y - 4  && input.pos.y < e.pos.y + 4)) {
        color("cyan")
        //Spawn a particle at the last player location
        particle(
          player.x, // x coordinate
          player.y, // y coordinate
          10, // The number of particles
          1.5, // The speed of the particles
          PI/2, // The emitting angle
          PI/4  // The emitting width
        );
        line(player, input.pos)
        player = vec(e.pos.x, e.pos.y)
        addScore(1 + player.y/10, e.pos)
        color("yellow")
        particle(e.pos, 10, 0.8, 1, 10);
        play("coin");
        return true
      }
    }
    if(e.pos.y > G.HEIGHT){
      play("explosion")
      end()
    }
  });

  if((player.y >= hooks.y - 5 || player.y <= hooks.y + 5) && (player.x >= hooks.x - 15 && player.x <= hooks.x + 15)){
    player.y -= hooks.vx * hooklaneSpeeds[hooks.hooklaneIndex];
  }
  else{
    player.y += 2 * difficulty;
  }
  if(player.y > G.HEIGHT){
    play("explosion")
    end()
  }
  function calcX(i) {
    return i * hooklaneWidth + hooklaneWidth / 2 + 12;
  }
  
}