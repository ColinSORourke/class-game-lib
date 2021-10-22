title = "After Covid";
 
description = 
`
[Click & Hold]
to hug
 
[Mouse] 
to avoid
time commitments
`;
 // to avoid time commitments
characters = 
[
`
  ccc
  ccc
   c
 ccccc
 ccccc
 ccccc
`
,
`
yy yy
 rrr
rwllr
rlwlr
rlllr
yrrry
`
];
 
// ----- Const Variables
const GAME = {
  WIDTH: 150,
  HEIGHT: 100,
  SPAWNCOOLDOWNTIME: 120,
  ROADCOOLDOWNTIME: 14,
  SCROLLSPEED: 1,
  HUGBUFFER: 15,
  HUGTIMEMIN: 20,
  HUGTIMEMAX: 150,
  HUGBAROFFSETX: -4,
  HUGBAROFFSETY: -5,
  HUGBARMIN: 3,
  HUGBARADDMAX: 5,
  PHRASETIME: 120,
  SCORELEVEL0: 30,
  SCORELEVEL1: 60,
  SCORELEVEL2: 100
}

const difficultySpeeds = [1, 1.25, 1.80];
 
const LEVEL = {
  SPAWNX: 155,
  PLAYERX: 25,
  BOTSPAWNY: 25,
  MIDSPAWNY: 50,
  TOPSPAWNY: 75,
  PHRASEX: 40
}
 
// ----- Setting options
options = {
  viewSize: {x: GAME.WIDTH, y: GAME.HEIGHT},
  theme: "crt",
  isPlayingBgm: false,
};
 
// ----- Defining objects
 
// -- Define SpawnCombo --------------------------------
/**
 * @typedef {{
 * bot: number,
 * mid: number,
 * top: number
 * }} SpawnCombo
 */
 
// -- Define Spawner --------------------------------
/**
 * @typedef {{
 * eCooldown: number,
 * fCooldown: number,
 * rCooldown: number
 * }} Spawner
 */
 
// -- Define Enemy --------------------------------
/**
 * @typedef {{
 * pos: Vector
 * }} Enemy
 */
 
// -- Define Friend --------------------------------
/**
 * @typedef {{
 * pos: Vector
 * }} Friend
 */

// -- Define roadbit --------------------------------
/**
 * @typedef {{
 * xPos: number
 * }} roadbit
 */
 
// -- Define Player --------------------------------
/**
 * @typedef {{
 * pos: Vector
 * lane: string
 * isHugging: boolean,
 * currHugTime: number,
 * currHugTarget: number,
 * speedAdd: number
 * currDiff: number
 * }} Player
 */
 
// -- Define Phrase --------------------------------
/**
 * @typedef {{
 * text: string
 * pos: Vector
 * time: number
 * }} Phrase
 */
 
// --- Declaring objects
 
// -- Declare ESpawnCombo Array --------------------------------
/**
 * @type { SpawnCombo [] }
 */
 let ESpawnCombos = [
  {bot: 1, mid: 0, top: 0},
  {bot: 0, mid: 1, top: 0},
  {bot: 0, mid: 0, top: 1},
  {bot: 1, mid: 1, top: 0},
  {bot: 1, mid: 0, top: 1},
  {bot: 0, mid: 1, top: 1},
  {bot: 0, mid: 0, top: 1},
  {bot: 1, mid: 2, top: 0},
  {bot: 2, mid: 1, top: 0},
  {bot: 0, mid: 1, top: 2},
  {bot: 0, mid: 2, top: 1},
  {bot: 2, mid: 1, top: 1},
  {bot: 1, mid: 2, top: 1},
  {bot: 1, mid: 1, top: 2},
];
 
// -- Declare FSpawnCombo Array --------------------------------
/**
* @type { SpawnCombo [] }
*/
 let FSpawnCombos = [
   {bot: 1, mid: 0, top: 0},
   {bot: 0, mid: 1, top: 0},
   {bot: 0, mid: 0, top: 1}  
 ];
 
