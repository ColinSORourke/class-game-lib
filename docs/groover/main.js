title = "GROOVER";

description = `
[PRESS] to jab
`;

characters = [
`
r
`,
];

const G = {
	WIDTH: 100,
	HEIGHT: 100,

	PLAYER_ROTATION_SPEED: (2 * Math.PI) / 71.991,

	BEAT_RADIUS: 6,
	BEAT_THICKNESS: 5,
	BEAT_DISTANCE: 21,
	BEAT_ROTATION_MOD: .44,
	BEAT_ARC_LENGTH: .3,
	BEAT_TRIANGLE_MOD1: .35,

	SPIKE_BASE_LENGTH: 4,
	SPIKE_JAB_LENGTH: 10,
	SPIKE_MAX_LENGTH: 16,
	JAB_SPEED: 4,
	JAB_RETRACT_SPEED: 2,

	POINT_2_PERCENTAGE: 0.90,
	POINT_3_PERCENTAGE: 0.80,
	POINT_4_PERCENTAGE: 0.70,
	POINT_5_PERCENTAGE: 0.60,
	POINT_6_PERCENTAGE: 0.50,

	BASE_CAMERA_SPEED: -.07,

	DEATH_RADIUS_RATE: 0.01,

	SHAKE_MAGNITUDE: 1.1,
	SHAKE_DURATION: 10
	
};

var isJabbing = false;
var jab = false;
var endJab = false;
var firstFlag = true;
var cameraSpeedX = G.BASE_CAMERA_SPEED;
var cameraSpeedY = G.BASE_CAMERA_SPEED;
var deathRadius = 0;
var beatSpawnAngle = 0;
var beatSpawnColor = 0;
var combo = 10;
var comboDeadAngle = 0;
var screenShakeOffsetX = 0;
var screenShakeOffsetY = 0;
var screenShakeMagnitude = G.SHAKE_MAGNITUDE;
var screenShakeCounter = 10;

/**
* @typedef {{
* pos: Vector,
* spikePos1: Vector,
* spikePoint1: Vector,
* spikePoint2: Vector,
* spikePoint3: Vector,
* spikePoint4: Vector,
* spikePoint5: Vector,
* spikePoint6: Vector,
* color: number,
* angle: number,
* rotation: number,
* spikeLength: number
* }} Player
*/

/**
 * @type { Player }
 */
let player;

/**
 * @typedef {{
 * pos: Vector,
 * angle: number,
 * color: number
 * }} Beat
 */

/**
 * @type { Beat [] }
 */
 let beats;

options = {
	viewSize: {x: G.WIDTH, y: G.HEIGHT},
	seed: 2122342,
	isPlayingBgm: true,
	theme: "shapeDark",
	isCapturing: true,
	isCapturingGameCanvasOnly: true,
	captureCanvasScale: 2
};

function initialize()
{
	player = {
		pos: vec(G.WIDTH * 0.5, G.HEIGHT * 0.5),
		spikePos1: vec(G.WIDTH * 0.5, G.HEIGHT * 0.5 - G.BEAT_RADIUS),
		spikePoint1: vec(G.WIDTH * 0.5, (G.HEIGHT * 0.5) - G.BEAT_RADIUS - G.SPIKE_BASE_LENGTH),
		spikePoint2: vec(G.WIDTH * 0.5, (G.HEIGHT * 0.5) - G.BEAT_RADIUS - G.SPIKE_BASE_LENGTH),
		spikePoint3: vec(G.WIDTH * 0.5, (G.HEIGHT * 0.5) - G.BEAT_RADIUS - G.SPIKE_BASE_LENGTH),
		spikePoint4: vec(G.WIDTH * 0.5, (G.HEIGHT * 0.5) - G.BEAT_RADIUS - G.SPIKE_BASE_LENGTH),
		spikePoint5: vec(G.WIDTH * 0.5, (G.HEIGHT * 0.5) - G.BEAT_RADIUS - G.SPIKE_BASE_LENGTH),
		spikePoint6: vec(G.WIDTH * 0.5, (G.HEIGHT * 0.5) - G.BEAT_RADIUS - G.SPIKE_BASE_LENGTH),
		color: 0,
		angle: 0,
		rotation: 0,
		spikeLength: G.SPIKE_BASE_LENGTH
	};

	beats = [];

	deathRadius = 0;
}

