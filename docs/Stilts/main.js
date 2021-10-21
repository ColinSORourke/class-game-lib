// Title of the game
title = "Stilts";

// Instruction to play the game
description = `
[Tap] Climb up/down\n
[Hold] Accelerate
       across gaps
`;

// Sprites in the game
characters = [
	`
llllll
ll l l
ll l l
llllll
 l  l
 l  l
`,
	`
llllll
ll l l
ll l l
llllll
ll  ll
`,
	`
yyyyyy
yyyyyy
`,
`
  yy
 yy
llllll
llllll
 yy
  yy
`
];

// The Variable for setting up the game
const GAME = {
	WIDTH: 150,
	HEIGHT: 110,
	PLAYERSPEED: 2,
	GROUND_OFFSET: 20,
	GRAVITY: 0.5
}

// Different option in the game
options = {
	isPlayingBgm: true,
	isReplayEnabled: true,
	seed: 11,
	viewSize: { x: GAME.WIDTH, y: GAME.HEIGHT },
	isCapturing: true,
    isCapturingGameCanvasOnly: true,
    captureCanvasScale: 5,
	theme:"dark"
};

// Create different Jsdoc for different elements in the game
/** @type {{pos: Vector, angle: number}} */
let player;
let stiltsLeftAngle;
let stiltsRightAngle;
let flip;
let interchange;
let onGround;
// Create different Jsdoc for different elements in the game
/** @type {{pos: Vector, width: number}[]} */
let Ground;
let nextGroundDist;
let isColliding;
let isup;
let missiles;
let endticks;
// Create different Jsdoc for different elements in the game
/** @type {{pos: Vector, speed: number}[]} */
let strips;

// Where game update
function update() {
	// Initialize varaibles
	if (!ticks) {
		isColliding = false;
		Ground = [];
		player = { pos: vec(GAME.WIDTH / 2, GAME.HEIGHT - 11), angle: -PI / 2 };
		stiltsLeftAngle = PI / 2;
		stiltsRightAngle = PI / 2;
		isup = true;
		flip = false;
		interchange = false;
		onGround = false;
		Ground.push({
			pos: vec(0, GAME.HEIGHT - 10),
			width: GAME.WIDTH
		});
		nextGroundDist = 0;
		missiles = [];
		endticks = -1;

		// Special Effect when accelerate
		strips = times(20, () => {
            // Random number generator function
            // rnd( min, max )
            const posX = rnd(0, GAME.WIDTH);
            const posY = rnd(0, GAME.HEIGHT);
            // An object of type Star with appropriate properties
            return {
	            // Creates a Vector
                pos: vec(posX, posY),
                // More RNG
                speed: rnd(0.5, 1.0)
            };
        });

	}
	addScore(1);

	// The Difficulty of the game.
	const scr = sqrt(difficulty);

	 // Update for Star
	 strips.forEach((s) => {
        // Move the star downwards
        s.pos.x -= (s.speed*2);
        // Bring the star back to top once it's past the bottom of the screen
        s.pos.wrap(0, GAME.WIDTH, 0, GAME.HEIGHT);

        // Choose a color to draw
		if (input.isPressed){
			color("black");
		} else{
			color("transparent");
		}
        // Draw the star as a square of size 1
        bar(s.pos.x, s.pos.y, 10, 1, 0, 0);
    });

	// Push ground pos and width into the Ground Array
	if (Ground.length === 0) {
		nextGroundDist = 0;
	}
	nextGroundDist -= scr;
	if (nextGroundDist < 0) {
		const width = rnd(40, 80);
		Ground.push({
			pos: vec(GAME.WIDTH, GAME.HEIGHT - 10),
			width
		});
		nextGroundDist += width + rnd(10, 20);
	}
	Ground.forEach((g) => {
		g.pos.x -= scr;
		color("green");
		rect(g.pos.x, g.pos.y, g.width, 26);
	});
	while (missiles.length < 1) {
		let posX = rnd(GAME.WIDTH, 3 * GAME.WIDTH);
		let posY = rndi(0, 2) ? (player.pos.y - 16): (player.pos.y - 6);
		missiles.push({
			pos: vec(posX, posY),
		});}
	
	if(input.isJustPressed){
		isup = isup ? false : true;
	}

	// Add Stilts Steps for the player
	color("yellow");
	bar(player.pos.x - 5, player.pos.y - 9, 20, 3, stiltsLeftAngle, 0.5).isColliding;
	bar(player.pos.x + 5, player.pos.y - 9, 20, 3, stiltsRightAngle, 0.5).isColliding;
	if(isup){
		char("c", vec(player.pos.x - 5, player.pos.y - 15));
		char("c", vec(player.pos.x + 3, player.pos.y - 15));
		color("black");
		char("a", vec(player.pos.x, player.pos.y - 19));
	}else{
		char("c", vec(player.pos.x - 5, player.pos.y - 6));
		char("c", vec(player.pos.x + 3, player.pos.y - 6));
		color("black");
		char("a", vec(player.pos.x, player.pos.y - 10));
	}
	
	color("green");
	// Ground checking Conditions
	remove(Ground, (g) => {
		//CAUTION: it may execute many times after one tick causing the speed inconsistency
		// Checks collision with ground and moves player down if not colliding
		// Add gravity to the player when collide with ground
		color("transparent");
		isColliding = isColliding || char("b", player.pos).isColliding.rect.green;
		// Remove the Ground when it is out of the screen
		return g.pos.x + g.width < 0;
	});
	remove(missiles, (m) => {
		m.pos.x -= scr * 1.5;
		color("black");
		let col = false;
		if(char("d", m.pos).isColliding.char.c){
			play("explosion");
			col = true;
			color("red");
			particle(m.pos, 9);
			endticks = 10;
		}
		return m.pos.x < 0 || col;
	});

	color("yellow");
	// Move the player forward when player pressing the button,
	// else it will shift player to the left of the scene.
	if (input.isPressed) {
		GAME.PLAYERSPEED = 8;
		if (player.pos.y <= GAME.HEIGHT - 10) {
			if (player.pos.x < GAME.WIDTH){ // Don't allow the player to move out from the right bound
				player.pos.x += GAME.PLAYERSPEED * 0.1;
			}
		}else{
			player.pos.x -= scr;
			player.pos.y += GAME.GRAVITY;
		} 
	} else {
		GAME.PLAYERSPEED = 2;
		player.pos.x -= scr / 2;
		if (!isColliding || player.pos.y >= GAME.HEIGHT - 10) {
			player.pos.y += GAME.GRAVITY;
		}
	}
			// The Stilts Animation when player is moving
			// It rotate left and right stilt interchange which looks like moving
			if (!flip) {
				stiltsRightAngle += -GAME.PLAYERSPEED/200 * PI;
				if (interchange) {
					stiltsLeftAngle += GAME.PLAYERSPEED/200 * PI;
				}
				if (stiltsRightAngle < 1.1) {
					flip = true;
					interchange = true;
				}
			} else if (flip) {
				stiltsRightAngle += GAME.PLAYERSPEED/200 * PI;
				if (interchange) {
					stiltsLeftAngle += -GAME.PLAYERSPEED/200 * PI;
				}
				if (stiltsRightAngle > 1.9) {
					flip = false;
					interchange = true;
				}
			}

	// The Game End condition when player touch the bottom of the scene
	// or move too slow (Touch the left bound of the screen).
	if (player.pos.y > 110 || player.pos.x < -5) {
		play("laser");
		end();
	}
	if(endticks > 0){
		endticks--;
	}
	if(endticks == 0){
		end();
	}

	isColliding = false;
}
