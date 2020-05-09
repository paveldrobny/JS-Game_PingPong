let canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d"),
  mainMenu = document.getElementById("menu"),
  startBtn = document.getElementById("startBtn"),
  textScore = document.getElementById("textScore"),
  mScore = document.getElementById("mScore"),
  pScore = document.getElementById("pScore"),
  textMatchType = document.getElementById("textMatchType"),
  mMatchType = document.getElementById("mMatchType"),
  pMatchType = document.getElementById("pMatchType"),
  textAI_Diff = document.getElementById("textAI_Diff"),
  mAI_Dif = document.getElementById("mAI_Dif"),
  pAI_Dif = document.getElementById("pAI_Dif"),
  textZoom = document.getElementById("textZoom");
mZoom = document.getElementById("mZoom"),
  pZoom = document.getElementById("pZoom"),


  canvas.width = 860;
canvas.height = 560;

var AI_Pos = canvas.height / 2 - 41;

var MatchType_arr = ["Local", "AI", "Spectator"];
var matchType_index = 0;

var AI_difficulty_arr = ["Easy", "Normal", "Hard"];
var AI_difficulty_index = 0;

var Zoom_arr = ["70%", "80%", "90%", "100%",
  "110%", "120%", "130%", "140%", "150%"];
var Zoom_index = 3; // Default 100%


//#region INIT
let player1 = new Player(15, AI_Pos, "green");
let player2 = new Player(canvas.width - 25, AI_Pos, "red");
let ball = new Ball(canvas.width / 2, canvas.height / 2, 10, "gray");
let input = new Input();
let gameM = new GameManager();
let ui = new UI();
textScore.innerHTML = gameM.scoreToEnd;
//#endregion


//#region PLAYER
function Player(x, y, color) {
  this.x = x;
  this.y = y;
  this.w = 10;
  this.h = 82;
  this.speed = 5;
  this.color = color;
  this.isUpKey = false;
  this.isDownKey = false;
}

Player.prototype.draw = function () {
  context.fillStyle = this.color;
  context.fillRect(this.x, this.y, this.w, this.h);
}
Player.prototype.move = function () {
  this.x++;
}
//#endregion


//#region BALL
function Ball(x, y, r, color) {
  this.x = x;
  this.y = y;
  xS = 4;
  yS = -4;
  this.r = r;
  this.color = color;
}

Ball.prototype.draw = function () {
  context.beginPath();
  context.fillStyle = this.color;
  context.arc(this.x, this.y, this.r, Math.PI * 2, 0);
  context.fill();
  context.closePath();
}

Ball.prototype.move = function () {
  if (this.y > canvas.height - this.r || this.y < 0 + this.r) {
    yS = -yS;
  }

  if (this.x > player1.x && this.x < player1.x + 10 && this.y > player1.y && this.y < player1.y + player1.h) {
    xS = -xS;
  }
  if (this.x > player2.x && this.x < player2.x + 10 && this.y > player2.y && this.y < player2.y + player2.h) {
    xS = -xS;
  }
  if (gameM.gameStart && gameM.gameEnd == false) {
    this.x += xS;
    this.y += yS;
  }
  console.log("GS " + gameM.gameStart)
  console.log("GE " + gameM.gameEnd)
}

Ball.prototype.restart = function () {
  this.x = canvas.width / 2;
  this.y = canvas.height / 2;
}
//#endregion


//#region INPUT 
function Input() {
  keyW = 87;
  keyS = 83;
  keyA = 65;
  keyD = 68;
  keyArrowUp = 38;
  keyArrowDown = 40;
  keyArrowLeft = 37;
  keyArrowRight = 39;
  keySpace = 32;
  keyEnter = 13;
}

Input.prototype.keyDown = function (e) {
  if (e.keyCode == keyW) {
    player1.isUpKey = true;
  }
  if (e.keyCode == keyS) {
    player1.isDownKey = true;
  }
  if (e.keyCode == keyArrowUp) {
    player2.isUpKey = true;
  }
  if (e.keyCode == keyArrowDown) {
    player2.isDownKey = true;
  }
  if (gameM.gameEnd) {
    if (e.keyCode == keySpace) {
      gameM.gameStart = false;
      location.reload();
    }
  }
}