function inputHandler()
{
	if(input.isJustPressed)
	{
		play("hit");
		deathRadius += 1;
		isJabbing = true;
		jab = true;
	} else if (input.isJustReleased)
	{
		isJabbing = false;
	}
}

function extend()
{
	//endJab = true;
	//jab = false;
}

function jabHandler()
{
	if(jab && !endJab)
	{
		if (player.spikeLength <= G.SPIKE_JAB_LENGTH)
		{
			player.spikeLength += G.JAB_SPEED;
		} else
		{
			endJab = true;
			jab = false;
		}
	}

	if(endJab)
	{
		if (player.spikeLength > G.SPIKE_BASE_LENGTH)
		{
			player.spikeLength -= G.JAB_RETRACT_SPEED;
		} else
		{
			player.spikeLength = G.SPIKE_BASE_LENGTH
			player.color++;
			if(player.color == 3)
			{
				player.color = 0;
			}
			endJab = false;
		}
	}
}

function playerHandler()
{
	player.rotation -= G.PLAYER_ROTATION_SPEED;
	player.angle -= G.PLAYER_ROTATION_SPEED;
	if(player.angle <= comboDeadAngle)
	{
		combo = 10;
	}

	color("purple");


	box(player.pos.x + screenShakeOffsetX, player.pos.y + screenShakeOffsetY, 10);
	arc(player.pos.x + screenShakeOffsetX, player.pos.y + screenShakeOffsetY, G.BEAT_RADIUS, G.BEAT_THICKNESS, player.rotation, player.rotation + (2 * Math.PI));
	//arc(player.pos, G.BEAT_RADIUS, G.BEAT_THICKNESS,-3,0);

	player.spikePos1.x = player.pos.x + screenShakeOffsetX + (G.BEAT_RADIUS * Math.cos(player.angle));
	player.spikePos1.y = player.pos.y + screenShakeOffsetY + (G.BEAT_RADIUS * Math.sin(player.angle));

	player.spikePoint1.x = player.pos.x + screenShakeOffsetX + ((G.BEAT_RADIUS + player.spikeLength) * Math.cos(player.angle));
	player.spikePoint1.y = player.pos.y + screenShakeOffsetY + ((G.BEAT_RADIUS + player.spikeLength) * Math.sin(player.angle));

	player.spikePoint2.x = player.pos.x + screenShakeOffsetX + (((G.BEAT_RADIUS + player.spikeLength) * G.POINT_2_PERCENTAGE) * Math.cos(player.angle));
	player.spikePoint2.y = player.pos.y + screenShakeOffsetY + (((G.BEAT_RADIUS + player.spikeLength) * G.POINT_2_PERCENTAGE) * Math.sin(player.angle));

	player.spikePoint3.x = player.pos.x + screenShakeOffsetX + (((G.BEAT_RADIUS + player.spikeLength) * G.POINT_3_PERCENTAGE) * Math.cos(player.angle));
	player.spikePoint3.y = player.pos.y + screenShakeOffsetY + (((G.BEAT_RADIUS + player.spikeLength) * G.POINT_3_PERCENTAGE) * Math.sin(player.angle));

	player.spikePoint4.x = player.pos.x + screenShakeOffsetX + (((G.BEAT_RADIUS + player.spikeLength) * G.POINT_4_PERCENTAGE) * Math.cos(player.angle));
	player.spikePoint4.y = player.pos.y + screenShakeOffsetY + (((G.BEAT_RADIUS + player.spikeLength) * G.POINT_4_PERCENTAGE) * Math.sin(player.angle));

	player.spikePoint5.x = player.pos.x + screenShakeOffsetX + (((G.BEAT_RADIUS + player.spikeLength) * G.POINT_5_PERCENTAGE) * Math.cos(player.angle));
	player.spikePoint5.y = player.pos.y + screenShakeOffsetY + (((G.BEAT_RADIUS + player.spikeLength) * G.POINT_5_PERCENTAGE) * Math.sin(player.angle));

	player.spikePoint6.x = player.pos.x + screenShakeOffsetX + (((G.BEAT_RADIUS + player.spikeLength) * G.POINT_6_PERCENTAGE) * Math.cos(player.angle));
	player.spikePoint6.y = player.pos.y + screenShakeOffsetY + (((G.BEAT_RADIUS + player.spikeLength) * G.POINT_6_PERCENTAGE) * Math.sin(player.angle));

	line(player.spikePos1.x, player.spikePos1.y, player.spikePoint1.x, player.spikePoint1.y, 1);
	line(player.spikePos1.x, player.spikePos1.y, player.spikePoint2.x, player.spikePoint2.y, 2);
	line(player.spikePos1.x, player.spikePos1.y, player.spikePoint3.x, player.spikePoint3.y, 3);
	line(player.spikePos1.x, player.spikePos1.y, player.spikePoint4.x, player.spikePoint4.y, 4);
	line(player.spikePos1.x, player.spikePos1.y, player.spikePoint5.x, player.spikePoint5.y, 5);
	line(player.spikePos1.x, player.spikePos1.y, player.spikePoint6.x, player.spikePoint6.y, 5.7);
	char("a", player.spikePoint2);

	
	color("white");
	deathRadius += G.DEATH_RADIUS_RATE;

	box(player.pos.x + screenShakeOffsetX, player.pos.y + screenShakeOffsetY, deathRadius*2);
	arc(player.pos.x + screenShakeOffsetX, player.pos.y + screenShakeOffsetY, deathRadius, G.BEAT_THICKNESS, player.rotation, player.rotation + (2 * Math.PI));

}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function beatSpawner()
{
	if(beats.length === 0)
	{
		const randAngle = getRandomInt(4);
		if(randAngle == 0)
		{
			beatSpawnAngle = 0;
		} else if(randAngle == 1)
		{
			beatSpawnAngle = PI / 2;
		} else if(randAngle == 2)
		{
			beatSpawnAngle = PI;
		} else if(randAngle == 3)
		{
			beatSpawnAngle = (3 * PI) / 2;
		}

		const posX = player.pos.x + (G.BEAT_DISTANCE * Math.cos(beatSpawnAngle));
		const posY = player.pos.y + (G.BEAT_DISTANCE * Math.sin(beatSpawnAngle));
		beats.push({pos: vec(posX, posY), angle: beatSpawnAngle, color: 0});
	}

	while(beats.length < 3)
	{
		const randAngle = getRandomInt(3);
		if(randAngle == 0)
		{
			beatSpawnAngle = beats[beats.length - 1].angle - (PI / 2);
			beatSpawnColor = 0;
		} else if(randAngle == 1)
		{
			beatSpawnAngle = beats[beats.length - 1].angle;
			beatSpawnColor = 1;
		} else if(randAngle == 2)
		{
			beatSpawnAngle = beats[beats.length - 1].angle + (PI / 2);
			beatSpawnColor = 2;
		}

		//const randAngle = rnd(beats[beats.length - 1].angle - (Math.PI / 2),beats[beats.length - 1].angle + (Math.PI / 2));
		const posX = beats[beats.length - 1].pos.x + (G.BEAT_DISTANCE * Math.cos(beatSpawnAngle));
		const posY = beats[beats.length - 1].pos.y + (G.BEAT_DISTANCE * Math.sin(beatSpawnAngle));
		beats.push({pos: vec(posX, posY), angle: beatSpawnAngle, color: beatSpawnColor});
	}
}