// -- Declare Phrases Array --------------------------------
/**
* @type { String [] }
*/
let Phrases = [
  'Imissed u 2',
  'Imissed u sm!',
  'its been yrs T_T',
  ':)))',
  ':\')',
  'Ive Missed ur :)',
  'long time no c!',
  'I miss her too',
  '1 more yr tgther',
  'so mny months!',
  'sick of home :(',
  'LOL Ive missed u',
  'I REMEMBER YOU!!',
  'u remembered me!',
  'See u in class!!',
  'See u in lecture!',
  'IN PERSON LECTURE!',
  'we can get dinnr!',
  'missed ur hugs',
  'missed u too T_T',
  'never saw him agn',
  'IveMissed campus 2',
  'lol I luv ur hugs',
  '*fistbump!!*',
  'not since march!',
  'lmk when ur free!',
  'happy to be back',
  'lost our junior yr',
  'atleast senior yr!',
  'back in the dorms',
  'jst like oldtimes',
  'missd studyin w u',
  'Im...back home',
  'Feelslike Im home',
  '<3',
  'never forgot you',
  'Imiss the busdrivr',
  '*warmth* :)',
  'its been too long',
  'senior yr at home'
];
 
// -- Declare spawner --------------------------------
/**
 * @type { Spawner }
 */
let spawner;
 
// -- Declare enemies Array --------------------------------
/**
 * @type { Enemy [] }
 */
let enemies;
 
// -- Declare friends Array --------------------------------
  /**
 * @type { Friend [] }
 */
let friends;
 
// -- Declare activePhrases Array --------------------------------
/**
 * @type { Phrase [] }
 */
let activePhrases;

// -- Declare roadbits Array --------------------------------
/**
 * @type { roadbit [] }
 */
let roadbits;

// -- Declare player --------------------------------
/**
 * @type { Player }
 */
let player;
 
