//
let canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d"),
  mainMenu = document.getElementById("menu"),
  timerB = document.getElementById("timer"),
  startBtn = document.getElementById("startBtn"),
  exitBtn = document.getElementById("exitBtn"),
  textScore = document.getElementById("textScore"),
  mScore = document.getElementById("mScore"),
  pScore = document.getElementById("pScore"),
  textMatchType = document.getElementById("textMatchType"),
  mMatchType = document.getElementById("mMatchType"),
  pMatchType = document.getElementById("pMatchType"),
  textAI_Diff = document.getElementById("textAI_Diff"),
  mAI_Dif = document.getElementById("mAI_Dif"),
  pAI_Dif = document.getElementById("pAI_Dif"),
  textZoom = document.getElementById("textZoom"),
  mZoom = document.getElementById("mZoom"),
  pZoom = document.getElementById("pZoom"),
  textBallSpeed = document.getElementById("textBallSpeed"),
  mBallSpeed = document.getElementById("mBallSpeed"),
  pBallSpeed = document.getElementById("pBallSpeed"),
  textStatGame = document.getElementById("textStatGame"),
  mStatGame = document.getElementById("mStatGame"),
  pStatGame = document.getElementById("pStatGame");

var WIDTH = 880;
var HEIGHT = 580;
var CANVAS_WIDTH = 880;
var CANVAS_HEIGHT = 580;

//// UNCOMMENT TO ENABLE ASPECT RATIO

// let resizeCanvas = function () {
//   CANVAS_WIDTH = window.innerWidth;
//   CANVAS_HEIGHT = window.innerHeight;

//   let ratio = 16 / 9;
//   if (CANVAS_HEIGHT < CANVAS_WIDTH / ratio)
//     CANVAS_WIDTH = CANVAS_HEIGHT * ratio;
//   else CANVAS_HEIGHT = CANVAS_WIDTH / ratio;

canvas.width = WIDTH;
canvas.height = HEIGHT;

//   context.mozImageSmoothingEnabled = true;
//   context.webkitImageSmoothingEnabled = true;
//   context.msImageSmoothingEnabled = true;
//   context.imageSmoothingEnabled = true;

//  canvas.style.width = "" + CANVAS_WIDTH + "px";
// canvas.style.height = "" + CANVAS_HEIGHT + "px";
// };

// resizeCanvas();

// window.addEventListener("resize", function () {
//   resizeCanvas();
// });
//////////////////////////////////////////////

var AI_Pos = HEIGHT / 2 - 41;

var g_sec = 0,
  g_min = 0;

var x_ballSpeed = 4,
  y_ballSpeed = x_ballSpeed * -1;

var MatchType_arr = ["Local", "AI", "Spectator"],
  AI_difficulty_arr = ["Easy", "Normal", "Hard"],
  Zoom_arr = [
    "80%",
    "90%",
    "100%",
    "110%",
    "120%",
    "130%",
    "140%",
    "150%",
    "160%",
    "170%",
    "180%",
  ],
  BallSpeed_arr = ["Normal", "1.2x", "1.4x", "1.6x", "1.8x", "2x"],
  MatchStats_arr = ["OFF", "ON"];

var matchType_index = 0,
  AI_difficulty_index = 0,
  Zoom_index = 2, // Default 100 zoom%
  Ball_index = 0,
  MatchStats_index = 0,
  ScoreToEndV = 2;

//#region INIT
let player1 = new Player(15, AI_Pos, "green");
let player2 = new Player(WIDTH - 25, AI_Pos, "red");
let ball = new Ball(WIDTH / 2, HEIGHT / 2, 10, "gray");
let input = new Input();
let gameM = new GameManager();
let ui = new UI();
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
};
Player.prototype.move = function () {
  this.x++;
};
//#endregion

//#region BALL
function Ball(x, y, r, color) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.color = color;
}

Ball.prototype.draw = function () {
  context.beginPath();
  context.fillStyle = this.color;
  context.arc(this.x, this.y, this.r, Math.PI * 2, 0);
  context.fill();
  context.closePath();
};

Ball.prototype.move = function () {
  if (this.y > HEIGHT - this.r || this.y < 0 + this.r) {
    y_ballSpeed = -y_ballSpeed;
  }
  if (
    this.x > player1.x &&
    this.x < player1.x + 10 &&
    this.y > player1.y &&
    this.y < player1.y + player1.h
  ) {
    x_ballSpeed = -x_ballSpeed;
  }
  if (
    this.x > player2.x &&
    this.x < player2.x + 10 &&
    this.y > player2.y &&
    this.y < player2.y + player2.h
  ) {
    x_ballSpeed = -x_ballSpeed;
  }
  if (gameM.gameStart && gameM.gameEnd == false) {
    this.x += x_ballSpeed;
    this.y += y_ballSpeed;
  }
};

Ball.prototype.restart = function () {
  this.x = WIDTH / 2;
  this.y = HEIGHT / 2;
};
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
};

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
};

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
};
//#endregion

//#region GAME MANAGER
function GameManager() {
  leftW = 0;
  rightW = WIDTH;
  topH = 0;
  bottomH = HEIGHT;
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
};

