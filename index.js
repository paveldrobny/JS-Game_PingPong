const DEV_MODE = false;

//////// CANVAS
const CANVAS = document.getElementById("canvas");
const CONTEXT = canvas.getContext("2d");

//////// CANVAS - SIZE
const WIDTH = 880;
const HEIGHT = 580;
const CANVAS_WIDTH = 880;
const CANVAS_HEIGHT = 580;

//////// UI
const UI_MENU = document.getElementById("ui-menu");
const UI_TIMER = document.getElementById("ui-timer");

//////// UI - PANEL
const UI_PANEL_MAIN = document.getElementById("ui-menu-panel-main");
const UI_PANEL_MATCH_SETTINGS = document.getElementById(
  "ui-menu-panel-matchSettings"
);
const UI_PANEL_GAME_SETTINGS = document.getElementById(
  "ui-menu-panel-gameSettings"
);
const UI_PANEL_UPDATE_LIST = document.getElementById(
  "ui-menu-panel-updateList"
);

//////// UI - BUTTON
const UI_BUTTON_START = document.getElementById("ui-button-start");
const UI_BUTTON_EXIT = document.getElementById("ui-button-exit");
const UI_BUTTON_MATCH_SETTINGS = document.getElementById(
  "ui-button-matchSettings"
);
const UI_BUTTON_GAME_SETTINGS = document.getElementById(
  "ui-button-gameSettings"
);
const UI_BUTTON_UPDATE_LIST = document.getElementById("ui-button-updateList");
const UI_BUTTON_SOURCE_CODE = document.getElementById("ui-button-sourceCode");
const UI_BUTTON_BACK = document.getElementById("ui-button-back");
const UI_BUTTON_SCORE_MINUS = document.getElementById("ui-button-score-minus");
const UI_BUTTON_SCORE_PLUS = document.getElementById("ui-button-score-plus");
const UI_BUTTON_MOVEMENT_MINUS = document.getElementById(
  "ui-button-movement-minus"
);
const UI_BUTTON_MOVEMENT_PLUS = document.getElementById(
  "ui-button-movement-plus"
);
const UI_BUTTON_MATCH_TYPE_MINUS = document.getElementById(
  "ui-button-matchType-minus"
);
const UI_BUTTON_MATCH_TYPE_PLUS = document.getElementById(
  "ui-button-matchType-plus"
);
const UI_BUTTON_DIFFICULTY_AI_MINUS = document.getElementById(
  "ui-button-difficultyAI-minus"
);
const UI_BUTTON_DIFFICULTY_AI_PLUS = document.getElementById(
  "ui-button-difficultyAI-plus"
);
const UI_BUTTON_WINDOW_ZOOM_MINUS = document.getElementById(
  "ui-button-windowZoom-minus"
);
const UI_BUTTON_WINDOW_ZOOM_PLUS = document.getElementById(
  "ui-button-windowZoom-plus"
);

//////// UI - TEXT
const UI_TEXT_SCORE = document.getElementById("ui-text-score");
const UI_TEXT_MOVEMENT_SPEED = document.getElementById("ui-text-movementSpeed");
const UI_TEXT_MATCH_TYPE = document.getElementById("ui-text-matchType");
const UI_TEXT_DIFFICULTY_AI = document.getElementById("ui-text-difficultyAI");
const UI_TEXT_WINDOW_ZOOM = document.getElementById("ui-text-windowZoom");
const UI_TEXT_TIMER = document.getElementById("ui-text-timer");

//////// OPTIONS - TEXT
const OPTIONS_TEXT_MATCH_TYPES = ["Local", "AI", "Spectator"];
const OPTIONS_TEXT_DIFFICULTIES_AI = ["Easy", "Normal", "Hard"];
const OPTIONS_TEXT_MOVEMENT_SPEEDS = [
  "Normal",
  "1.2x",
  "1.4x",
  "1.6x",
  "1.8x",
  "2x"
];

//////// OPTIONS - VALUE
const OPTIONS_VALUE_WINDOW_ZOOM_MAX = 185;

////////
let defaultPositionY = CANVAS.height * 2 - 41;
let gameSeconds = 0;
let gameMinutes = 0;
let indexMatchType = 0;
let indexDifficultyAI = 0;
let indexWindowZoom = 100; // Default zoom - 100%
let indexMovementSpeed = 0;
let keyState = [];

function onKeyDown(event) {
  keyState[event.key] = true;
}

function onKeyUp(event) {
  keyState[event.key] = false;
}

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);

// // UNCOMMENT TO ENABLE ASPECT RATIO

