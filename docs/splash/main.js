title = "SPLASH";

description = `
 [Hold]
Angle Shot

[Release]
Take Shot
`;

characters = [
  `
  ll
  l  l
 lllly
l l  
  lll
 l 
  `,
  `
  ll
  l
 lllll
l l  
llll
    ly
  `,
  `
  ll y
  l  l
  lll
  l  
  lll
  l  l
  `,
  `
  ll
  l  
 lllll
l l  
  lll
 l 
  `,
  `
  ll
  l
 llll
l l  l
llll
    l  
  `,
  `
  ll 
  l  
  lll
  l  l
  lll
  l  l
  `,
  `
  yy
 yy y
 y yy
  yy
  `
];

options = {
  theme: "crt",
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 127,
};

let court, pole, connector, backboard, rim, net1, net2, net3, net4, net5,
net6, net7, net8, net9;
let position;
let sprite1, sprite2, sprite_counter;
let movement_counter;
let ready_to_shoot, can_shoot;
let isPressing;
let jump, jump_counter;
let fall;
let finished_anim, finished_anim_counter;
let sprite3, sprite4, sprite_counter2;
let ball_released;
let hoop_height;
/** @type {{pos: Vector, vel: Vector}[]} */
let basketball;
let shoot_angle;
let line_position;
let bucket_score;