Input.prototype.keyUp = function (e) {
  if (e.keyCode == keyW) {
    player1.isUpKey = false;
  }
  if (e.keyCode == keyS) {
    player1.isDownKey = false;
  }
  if (e.keyCode == keyArrowUp) {
    player2.isUpKey = false;
  }
  if (e.keyCode == keyArrowDown) {
    player2.isDownKey = false;
  }
}

Input.prototype.keyDetect = function (e) {
  if (player1.isUpKey) {
    player1.y -= player1.speed;
  }
  if (player1.isDownKey) {
    player1.y += player1.speed;
  }
  if (player2.isUpKey) {
    player2.y -= player2.speed;
  }
  if (player2.isDownKey) {
    player2.y += player2.speed;
  }
}
//#endregion


//#region GAME MANAGER
function GameManager() {
  leftW = 0;
  rightW = canvas.width;
  topH = 0;
  bottomH = canvas.height;
  this.p1Score = 0;
  this.p2Score = 0;
  this.scoreToEnd = 2;
  this.gameStart = false;
  this.gameEnd = false;
}

GameManager.prototype.area = function () {
  if (player1.y < topH) {
    player1.y = topH;
  }
  if (player1.y > bottomH - player1.h) {
    player1.y = bottomH - player1.h;
  }
  if (player2.y < topH) {
    player2.y = topH;
  }
  if (player2.y > bottomH - player2.h) {
    player2.y = bottomH - player2.h;
  }
}

GameManager.prototype.addScore = function () {
  if (ball.x < leftW) {
    gameM.p2Score++;
    ball.restart();
  } if (ball.x > rightW) {
    gameM.p1Score++;
    ball.restart();
  }
  if (this.p1Score >= this.scoreToEnd || this.p2Score >= this.scoreToEnd) {
    gameM.gameEnd = true;
    ui.winPlayer();
    ui.message("Press the Spacebar to return to the menu.");
  } else {
    // Else UI
  }
}

// UI SELECTOR 
GameManager.prototype.mScoreToEnd = function () {
  if (gameM.scoreToEnd > 2) {
    gameM.scoreToEnd -= 2;
    textScore.innerHTML = gameM.scoreToEnd;
  }
}

GameManager.prototype.pScoreToEnd = function () {
  if (gameM.scoreToEnd < 100) {
    gameM.scoreToEnd += 2;
    textScore.innerHTML = gameM.scoreToEnd;
  }
}

GameManager.prototype.mMatchType = function () {
  if (matchType_index <= 0) {
    matchType_index = 0
  } else {
    matchType_index--;
  }
  textMatchType.innerHTML = MatchType_arr[matchType_index];
}

GameManager.prototype.pMatchType = function () {
  if (matchType_index >= MatchType_arr.length - 1) {
    matchType_index = MatchType_arr.length - 1;
  } else {
    matchType_index++;
  }
  textMatchType.innerHTML = MatchType_arr[matchType_index];
}

GameManager.prototype.mAI_Dif = function () {
  if (AI_difficulty_index <= 0) {
    AI_difficulty_index = 0
  } else {
    AI_difficulty_index--;
  }
  textAI_Diff.innerHTML = AI_difficulty_arr[AI_difficulty_index];
}

GameManager.prototype.pAI_Dif = function () {
  if (AI_difficulty_index >= AI_difficulty_arr.length - 1) {
    AI_difficulty_index = AI_difficulty_arr.length - 1;
  } else {
    AI_difficulty_index++;
  }
  textAI_Diff.innerHTML = AI_difficulty_arr[AI_difficulty_index];
}

