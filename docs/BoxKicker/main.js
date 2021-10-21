title = "Box Kicker";

description = `Kick That box
`;

characters = [
`
ppp
ppp
pppp
ppppppp
ppppppp
`

];

options = {
  isPlayingBgm: true,
};

let boot;
var bootspeed = 1;
var concrete = false;
var boxCheck = 30;
var luckyBox = 0;
boot = {
  pos: vec(20, 80)
}
function update() {
  
  color(concrete == false ? "red":"black");
  rect(50, 70, 25);



  color("blue");
  char("a", boot.pos);
  

  if (!ticks) {
    boot.pos.x = 20;
    char("a", boot.pos);
    concrete = false;
  }
  if (input.isJustPressed) {
    while (boot.pos.x < 50) {
    char("a", boot.pos);
    boot.pos.x += bootspeed;
    }
    //char("a", 50, 80);
    if (concrete == true) {
      end();
    }
    else {
    addScore(1);
    play("explosion");
    times(3, (i) => {
      particle(boot.pos, 4, 2, PI, .5);
    });
    while (boot.pos.x > 20) {
      boot.pos.x -= 5;
    }
    }
  }
  if (boxCheck <= 0) {
    luckyBox = Math.floor(Math.random() * 20);
    if(luckyBox <= 2) {
      concrete = true;
      boxCheck = 60;
    }
    else {
      concrete = false;
      boxCheck = 30;
    }

  }
  else{
    boxCheck--;
  }

}
