title = "cityplan";

description = `   
  [TAP] to 
  place building.
  Make unique 2x2
  groups to clear.
`;

characters = [
`
  l  
 lPl
lPPPl
lPlPl
lPlPl
`,
`
     
lllll
bbbbb
blblb
bbblb
`,
`
  l l
 lyly
lyyyy
lylyl
lylyl
`,
`
 GGG 
 GGG
 GGG
  l 
  l
`
];

const S = {
	WIDTH: 100,     // Game Width
  HEIGHT: 100,    // Game Height
  GRIDSIZE: 10,    // Size of quares in the grid (10 is a good numer)
  GRIDNUM: 8,     // Number of rows / columns in grid (8 is a good numer)
  BOUNDX: 0,      // Grid buffer on x
  BOUNDY: 0,       // Grid buffer on y
};

const B = {
  RESIDENTIAL: "a",
  COMMERCIAL: "b",
  INDUSTRIAL: "c",
  RECREATIONAL: "d",
}

options = {
  viewSize: {
  x: S.WIDTH,
  y: S.HEIGHT,
  },
  isPlayingBgm: true,
  seed: 20,
  isReplayEnabled: true,
  isDrawingParticleFront: true,
  isDrawingScoreFront: true
};

// Declaring stuff
let dict = new Map();
let cursor;
let bankArray = [];
let tickCount = 0;
let clockWidth = (S.GRIDSIZE)+1;
let clockspeed = 25; //the number of ticks between clock incremental increase
let clockIncrease = 1;

//SCORE TYPE AND FUNCTIONS COURTESY OF COLON O'ROURKE (Modified with permission)
/**
 * @typedef {{
 * pos: Vector,
 * age: number,
 * score: number,
 * color: string,
 * }} Score
 */

/**
 * @type { Score []}
 */
let scores;

function update() {
  if (!ticks) {
    // Cursor
    cursor = vec(S.WIDTH * 0.5, S.HEIGHT * 0.5)

    // Setup Grid Dictionary
    for(let i = 1; i <= S.GRIDNUM; i++){
      for(let j = 1; j <= S.GRIDNUM; j++){
        const xpos = S.BOUNDX+(i*(S.GRIDSIZE));
        const ypos = S.BOUNDY+(j*(S.GRIDSIZE));
        const tempA = [xpos, ypos];
        const tempS = tempA.join(',');
        dict.set(tempS, "empty");
      }
    }

    //Generate initial bank
    bankArray = this.genBank();

    scores = [];
  }

  //Draw Grid
  Filldict(S.GRIDNUM, S.GRIDSIZE, S.BOUNDX, S.BOUNDY);

  //Increase clock
  tickCount++;
  if(tickCount%clockspeed == 0) {
    clockWidth++;
  }
  if(clockWidth > (S.GRIDSIZE/2+1)+S.GRIDSIZE+1+(S.GRIDSIZE)-2) { //Once clock cycle completes, reset
    resetClock();
    //INSERT CODE HERE TO TRIGGER EVENT ON CLOCK COMPLETION
    randEmptyPlot();
    play("explosion");
    tetrisCheck();
    fullGridTest();
  }

  // Cursor
  color("light_purple");
  let mouse = rect(cursor, 1, 1);
  cursor = vec(input.pos.x - (input.pos.x % S.GRIDSIZE), input.pos.y - (input.pos.y % S.GRIDSIZE));

  // Render Bank
  renderBank();

  // Render Clock
  renderClock();
  
  // Cursor collison check
  colCheck(mouse);

  //SCORE TYPE AND FUNCTIONS COURTESY OF COLON O'ROURKE (Modified with permission)
  remove(scores, (s) => {
    // @ts-ignore
    color(s.color);
    //s.pos.y -= 0.1
    text(" " + s.score, s.pos)
    s.age -= 1
    let disappear = (s.age <= 0)
    return disappear
  })
}

function Filldict(num, size, boundx, boundy){
  for(let i = 1; i <= num; i++){
    for(let j = 1; j <= num; j++){
      const xpos = boundx+(i*(size));
      const ypos = boundy+(j*(size));
      const tempA = [xpos, ypos];
      const tempS = tempA.join(',');
      // Draw Land
      color("green");
      rect(xpos, ypos, size, size);
      // Draw Buildings
      color("black");
      switch(dict.get(tempS)){
        case 'a':
          char('a', xpos+(S.GRIDSIZE/2), ypos+(S.GRIDSIZE/2));
          break;
        case 'b':
          char('b', xpos+(S.GRIDSIZE/2), ypos+(S.GRIDSIZE/2));
          break;
        case 'c':
          char('c', xpos+(S.GRIDSIZE/2), ypos+(S.GRIDSIZE/2));
          break;
        case 'd':
          char('d', xpos+(S.GRIDSIZE/2), ypos+(S.GRIDSIZE/2));
          break;
      }
    }
  }
}