GameManager.prototype.mZoom = function () {
  if (Zoom_index <= 0) {
    Zoom_index = 0
  } else {
    Zoom_index--;
  }
  textZoom.innerHTML = Zoom_arr[Zoom_index];
  document.body.style.zoom = Zoom_arr[Zoom_index];
}

GameManager.prototype.pZoom = function () {
  if (Zoom_index >= Zoom_arr.length - 1) {
    Zoom_index = Zoom_arr.length - 1;
  } else {
    Zoom_index++;
  }
  textZoom.innerHTML = Zoom_arr[Zoom_index];
  document.body.style.zoom = Zoom_arr[Zoom_index];
}


GameManager.prototype.startGame = function () {
  gameM.gameStart = true;
  menu.style.display = "none";
}

GameManager.prototype.endGame = function () {
  a = this.p1Score;
  b = this.p2Score;
  if (a > b) return "Player 1";
  else return "Player 2";
}

GameManager.prototype.AI = function () {
  const EASY = 10, NORMAL = 9, HARD = 8;
  if (AI_difficulty_index == 0) {
    if (matchType_index == 2) {
      AI_Pos = (ball.y - 10) + Math.floor(Math.random() * 3) + EASY;
      player1.y = AI_Pos;
    }
    AI_Pos = (ball.y - 10) + Math.floor(Math.random() * 3) + EASY;
    player2.y = AI_Pos;
  }
  else if (AI_difficulty_index == 1) {
    if (matchType_index == 2) {
      AI_Pos = (ball.y - 10) + Math.floor(Math.random() * 3) + NORMAL;
      player1.y = AI_Pos;
    }
    AI_Pos = (ball.y - 10) + Math.floor(Math.random() * 3) + NORMAL;
    player2.y = AI_Pos;
  } else if (AI_difficulty_index == 2) {
    if (matchType_index == 2) {
      AI_Pos = (ball.y - 10) + Math.floor(Math.random() * 3) + HARD;
      player1.y = AI_Pos;
    }
    AI_Pos = (ball.y - 10) + Math.floor(Math.random() * 3) + HARD;
    player2.y = AI_Pos;
  }
}

//#endregion


//#region UI 
function UI() {
  x = canvas.width;
  y = canvas.height;
}

UI.prototype.score = function () {
  context.font = '27px sans-serif';
  context.fillStyle = 'white';
  context.textAlign = 'center';
  context.fillText(gameM.p1Score + " : " + gameM.p2Score, x / 2, 35);
}

UI.prototype.winPlayer = function () {
  context.font = '45px sans-serif';
  context.fillStyle = 'orange';
  context.textAlign = 'center';
  context.fillText(gameM.endGame() + " Won!", x / 2, y / 2 - 30);
}

UI.prototype.message = function (mess) {
  context.font = '19px sans-serif';
  context.fillStyle = '#a0a0a0';
  context.textAlign = 'center';
  context.fillText(mess, x / 2, y - 26);
}
//#endregion 


//#region EVENTS 


window.addEventListener("keydown", input.keyDown);
window.addEventListener("keyup", input.keyUp);
startBtn.addEventListener("click", gameM.startGame);
mScore.addEventListener("click", gameM.mScoreToEnd);
pScore.addEventListener("click", gameM.pScoreToEnd);
mMatchType.addEventListener("click", gameM.mMatchType);
pMatchType.addEventListener("click", gameM.pMatchType);
mAI_Dif.addEventListener("click", gameM.mAI_Dif);
pAI_Dif.addEventListener("click", gameM.pAI_Dif);
mZoom.addEventListener("click", gameM.mZoom);
pZoom.addEventListener("click", gameM.pZoom);

//#endregion


function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (gameM.gameStart) {
    player1.draw();
    player2.draw();
    ball.draw();
    ball.move();
    input.keyDetect();
    if (matchType_index == 1 || matchType_index == 2) {
      gameM.AI();
    }
    gameM.area();
    gameM.addScore();
    ui.score();
  }
  if (!gameM.gameStart) {
    menu.style.display = "block";
  }
  requestAnimationFrame(gameLoop);
}

gameLoop();