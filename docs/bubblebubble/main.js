title = "Bubble Bubble";

description = `
pick up mushrooms &
avoid green bubbles

get to the cauldron

You have 3 lives

[tap] to change
directions
[hold] to slow
`;

characters = [

  `
  pppp
   ppp
    pp
     p
    pp
    pp
`,//a Cat a1
`
pppp
pppppp
pppppp
pppppp
pppppp
  pppp
`,//b Cat a2
`


p
pp
pp
   L
`,//c Cat a3
`

  LL p
 LLL p
LLLL p
LLLL p
LLL pp
`,//d Cat b1
`
pp
pp LL
ppp  p
pppppp
pppppp
  pppp
`,//e Cat b2
`
pp LL
ppp LL
ppp LL
ppp LL
ppp LL
  pp L
`,//f Cat b3
`
LLL pp
 LL pp
    pp
     p
    p
     p
`,//g Cat c1
`
  pppp
pppppp
p pp p
pp
pppppp
  pppp
`,//h Cat c2
`
  pp L
pppp L
 ppp
ppp
pp p
  p
`,//i Cat c3
`

    LL
  LLLL
 LLLGG
LLGGGG
LGGGGG
`,//j Cauldron a1
`
 LLLLL
LLLLLL
LGGGGG
GGGGGG
GGGGGG
GGGGGG
`,//k Cauldron a2
`
LLLLL
LLLLLL
GGGGGL
GGGGGG
GGGGGG
GGGGGG
`,//l Cauldron a3
`

LLL
LLLL
GGLLL
GGGGLL
GGGGGL
`,//m Cauldron a4
`
 LLGGG
  LLLL
 L  LL
LLLL
LLLLLL
LLLLLL
`,//n Cauldron b1
`
GGGGGG
LGGGGG
LLLLLL
  LLLL
LL
LLLLLL
`,//o Cauldron b2
`
GGGGGG
GGGGGL
LLLLLL
LLLL
    LL
LLLLLL
`,//p Cauldron b3
`
GGGLL
LLLL
L   L
 LLLLL
LLLLLL
LLLLLL
`,//q Cauldron b4
`
  Y
  Yr
Y  r Y
rYryrr
rryyrY
 Yrrr
`,//r player fire
`
 GGGG
GggggG
G g gG
Gggg G
Gg g G
 GGGG
`,//s Bubble obstacle
`
 ryr
  rry
  yrrr
  yyry
 yy  r
yy
`,//t ingredients (mushroom)
`
  LLLL
  LLLL
    LL
 LL
LLL
LL
`,//u Cauldron d1
`
LLLLLL
LLLLLL
LLLLLL
LLLLLL

     L
`,//v Cauldron d2
`
LLLLLL
LLLLLL
LLLLLL
LLLLLL

L
`,//w Cauldron d3
`
LLLL
LLLL
LL
   LL
   LLL
    LL
`,//x Cauldron d4
`
     o
    oo
   oo
  oo
 oo
oo
`,//y Spoon
`
 LLLL
LggggL
 LLLL
LLLLLL
LLLLLL
 LLLL
`,//z +1 life
`
 LLLrr
LLLrr
LLrrL
LrrL L
rrL  L
rLL L
`,//unused -1 life
`
 R RR
RR RRR
RRyy
  yyRR
RRR RR
 RR R
`,//unused ingredients (flower)
`
   YY
  yrYY
 yyyrY
 yry
ry
y
`,//unused ingredients (pizza)

];

const S = {
	WIDTH: 225,
	HEIGHT: 225,
  RING_RADIUS_1: 40,
  RING_RADIUS_2: 60,
  RING_RADIUS_3: 80,
  RING_RADIUS_4: 100,
  SPAWN_RATE_MIN: 30,
  SPAWN_RATE_MAX: 120,
  SPAWN_AMOUNT_MIN: 2,
  SPAWN_AMOUNT_MAX: 5,
  MIN_PICKUPS: 4,
  MAX_PICKUPS: 10,
  COMBO_DRAIN_RATE: 0.01,
  COMBO_GAIN_RATE: 1,
};