// let resizeCanvas = function () {
//   CANVAS_WIDTH = window.innerWidth; // replace CANVAS_WIDTH type from const to let on line 10
//   CANVAS_HEIGHT = window.innerHeight; // replace CANVAS_HEIGHT type from const to let on line 11

//   let ratio = 16 / 9;
//   if (CANVAS_HEIGHT < CANVAS_WIDTH / ratio)
//     CANVAS_WIDTH = CANVAS_HEIGHT * ratio;
//   else CANVAS_HEIGHT = CANVAS_WIDTH / ratio;

CANVAS.width = WIDTH;
CANVAS.height = HEIGHT;
//   CONTEXT.mozImageSmoothingEnabled = true;
//   CONTEXT.webkitImageSmoothingEnabled = true;
//   CONTEXT.msImageSmoothingEnabled = true;
//   CONTEXT.imageSmoothingEnabled = true;

//   CANVAS.style.width = "" + CANVAS_WIDTH + "px";
//   CANVAS.style.height = "" + CANVAS_HEIGHT + "px";
// };

// resizeCanvas();

// window.addEventListener("resize", function () {
//   resizeCanvas();
// });
// ////////////////////////////////////////////

const setTextTimer = (value) => {
  return (value = value < 10 ? "0" + value : value);
};

const getRandomValue = () => {
  return Math.floor(Math.random() * 11);
};

function switchPanel(openPanel) {
  const PANELS = document.getElementsByClassName("panel");

  for (let i = 0; i < PANELS.length; i++) {
    if (PANELS[i].id == "ui-menu-panel-main") {
      UI_BUTTON_BACK.style.display = "block";
    } else {
      UI_BUTTON_BACK.style.display = "block";
    }

    if (PANELS[i].id === `ui-menu-panel-${openPanel}`) {
      PANELS[i].classList.remove("hide-panel");
    } else {
      PANELS[i].classList.add("hide-panel");
    }
  }
}

//#region INIT
const player1 = new Player(15, defaultPositionY, "green");
const player2 = new Player(WIDTH - 25, defaultPositionY, "red");
const ball = new Ball(WIDTH / 2, HEIGHT / 2, 10, "gray");
const input = new Input();
const gameManager = new GameManager();
const canvasUI = new CanvasUI();
//#endregion

//#region SAVE/LOAD
function store() {
  localStorage.ScoreToEnd = gameManager.scoreToEnd;
  localStorage.ZoomIndex = indexWindowZoom;
  localStorage.MovementSpeed = indexMovementSpeed;
}

function getValue() {
  const ScoreToEndValue = parseInt(localStorage.ScoreToEnd);
  const ZoomValue = parseInt(localStorage.ZoomIndex);
  const MovementSpeedValue = parseInt(localStorage.MovementSpeed);

  // load score to end
  !ScoreToEndValue
    ? (gameManager.scoreToEnd = 2)
    : (gameManager.scoreToEnd = ScoreToEndValue);

  // load window zoom
  if (!ZoomValue) {
    indexWindowZoom = 100;
  } else {
    if (ZoomValue < 80) {
      return (indexWindowZoom = 80);
    }
    if (ZoomValue > OPTIONS_VALUE_WINDOW_ZOOM_MAX) {
      indexWindowZoom = OPTIONS_VALUE_WINDOW_ZOOM_MAX;
    }
    indexWindowZoom = ZoomValue;
  }

  // load ball speed
  !MovementSpeedValue
    ? (indexMovementSpeed = 0)
    : (indexMovementSpeed = MovementSpeedValue);
}
//#endregion

//#region PLAYER
function Player(x, y, color) {
  this.x = x;
  this.y = y;
  this.w = 10;
  this.h = 82;
  this.speed = 5;
  this.color = color;
}

Player.prototype.draw = function () {
  CONTEXT.fillStyle = this.color;
  CONTEXT.fillRect(this.x, this.y, this.w, this.h);
};

Player.prototype.move = function () {
  this.x++;
};

Player.prototype.collision = function (x, y) {
  if (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h) {
    return true;
  }
};
//#endregion

//#region BALL
function Ball(x, y, r, color) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.speed = 5;
  this.color = color;
  this.isMoveTop = false;
  this.isMoveRight = false;
}

Ball.prototype.draw = function () {
  CONTEXT.beginPath();
  CONTEXT.fillStyle = this.color;
  CONTEXT.arc(this.x, this.y, this.r, Math.PI * 2, 0);
  CONTEXT.fill();
  CONTEXT.closePath();
};

