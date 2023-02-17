let grid;
let cols;
let rows;
let res = 15; 
let start = false; 
let nextgen = false;
let roundCorners = 1;
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

const splash = document.querySelector(".splash"); //splash = html element with splash class 
document.addEventListener("DOMContentLoaded", (e) =>{  //waiting for html to load, e passes obj onto func
  setTimeout(() => { 
    splash.classList.add('display-none'); //hiding element bhind page
  }, 1500); 
})

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
  generation = 0;
  countGens();

  document.getElementById("currentField").innerHTML = "Torodial";
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
  countCells(grid);
}

function draw() {
  if(key==="b"){
    colorMode1();}
  else if(key==="n"){
    colorMode2();}
  else if(key==="m"){
    colorMode3();}
  background(h1,s1,b1);
  //draw
  for(let i=0; i<cols; i++){
    for(let j=0; j<rows; j++){
      let x = i*res;
      let y = j*res;
      if (grid[i][j] == 1){
        fill(h2,s2,b2);
        stroke(0);
        rect(x, y, res-1, res-1, roundCorners*(res/2));
      }
      if ((i*res<mouseX) && (mouseX<(i + 1)*res) && (j*res<mouseY) && (mouseY<(j + 1)*res)) { //mouse on canvas/array?
        if (mouse == true) { 
            grid[i][j] = (grid[i][j] + 1) % 2; //when 0 --> 1, when 1 --> 0
            mouse = false;
        }
      }
    }
  } 
  if(start == true || nextgen == true) {
    let next = makeNewGrid (cols, rows);

    if(torodial == true){
      //Calculate next based on old grid
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
  if(key === "p"){
   roundCorners = 1;
  }
}

function countNeighborsTorodial(grid, x, y) {
  let sum = 0;
  for(let i=-1; i<2; i++) {
    for (let j=-1; j<2; j++) {

      let col = (x + i + cols) % cols; //due to wrapparound shifting rows and cols to the other side
      let row = (y + j + rows) % rows; //p.e.: (9+1+10 % 10 = 0) -> 9th element in row was shifted to 1st in nexte gen

      sum += grid[col][row];
    }
  }
  sum -= grid[x][y]; //only neighbors -> substract yourself from sum
  return sum;
}

function countNeighborsFinite(grid, x, y){
  let sum = 0;
  for(let i=-1; i<2; i++){
    for(let j=-1; j<2; j++){
      sum += grid[x+i][y+j];
    }
  }
  sum -= grid[x][y]; //only neighbors -> substract yourself from sum
  return sum;
}

function colorMode1(){
  h1=0;s1=0;b1=0;h2=0;s2=0;b2=100;
  print("COLORMODE CHANGED TO BW");} // BW
function colorMode2(){
  h1=0;s1=0;b1=100;h2=0;s2=0;b2=0;
  print("COLORMODE CHANGED TO WB");} // WB
function colorMode3(){
  h1=276;s1=100;b1=50;h2=180;s2=100;b2=100;
  print("COLORMODE CHANGED TO QI");} // QI

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
  //print("DEAD:" + deadCells + " ALIVE:" + aliveCells);
  document.getElementById("currentDead").innerHTML = deadCells;
  document.getElementById("currentAlive").innerHTML = aliveCells;
}
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

//----------------------USER INTERACTIONS

function mousePressed() {
  mouse = true;
}

function keyTyped() {
  if(key==="a"){
    startSim();}
  if(key==="s"){
    stopSim();}
  if(key==="d"){
    nextGen();}
  if(key==="c"){
    clearCanvas();}
  if(key==="r"){
    randomCanvas();}
  if(key==="t"){
    makeTorodial();}
  if(key==="f"){
    makeFinite();}
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
  res=5; setup();print("RESOLUTION SET TO 5");
}
function setResTo10(){
  res=10; setup();print("RESOLUTION SET TO 10");
}
function setResTo15(){
  res=15; setup();print("RESOLUTION SET TO 15");
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
  if(xC<0 || yC<0){
    positive = false;
    alertNeg();
  }
  if(xC % 1 != 0 || yC % 1 != 0) {
    alertInt();  
    ganzeZahl = false;
  } else if(ganzeZahl == true && positive == true) {
      canvasWidth = xC;
      canvasHeight = yC;
      print("CANVASSIZE SET TO "+ xC + " x " + yC );
      setup();
  }
}
function setResTo(a) {
  let ganzeZahl = true;
  if(a % 1 != 0) {
    alertInt();  
    ganzeZahl = false;
  } else if(ganzeZahl == true) {
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

//-------------------INSERT PATTERNS

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
  if(index == 13){insertPattern = [[0,0,1],[1,0,1],[0,1,1]];} //gliders
  if(index == 14){insertPattern = [[0,1,0],[1,0,0],[1,1,1]];}
  if(index == 15){insertPattern = [[1,1,0],[1,0,1],[1,0,0]];}
  if(index == 16){insertPattern = [[1,1,1],[0,0,1],[0,1,0]];}
  if(index == 17){insertPattern = [[0,0,1,0,0,0,0,0,0,0],[1,1,0,1,0,0,0,0,0,0],[1,1,0,1,1,0,0,0,0,0],[0,1,0,1,1,0,0,0,0,0], 
    [1,1,0,1,1,0,0,0,0,0],[0,1,0,1,0,0,0,1,1,0],[0,0,1,1,0,0,0,1,0,1],[0,0,1,1,0,1,0,0,0,1],[0,0,0,0,0,1,1,1,1,0],[0,0,0,0,0,1,1,0,0,0]];}//loafer
  if(index == 18){insertPattern = [[1,1,1,0,0,0,0,0,0,0],[1,0,1,1,0,0,0,0,0,0],[1,1,1,1,0,1,0,0,0,0],[0,0,0,0,0,0,1,0,0,0],
    [0,0,0,0,0,1,1,0,0,0],[0,0,0,0,0,0,1,1,1,1],[0,0,0,0,1,0,1,0,0,0],[0,0,0,1,0,0,1,0,0,0],[0,0,0,1,0,0,1,0,0,0],[0,0,0,0,1,0,1,0,0,0],
    [0,0,0,0,0,0,1,1,1,1],[0,0,0,0,0,1,1,0,0,0],[0,0,0,0,0,0,1,0,0,0],[1,1,1,1,0,1,0,0,0,0],[1,0,1,1,0,0,0,0,0,0],[1,1,1,0,0,0,0,0,0,0]];}//weekender
  if(index == 19){insertPattern = [[0,0,0,1,1,0,1,1,1,0,0,0,0],[0,1,1,0,0,1,1,0,0,0,0,1,0],[1,0,0,0,0,1,0,0,0,0,0,1,1],
    [1,0,0,0,0,1,0,0,0,0,0,1,1],[0,1,1,0,0,1,1,0,0,0,0,1,0],[0,0,0,1,1,0,1,1,1,0,0,0,0]];} //copperhead
  if(index == 20){insertPattern = [[1,1,1,0],[1,0,0,1],[1,0,0,0],[1,0,0,0],[0,1,0,1]];} //spaceships 
  if(index == 21){insertPattern = [[1,0,1,0],[0,0,0,1],[0,0,0,1],[1,0,0,1],[0,1,1,1]];}
  if(index == 22){insertPattern = [[0,1,0,0,1],[1,0,0,0,0],[1,0,0,0,1],[1,1,1,1,0]];}
  if(index == 23){insertPattern = [[0,1,1,1,1],[1,0,0,0,1],[0,0,0,0,1],[1,0,0,1,0]];}
  if(x % 1 != 0 || y % 1 != 0){
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


function alertInt(){
  let r = floor(random(8));
  if(r==0){
    alert("Life is full of infinite possibilities, but canvas sizes aren't one of them. Please enter an integer value for the canvas size.");      
  } else if(r==1){
    alert("EMOTIONAL DAMAGE. enter an integer");
  } else if(r==7){
    alert("YOU ARE SUCH A FAILURE. enter an integer");
  }else if(r==2){
    alert("Life's resolution is not about the pixels, but the moments that make them. Please enter an integer value for the screen resolution and enjoy life's vivid details.")
  }else if(r==3){
    alert("Error 101: Life's resolution not found. Please set your screen resolution to an integer value and watch your life come into focus.")
  }else if(r==4){
    alert("Life is a journey full of twists and turns, but the screen resolution is not one of them. Please enter an integer value and let the game of life run smoothly.")
  }else if(r==5){
    alert("Non-integer resolution? That's a bit of a screen glitch. Please set your resolution to an integer value and enjoy life's vibrant display.")
  }else if(r==6){
    alert("Sorry, friend. Non-integer resolutions are not compatible with life's software. Please enter an integer value and see your life in high-definition clarity.")
  }
}
function alertNeg(){
  let r = floor(random(8));
  if(r==0){
    alert("Negativity has no place in the canvas of life. Please enter a positive value for canvas size.");
  } else if(r==1){
    alert("have you ever tried to drink -1 Paulaner Spazi? Me neither. Enter a positive value for the canvas size.")
  }else if(r==7){
    alert("EMOTIONAL DAMAGE. enter a positive value.");
  }else if(r==2){
    alert("Whoa there, friend! Negative canvas size? That's a real stroke of bad luck. Please enter a positive value and paint your life's masterpiece in a brighter hue.")
  }else if(r==3){
    alert("Error 404: Positive vibes not found. Please set your canvas size to a positive value and let the colors of life shine through.")
  }else if(r==4){
    alert("Life is a canvas that should be painted with bold strokes, not negative numbers. Please enter a positive value for the canvas size and let the game of life unfold in its own unique way.")
  }else if(r==5){
    alert("Negative canvas size? That's a real downer. Remember, life is a work of art and you're the artist. So keep your canvas positive and paint a picture of a happy, fulfilling life.")
  }else if(r==6){
    alert("Sorry, friend. Negative canvas size is not an option. Please choose a positive value and embrace the beauty of life's canvas.")
  }
}
function alertOutOfField(){
  alert("Please enter a value for x and y that is inside the canvas.")
}