function beatHandler()
{
	remove(beats, (b) => {

		if(b.color == 0)
		{
			color("blue");
		} else if(b.color == 1)
		{
			color("red");
		} else
		{
			color("yellow");
		}


		box(b.pos.x + screenShakeOffsetX, b.pos.y + screenShakeOffsetY, 10);
		arc(b.pos.x + screenShakeOffsetX, b.pos.y + screenShakeOffsetY, G.BEAT_RADIUS, G.BEAT_THICKNESS, b.angle - G.BEAT_ROTATION_MOD, (b.angle + (2 * Math.PI)) - G.BEAT_ROTATION_MOD);

		color('black');
		
		var arcStart = b.angle - G.BEAT_ROTATION_MOD + Math.PI + 0.2;
		//arc(b.pos, G.BEAT_RADIUS, G.BEAT_THICKNESS + .4, arcStart + .1, arcStart + G.BEAT_ARC_LENGTH);

		const isCollidingWithSpike1 = line(b.pos.x + screenShakeOffsetX, b.pos.y + screenShakeOffsetY, b.pos.x + screenShakeOffsetX + ((G.BEAT_RADIUS + 1.6) * Math.cos(Math.PI + b.angle + G.BEAT_TRIANGLE_MOD1)),  b.pos.y + screenShakeOffsetY + ((G.BEAT_RADIUS + 1.6) * Math.sin(Math.PI + b.angle + G.BEAT_TRIANGLE_MOD1)), 2).isColliding.char.a;
		const isCollidingWithSpike2 = line(b.pos.x + screenShakeOffsetX, b.pos.y + screenShakeOffsetY, b.pos.x + screenShakeOffsetX + ((G.BEAT_RADIUS + 1.6) * Math.cos(Math.PI + b.angle - G.BEAT_TRIANGLE_MOD1)),  b.pos.y + screenShakeOffsetY + ((G.BEAT_RADIUS + 1.6) * Math.sin(Math.PI + b.angle - G.BEAT_TRIANGLE_MOD1)), 2).isColliding.char.a;
		const isCollidingWithSpike3 = line(b.pos.x + screenShakeOffsetX + ((G.BEAT_RADIUS + 1.6) * Math.cos(Math.PI + b.angle + G.BEAT_TRIANGLE_MOD1)),  b.pos.y + screenShakeOffsetY + ((G.BEAT_RADIUS + 1.6) * Math.sin(Math.PI + b.angle + G.BEAT_TRIANGLE_MOD1)), b.pos.x + screenShakeOffsetX + ((G.BEAT_RADIUS + 1.6) * Math.cos(Math.PI + b.angle - G.BEAT_TRIANGLE_MOD1)),  b.pos.y + screenShakeOffsetY + ((G.BEAT_RADIUS + 1.6) * Math.sin(Math.PI + b.angle - G.BEAT_TRIANGLE_MOD1)), 2).isColliding.char.a;
		const isCollidingWithSpike4 = line(b.pos.x + screenShakeOffsetX + ((2) * Math.cos(Math.PI + b.angle)), b.pos.y + screenShakeOffsetY + ((2) * Math.sin(Math.PI + b.angle)), b.pos.x + screenShakeOffsetX + ((G.BEAT_RADIUS) * Math.cos(Math.PI + b.angle)),  b.pos.y + screenShakeOffsetY + ((G.BEAT_RADIUS) * Math.sin(Math.PI + b.angle)), 3).isColliding.char.a;

		if(isCollidingWithSpike1 || isCollidingWithSpike2 || isCollidingWithSpike3 || isCollidingWithSpike4)
		{
			if(b.color == 0)
			{
				color("blue");
			} else if(b.color == 1)
			{
				color("red");
			} else
			{
				color("yellow");
			}
			// Generate particles
			particle(
					(b.pos.x + player.pos.x)/2, // x coordinate
					(b.pos.y + player.pos.y)/2, // y coordinate
					200, // The number of particles
					2.5, // The speed of the particles
			);
			color("purple");
			line(player.pos, b.pos, 16.5);
			player.pos = b.pos;
			player.angle += Math.PI;
			play("jump");
			addScore(combo, b.pos);
			deathRadius -= 2;
			combo += 10;
			comboDeadAngle = player.angle - (2 * PI);
			screenShakeCounter = 0;
			if(deathRadius < 0)
			{
				deathRadius = 0;
			}
		}

		return isCollidingWithSpike1 || isCollidingWithSpike2 || isCollidingWithSpike3 || isCollidingWithSpike4;
	});
}