Ball.prototype.move = function () {
  if (gameManager.isGameStarted && !gameManager.isGameEnded) {
    if (this.y < 0 + this.r) {
      this.isMoveTop = false;
    }

    if (this.y > HEIGHT - this.r) {
      this.isMoveTop = true;
    }

    this.isMoveTop ? (this.y -= this.speed) : (this.y += this.speed);
    this.isMoveRight ? (this.x += this.speed) : (this.x -= this.speed);

    if (player1.collision(this.x, this.y)) {
      this.isMoveRight = true;
    }
    if (player2.collision(this.x, this.y)) {
      this.isMoveRight = false;
    }
  }
};

Ball.prototype.restart = function () {
  this.x = WIDTH / 2;
  this.y = HEIGHT / 2;
};
//#endregion

//#region INPUT
function Input() {
  this.keys = {
    W: "w",
    A: "a",
    S: "s",
    D: "d",
    ArrowUp: "ArrowUp",
    ArrowLeft: "ArrowLeft",
    ArrowDown: "ArrowDown",
    ArrowRight: "ArrowRight",
    Spacebar: " "
  };
}

Input.prototype.keyDetect = function () {
  if (keyState[this.keys.W]) {
    player1.y -= player1.speed;
  }
  if (keyState[this.keys.S]) {
    player1.y += player1.speed;
  }
  if (keyState[this.keys.ArrowUp]) {
    player2.y -= player2.speed;
  }
  if (keyState[this.keys.ArrowDown]) {
    player2.y += player2.speed;
  }
  if (gameManager.isGameEnded) {
    if (keyState[this.keys.Spacebar]) {
      // gameManager.isGameEnded = false;
      location.reload();
    }
  }
};
//#endregion

//#region GAME MANAGER
function GameManager() {
  leftSide = 0;
  rightSide = WIDTH;
  topSide = 0;
  bottomSide = HEIGHT;
  this.player1Score = 0;
  this.player2Score = 0;
  this.scoreToEnd = 2;
  this.isGameStarted = false;
  this.isGameEnded = false;
}

GameManager.prototype.area = function () {
  if (player1.y < topSide) {
    player1.y = topSide;
  }
  if (player1.y > bottomSide - player1.h) {
    player1.y = bottomSide - player1.h;
  }
  if (player2.y < topSide) {
    player2.y = topSide;
  }
  if (player2.y > bottomSide - player2.h) {
    player2.y = bottomSide - player2.h;
  }
};

GameManager.prototype.addScore = function () {
  if (ball.x < leftSide) {
    gameManager.player2Score++;
    ball.restart();
  }
  if (ball.x > rightSide) {
    gameManager.player1Score++;
    ball.restart();
  }
  if (
    this.player1Score >= this.scoreToEnd ||
    this.player2Score >= this.scoreToEnd
  ) {
    gameManager.isGameEnded = true;
    canvasUI.winPlayer();
    canvasUI.sendMessage("Press the Spacebar to return to the main menu.");
  } else {
    canvasUI.remainingScore();
  }
};

GameManager.prototype.matchTimer = function () {
  if (!gameManager.isGameEnded) {
    gameSeconds++;

    if (gameSeconds >= 60) {
      gameSeconds = 0;
      gameMinutes += 1;
    }

    UI_TEXT_TIMER.innerHTML = `${setTextTimer(gameMinutes)}:${setTextTimer(
      gameSeconds
    )}`;
  }
};

// UI SELECTOR
GameManager.prototype.minusScoreToEnd = function () {
  if (gameManager.scoreToEnd > 2) {
    gameManager.scoreToEnd -= 2;
  }
  store();
};

GameManager.prototype.plusScoreToEnd = function () {
  if (gameManager.scoreToEnd < 100) {
    gameManager.scoreToEnd += 2;
  }
  store();
};

GameManager.prototype.minusMatchType = function () {
  if (indexMatchType <= 0) {
    return (indexMatchType = 0);
  }
  indexMatchType--;
};

GameManager.prototype.plusMatchType = function () {
  if (indexMatchType >= OPTIONS_TEXT_MATCH_TYPES.length - 1) {
    return (indexMatchType = OPTIONS_TEXT_MATCH_TYPES.length - 1);
  }
  indexMatchType++;
};

GameManager.prototype.minusAIDifficulty = function () {
  if (indexDifficultyAI <= 0) {
    return (indexDifficultyAI = 0);
  }
  indexDifficultyAI--;
};

GameManager.prototype.plusAIDifficulty = function () {
  if (indexDifficultyAI >= OPTIONS_TEXT_DIFFICULTIES_AI.length - 1) {
    return (indexDifficultyAI = OPTIONS_TEXT_DIFFICULTIES_AI.length - 1);
  }
  indexDifficultyAI++;
};