function colCheck(mouse){
  if(mouse.isColliding.rect.green){
    const xpos = input.pos.x - (input.pos.x % S.GRIDSIZE);
    const ypos = input.pos.y - (input.pos.y % S.GRIDSIZE);
    const tempA = [xpos, ypos];
    const tempS = tempA.join(',');

    if(dict.get(tempS) == "empty"){
      // Highlight selected area with box
      color("yellow");
      rect(xpos, ypos, 1, S.GRIDSIZE);
      rect(xpos, ypos, S.GRIDSIZE, 1);
      rect(xpos+S.GRIDSIZE, ypos, 1, S.GRIDSIZE);
      rect(xpos, ypos+S.GRIDSIZE, S.GRIDSIZE+1, 1);

      // Place building
      if(input.isJustPressed){
        dict.set(tempS, bankArray[0]) //Feel free to fix, bankArray[0] always has the building next up in the queue
        color("black");
        char(bankArray[0], xpos+3, ypos+3);

        bankArray.splice(0,1); //Clears top building from stack
        bankArray.push(randBuilding()); //Adds new random building to the end of the array

        resetClock();
        play("jump");
        //particle(xpos, ypos);
        tetrisCheck();
        fullGridTest();
      }
    } else {
      // Highlight selected area with box
      color("light_red");
      rect(xpos, ypos, 1, S.GRIDSIZE);
      rect(xpos, ypos, S.GRIDSIZE, 1);
      rect(xpos+S.GRIDSIZE, ypos, 1, S.GRIDSIZE);
      rect(xpos, ypos+S.GRIDSIZE, S.GRIDSIZE+1, 1);
    }
  }
}

/*function buildingCheck(){
  // Check each space on the grid
  for (const [key, value] of dict) {
    color("red");
    const pos = key.split(",");
    const xpos = parseInt(pos[0]);
    const ypos = parseInt(pos[1]);
    const up = [xpos, ypos-S.GRIDSIZE].join(',');
    const down = [xpos, ypos+S.GRIDSIZE].join(',');
    const left = [xpos-S.GRIDSIZE, ypos].join(',');
    const right = [xpos+S.GRIDSIZE, ypos].join(',');
    let scoreNum = 0;
    switch(value){
      case 'a':
        //RESIDENTIAL: "a"
        //Worth 1 point
        
        myAddScore(1, pos[0], pos[1], "red", 20);
        //addScore(1, pos);
        break;
      case 'b':
        //COMMERCIAL: "b"
        //1 point for each adjacent building
        
        if(dict.get(up) != "empty") scoreNum++;
        if(dict.get(down) != "empty") scoreNum++;
        if(dict.get(left) != "empty") scoreNum++;
        if(dict.get(right) != "empty") scoreNum++;
        //addScore(scoreNum, pos);
        myAddScore(scoreNum, pos[0], pos[1], "red", 20);
        break;
      case 'c':
        //INDUSTRIAL: "c"
        // 5 points but -1 for each adjacent building that isn't another Industrial
        
        scoreNum = 5;
        if(dict.get(up) != "empty") scoreNum--;
        if(dict.get(down) != "empty") scoreNum--;
        if(dict.get(left) != "empty") scoreNum--;
        if(dict.get(right) != "empty") scoreNum--;
        //addScore(scoreNum, pos);
        myAddScore(scoreNum, pos[0], pos[1], "red", 20);
        break;
      case 'd':
        //RECREATIONAL: "d"
        // +2 for each adjacent residential
        
        if(dict.get(up) == "a") scoreNum++;
        if(dict.get(down) == "a") scoreNum++;
        if(dict.get(left) == "a") scoreNum++;
        if(dict.get(right) == "a") scoreNum++;
        //addScore(scoreNum, pos);
        myAddScore(scoreNum, pos[0], pos[1], "red", 20);
        break;
    }
  }
}*/

