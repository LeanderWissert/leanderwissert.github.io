let grid;
let cols;
let rows;
let res = 15; 
let start = 0;
let roundOff = 1;
let canvasWidth = Math.floor(window.innerWidth);  //CANVAS: Math.floor: rounds down to highest integer
let canvasHeight = Math.floor(window.innerHeight);
let playing = false;
let shape;
let generation = 0;
let clear = false;
let mouse = 0;
let h1=0;
let s1=0;
let b1=0;
let h2=0;
let s2=0;
let b2=100;
let aliveCells = 0;
let deadCells = 0;

/*TODO: 
-place objects
-display number of dead and alive cells
-slider for resolution
*/

function preload() {
  Sans = loadFont('OpenSans-Regular.ttf');
}

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

  document.getElementById("currentRes").innerHTML = res;
  document.getElementById("currentSize").innerHTML = canvasWidth + " × " + canvasHeight;

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
  countAliveCells(grid);
}


function draw() {
  if(key==="f"){
    h1=0;s1=0;b1=0;h2=0;s2=0;b2=100;
    print("COLORMODE CHANGED TO BW");} //colormode 1 BW
  else if(key==="g"){
    h1=0;s1=0;b1=100;h2=0;s2=0;b2=0;
    print("COLORMODE CHANGED TO WB");} //colormode 2 - WB
  else if(key==="h"){
    h1=276;s1=100;b1=50;h2=180;s2=100;b2=100;
    print("COLORMODE CHANGED TO QI");} //colormode 3 - QI
  background(h1,s1,b1);
  //draw
  for(let i=0; i<cols; i++){
    for(let j=0; j<rows; j++){
      let x = i*res;
      let y = j*res;
      if (grid[i][j] == 1){
        fill(h2,s2,b2);
        stroke(0);
        rect(x, y, res-1, res-1, roundOff*(res/2));
      }
      if ((i*res<mouseX) && (mouseX<(i + 1)*res) && (j*res<mouseY) && (mouseY<(j + 1)*res)) { //mouse on canvas/array?
        if (mouse == 1) { //mouse == 1 when mousePressed
            grid[i][j] = (grid[i][j] + 1) % 2; //when 0 --> 1, when 1 --> 0
            mouse = 0;
        }
      }
    }
  } 
  if(start == 1 || start == 2) {
    let next = makeNewGrid (cols, rows);

    //Calculate next based on old grid
    for(let i=0; i<cols; i++){
      for(let j=0; j<rows; j++){
        let state = grid[i][j];

        //Count live neighbors
        let sum = 0;
        let neighbors = countNeighbors(grid,i,j);

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
    if(start == 2){
      start = 0;
    }
    generation++;
    //print(generation);
    grid = next;
    let genCountDiv = document.getElementById("generation-count");
    genCountDiv.innerHTML = generation;  //GEN COUNT IN HTML
    countAliveCells(grid);
  }
  if(key==="o"){
    roundOff = 0;
  }
  if(key === "p"){
    roundOff = 1;
  }
}

function countAliveCells(grid){
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
  print("DEAD:" + deadCells + "ALIVE:" + aliveCells);
  document.getElementById("currentDead").innerHTML = deadCells;
  document.getElementById("currentAlive").innerHTML = aliveCells;
}

function countNeighbors(grid, x, y) {
  let sum = 0;
  for(let i=-1; i<2; i++) {
    for (let j=-1; j<2; j++) {

      let col = (x + i + cols) % cols; //due to wrapparound shifting rows and cols to the other side
      let row = (y + j + rows) % rows; //p.e.: (9+1+10 % 10 = 0) -> 9th element in row was shifted to 1st in nexte gen

      sum += grid[col][row];
    }
  }
  sum -= grid[x][y];
  return sum;
}

//---------------------------kUSER INTERACTIONS

function mousePressed() {
  mouse = (mouse + 1) % 2;
}

function keyTyped() {
  if(key==="j"){startSim();}
  if(key==="k"){stopSim();}
  if(key==="l"){nextGen();}
  if(key==="c"){clearCanvas();}
  if(key==="r"){randomCanvas();}
  if(key==="a"){resUp();}
  if(key==="s"){resDown();}
  if(key==="d"){resRes();}
  if(key==="q"){canvasUp();}
  if(key==="w"){canvasDown();}
  if(key==="e"){canvasRes();}

}
function startSim(){
  start = 1;
  print("SIMULATION STARTED");}
function stopSim(){
  start = 0;
  print("SIMULATION STOPPED");}
function nextGen(){
  start = 2;
  print("NEXT GENERATION");}
function clearCanvas(){
  clear = true;
  setup();
  print("CANVAS CLEARED");}
function randomCanvas(){
  clear = false; 
  setup();
  print("RANDOM CANVAS");}
function edgeRounding(){
  if (roundOff == 1) {
      roundOff = 0;
      print("CORNERS");
      document.getElementById("roundOffButton").value = "◯";
  } else if (roundOff == 0) {
      roundOff = 1;
      print("CIRCLES");
      document.getElementById("roundOffButton").value = "▢";
  }
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
    alert("MINIMAL CANVAS SIZE REACHED.");
  }
}
function canvasRes(){
  canvasWidth = Math.floor(window.innerWidth); 
  canvasHeight = Math.floor(window.innerHeight);
  setup();
  print("CANVAS SIZE WAS RESET");
}
function setResTo5(){
  res=5; setup();print("RESOLUTION SET TO 5");}
function setResTo10(){
  res=10; setup();print("RESOLUTION SET TO 10");}
function setResTo15(){
  res=15; setup();print("RESOLUTION SET TO 15");}
function setResTo20(){
  res=20; setup();print("RESOLUTION SET TO 20");}
function setResTo30(){
  res=30; setup();print("RESOLUTION SET TO 30");}

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
  if (xC % 1 != 0) {
      alert("ENTER AN INTEGER.");
      ganzeZahl = false;
  } if (yC % 1 != 0) {
      alert("ENTER AN INTEGER.");
      ganzeZahl = false;
  } else if (ganzeZahl == true) {
      canvasWidth = xC;
      canvasHeight = yC;
      print("CANVASSIZE SET TO "+ xC + " x " + yC );
      setup();
  }
}
function setResTo(a) {
  let ganzeZahl = true;
  if (a % 1 != 0) {
      alert("ENTER AN INTEGER.");
      ganzeZahl = false;
  } else if (ganzeZahl == true) {
      res = a;
      print("RESOLUTION SET TO "+ a);
      setup();
  }
}
document.addEventListener("DOMContentLoaded", function() {
  let resSlider = document.getElementById("resolution-slider");
  resSlider.oninput = function() {
    res = resSlider.value;
    print(`RESOLUTION SET TO ${resSlider.value}`);
    setup();
  };
});