function update() {
  // ----- Initialization --------------------------------
  if (!ticks) {
    // Init spawner
    spawner = {
      eCooldown: GAME.SPAWNCOOLDOWNTIME,
      fCooldown: GAME.SPAWNCOOLDOWNTIME / 2,
      rCooldown: 0
    };
 
    // Init enemies array
    enemies = [];
 
    // Init friends array
    friends = [];

    // Init roadbits array
    roadbits = [];
 
    // Init activePhrases array
    activePhrases = [];
 
    // Init player
    player = {
      pos: vec(LEVEL.PLAYERX,LEVEL.MIDSPAWNY),
      lane: 'mid',
      isHugging: false,
      currHugTime: 0,
      currHugTarget: 1,
      speedAdd: 0,
      currDiff: 0
    }
  }
 
  // ----- Running --------------------------------

  if (score >= GAME.SCORELEVEL2) {
    player.currDiff = 2;
  } else if (score >= GAME.SCORELEVEL1) {
    player.currDiff = 1;
  } else if (score >= GAME.SCORELEVEL0) {
    player.currDiff = 0;
  }

  // Determine Player position based on mouse position
  if (!player.isHugging) {
    if (input.pos.y < GAME.HEIGHT/3) {
      player.pos.y = LEVEL.BOTSPAWNY;
      CheckLaneChange('bot');
    } else if (input.pos.y < 2 * GAME.HEIGHT/3) {
      player.pos.y = LEVEL.MIDSPAWNY;
      CheckLaneChange('mid');
    } else {
      player.pos.y = LEVEL.TOPSPAWNY;
      CheckLaneChange('top');
    }
  }
 
  // Draw Player
  color("cyan");
  //box(player.pos, 5);
  char('a', player.pos.x, player.pos.y);
 
  // Update and draw enemies and remove any that satisfy the conditions
  remove(enemies, (en) => {
    // draw enemy and check collision
    color("black");
    const isCollidingWithPlayer = char('b', en.pos).isColliding.char.a;
 
    // if colliding, end game
    if (isCollidingWithPlayer) {
      color('red');
      text('Rly gotta study', GAME.WIDTH/4, GAME.HEIGHT/3);
      text('Ill just...', GAME.WIDTH/4, 2 * GAME.HEIGHT/3);
      text('see them later', GAME.WIDTH/4, 2.5 * GAME.HEIGHT/3);
      ClearLevel();
      play('hit')
      end();
    }
    
    if (!player.isHugging) {
      // update enemy position
      en.pos.x -= difficultySpeeds[player.currDiff];
    }
 
    // remove unseen enemies
    return en.pos.x < 0;
  });
 
  // Update and draw friends and remove any that satisfy the conditions
  remove(friends, (fr) => {
    // draw friend and check collision
    color("yellow");
    const isCollidingWithPlayer = char('a', fr.pos).isColliding.char.a;
 
    // if colliding, check click
    if (isCollidingWithPlayer && input.isJustPressed) {
      player.isHugging = true;
      player.currHugTarget = rnd(GAME.HUGTIMEMIN, GAME.HUGTIMEMAX);
      color('yellow');
      particle(fr.pos);
      play('select');
    }
 
    if (isCollidingWithPlayer && input.isPressed && player.isHugging) {
      player.currHugTime++;
      let currHugRatio = player.currHugTime / player.currHugTarget;
      color('light_black');
      rect(input.pos.x + GAME.HUGBAROFFSETX, input.pos.y + GAME.HUGBAROFFSETY, 
        GAME.HUGBARMIN + round(GAME.HUGBARADDMAX * player.currHugTarget/GAME.HUGTIMEMAX), 4);
      
      if (abs(player.currHugTarget - player.currHugTime) <= GAME.HUGBUFFER) {
        color('light_green');
        rect(input.pos.x + GAME.HUGBAROFFSETX, input.pos.y + GAME.HUGBAROFFSETY, 
          round(currHugRatio * (GAME.HUGBARMIN + round(GAME.HUGBARADDMAX * player.currHugTarget/GAME.HUGTIMEMAX))), 4);  
      } else if (player.currHugTarget > player.currHugTime) {
        color('light_yellow');
        rect(input.pos.x + GAME.HUGBAROFFSETX, input.pos.y + GAME.HUGBAROFFSETY, 
          round(currHugRatio * (GAME.HUGBARMIN + round(GAME.HUGBARADDMAX * player.currHugTarget/GAME.HUGTIMEMAX))), 4);
      } else {
        color('light_red');
        rect(input.pos.x + GAME.HUGBAROFFSETX, input.pos.y + GAME.HUGBAROFFSETY,
          round(5), 4);
      }
      
    } else if (isCollidingWithPlayer && input.isJustReleased) {
      if ( (player.currHugTime >= player.currHugTarget - GAME.HUGBUFFER) && (player.currHugTime <= player.currHugTarget + GAME.HUGBUFFER) ) {
        player.isHugging = false;
        player.currHugTime = 0;
        color('cyan');
        particle(player.pos, 10, 1);
        addScore(10, fr.pos);
        SayPhrase(player.lane);
        play('jump');
      } else {
        color('yellow')
        text('Awkward hug ^^;', GAME.WIDTH/4, GAME.HEIGHT/3);
        if (player.currHugTime < player.currHugTarget - GAME.HUGBUFFER) {
          text('a lil too short', GAME.WIDTH/4, 2 * GAME.HEIGHT/3);
        } else {
          text('a lil too long', GAME.WIDTH/4, 2 * GAME.HEIGHT/3);
        }
        ClearLevel();
        end();
      }
    }
 
    if (!player.isHugging) {
      // update friend position
      fr.pos.x -= difficultySpeeds[player.currDiff];
    }
 
    // remove unseen friends
    return fr.pos.x < 0;
  });

  // Update and draw friends and remove any that satisfy the conditions
  remove(roadbits, (rb) => {
    // draw friend and check collision
    color('light_blue');
    rect(rb.xPos, LEVEL.BOTSPAWNY + 7, 4, 1);
    rect(rb.xPos, LEVEL.MIDSPAWNY + 7, 4, 1);
    rect(rb.xPos, LEVEL.TOPSPAWNY + 7, 4, 1);

    //console.log(rb)
 
    if (!player.isHugging) {
      // update friend position
      rb.xPos -= difficultySpeeds[player.currDiff];
    }
 
    // remove unseen roadbits
    return rb.xPos < -15;
  });
 
  // Draw phrases and remove them if they satisfy any conditions
  remove(activePhrases, (ph) => {
    if (ph.time <= 0) {
      return true
    }
    
    color('yellow')
    text(ph.text, ph.pos);
    ph.time--;
  });
 
  // tick the spawn timer
  if (!player.isHugging) {
    spawner.eCooldown--;
    spawner.fCooldown--;
    spawner.rCooldown--;
    
    // determine if enemies will spawn
    if (spawner.eCooldown <= 0) {
      let currCombo = ESpawnCombos[rndi(0, ESpawnCombos.length - 1)];
      
      if (currCombo.bot == 1) {
        // create enemy on bottom track
        SpawnEnemy('bot');
      } else if (currCombo.bot == 2) {
        // create friend on bottom track
        SpawnFriend('bot');
      }
  
      if (currCombo.mid == 1) {
        // create enemy on middle track
        SpawnEnemy('mid');
      } else if (currCombo.mid == 2) {
        // create enemy on middle track
        SpawnFriend('mid');
      }
  
      if (currCombo.top == 1) {
        // create enemy on top track
        SpawnEnemy('top');
      } else if (currCombo.top == 2) {
        SpawnFriend('top');
      }
      
      // reset the spawn cooldown
      spawner.eCooldown = GAME.SPAWNCOOLDOWNTIME;
    }

    // determine if friends will spawn
    if (spawner.fCooldown <= 0) {
      let currCombo = FSpawnCombos[rndi(0, FSpawnCombos.length - 1)];
      
      if (currCombo.bot == 1) {
        // create enemy on bottom track
        SpawnFriend('bot');
      }
  
      if (currCombo.mid == 1) {
        // create enemy on middle track
        SpawnFriend('mid');
      }
  
      if (currCombo.top == 1) {
        // create enemy on top track
        SpawnFriend('top');
      }
      
      // reset the friend spawn cooldown
      spawner.fCooldown = GAME.SPAWNCOOLDOWNTIME;
    }

    // determine if roadbit will spawn
    if (spawner.rCooldown <= 0) {
      roadbits.push({xPos: LEVEL.SPAWNX});
      // reset the friend spawn cooldown
      spawner.rCooldown = GAME.ROADCOOLDOWNTIME;
    }
  }
}
 