function cameraSimulation()
{
	cameraSpeedX = G.BASE_CAMERA_SPEED * (player.pos.x - (G.WIDTH / 2))
	cameraSpeedY = G.BASE_CAMERA_SPEED * (player.pos.y - (G.HEIGHT / 2))

	player.pos.y += cameraSpeedY;
	for(let i = 0; i < beats.length; i++)
	{
		beats[i].pos.y += cameraSpeedY;
	}

	player.pos.x += cameraSpeedX;
	for(let i = 0; i < beats.length; i++)
	{
		beats[i].pos.x += cameraSpeedX;
	}
}

function screenShake()
{
	if(screenShakeCounter < G.SHAKE_DURATION)
	{
		screenShakeOffsetX = rnd(-screenShakeMagnitude, screenShakeMagnitude);
		screenShakeOffsetY = rnd(-screenShakeMagnitude, screenShakeMagnitude);

		screenShakeMagnitude -= .1;
		screenShakeCounter++;
	} else
	{
		screenShakeMagnitude = G.SHAKE_MAGNITUDE;
	}
}

function update() {
	if (!ticks) {
		initialize();
	}
	
	inputHandler();

	jabHandler();

	playerHandler();

	beatSpawner();

	beatHandler();

	cameraSimulation();

	screenShake();

	if(deathRadius >= G.BEAT_RADIUS + .05)
	{
		end();
	}
}