function tetrisCheck(){
  // Check each space on the grid
  for (const [key, value] of dict) {
    const pos = key.split(",");
    const xpos = parseInt(pos[0]);
    const ypos = parseInt(pos[1]);
    const right = [xpos+S.GRIDSIZE, ypos].join(',');
    const down = [xpos, ypos+S.GRIDSIZE].join(',');
    const diagonal = [xpos+S.GRIDSIZE, ypos+S.GRIDSIZE].join(',');
    let scoreNum = 0;
    // Check for 4 near
    if(dict.get(key) != "empty") scoreNum++;
    if(dict.get(right) != "empty") scoreNum++;
    if(dict.get(down) != "empty") scoreNum++;
    if(dict.get(diagonal) != "empty") scoreNum++;

    if(scoreNum == 4 && diffCheck(key,right,down,diagonal)) {
      myAddScore(1, pos[0], pos[1], "red", 20);
      play("coin");
      particle(pos[0], pos[1]);
      // Icrease difficulty
      if(clockspeed > 8) clockspeed -= clockIncrease;
      if(clockspeed <= 8) clockspeed = 8;

      // Clear all spaces
      dict.set(key, "empty")
      dict.set(right, "empty")
      dict.set(down, "empty")
      dict.set(diagonal, "empty")
    }
  }
}

//Generate initial bank
function genBank(){
  let returnArray = [];
  for(let i = 0; i < 4; i++) {
    returnArray.push(randBuilding());
  }
  return returnArray;
}

//Return a random building
function randBuilding(){
  let buildingIndex = [B.RESIDENTIAL,B.COMMERCIAL,B.INDUSTRIAL,B.RECREATIONAL]
  return buildingIndex[Math.floor(Math.random()*buildingIndex.length)]
}

//Draw the bank
function renderBank(){
  let x = (S.WIDTH/S.GRIDSIZE)+(S.GRIDSIZE*2);
  let y = (S.GRIDSIZE*S.GRIDNUM)+S.GRIDSIZE;
  let w = ((S.WIDTH/S.GRIDSIZE)*S.GRIDNUM)-(S.GRIDSIZE*4);
  let h = S.GRIDSIZE;
  let o = 1;

  color("black"); //Draw the outline
  rect(x,y,w,h);
  color("white"); //Draw the inner white rectangle
  rect(x+o,y+o,w-(2*o),h-(2*o));

  color("black"); //Draw the buildings in the bank
  let i = 0;
  for(const element of bankArray) {
    char(element,(x+(S.GRIDSIZE*i))+(4*o),y+(S.GRIDSIZE/2));
    i++;
  }
  text("bank",x+(S.GRIDSIZE*4)+(3*o),y+(S.GRIDSIZE/2));
}

function popBank(){
  let buildingType = bankArray[0];
  bankArray.splice(0,1); //Clears top building from stack
  bankArray.push(randBuilding()); //Adds new random building to the end of the array
  return buildingType;
}

function renderClock(){
  //Draw red rectangle
  let x = S.GRIDSIZE;
  let y = S.HEIGHT-S.GRIDSIZE+2;
  let h = S.GRIDSIZE/2+1;
  color("red");
  rect(x,y,x+h,h);
  //Draw white rectangle on top
  color("white")
  let w = (x-2)-(clockWidth-(x+1));
  rect(clockWidth,y+1,w+h,h-2);
}

function resetClock(){
  clockWidth = S.GRIDSIZE+1;
}

function randEmptyPlot(){
  let emptyPlotArray = [];
  let dictIterator = dict.entries();

  for(const element of dictIterator) {
    let key = element[0];
    let value = element[1];
    if(value == "empty"){
      emptyPlotArray.push(key);
    }
  }
  let plotToBuild = emptyPlotArray[Math.floor(Math.random()*emptyPlotArray.length)];
  dict.set(plotToBuild, popBank());
  // return emptyPlotArray;
}

//Determines whether the four adjacent plots are unique amongst eachother
function diffCheck(topL,topR,botL,botR){
  let keys = [topL,topR,botL,botR];
  let vals = [];
  for(const k of keys){
    vals.push(dict.get(k));
  }
  let uniques = [... new Set(vals)] //Creates new array with only unique entries
  if(uniques.length == 4) {
    return true;
  } else {
    return false;
  }
}

function fullGridTest(){
  let dictIterator = dict.entries();
  let emptyExists = false;

  for(const element of dictIterator) {
    if(element[1] == "empty"){
      emptyExists = true;
    }
  }
  if(!emptyExists){
    end();
  }
}

//SCORE TYPE AND FUNCTIONS COURTESY OF COLON O'ROURKE (Modified with permission)
function myAddScore(value, x = S.WIDTH/2, y = S.HEIGHT/2, color, time = 60){
  let score = {
    pos: vec(x,y),
    age: time,
    score: value,
    color: color
  }
  scores.push(score)
  addScore(value);
}