GameManager.prototype.addScore = function () {
  if (ball.x < leftW) {
    gameM.p2Score++;
    ball.restart();
  }
  if (ball.x > rightW) {
    gameM.p1Score++;
    ball.restart();
  }
  if (this.p1Score >= this.scoreToEnd || this.p2Score >= this.scoreToEnd) {
    gameM.gameEnd = true;
    ui.winPlayer();
    ui.message("Press the Spacebar to return to the menu.");
  } else {
    ui.remainingScore();
  }
};

GameManager.prototype.matchTimer = function () {
  let timer_Min = document.getElementById("timer_Min"),
    timer_Sec = document.getElementById("timer_Sec");
  if (!gameM.gameEnd) {
    g_sec++;
    if (g_sec >= 60) {
      g_sec = 0;
      g_min += 1;
    }
    if (g_sec < 10) {
      timer_Sec.innerHTML = "0" + g_sec;
    } else {
      timer_Sec.innerHTML = g_sec;
    }
    if (g_min < 10) {
      timer_Min.innerHTML = "0" + g_min;
    } else {
      timer_Min.innerHTML = g_min;
    }
  }
};

// UI SELECTOR
GameManager.prototype.mScoreToEnd = function () {
  if (gameM.scoreToEnd > 2) {
    gameM.scoreToEnd -= 2;
  }
};

GameManager.prototype.pScoreToEnd = function () {
  if (gameM.scoreToEnd < 100) {
    gameM.scoreToEnd += 2;
  }
};

GameManager.prototype.mMatchType = function () {
  if (matchType_index <= 0) {
    matchType_index = 0;
  } else {
    matchType_index--;
  }
};

GameManager.prototype.pMatchType = function () {
  if (matchType_index >= MatchType_arr.length - 1) {
    matchType_index = MatchType_arr.length - 1;
  } else {
    matchType_index++;
  }
};

GameManager.prototype.mAI_Dif = function () {
  if (AI_difficulty_index <= 0) {
    AI_difficulty_index = 0;
  } else {
    AI_difficulty_index--;
  }
};

GameManager.prototype.pAI_Dif = function () {
  if (AI_difficulty_index >= AI_difficulty_arr.length - 1) {
    AI_difficulty_index = AI_difficulty_arr.length - 1;
  } else {
    AI_difficulty_index++;
  }
};

GameManager.prototype.mZoom = function () {
  if (Zoom_index <= 0) {
    Zoom_index = 0;
  } else {
    Zoom_index--;
    store();
  }
};

GameManager.prototype.pZoom = function () {
  if (Zoom_index >= Zoom_arr.length - 1) {
    Zoom_index = Zoom_arr.length - 1;
  } else {
    Zoom_index++;
    store();
  }
};

GameManager.prototype.mBallSpeed = function () {
  if (Ball_index <= 0) {
    Ball_index = 0;
  } else {
    Ball_index--;
  }
};

GameManager.prototype.pBallSpeed = function () {
  if (Ball_index >= BallSpeed_arr.length - 1) {
    Ball_index = BallSpeed_arr.length - 1;
  } else {
    Ball_index++;
  }
};

GameManager.prototype.mStatGame = function () {
  if (MatchStats_index <= 0) {
    MatchStats_index = 0;
  } else {
    MatchStats_index--;
    store();
  }
};

GameManager.prototype.pStatGame = function () {
  if (MatchStats_index >= MatchStats_arr.length - 1) {
    MatchStats_index = MatchStats_arr.length - 1;
  } else {
    MatchStats_index++;
    store();
  }
};

GameManager.prototype.startGame = function () {
  gameM.gameStart = true;
  menu.style.display = "none";
  timerB.style.display = "block";
  setInterval(gameM.matchTimer, 1000);
};

GameManager.prototype.checkScoreToWin = function () {
  a = this.p1Score;
  b = this.p2Score;
  if (a > b) return `Player 1 needs ${this.scoreToEnd - a} scores to win`;
  else if (a < b) return `Player 2 needs ${this.scoreToEnd - b} scores to win`;
  else return `Both Player needs ${this.scoreToEnd - a} scores to win`;
};

GameManager.prototype.endGame = function () {
  a = this.p1Score;
  b = this.p2Score;
  if (a > b) return "Player 1";
  else if (a < b) return "Player 2";
  else return "Player 1's score is equal to Player 2's";
};

GameManager.prototype.AI = function () {
  const EASY = 10,
    NORMAL = 9,
    HARD = 8;
  if (AI_difficulty_index == 0) {
    if (matchType_index == 2) {
      AI_Pos = ball.y - 10 + Math.floor(Math.random() * 3) + EASY;
      player1.y = AI_Pos;
    }
    AI_Pos = ball.y - 10 + Math.floor(Math.random() * 3) + EASY;
    player2.y = AI_Pos;
  } else if (AI_difficulty_index == 1) {
    if (matchType_index == 2) {
      AI_Pos = ball.y - 10 + Math.floor(Math.random() * 3) + NORMAL;
      player1.y = AI_Pos;
    }
    AI_Pos = ball.y - 10 + Math.floor(Math.random() * 3) + NORMAL;
    player2.y = AI_Pos;
  } else if (AI_difficulty_index == 2) {
    if (matchType_index == 2) {
      AI_Pos = ball.y - 10 + Math.floor(Math.random() * 3) + HARD;
      player1.y = AI_Pos;
    }
    AI_Pos = ball.y - 10 + Math.floor(Math.random() * 3) + HARD;
    player2.y = AI_Pos;
  }
};

