let grid;
let cols;
let rows;
let res = 15; 
let start = false; 
let nextgen = false;
let roundCorners = 0;
let canvasWidth = Math.floor(window.innerWidth);  //CANVAS: Math.floor: rounds down to highest integer
let canvasHeight = Math.floor(window.innerHeight);
let playing = false;
let shape;
let generation = 0;
let clear = false;
let mouse = false;
let h1=0;
let s1=0;
let b1=0;
let h2=0;
let s2=0;
let b2=100;
let aliveCells = 0;
let deadCells = 0;
let torodial = true;

//SPLASHSCREEN

const splash = document.querySelector(".splash"); 
document.addEventListener("DOMContentLoaded", (e) =>{ 
  setTimeout(() => { 
    splash.classList.add('display-none');
  }, 1500); 
})

//MUSIC

var audio = document.getElementById("audio");
var sources = audio.getElementsByTagName('source');
var currentSource = 0;

function playAudio() {
  audio.play();
  print("MUSIC STARTED");
}
function pauseAudio() {
  audio.pause();
  print("MUSIC PAUSED");
}
function prevAudio() {
  currentSource = (currentSource - 1 + sources.length) % sources.length;
  audio.src = sources[currentSource].src;
  audio.load();
  audio.play();
  print("PREVIOUS SONG");
}
function nextAudio() {
  currentSource = (currentSource + 1) % sources.length;
  audio.src = sources[currentSource].src;
  audio.load();
  audio.play();
  print("SONG SKIPPED");
}
audio.addEventListener("ended", function() {
  nextAudio();
});
document.addEventListener("DOMContentLoaded", function() { 
  let volSlider = document.getElementById("volume-slider");
  volSlider.oninput = function() {
    audio.volume = (volSlider.value/100);
    print(`VOLUME SET TO ${(volSlider.value/100)}`); 
  };
});

function preload() {
  Sans = loadFont('OpenSans-Regular.ttf');
}

//MAKE 2D ARRAY

function makeNewGrid(cols, rows){
  let arr = new Array(cols);
  for(let i=0; i<arr.length; i++){
    arr[i] = new Array(rows);
  }
  return arr;
}

function setup() {
  colorMode(HSB);
  createCanvas(canvasWidth, canvasHeight);
  generation = 0;
  countGens();
  
  if(torodial == false){
    document.getElementById("currentField").innerHTML = "Finite";
  } else {
    document.getElementById("currentField").innerHTML = "Torodial";
  }
  document.getElementById("currentRes").innerHTML = res;
  document.getElementById("currentSize").innerHTML = `${canvasWidth} x ${canvasHeight}`;

  cols = floor(width/res);
  rows = floor(height/res);

  grid = makeNewGrid(cols, rows);  

  for(let i=0; i<cols; i++){
    for(let j=0; j<rows; j++){
      if(clear == false){
        grid[i][j] = floor(random(2)); //0 or 1
      } else if(clear == true){
        grid[i][j] = 0;
      }
    }
  }
  countCells(grid);
}

//MAIN LOOP