GameManager.prototype.minusZoom = function () {
  if (indexWindowZoom <= 80) {
    return (indexWindowZoom = 80);
  }
  indexWindowZoom -= 5;
  store();
};

GameManager.prototype.plusZoom = function () {
  if (indexWindowZoom >= OPTIONS_VALUE_WINDOW_ZOOM_MAX) {
    return (indexWindowZoom = OPTIONS_VALUE_WINDOW_ZOOM_MAX);
  }
  indexWindowZoom += 5;
  store();
};

GameManager.prototype.minusMovementSpeed = function () {
  if (indexMovementSpeed <= 0) {
    return (indexMovementSpeed = 0);
  }
  indexMovementSpeed--;
  store();
};

GameManager.prototype.plusMovementSpeed = function () {
  if (indexMovementSpeed >= OPTIONS_TEXT_MOVEMENT_SPEEDS.length - 1) {
    return (indexMovementSpeed = OPTIONS_TEXT_MOVEMENT_SPEEDS.length - 1);
  }
  indexMovementSpeed++;
  store();
};

const UI_COUNTDOWN = document.getElementById("ui-countdown");
const UI_TEXT_COUNTDOWN = document.getElementById("ui-text-countdown");

GameManager.prototype.startGame = function () {
  UI_MENU.style.display = "none";
  UI_COUNTDOWN.style.display = "block";

  player1.speed = indexMovementSpeed + 6;
  player2.speed = indexMovementSpeed + 6;
  ball.speed = indexMovementSpeed + 6;

  // Random direction ball on start game
  getRandomValue() % 2 == 0
    ? (ball.isMoveTop = true)
    : (ball.isMoveTop = false);
  getRandomValue() % 2 == 0
    ? (ball.isMoveRight = false)
    : (ball.isMoveRight = true);

  let countdownValue = 3;

  const timer = setInterval(function () {
    countdownValue--;
    UI_TEXT_COUNTDOWN.innerHTML = countdownValue;

    if (countdownValue == 0) {
      UI_COUNTDOWN.style.display = "none";
      UI_TIMER.style.display = "block";
      gameManager.isGameStarted = true;
      setInterval(gameManager.matchTimer, 1000);
      clearInterval(timer);
    }
  }, 1000);
};

GameManager.prototype.checkScoreToWin = function () {
  const a = this.player1Score;
  const b = this.player2Score;

  if (a > b) return `Player 1 needs ${this.scoreToEnd - a} scores to win`;
  else if (a < b) return `Player 2 needs ${this.scoreToEnd - b} scores to win`;
  else return `Both Player needs ${this.scoreToEnd - a} scores to win`;
};

GameManager.prototype.endGame = function () {
  const a = this.player1Score;
  const b = this.player2Score;

  if (a > b) return "Player 1";
  else if (a < b) return "Player 2";
  else return "Player 1's score is equal to Player 2's";
};

GameManager.prototype.AI = function () {
  const EASY = 10,
    NORMAL = 9,
    HARD = 8;

  if (indexDifficultyAI == 0) {
    if (indexMatchType == 2) {
      defaultPositionY = ball.y - 10 + Math.floor(Math.random() * 3) + EASY;
      player1.y = defaultPositionY;
    }
    defaultPositionY = ball.y - 10 + Math.floor(Math.random() * 3) + EASY;
    player2.y = defaultPositionY;
  } else if (indexDifficultyAI == 1) {
    if (indexMatchType == 2) {
      defaultPositionY = ball.y - 10 + Math.floor(Math.random() * 3) + NORMAL;
      player1.y = defaultPositionY;
    }
    defaultPositionY = ball.y - 10 + Math.floor(Math.random() * 3) + NORMAL;
    player2.y = defaultPositionY;
  } else if (indexDifficultyAI == 2) {
    if (indexMatchType == 2) {
      defaultPositionY = ball.y - 10 + Math.floor(Math.random() * 3) + HARD;
      player1.y = defaultPositionY;
    }
    defaultPositionY = ball.y - 10 + Math.floor(Math.random() * 3) + HARD;
    player2.y = defaultPositionY;
  }
};

GameManager.prototype.restartGame = function () {};

//#endregion

//#region UI
function CanvasUI() {
  x = WIDTH;
  y = HEIGHT;
}

CanvasUI.prototype.score = function () {
  CONTEXT.font = "27px sans-serif";
  CONTEXT.fillStyle = "white";
  CONTEXT.textAlign = "center";
  CONTEXT.fillText(
    gameManager.player1Score + " : " + gameManager.player2Score,
    x / 2,
    30
  );
};