//#endregion

//#region UI
function UI() {
  x = WIDTH;
  y = HEIGHT;
}

UI.prototype.score = function () {
  context.font = "27px sans-serif";
  context.fillStyle = "white";
  context.textAlign = "center";
  context.fillText(gameM.p1Score + " : " + gameM.p2Score, x / 2, 30);
};

UI.prototype.timer = function () {
  context.font = "18px sans-serif";
  context.fillStyle = "gray";
  context.textAlign = "center";
  context.fillText(g_min + ":" + g_sec, x / 2, 55);
};

UI.prototype.winPlayer = function () {
  context.font = "45px sans-serif";
  context.fillStyle = "orange";
  context.textAlign = "center";
  context.fillText(gameM.endGame() + " Won!", x / 2, y / 2 - 30);
};

UI.prototype.message = function (mess) {
  context.font = "19px sans-serif";
  context.fillStyle = "#a0a0a0";
  context.textAlign = "center";
  context.fillText(mess, x / 2, y - 26);
};

UI.prototype.remainingScore = function () {
  context.font = "19px sans-serif";
  context.fillStyle = "rgba(144, 144, 144, 0.8)";
  context.textAlign = "center";
  context.fillText(gameM.checkScoreToWin(), x / 2, y - 26);
};

UI.prototype.GameStats = function () {
  context.font = "15px sans-serif";
  context.fillStyle = "rgba(144, 144, 144, 0.35)";
  context.textAlign = "left";
  context.fillText("Ball speed: " + BallSpeed_arr[Ball_index], 10, 20);
  context.fillText("Match type: " + MatchType_arr[matchType_index], 10, 41);
};

UI.prototype.GameStats1 = function () {
  context.font = "15px sans-serif";
  context.fillStyle = "rgba(144, 144, 144, 0.35)";
  context.textAlign = "right";
  context.fillText(
    "AI difficulty (if active): " + AI_difficulty_arr[AI_difficulty_index],
    x - 10,
    20
  );
  context.fillText("Game window zoom: " + Zoom_arr[Zoom_index], x - 10, 41);
};

UI.prototype.GameStats2 = function () {
  context.font = "15px sans-serif";
  context.fillStyle = "rgba(144, 144, 144, 0.35)";
  context.textAlign = "left";
  context.fillText("Player 1 y-pos: " + player1.y, 10, y - 15);
};

UI.prototype.GameStats3 = function () {
  context.font = "15px sans-serif";
  context.fillStyle = "rgba(144, 144, 144, 0.35)";
  context.textAlign = "right";
  context.fillText("Player 2 y-pos:  " + player2.y, x - 10, y - 15);
};

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
mBallSpeed.addEventListener("click", gameM.mBallSpeed);
pBallSpeed.addEventListener("click", gameM.pBallSpeed);
mStatGame.addEventListener("click", gameM.mStatGame);
pStatGame.addEventListener("click", gameM.pStatGame);
exitBtn.onclick = function () {
  window.close();
};

//#endregion

function gameLoop() {
  context.clearRect(0, 0, WIDTH, HEIGHT);
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

    if (MatchStats_index == 1) {
      ui.GameStats();
      ui.GameStats1();
      ui.GameStats2();
      ui.GameStats3();
    }
  }
  if (!gameM.gameStart) {
    menu.style.display = "block";
    timerB.style.display = "none";
    textScore.innerHTML = gameM.scoreToEnd;
    textMatchType.innerHTML = MatchType_arr[matchType_index];
    textAI_Diff.innerHTML = AI_difficulty_arr[AI_difficulty_index];
    textZoom.innerHTML = Zoom_arr[Zoom_index];
    document.body.style.zoom = Zoom_arr[Zoom_index];
    textBallSpeed.innerHTML = BallSpeed_arr[Ball_index];
    textStatGame.innerHTML = MatchStats_arr[MatchStats_index];
    x_ballSpeed = Ball_index + 5;
  }
  requestAnimationFrame(gameLoop);
}

gameLoop();

function store() {
  localStorage.ZoomIndex = Zoom_index;
  localStorage.MatchStats = MatchStats_index;
}

function getValue() {
  var ZoomValue = localStorage.ZoomIndex,
    MatchStatsValue = localStorage.MatchStats;

  // LOAD ZOOM SETTINGS
  if (!ZoomValue) {
    Zoom_index = 2; // Default 100%
  } else {
    Zoom_index = ZoomValue;
  }
  // LOAD MATCH STATS
  if (!MatchStatsValue) {
    MatchStats_index = 0; // Default OFF
  } else {
    MatchStats_index = MatchStatsValue;
  }
}

getValue();
