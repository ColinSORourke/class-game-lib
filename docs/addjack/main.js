title = "ADDJACK";

description = `
[Tap] Pick

Reach 21!
`;

characters = [
`
  l
 lll
lllll
  l
  l
  l
`
];

const G = {
  WIDTH: 100,
  HEIGHT: 50,
}

options = {
  isCapturing: true,
  isCapturingGameCanvasOnly: true,
  captureCanvasScale: 2,
  viewSize: {x: G.WIDTH, y: G.HEIGHT},
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 23,
};

/**
 * @typedef {{
 * pos: Vector
 * value: number
 * }} card
 */

/**
 * @type { card [] }
 */
let cards;

/**
 * @typedef {{
 * pos: Vector,
 * length: number
 * }} bar
 */

/**
 * @type { bar }
 */
let timerBar;

/**
 * @typedef {{
 * pos: Vector
 * }} arrow
 */

/**
 * @type { arrow }
 */
let arrowSprite;

let sum;
let current;
let timer;
let cardSpeed;
let cardCooldown;
let cardCooldownMax

function update() {
  if (!ticks) {
    cards = [];
    sum = 0;
    timer = 300;
    cardSpeed = 0.5;
    cardCooldownMax = 30;
    cardCooldown = cardCooldownMax;
    arrowSprite = {
      pos: vec(G.WIDTH - 10, (G.HEIGHT * 0.5) + 10)
    };
    timerBar = {
      pos: vec(1, G.HEIGHT+5),
      length: timer
    };
  }
  timer--;
  cardCooldown--;

  color ("black");
  char("a", arrowSprite.pos);

  //spawning cards
  //maybe make them actual cards instead of just numbers??
  if(cardCooldown <= 0){
    cards.push({
      pos: vec(0, G.HEIGHT * 0.5),
      value: rndi(1, 12)
    })
    cardCooldown = cardCooldownMax;
  }

  color("red");
  rect(0, G.HEIGHT-3, 100-(timer/3), 3);

  remove(cards, (c) => {
    c.pos.x += cardSpeed;

    let ifChosen = false; 
    color("blue")
    text(`${c.value}`, c.pos);

    if(input.isJustPressed && arrowSprite.pos.x-8 < c.pos.x && c.pos.x < arrowSprite.pos.x+8){
      play("coin");
      color("green");
      particle(c.pos);
      ifChosen = true;
      sum += c.value;
      addScore(c.value);
      timer = 300;
    }
    if(sum > 21||timer <= 0){
      end();
      play("explosion");
    }
    if(sum == 21){
      play("powerUp");
      sum = 0;
      cardSpeed += 0.05;
      cardCooldownMax -= 1;
    }
  
    color("green");
    text(`${sum}`, G.WIDTH*0.5-1, G.HEIGHT - 10);

    return (ifChosen || c.pos.x > G.WIDTH);
  })

  
}
