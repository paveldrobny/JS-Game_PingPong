let canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d"),
  mainMenu = document.getElementById("menu"),
  startBtn = document.getElementById("startBtn"),
  textScore = document.getElementById("textScore"),
  mScore = document.getElementById("mScore"),
  pScore = document.getElementById("pScore"),
  battleBtn = document.getElementsByClassName("battleBtn");


canvas.width = 850;
canvas.height = 550;

var AI_Pos = canvas.height / 2 - 41;


/*
LOCAL MODE - game_Type = 0;
AI MODE - game_Type = 1;
SPECTATOR MODE - game_Type = 2;
*/
var game_Type = 0;


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
  }else{
    ui.scoreEndMath();
  }
}

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
  AI_Pos = (ball.y - 10) + Math.floor(Math.random() * 3) + 9;
  player2.y = AI_Pos;
  if(game_Type == 2){
    AI_Pos = (ball.y - 10) + Math.floor(Math.random() * 3) + 9;
    player1.y = AI_Pos;
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

UI.prototype.scoreEndMath = function () {
  context.font = '19px sans-serif';
  context.fillStyle = 'gray';
  context.textAlign = 'center';
  context.fillText("Score to end: " + gameM.scoreToEnd, x / 2, y - 15);
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

for (let i = 0; i < battleBtn.length; i++) {
  battleBtn[i].addEventListener("click", function () {
    for (let i of battleBtn) i.classList.remove("active");
    battleBtn[i].classList.add("active");
    switch (i) {
      case 0:
        game_Type = 0;
        break;
      case 1:
        game_Type = 1;
        break;
      case 2:
        game_Type = 2;
        break;
    }
  })
}
window.addEventListener("keydown", input.keyDown);
window.addEventListener("keyup", input.keyUp);
startBtn.addEventListener("click", gameM.startGame);
mScore.addEventListener("click", gameM.mScoreToEnd);
pScore.addEventListener("click", gameM.pScoreToEnd);
//#endregion


function gameLoop() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (gameM.gameStart) {
    player1.draw();
    player2.draw();
    ball.draw();
    ball.move();
    input.keyDetect();
    if (game_Type == 1 || game_Type == 2) {
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