title = "RINGMATCH";

description = `
[Hold] to expand
Leave to retract
[Mouse] to move
`;

const GAME = {
  WIDTH: 150,
  HEIGHT: 150,
  BGRING_MAXSPEED: 1,
  BGRING_MINSPEED: 0.8,
  RING_MAX: 20,
  RING_MIN: 2,
  RING_SPEED: 0.8,
  MAX_TARGETS: 3,
  TARGET_TIME_MAX: 8,
  TARGET_TIME_MIN: 4,
  WIGGLE_ROOM: 2
};

characters = [];

options = {
  viewSize: {x: GAME.WIDTH, y: GAME.HEIGHT},
  isPlayingBgm: true,
  seed: 1000,
  theme: 'shapeDark',
  isReplayEnabled: true
};

let bgRings;
let ring;
let ringsize;
let targets;
let currentTargetTime

function update() {
  if (!ticks) {
    bgRings = times(20, () => {
      targets = [];
			const posX = rnd(0, GAME.WIDTH);
			const posY = rnd(0, GAME.HEIGHT);
			return {
				pos: vec(posX, posY),
				speed: rnd(GAME.BGRING_MINSPEED, GAME.BGRING_MAXSPEED),
        size: rnd(3, 8)
			};
		});
    ring = {
      pos: vec(GAME.WIDTH * 0.5, GAME.HEIGHT * 0.5)
    };
    ringsize = GAME.RING_MAX/2;
  };
  if(input.isJustReleased || input.isJustPressed){
    play("select");
  }
  if (!input.isPressed && ringsize > GAME.RING_MIN){
    ringsize -= GAME.RING_SPEED*difficulty;
  }
  if(input.isPressed && ringsize <= GAME.RING_MAX){
    ringsize += GAME.RING_SPEED*difficulty;
  }

  bgRings.forEach((s) => {
		s.pos.y += s.speed;
		s.pos.wrap(0, GAME.WIDTH, 0, GAME.HEIGHT);
		color("light_black");
		arc(s.pos, s.size);
	});

  if(targets.length < GAME.MAX_TARGETS * difficulty){
    const targetsToSpawn = round(rnd(1,(GAME.MAX_TARGETS * difficulty)));
    for(let i = 0; i < targetsToSpawn; i++){
      const size = rnd(GAME.RING_MIN, GAME.RING_MAX);
      const posX = rnd(0+size, GAME.WIDTH-size);
      const posY = rnd(0+size, GAME.HEIGHT-size);
      targets.push({pos: vec(posX, posY), time: rnd((GAME.TARGET_TIME_MIN), (GAME.TARGET_TIME_MAX))*60, size: size})
    };
  }

  remove(targets, (t) => {
    color('blue');
    arc(t.pos, t.size);
    color('red')
    arc(t.pos, t.size, t.thickness=1.5, t.angleFrom=0, t.angleTo=(t.time/60));
    
    let hasBeenScored = false;
    if(ring.pos.x > t.pos.x-GAME.WIGGLE_ROOM && ring.pos.x < t.pos.x+GAME.WIGGLE_ROOM &&
      ring.pos.y > t.pos.y-GAME.WIGGLE_ROOM && ring.pos.y < t.pos.y+GAME.WIGGLE_ROOM &&
      ringsize < t.size+GAME.WIGGLE_ROOM && ringsize > t.size-GAME.WIGGLE_ROOM){
        addScore(10*difficulty);
        particle(t.pos);
        play('coin');
        hasBeenScored = true;
    }
    t.time -= 1;
    if(t.time < 1){
      play("explosion");
      end();
    };
    return (hasBeenScored);
  });

  ring.pos = vec(input.pos.x, input.pos.y);
  ring.pos.clamp(0+(ringsize), GAME.WIDTH-(ringsize), 0+(ringsize), GAME.HEIGHT-(ringsize));
  color("yellow");
  arc(ring.pos, ringsize);
}