CanvasUI.prototype.timer = function () {
  CONTEXT.font = "18px sans-serif";
  CONTEXT.fillStyle = "gray";
  CONTEXT.textAlign = "center";
  CONTEXT.fillText(gameMinutes + ":" + gameSeconds, x / 2, 55);
};

CanvasUI.prototype.winPlayer = function () {
  CONTEXT.font = "45px sans-serif";
  CONTEXT.fillStyle = "orange";
  CONTEXT.textAlign = "center";
  CONTEXT.fillText(gameManager.endGame() + " Won!", x / 2, y / 2 - 30);
};

CanvasUI.prototype.sendMessage = function (mess) {
  CONTEXT.font = "19px sans-serif";
  CONTEXT.fillStyle = "#a0a0a0";
  CONTEXT.textAlign = "center";
  CONTEXT.fillText(mess, x / 2, y - 26);
};

CanvasUI.prototype.remainingScore = function () {
  CONTEXT.font = "19px sans-serif";
  CONTEXT.fillStyle = "rgba(144, 144, 144, 0.8)";
  CONTEXT.textAlign = "center";
  CONTEXT.fillText(gameManager.checkScoreToWin(), x / 2, y - 26);
};
//#endregion

//#region EVENTS
UI_BUTTON_START.addEventListener("click", gameManager.startGame);
UI_BUTTON_EXIT.addEventListener("click", function () {
  window.close();
});
UI_BUTTON_MATCH_SETTINGS.addEventListener("click", function () {
  switchPanel("matchSettings");
});
UI_BUTTON_GAME_SETTINGS.addEventListener("click", function () {
  switchPanel("gameSettings");
});
UI_BUTTON_UPDATE_LIST.addEventListener("click", function () {
  switchPanel("updateList");
});
UI_BUTTON_SOURCE_CODE.addEventListener("click", function () {
  open("https://github.com/paveldrobny/JS-Game_PingPong");
});
UI_BUTTON_BACK.addEventListener("click", function () {
  switchPanel("main");
  UI_BUTTON_BACK.style.display = "none";
});

UI_BUTTON_SCORE_MINUS.addEventListener("click", gameManager.minusScoreToEnd);
UI_BUTTON_SCORE_PLUS.addEventListener("click", gameManager.plusScoreToEnd);
UI_BUTTON_MOVEMENT_MINUS.addEventListener(
  "click",
  gameManager.minusMovementSpeed
);
UI_BUTTON_MOVEMENT_PLUS.addEventListener(
  "click",
  gameManager.plusMovementSpeed
);
UI_BUTTON_MATCH_TYPE_MINUS.addEventListener(
  "click",
  gameManager.minusMatchType
);
UI_BUTTON_MATCH_TYPE_PLUS.addEventListener("click", gameManager.plusMatchType);
UI_BUTTON_DIFFICULTY_AI_MINUS.addEventListener(
  "click",
  gameManager.minusAIDifficulty
);
UI_BUTTON_DIFFICULTY_AI_PLUS.addEventListener(
  "click",
  gameManager.plusAIDifficulty
);
UI_BUTTON_WINDOW_ZOOM_MINUS.addEventListener("click", gameManager.minusZoom);
UI_BUTTON_WINDOW_ZOOM_PLUS.addEventListener("click", gameManager.plusZoom);
//#endregion

const update = () => {
  CONTEXT.clearRect(0, 0, WIDTH, HEIGHT);

  if (gameManager.isGameStarted) {
    player1.draw();
    player2.draw();
    ball.draw();
    ball.move();
    input.keyDetect();

    if (indexMatchType == 1 || indexMatchType == 2) {
      gameManager.AI();
    }

    gameManager.area();
    gameManager.addScore();
    canvasUI.score();
  }
  if (!gameManager.isGameStarted) {
    UI_TEXT_SCORE.innerHTML = gameManager.scoreToEnd;
    UI_TEXT_MATCH_TYPE.innerHTML = OPTIONS_TEXT_MATCH_TYPES[indexMatchType];
    UI_TEXT_DIFFICULTY_AI.innerHTML =
      OPTIONS_TEXT_DIFFICULTIES_AI[indexDifficultyAI];
    UI_TEXT_WINDOW_ZOOM.innerHTML = `${indexWindowZoom}%`;
    UI_TEXT_MOVEMENT_SPEED.innerHTML =
      OPTIONS_TEXT_MOVEMENT_SPEEDS[indexMovementSpeed];
    document.body.style.zoom = `${indexWindowZoom}%`;
  }
  requestAnimationFrame(update);
};

update();
getValue();