function draw() {
  if(key==="b"){
    colorMode1();}
  else if(key==="n"){
    colorMode2();}
  else if(key==="m"){
    colorMode3();}
  background(h1,s1,b1);
  
  for(let i=0; i<cols; i++){
    for(let j=0; j<rows; j++){
      let x = i*res;
      let y = j*res;
      if (grid[i][j] == 1){
        fill(h2,s2,b2);
        stroke(0);
        rect(x, y, res-1, res-1, roundCorners*(res/2));
      }
      if ((i*res<mouseX) && (mouseX<(i + 1)*res) && (j*res<mouseY) && (mouseY<(j + 1)*res)) { 
        if (mouse == true) { 
            grid[i][j] = (grid[i][j] + 1) % 2; 
            mouse = false;
        }
      }
    }
  } 
  if(start == true || nextgen == true) {
    let next = makeNewGrid (cols, rows);

    if(torodial == true){
      for(let i=0; i<cols; i++){
       for(let j=0; j<rows; j++){
          let state = grid[i][j];

          let sum = 0;
          let neighbors = countNeighborsTorodial(grid,i,j)

         //RULES
         if(state == 0 && neighbors == 3) {
           next[i][j] = 1; //if dead and 3 near next alive
         } else if (state == 1 && (neighbors < 2 || neighbors > 3)){
            next[i][j] = 0; //if alive and either less then 2 or more than 3 dead
         } else { //else stay
           next[i][j] = state;
          }
        }
      }
    } else {
      for(let i=0; i<cols; i++){
        for(let j=0; j<rows; j++){
          let state = grid[i][j];
          if(i==0 || i==cols-1 || j==0 || j==rows-1){ //cells on edge die
            next[i][j] = 0;
          } else {
            let sum = 0;
            let neighbors = countNeighborsFinite(grid,i,j);

            //RULES
            if(state == 0 && neighbors == 3) {
              next[i][j] = 1; //if dead and 3 near next alive
            } else if (state == 1 && (neighbors < 2 || neighbors > 3)){
              next[i][j] = 0; //if alive and either less then 2 or more than 3 dead
            } else { //else stay
              next[i][j] = state;
            }
          }
        }
      }
    }
    if(nextgen == true){
      start = false;
      nextgen = false;
      }
    generation++;
    //print(generation);
    grid = next;
    countGens();  
    countCells(grid);
  }
  if(key==="o"){
    roundCorners = 0;
  }
  if(key==="p"){
   roundCorners = 1;
  }
}

function countNeighborsTorodial(grid, x, y) {
  let sum = 0;
  for(let i=-1; i<2; i++) {
    for (let j=-1; j<2; j++) {

      let col = (x + i + cols) % cols; 
      let row = (y + j + rows) % rows; 

      sum += grid[col][row]; 
    }
  }
  sum -= grid[x][y]; 
  return sum;
}

function countNeighborsFinite(grid, x, y){
  let sum = 0;
  for(let i=-1; i<2; i++){
    for(let j=-1; j<2; j++){
      sum += grid[x+i][y+j];
    }
  }
  sum -= grid[x][y]; 
  return sum;
}

function countGens() {
  let genCountDiv = document.getElementById("generation-count");
  genCountDiv.innerHTML = generation;
}

function countCells(grid){
  let aliveCells = 0;
  let deadCells = 0;
  for(let i = 0; i < cols; i++){
    for(let j = 0; j < rows; j++){
      if(grid[i][j] === 0){
        deadCells++;
      } else {
        aliveCells++;
      }
    }
  }
  //print(`DEAD:${deadCells} ALIVE:${aliveCells}`);
  document.getElementById("currentDead").innerHTML = deadCells;
  document.getElementById("currentAlive").innerHTML = aliveCells;
}

//CHANGE PROPERTIES OF CANVAS

function makeTorodial(){
  torodial = true;
  //setup(); 
  print("CHANGED TO TORODIAL FIELD");
  document.getElementById("currentField").innerHTML = "Torodial";
}
function makeFinite(){
  torodial = false;
  //setup();
  print("CHANGED TO FINITE FIELD");
  document.getElementById("currentField").innerHTML = "Finite";
}

//USER INTERACTIONS

function mousePressed() {
  mouse = true;
}