// --- Helper Functions
function SpawnEnemy(laneName) {
  let lane;
  if (laneName == 'top') {
    lane = LEVEL.TOPSPAWNY;
  } else if (laneName == 'mid') {
    lane = LEVEL.MIDSPAWNY;
  } else {
    lane = LEVEL.BOTSPAWNY;
  }
 
  enemies.push({
    pos: vec(LEVEL.SPAWNX, lane)
  });
}
 
function SpawnFriend(laneName) {
  let lane;
  if (laneName == 'top') {
    lane = LEVEL.TOPSPAWNY;
  } else if (laneName == 'mid') {
    lane = LEVEL.MIDSPAWNY;
  } else {
    lane = LEVEL.BOTSPAWNY;
  }
 
  friends.push({
    pos: vec(LEVEL.SPAWNX, lane)
  });
}
 
function SayPhrase(laneName) {
  let lane;
  if (laneName == 'top') {
    lane = LEVEL.TOPSPAWNY;
  } else if (laneName == 'mid') {
    lane = LEVEL.MIDSPAWNY;
  } else {
    lane = LEVEL.BOTSPAWNY;
  }
 
  activePhrases.push({
    text: Phrases[rndi(0, Phrases.length)],
    pos: vec(LEVEL.PHRASEX, lane),
    time: GAME.PHRASETIME
  });
}

function ClearLevel() {
  remove(enemies, (en) => {
    return en;
  });
  remove(friends, (en) => {
    return en;
  });
  remove(roadbits, (en) => {
    return en;
  });
  remove(activePhrases, (en) => {
    return en;
  });
}

function CheckLaneChange(lane) {
  if (player.lane != lane) {
    player.lane = lane;
    color('light_blue');
    particle(player.pos.x, player.pos.y, 5, 1)
  }
}
 
 
 