function update() {
  // init settings
  if (!ticks) {
    position = vec(0, 87);
    color("black");
    char("a", position);
    sprite2 = false;
    sprite1 = true;
    sprite_counter = 0;
    movement_counter = 0;
    ready_to_shoot = false;
    can_shoot = true;
    isPressing = false;
    jump = false;
    fall = false;
    jump_counter = 0;
    finished_anim = false;
    finished_anim_counter = 0;
    sprite4 = false;
    sprite3 = true;
    sprite_counter2 = 0;
    ball_released = false;
    hoop_height = rnd(30, 50);
    basketball = [];
    shoot_angle = undefined;
    bucket_score = 3;
  }
  
  // basketball hoop
  color("light_black");
  court = rect(-50, 90, 200, 10);
  color("blue");
  pole = rect(95, hoop_height, 2, 90 - hoop_height + 1);
  color("blue");
  connector = rect(88, hoop_height, 7, 2);
  color("light_blue");
  backboard = rect(88, hoop_height - 13, 2, 18);
  color("yellow");
  rim = rect(79, hoop_height, 9, 1);
  color("black");
  net1 = rect(80, hoop_height + 1, 1, 2);
  color("black");
  net2 = rect(81, hoop_height + 3, 1, 2);
  color("black");
  net3 = rect(82, hoop_height + 1, 1, 2);
  color("black");
  net4 = rect(83, hoop_height + 3, 1, 2);
  color("black");
  net5 = rect(84, hoop_height + 1, 1, 2);
  color("black");
  net6 = rect(85, hoop_height + 3, 1, 2);
  color("black");
  net7 = rect(86, hoop_height + 1, 1, 2);
  color("black");
  net8 = rect(82, hoop_height + 5, 1, 2);
  color("black");
  net9 = rect(84, hoop_height + 5, 1, 2);
  
  // initial sprite animation
  if (sprite2 && sprite_counter > 30 && !ready_to_shoot && !finished_anim)
  {
    color("black");
    char("a", position);
    sprite2 = false;
    sprite1 = true;
    sprite_counter = 0;
  }
  else if (sprite2 && sprite_counter < 30 && !ready_to_shoot && !finished_anim)
  {
    color("black");
    char("b", position);
  }
  if (sprite1 && sprite_counter > 30 && !ready_to_shoot && !finished_anim)
  {
    color("black");
    char("b", position);
    sprite2 = true;
    sprite1 = false;
    sprite_counter = 0;
  }
  else if (sprite1 && sprite_counter < 30 && !ready_to_shoot && !finished_anim)
  {
    color("black");
    char("a", position);
  }
  sprite_counter += 1;
  
  // initial movement
  if (position.x < 20 && movement_counter > 5 && !ready_to_shoot && !finished_anim)
  {
    position.x += 1;
    movement_counter = 0;
  }
  movement_counter += 1;

  if (position.x >= 20 && !jump && can_shoot)
  {
    ready_to_shoot = true;
  }

  // shooting
  if (ready_to_shoot && !finished_anim && can_shoot)
  {
    color("black");
    char("c", position);
  }

  if (ready_to_shoot && can_shoot)
  {
    if (shoot_angle == null) {
      if (input.isJustPressed) {
        shoot_angle = -PI / 6;
        play("jump");
        jump = true;
      }
    }
    if (shoot_angle != null) {
      shoot_angle -= 0.025 * difficulty;
      color("black");
      line_position = vec(position.x + 5, position.y - 5);
      line(line_position, vec(line_position).addWithAngle(shoot_angle, 5), 2);
      if (input.isJustReleased || (-shoot_angle) > ((5 * PI ) / 12)) {
        basketball.push({
          pos: vec(position),
          vel: vec().addWithAngle(shoot_angle, sqrt(difficulty) * 3),
        });
        shoot_angle = undefined;
        can_shoot = false;
      }
    }
  }

  if (!can_shoot && input.isJustReleased && !ball_released && !finished_anim)
  {
    ball_released = true;
  }

  if (ball_released && !finished_anim)
  {
    color("black");
    char("f", position);
  }

  if (ready_to_shoot && !finished_anim && !ball_released)
  {
    color("black");
    char("c", position);
  }

  if (jump == true && position.y >= 60)
  {
    position.y -= 1;
  }
  if (jump == true && position.y == 60)
  {
    jump = false;
    fall = true;
  }
  if (fall == true && position.y < 87)
  {
    position.y += 1;
  }
  if (fall == true && position.y == 87)
  {
    fall = false;
    finished_anim = true;
  }
  if (finished_anim && finished_anim_counter > 1)
  {
    position.x += 2;
    finished_anim_counter = 0;
  }
  finished_anim_counter += 1;

  // actual shooting
  color("black");
  remove(basketball, (b) => {
    b.pos.add(b.vel);
    b.vel.y += difficulty * 0.07;
    const c = char("g", b.pos);
    
    if (c.isColliding.rect.light_blue)
    {
      bucket_score = 1;
      b.vel.x = -b.vel.x/1.5;
    }

    if (c.isColliding.rect.white)
    {
      b.vel.x = b.vel.x/2;
    }

    if (c.isColliding.rect.yellow)
    {
      if (b.pos.y >= hoop_height + 1)
      {
        b.vel.x = -b.vel.x/1.5;
      }
      else
      {
        if (bucket_score == 1)
        {
          play("coin");
        }
        particle(b.pos);
        addScore(bucket_score, b.pos);
        if (bucket_score == 3)
        {
          play("powerUp");
          particle(rnd(30, 70), 20, 100, 2, -PI / 2, 180);
        }
        return b;
      }
    }

    if (c.isColliding.rect.light_black || b.pos.x > 100)
    {
      end();
    }
    
    return b.pos.y > 90;
  });
  
  // after shooting sprite animation
  if (sprite4 && sprite_counter2 > 30 && finished_anim)
  {
    color("black");
    char("d", position);
    sprite4 = false;
    sprite3 = true;
    sprite_counter2 = 0;
  }
  else if (sprite4 && sprite_counter2 < 30 && finished_anim)
  {
    color("black");
    char("e", position);
  }
  if (sprite3 && sprite_counter2 > 30 && finished_anim)
  {
    color("black");
    char("e", position);
    sprite4 = true;
    sprite3 = false;
    sprite_counter2 = 0;
  }
  else if (sprite3 && sprite_counter2 < 30 && finished_anim)
  {
    color("black");
    char("d", position);
  }
  sprite_counter2 += 1;

  // reset player
  if (position.x > 100)
  {
    position = vec(0, 87);
    color("black");
    char("a", position);
    sprite2 = false;
    sprite1 = true;
    sprite_counter = 0;
    movement_counter = 0;
    ready_to_shoot = false;
    can_shoot = true;
    isPressing = false;
    jump = false;
    fall = false;
    jump_counter = 0;
    finished_anim = false;
    finished_anim_counter = 0;
    sprite4 = false;
    sprite3 = true;
    sprite_counter2 = 0;
    ball_released = false;
    hoop_height = rnd(30, 50);
    shoot_angle = undefined;
    bucket_score = 3;
  }
}