function keyTyped() {
  if(key==="a"){
    startSim();
  }
  if(key==="s"){
    stopSim();
  }
  if(key==="d"){
    nextGen();
  }
  if(key==="c"){
    clearCanvas();
  }
  if(key==="r"){
    randomCanvas();
  }
  if(key==="t"){
    makeTorodial();
  }
  if(key==="f"){
    makeFinite();
  }
  if(key==="q"){
    print("%c  ___                    _                     ___           _   ", 'color: aqua');print("%c / _ \\ _   _  __ _ _ __ | |_ _   _ _ __ ___   |_ _|_ __   __| |  ", 'color: aqua');print("%c| | | | | | |/ _` | '_ \\| __| | | | '_ ` _ \\   | || '_ \\ / _` |  ", 'color: aqua');print("%c| |_| | |_| | (_| | | | | |_| |_| | | | | | |  | || | | | (_| |  ", 'color: aqua');print("%c \\__\\_\\__,_|\\__,_|_| |_|\\__|\\__,_|_| |_|  |_| |___|_| |_|\\__,_/  (_)", 'color: aqua');
  }
}
function startSim(){
  start = true;
  print("SIMULATION STARTED");
}
function stopSim(){
  start = false;
  print("SIMULATION STOPPED");
}
function nextGen(){
  nextgen = true;
  print("NEXT GENERATION");
}
function clearCanvas(){
  clear = true;
  countGens();
  setup();
  print("CANVAS CLEARED");
}
function randomCanvas(){
  clear = false;
  countGens();
  setup();
  print("RANDOM CANVAS");
}
function corners(){
  roundCorners = 0;
  print("CORNERS");
}
function circles(){
  roundCorners = 1;
  print("CIRCLES");
}
function resUp(){
  res++;
  setup();
  print("RESOLUTION DECREASED BY 1");
}
function resDown() {
  res--;
  setup();
  print("RESOLUTION INCREASED BY 1");
}
function resRes (){
  res = 15;
  setup();
  print("RESOLUTION WAS RESET");
}
function canvasUp(){
  canvasHeight += 100;
  canvasWidth += 100; 
  print("CANVAS SIZE INCREASED BY 100");
  setup();
}
function canvasDown(){
  if(canvasHeight > 100 && canvasWidth > 100){
    canvasHeight -= 100;
    canvasWidth -= 100;
    setup();
    print("CANVAS SIZE DECREASED BY 100");
  } else {
    alertNeg();
    }
}
function canvasRes(){
  canvasWidth = Math.floor(window.innerWidth); 
  canvasHeight = Math.floor(window.innerHeight);
  setup();
  print("CANVAS SIZE WAS RESET");
}
function setResTo5(){
  res=5; 
  setup();
  print("RESOLUTION SET TO 5");
}
function setResTo10(){
  res=10; 
  setup();
  print("RESOLUTION SET TO 10");
}
function setResTo15(){
  res=15; 
  setup();
  print("RESOLUTION SET TO 15");
}
function setCanvasTo400(){
  canvasHeight = 400;
  canvasWidth = 400; 
  print("CANVAS SIZE SET TO 400 x 400");
  setup();
}
function setCanvasTo1000(){
  canvasHeight = 1000;
  canvasWidth = 1000; 
  print("CANVAS SIZE SET TO 1000 x 1000");
  setup();
}
function setCanvasTo1500(){
  canvasHeight = 1500;
  canvasWidth = 1500; 
  print("CANVAS SIZE SET TO 1500 x 1500");
  setup();
}
function setCanvasTo(xC, yC) {
  let ganzeZahl = true;
  let positive = true;
  if(xC == "" || yC == ""){
    alertEmpty();
  } else if(xC<0 || yC<0){
    positive = false;
    alertNeg();
  } else if(xC % 1 != 0 || yC % 1 != 0) {
    alertInt();  
    ganzeZahl = false;
  } else if(ganzeZahl == true && positive == true) {
      canvasWidth = xC;
      canvasHeight = yC;
      print(`CANVASSIZE SET TO ${xC} x ${yC}` );
      setup();
  }
}
function setResTo(a) {
  let ganzeZahl = true;
  let positive = true;
  if(a == ""){
    alertEmpty();
  } else if(a<0){
    positive = false;
    alertNeg();
  } else if(a % 1 != 0) {
    alertInt();  
    ganzeZahl = false;
  } else if(ganzeZahl == true && positive == true) {
      res = a;
      print(`RESOLUTION SET TO ${a}`);
      setup();
  }
}

document.addEventListener("DOMContentLoaded", function() {
  let resSlider = document.getElementById("resolution-slider");
  resSlider.oninput = function() {
    res = resSlider.value;
    print(`RESOLUTION SET TO ${resSlider.value}`); //f string
    setup();
  };
});

function colorMode1(){
  h1=0;s1=0;b1=0;
  h2=0;s2=0;b2=100;
  print("COLORMODE CHANGED TO BW");} // BW
function colorMode2(){
  h1=0;s1=0;b1=100;
  h2=0;s2=0;b2=0;
  print("COLORMODE CHANGED TO WB");} // WB
function colorMode3(){
  h1=0;s1=0;b1=0;
  h2=180;s2=100;b2=100;
  print("COLORMODE CHANGED TO QI");} // QI

//INSERT PATTERNS