options = {
  theme: 'dark',
  isPlayingBgm: true,
  viewSize: {x: S.WIDTH, y: S.HEIGHT}
  };


    /**
* @typedef {{
  * ring: 0
  * pos: 0
  * vel: 0
  * }} Pickup
  */
  
  /**
  * @type  { Pickup [] }
  */

   /**
* @typedef {{
  * pos: Vector
  * vel: Vector
  * }} Bubble
  */
  
  /**
  * @type  { Bubble [] }
  */

  let bubbles;
  let pickups;
  let player;
  let counter;
  let bob;
  let slow;
  let spawn;
  let multiplier;
  let noMoreBubbles;
  let spawnPickups;
  let life;

function update() {
  if (!ticks) {
    player = {
      pos:3.14,
      truPos: vec(S.WIDTH/2,S.HEIGHT/2+100),
      ring: 4,
      vel: 0.02,
      clkwise: 1,
    }
    counter = 0;
    bob = 0;
    slow = 1;
    bubbles = [];
    pickups = [];
    spawn = 30;
    multiplier = 1;
    noMoreBubbles = false;
    spawnPickups = true;
    life = 3;
  }

  color("light_yellow");
  arc(S.WIDTH/2,S.HEIGHT/2,S.RING_RADIUS_1);
  arc(S.WIDTH/2,S.HEIGHT/2,S.RING_RADIUS_2);
  arc(S.WIDTH/2,S.HEIGHT/2,S.RING_RADIUS_3);
  arc(S.WIDTH/2,S.HEIGHT/2,S.RING_RADIUS_4);

  //cat + animation
  counter++;
  if(spawn>0){spawn--;}
  else{
    let amount = rnd(S.SPAWN_AMOUNT_MIN,S.SPAWN_AMOUNT_MAX)+difficulty/2;
    for (let i = 0; i < amount; i++) {
      let x = rnd(-1,1);
      let y = rnd(-1,1);
      bubbles.push({
        pos: vec(S.WIDTH/2,S.HEIGHT/2),
        vel: vec(x,y),
      })
    }
    spawn=rndi(S.SPAWN_RATE_MIN,S.SPAWN_RATE_MAX)/difficulty;
  }
  if(spawnPickups){
    for(let i=0; i<4; i++){
      let pickupsInRing = rndi(S.MIN_PICKUPS, S.MAX_PICKUPS);
      pickups[i] = [];
      for(let j=0; j<pickupsInRing; j++){
        let r = 20*(i+2);
        let pos = rnd(3.14,12.56);
        pickups[i].push({
          truPos: vec(r*sin(pos%6.28)+S.WIDTH/2,r*cos(pos%6.28)+S.HEIGHT/2),
        });
      }
    }
    spawnPickups = false;
  }

  if (multiplier>1){multiplier -= (S.COMBO_DRAIN_RATE*(multiplier/2));}

  if(counter%30 == 0){
    if (bob==1){bob=0;}
    else{bob=1}
  }

  color("black");
  //cat
  char("a", S.WIDTH/2-7, S.HEIGHT/2-19-bob);
  char("b", S.WIDTH/2-1, S.HEIGHT/2-19-bob);
  char("c", S.WIDTH/2+4, S.HEIGHT/2-19-bob);
  char("d", S.WIDTH/2-7, S.HEIGHT/2-13-bob);
  char("e", S.WIDTH/2-1, S.HEIGHT/2-13-bob);
  char("f", S.WIDTH/2+5, S.HEIGHT/2-13-bob);
  char("g", S.WIDTH/2-7, S.HEIGHT/2-7-bob);
  char("h", S.WIDTH/2-1, S.HEIGHT/2-7-bob);
  char("i", S.WIDTH/2+5, S.HEIGHT/2-7-bob);
  //cauldron
  char("j", S.WIDTH/2-9, S.HEIGHT/2);
  char("k", S.WIDTH/2-3, S.HEIGHT/2);
  char("l", S.WIDTH/2+3, S.HEIGHT/2);
  char("m", S.WIDTH/2+9, S.HEIGHT/2);
  char("n", S.WIDTH/2-9, S.HEIGHT/2+6);
  char("o", S.WIDTH/2-3, S.HEIGHT/2+6);
  char("p", S.WIDTH/2+3, S.HEIGHT/2+6);
  char("q", S.WIDTH/2+9, S.HEIGHT/2+6);
  //char("r", S.WIDTH/2-9, S.HEIGHT/2+12);
  //char("s", S.WIDTH/2-3, S.HEIGHT/2+12);
  //char("s", S.WIDTH/2+3, S.HEIGHT/2+12);
  //char("t", S.WIDTH/2+9, S.HEIGHT/2+12);
  color("light_black")
  rect(S.WIDTH/2-12, S.HEIGHT/2+9, 24,6)
  color("black")
  char("u", S.WIDTH/2-9, S.HEIGHT/2+18);
  char("v", S.WIDTH/2-3, S.HEIGHT/2+18);
  char("w", S.WIDTH/2+3, S.HEIGHT/2+18);
  char("x", S.WIDTH/2+9, S.HEIGHT/2+18);
  text("LIFE", 5, 10);
  text(`X ${round(multiplier)}`, S.WIDTH-30, 10)
  if(life > 0){char("z", 5, 20);}
  if(life > 1){char("z", 5, 30);}
  if(life > 2){char("z", 5, 40);}

  /*char("r",50,50);
  char("s",56,50);
  char("t",62,50);
  char("y",50,56);
  char("z",56,56);*/
  if(player.ring ==-1 || pickups[player.ring-1].length == 0){
    if(player.ring==-1){
      player.ring = 4;
      play("powerUp");
      spawnPickups = true;
    }
    else if(player.ring<=1){
      player.ring=-1;
      play("coin")
    }
    else{
      player.ring--;
      play("powerUp");
    }
  }

  if(input.isPressed){slow=0.5}
  if(input.isJustReleased){
    slow=1;
    player.clkwise*=(-1)
  }

  let r = 20*(player.ring+1);
  player.truPos = vec(r*sin(player.pos%6.28)+S.WIDTH/2,r*cos(player.pos%6.28)+S.HEIGHT/2);
  if(player.ring<1){
    player.truPos=vec(S.WIDTH/2,S.HEIGHT/2);
    player.pos=3.14;
  }

  char("r",player.truPos);
  player.vel = 0.04*player.clkwise*slow*3/(2+player.ring);
  player.pos+=player.vel;

  bubbles.forEach((b)=>{
    b.pos.x += b.vel.x;
    b.pos.y += b.vel.y;
    char("s",b.pos);
  });

  remove(bubbles,(b)=>{
    const isCollidePlayer = char("s", b.pos).isColliding.char.r;
    if(isCollidePlayer&&player.truPos.x!=S.WIDTH/2){
      play("explosion");
      color("green");
      particle(b.pos);
      color("black");
      life -= 1;
      if(life == 2){
        particle(5, 40);
      } else if(life == 1){
        particle(5, 30)
      } else if (life == 0){
        particle(5, 20);
      } else {
        end();
      }
    }
    return(noMoreBubbles||isCollidePlayer||abs(b.pos.x-S.WIDTH/2)>S.WIDTH/2||abs(b.pos.y-S.HEIGHT/2)>S.HEIGHT/2);
  });

  for(let i=0; i<pickups.length; i++){
    remove(pickups[i], (p)=>{
      const isCollidePlayer = char("t", p.truPos).isColliding.char.r;
      if(isCollidePlayer&&player.truPos.x!=S.WIDTH/2){
        play("coin");
        color("yellow");
        particle(p.truPos);
        color("black");
        multiplier += S.COMBO_GAIN_RATE;
        addScore(10 * multiplier);
      }
      return(isCollidePlayer);
    })
  }
}
