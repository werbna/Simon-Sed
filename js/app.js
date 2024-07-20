let order = []; 
let playerOrder = [];
let flash;
let turn;
let good;
let compTurn;
let intervalID;
let strict = false;
let noise = true;
let on = false;
let win;

const turnCounter = document.getElementById('turn');
const topLeft = document.getElementById('topleft');
const topRight = document.getElementById('topright');
const bottomLeft = document.getElementById('bottomleft');
const bottomRight = document.getElementById('bottomright');
const strictButton = document.getElementById('strict');
const onSwitch = document.getElementById('on');
const startButton = document.getElementById('start');

strictButton.addEventListener('change', () => {
  if (strictButton.checked === true) {
    strict = true;
  } else {
    strict = false;
  }
})

onSwitch.addEventListener('change', () => {
  if (onSwitch.checked === true) {
    on = true; 
    turnCounter.innerHTML = '-'
  } else {
    on = false;
    turnCounter.innerHTML = ''
    clearColor();
    clearInterval(intervalID);
  }
});

startButton.addEventListener('click', () => {
  if (on || win) {
    play();
  }
});

function play() {
  win = false;
  order = [];
  playerOrder = [];
  flash = 0;
  intervalID = 0;
  turn = 1;
  turnCounter.innerHTML = 1;
  good = true;
  for (let i = 0; i < 20; i++) {
    order.push(Math.floor(Math.random()*4) +1);
  }
  compTurn = true;
  intervalID = setInterval(gameTurn, 800);
}

function gameTurn() {
  on = false;

  if (flash === turn) {
    clearInterval(intervalID);
    compTurn = false;
    clearColor();
    on = true;
  }

  if (compTurn) {
    clearColor();
    setTimeout(() => {
      switch (order[flash]) {
        case 1: one(); break;
        case 2: two(); break;
        case 3: three(); break;
        case 4: four(); break;
      }
      flash++;
    }, 200);
  }
}

function one() {
  playSoundAndHighlight('clip1', topLeft, 'lightgreen');
}

function two() {
  playSoundAndHighlight('clip2', topRight, 'tomato');
}

function three() {
  playSoundAndHighlight('clip3', bottomLeft, 'yellow');
}

function four() {
  playSoundAndHighlight('clip4', bottomRight, 'skyblue');
}

function playSoundAndHighlight(clipId, element, color) {
  if (noise) {
    let audio = document.getElementById(clipId);
    audio.play();
  }
  noise = true;
  element.style.backgroundColor = color;
}

function clearColor() {
  topLeft.style.backgroundColor = 'darkgreen';
  topRight.style.backgroundColor = 'darkred';
  bottomLeft.style.backgroundColor = 'goldenrod';
  bottomRight.style.backgroundColor = 'darkblue';
}

function flashColor() {
  topLeft.style.backgroundColor = 'lightgreen';
  topRight.style.backgroundColor = 'tomato';
  bottomLeft.style.backgroundColor = 'yellow';
  bottomRight.style.backgroundColor = 'skyblue';
}

function handlePlayerClick(color, number) {
  if (on) {
    playerOrder.push(number);
    check();
    color();
    if (!win) {
      setTimeout(clearColor, 300);
    }
  }
}

topLeft.addEventListener('click', () => handlePlayerClick(one, 1));
topRight.addEventListener('click', () => handlePlayerClick(two, 2));
bottomLeft.addEventListener('click', () => handlePlayerClick(three, 3));
bottomRight.addEventListener('click', () => handlePlayerClick(four, 4));

function check() {
  if (playerOrder[playerOrder.length - 1] !== order[playerOrder.length - 1]) {
    good = false;
  }

  if (playerOrder.length === 20 && good) {
    winGame();
  }

  if (!good) {
    flashColor();
    turnCounter.innerHTML = 'NO!';
    setTimeout(() => {
      turnCounter.innerHTML = turn;
      clearColor();

      if (strict) {
        play();
      } else {
        compTurn = true;
        flash = 0;
        playerOrder = [];
        good = true;
        intervalID = setInterval(gameTurn, 800);
      }
    }, 800);
    noise = false;
  }

  if (turn === playerOrder.length && good && !win) {
    turn++;
    playerOrder = [];
    compTurn = true;
    flash = 0;
    turnCounter.innerHTML = turn;
    intervalID = setInterval(gameTurn, 800);
  }
}

function winGame() {
  flashColor();
  turnCounter.innerHTML = 'WIN!';
  on = false;
  win = true;
}