function insert(x,y,index){
  x = parseInt(x); //parsing string to integer 
  y = parseInt(y);

  if(index == 1){insertPattern = [[1,0,0],[1,1,1],[0,1,0]];} //rpent
  if(index == 2){insertPattern = [[1,1,1,0],[0,1,0,0],[0,1,1,1]];} //herschel
  if(index == 3){insertPattern = [[1,1,1],[1,0,0],[1,1,1]];} //piHept
  if(index == 4){insertPattern = [[1,1,0,0,0,1,1],[0,0,1,1,1,0,0],[0,1,0,0,0,1,0],[0,0,1,0,1,0,0],[0,0,0,1,0,0,0]];} // queenbee
  if(index == 5){insertPattern = [[0,1,0,0],[1,0,1,0],[1,0,0,1],[0,1,1,1]];} // wing
  if(index == 6){insertPattern = [[0,0,1],[1,0,1],[0,0,0],[0,1,0],[0,0,1],[0,0,1],[0,0,1]];} //acorn
  if(index == 7){insertPattern = [[0,1,1,1,1,0],[1,0,1,1,0,1],[1,1,0,0,1,1],[1,1,0,0,1,1],[1,0,1,1,0,1],[0,1,1,1,1,0]];} // octagon 2
  if(index == 8){insertPattern = [[0,0,0,1,1,1],[0,0,0,1,1,1],[0,0,0,1,1,1],[1,1,1,0,0,0],[1,1,1,0,0,0],[1,1,1,0,0,0]];} // figure 8
  if(index == 9){insertPattern = [[1,1,1,0,0,0],[1,0,0,0,1,1],[0,1,1,1,1,1],[0,0,0,0,0,0],[0,1,1,1,1,1],[1,0,0,0,1,1],[1,1,1,0,0,0]];} // tumbler
  if(index == 10){insertPattern = [[1,1,0,0],[1,1,0,0],[0,0,1,1],[0,0,1,1]];} //beacon
  if(index == 11){insertPattern = [[1,1,1]];} //blinker
  if(index == 12){insertPattern = [[0,0,0,0,1,1,0,0,0],[0,0,0,0,1,1,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,1,1,0,0],[0,0,0,0,1,1,1,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,1,1,0,0,0,1,1],
    [0,0,0,1,1,1,1,1,0],[0,0,0,0,1,1,1,0,0],[0,0,0,0,0,1,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[1,1,0,0,0,1,1,0,0],[0,0,1,1,1,0,0,0,0],
    [0,1,0,0,0,1,0,0,0],[0,0,1,0,1,0,0,0,0],[0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],
    [0,0,1,1,0,0,0,0,0],[0,0,1,1,0,0,0,0,0]];} //gosper glider gun
  if(index == 13){insertPattern = [[0,0,1],[1,0,1],[0,1,1]];}//glider
  if(index == 14){insertPattern = [[0,1,0],[1,0,0],[1,1,1]];}//glider
  if(index == 15){insertPattern = [[1,1,0],[1,0,1],[1,0,0]];}//glider
  if(index == 16){insertPattern = [[1,1,1],[0,0,1],[0,1,0]];}//glider
  if(index == 17){insertPattern = [[0,0,1,0,0,0,0,0,0,0],[1,1,0,1,0,0,0,0,0,0],[1,1,0,1,1,0,0,0,0,0],[0,1,0,1,1,0,0,0,0,0], 
    [1,1,0,1,1,0,0,0,0,0],[0,1,0,1,0,0,0,1,1,0],[0,0,1,1,0,0,0,1,0,1],[0,0,1,1,0,1,0,0,0,1],[0,0,0,0,0,1,1,1,1,0],[0,0,0,0,0,1,1,0,0,0]];}//loafer
  if(index == 18){insertPattern = [[1,1,1,0,0,0,0,0,0,0],[1,0,1,1,0,0,0,0,0,0],[1,1,1,1,0,1,0,0,0,0],[0,0,0,0,0,0,1,0,0,0],
    [0,0,0,0,0,1,1,0,0,0],[0,0,0,0,0,0,1,1,1,1],[0,0,0,0,1,0,1,0,0,0],[0,0,0,1,0,0,1,0,0,0],[0,0,0,1,0,0,1,0,0,0],[0,0,0,0,1,0,1,0,0,0],
    [0,0,0,0,0,0,1,1,1,1],[0,0,0,0,0,1,1,0,0,0],[0,0,0,0,0,0,1,0,0,0],[1,1,1,1,0,1,0,0,0,0],[1,0,1,1,0,0,0,0,0,0],[1,1,1,0,0,0,0,0,0,0]];}//weekender
  if(index == 19){insertPattern = [[0,0,0,1,1,0,1,1,1,0,0,0,0],[0,1,1,0,0,1,1,0,0,0,0,1,0],[1,0,0,0,0,1,0,0,0,0,0,1,1],
    [1,0,0,0,0,1,0,0,0,0,0,1,1],[0,1,1,0,0,1,1,0,0,0,0,1,0],[0,0,0,1,1,0,1,1,1,0,0,0,0]];} //copperhead
  if(index == 20){insertPattern = [[1,1,1,0],[1,0,0,1],[1,0,0,0],[1,0,0,0],[0,1,0,1]];}//spaceship
  if(index == 21){insertPattern = [[1,0,1,0],[0,0,0,1],[0,0,0,1],[1,0,0,1],[0,1,1,1]];}//spaceship
  if(index == 22){insertPattern = [[0,1,0,0,1],[1,0,0,0,0],[1,0,0,0,1],[1,1,1,1,0]];}//spaceship
  if(index == 23){insertPattern = [[0,1,1,1,1],[1,0,0,0,1],[0,0,0,0,1],[1,0,0,1,0]];}//spaceship
  if(index == 24){insertPattern = [[0,1,0],[0,1,1],[1,1,0],[1,0,0]]}//century
  if(index == 25){insertPattern = [[0,1,1,0],[1,0,0,0],[1,0,1,1],[0,1,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,1,1,0],[0,1,1,0]]}//beehive
  if(index == 26){insertPattern = [[1,0,0,0,0],[1,0,1,1,1],[1,0,0,0,0]]}//thunderbird
  if(index == 27){insertPattern = [[1,1,1,0,0,0,1,1,1],[1,0,0,1,0,1,0,0,1],[1,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,1],[0,1,0,1,0,1,0,1,0],
    [0,0,0,0,0,0,0,0,0],[0,0,0,0,1,0,0,0,0],[0,0,0,1,1,1,0,0,0],[0,0,1,1,0,1,1,0,0],[0,0,0,1,1,1,0,0,0],[0,0,0,1,1,1,0,0,0],[0,0,0,1,1,1,0,0,0],
    [0,0,0,1,0,1,0,0,0],[0,0,0,1,0,1,0,0,0],[0,0,0,0,1,0,0,0,0]]}//schick engine spaceship
  if(index == 28){insertPattern = [[0,1,0,0],[1,0,1,0],[0,0,0,0],[1,0,0,1],[0,0,1,1],[0,0,0,1]]}//switch engine
  if(index == 29){insertPattern = [[0,1,1,1,0,0,0,0,0],[0,1,1,1,0,0,0,0,0],[0,1,0,0,0,0,0,0,0],[0,1,1,0,0,0,0,0,0],[1,0,0,1,0,0,0,0,0],
    [1,0,0,0,0,0,1,1,0],[1,0,0,0,1,1,1,1,0],[1,0,0,0,0,1,1,0,1],[1,0,0,1,0,0,1,1,1],[1,1,1,0,0,0,0,1,0]]}//coe ship
  if(index == 30){insertPattern = [[0,0,0,0,1,0,0,0,0,0,1,0,0,0,0],[0,0,0,1,1,1,0,0,0,1,1,1,0,0,0],[0,0,0,1,0,1,1,0,1,1,0,1,0,0,0],
    [0,0,0,0,1,1,1,0,1,1,1,0,0,0,0],[0,0,0,0,1,1,0,0,0,1,1,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,1,0,0,0,0,0,0],[0,0,0,0,0,1,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,1,0,1,0,0,0,0,0,0],[1,1,1,0,0,0,1,1,1,0,0,0,1,1,1],
    [1,0,0,1,0,0,0,0,0,0,0,1,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],[0,1,0,1,0,0,0,0,0,0,0,1,0,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],[0,0,0,0,0,0,1,0,1,0,0,0,0,0,0],[0,0,0,0,0,0,1,1,1,0,0,0,0,0,0]]}//blinker ship 1
  if(index == 31){insertPattern = [[1,1],[1,1]]}//block
  if(index == 32){insertPattern = [[1,1,0,0],[1,0,0,0],[0,1,1,1],[0,0,0,1]]}//eater 
  if(index == 33){insertPattern = [[1,0,0,0],[1,1,1,0],[0,0,0,1],[0,0,1,1]]}//eater 
  if(index == 34){insertPattern = [[0,0,1,1],[0,1,0,1],[0,1,0,0],[1,1,0,0]]}//eater 
  if(index == 35){insertPattern = [[0,0,1,1],[0,0,1,0],[1,0,1,0],[1,1,0,0]]}//eater 
  if(index == 36){insertPattern = [[0,0,0,0,1,0,0,0,0],[0,0,0,0,1,0,0,0,0],[0,0,1,0,1,0,1,0,0],[0,0,1,0,1,0,1,0,0],[1,0,1,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,0,1],[1,0,1,0,1,0,1,0,1],[1,0,1,0,1,0,1,0,1],[0,0,1,0,1,0,1,0,0],[0,0,1,0,1,0,1,0,0],[0,0,0,0,1,0,0,0,0],[0,0,0,0,1,0,0,0,0]]}//diamond 
  if(index == 37){insertPattern = [[1,1],[1,1],[1,1],[1,1],[1,1],[1,0]]}//undecomino 
  if(index == 38){insertPattern = [[0,0,1,0,1,1,0],[0,1,0,1,0,0,1],[1,0,0,1,0,1,0],[0,1,1,0,1,0,0]]}//bi-loaf 
  if(index == 0){insertPattern = [[0,1,0,0,0,0,0],[0,1,0,1,0,0,0],[1,0,1,0,0,0,0],[0,0,1,0,1,0,0],[0,0,0,0,1,0,1],[0,0,0,1,0,1,0],[0,0,0,0,0,1,0]]}//bi-clock
  if(index == 39){insertPattern = [[1,1,0,1,1,1,1,1,1],[1,1,0,1,1,1,1,1,1],[1,1,0,0,0,0,0,0,0],[1,1,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,1,1],[1,1,0,0,0,0,0,1,1],
    [0,0,0,0,0,0,0,1,1],[1,1,1,1,1,1,0,1,1],[1,1,1,1,1,1,0,1,1]]} //kok's galaxy
  if(index == 40){insertPattern = [[0,1,0],[0,1,1],[0,0,0],[0,0,0],[0,0,0],[0,0,1],[1,0,1],[0,0,1]]}//diehard
  if(index == 41){insertPattern = [[0,1,0],[1,1,1],[1,0,0]];} //fpent
  if(index == 42){insertPattern = [[0,0,1],[1,0,1],[0,1,1],[0,1,1],[1,0,1],[0,0,1]];} //angel
 
  if(x == "" || y == ""){
    alertEmpty();
  } else if(x % 1 != 0 || y % 1 != 0){
    alertInt();
  } else if(x < 0 || y < 0){
    alertNeg();
  } else if(x>canvasWidth/res || y>canvasHeight/res){
    alertOutOfField();
  } 
  else {
    for(let i=0; i<insertPattern.length; i++) {
      for(let j=0; j<insertPattern[i].length; j++) {
        grid[y+i][x+j] = insertPattern[i][j];
      }
    }
  }
}
function randomPattern(){
  let r = floor(random(43));
  let x = document.getElementById('xPos').value;
  let y = document.getElementById('yPos').value;
  if(document.getElementById('xPos').value == "" || document.getElementById('yPos').value == ""){
    alertEmpty();
  } else if(x % 1 != 0 || y % 1 != 0){
    alertInt();
  } else if(x>canvasWidth/res || y>canvasHeight/res){
    alertOutOfField();
  } else if(x<0||y<0){
    alertNeg();
  } else{
    insert(document.getElementById('xPos').value, document.getElementById('yPos').value, r);
  }
}

//ALERTS

function alertInt(){
  let r = floor(random(8));
  if(r==0){
    alert("Life is full of infinite possibilities, but canvas sizes aren't one of them. Please enter an integer value for the canvas size.");      
  } else if(r==1){
    alert("EMOTIONAL DAMAGE. enter an integer");
  } else if(r==7){
    alert("YOU ARE SUCH A FAILURE. enter an integer");
  } else if(r==2){
    alert("Life's resolution is not about the pixels, but the moments that make them. Please enter an integer value for the screen resolution and enjoy life's vivid details.")
  } else if(r==3){
    alert("Error 101: Life's resolution not found. Please set your screen resolution to an integer value and watch your life come into focus.")
  } else if(r==4){
    alert("Life is a journey full of twists and turns, but the screen resolution is not one of them. Please enter an integer value and let the game of life run smoothly.")
  } else if(r==5){
    alert("Non-integer resolution? That's a bit of a screen glitch. Please set your resolution to an integer value and enjoy life's vibrant display.")
  } else if(r==6){
    alert("Sorry, friend. Non-integer resolutions are not compatible with life's software. Please enter an integer value and see your life in high-definition clarity.")
  }
}
function alertNeg(){
  let r = floor(random(8));
  if(r==0){
    alert("Negativity has no place in the canvas of life. Please enter a positive value for canvas size.");
  } else if(r==1){
    alert("have you ever tried to drink -1 Paulaner Spazi? Me neither. Enter a positive value for the canvas size.")
  } else if(r==7){
    alert("EMOTIONAL DAMAGE. enter a positive value.");
  } else if(r==2){
    alert("Whoa there, friend! Negative canvas size? That's a real stroke of bad luck. Please enter a positive value and paint your life's masterpiece in a brighter hue.")
  } else if(r==3){
    alert("Error 404: Positive vibes not found. Please set your canvas size to a positive value and let the colors of life shine through.")
  } else if(r==4){
    alert("Life is a canvas that should be painted with bold strokes, not negative numbers. Please enter a positive value for the canvas size and let the game of life unfold in its own unique way.")
  } else if(r==5){
    alert("Negative canvas size? That's a real downer. Remember, life is a work of art and you're the artist. So keep your canvas positive and paint a picture of a happy, fulfilling life.")
  } else if(r==6){
    alert("Sorry, friend. Negative canvas size is not an option. Please choose a positive value and embrace the beauty of life's canvas.")
  }
}
function alertOutOfField(){
  let r = floor(random(8));
  if(r==0){
    alert("Life is infinite, but your input must fit within the boundaries of the field. Please enter a value that is within the range of the pattern's size.");
  } else if(r==1){
    alert("Error: Your input is out of bounds. Life's patterns can't extend beyond the field, so please enter a value that fits within the pattern's size.")
  } else if(r==7){
    alert("EMOTIONAL DAMAGE. enter values that are inside the field.");
  } else if(r==2){
    alert("Life is full of surprises, but your input shouldn't be one of them. Please enter a value that is within the bounds of the pattern's size and let the game of life unfold naturally.")
  } else if(r==3){
    alert("Error: Your input is causing a disturbance in the game of life. Please enter a value that is within the range of the pattern's size and maintain the harmony of the field.")
  } else if(r==4){
    alert("Error: Your input is triggering an existential crisis in the game of life. Please enter a value that is within the range of the pattern's size and help the game of life find meaning.")
  } else if(r==5){
    alert("Error: Your input is like a glitch in the matrix. Please enter a value that is within the range of the pattern's size and restore order to the game of life.")
  } else if(r==6){
    alert("Error: Your input is like a rogue wave, causing chaos in the game of life. Please enter a value that is within the range of the pattern's size and tame the turbulent waters of the field.")
  }
}
function alertEmpty(){
  let r = floor(random(8));
  if(r==0){
    alert("Error: You forgot to enter a value. Please enter a valid value to change the course of the game of life.");
  } else if(r==1){
    alert("Life is a blank canvas, but you forgot to paint it. Please enter a value to bring your vision to life.")
  } else if(r==7){
    alert("EMOTIONAL DAMAGE. enter a value");
  } else if(r==2){
    alert("Life is like a road trip, but you forgot to pack your bags. Please enter a value to ensure you have everything you need for the journey.")
  } else if(r==3){
    alert("Error: Your input is as empty as a vacuum. Please enter a value to fill the void in the game of life.")
  } else if(r==4){
    alert("Life is full of choices, but you forgot to make one. Please enter a value to shape the game of life.")
  } else if(r==5){
    alert("Error: Your input is as absent as a ghost. Please enter a value to bring life to the game.")
  } else if(r==6){
    alert("Error: Your input is as elusive as a unicorn. Please enter a value to make the game of life more real.")
  }
}