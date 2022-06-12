const DEV_MODE = false;

//////// Canvas
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

//////// Canvas - size
const WIDTH = 880;
const HEIGHT = 580;
const CANVAS_WIDTH = 880;
const CANVAS_HEIGHT = 580;

//////// UI
const uiMenu = document.getElementById("ui-menu");
const uiTimer = document.getElementById("ui-timer");

//////// UI - panel
const uiPanelMain = document.getElementById("ui-menu-panel-main");
const uiPanelMatchSettings = document.getElementById(
  "ui-menu-panel-matchSettings"
);
const uiPanelGameSettings = document.getElementById(
  "ui-menu-panel-gameSettings"
);
const uiPanelUpdateList = document.getElementById("ui-menu-panel-updateList");

//////// UI - scroll
const uiScrollHistoryMatch = document.getElementById(
  "historyMatch-scroll-content"
);

//////// UI - button
const uiButtonStart = document.getElementById("ui-button-start");
const uiButtonExit = document.getElementById("ui-button-exit");
const uiButtonMatchSettings = document.getElementById(
  "ui-button-matchSettings"
);
const uiButtonGameSettings = document.getElementById("ui-button-gameSettings");
const uiButtonHistoryMatches = document.getElementById(
  "ui-button-historyMatches"
);
const uiButtonUpdateList = document.getElementById("ui-button-updateList");
const uiButtonSourceCode = document.getElementById("ui-button-sourceCode");
const uiButtonBack = document.getElementById("ui-button-back");
const uiButtonScoreMinus = document.getElementById("ui-button-score-minus");
const uiButtonScorePlus = document.getElementById("ui-button-score-plus");
const uiButtonMovementMinus = document.getElementById(
  "ui-button-movement-minus"
);
const uiButtonMovementPlus = document.getElementById("ui-button-movement-plus");
const uiButtonMatchTypeMinus = document.getElementById(
  "ui-button-matchType-minus"
);
const uiButtonMatchTypePlus = document.getElementById(
  "ui-button-matchType-plus"
);
const uiButtonDifficultyAiMinus = document.getElementById(
  "ui-button-difficultyAI-minus"
);
const uiButtonDifficultyAiPlus = document.getElementById(
  "ui-button-difficultyAI-plus"
);
const uiButtonWindowZoomMinus = document.getElementById(
  "ui-button-windowZoom-minus"
);
const uiButtonWindowZoomPlus = document.getElementById(
  "ui-button-windowZoom-plus"
);

//////// UI - Text
const uiTextScore = document.getElementById("ui-text-score");
const uiTextMovementSpeed = document.getElementById("ui-text-movementSpeed");
const uiTextMatchType = document.getElementById("ui-text-matchType");
const uiTextDifficultyAi = document.getElementById("ui-text-difficultyAI");
const uiTextWindowZoom = document.getElementById("ui-text-windowZoom");
const uiTextTimer = document.getElementById("ui-text-timer");

//////// OPTIONS - Text
const optionsTextMatchTypes = ["Local", "AI", "Spectator"];
const optionsTextDifficultiesAi = ["Easy", "Normal", "Hard"];
const optionsTextMovementSpeeds = [
  "Normal",
  "1.2x",
  "1.4x",
  "1.6x",
  "1.8x",
  "2x",
];

//////// OPTIONS - Value
const OPTIONS_VALUE_WINDOW_ZOOM_MAX = 185;

////////
let defaultPositionY = canvas.height * 2 - 41;
let gameSeconds = 0;
let gameMinutes = 0;
let indexMatchType = 0;
let indexDifficultyAI = 0;
let indexWindowZoom = 100; // Default zoom - 100%
let indexMovementSpeed = 0;
let keyState = [];

function onKeyDown(event) {
  keyState[event.keyCode] = true;
}

function onKeyUp(event) {
  keyState[event.keyCode] = false;
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

canvas.width = WIDTH;
canvas.height = HEIGHT;
//   context.mozImageSmoothingEnabled = true;
//   context.webkitImageSmoothingEnabled = true;
//   context.msImageSmoothingEnabled = true;
//   context.imageSmoothingEnabled = true;

//   canvas.style.width = "" + CANVAS_WIDTH + "px";
//   canvas.style.height = "" + CANVAS_HEIGHT + "px";
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
      uiButtonBack.style.display = "block";
    } else {
      uiButtonBack.style.display = "block";
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
  localStorage.HistoryMatches = uiScrollHistoryMatch.innerHTML;
}

function getValue() {
  const ScoreToEndValue = parseInt(localStorage.ScoreToEnd);
  const ZoomValue = parseInt(localStorage.ZoomIndex);
  const MovementSpeedValue = parseInt(localStorage.MovementSpeed);
  const HISTORY_MATCHES = localStorage.HistoryMatches;

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

  !HISTORY_MATCHES
    ? (uiScrollHistoryMatch.innerHTML = "")
    : (uiScrollHistoryMatch.innerHTML = HISTORY_MATCHES);
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
  context.fillStyle = this.color;
  context.fillRect(this.x, this.y, this.w, this.h);
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
  context.beginPath();
  context.fillStyle = this.color;
  context.arc(this.x, this.y, this.r, Math.PI * 2, 0);
  context.fill();
  context.closePath();
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
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    ArrowUp: 38,
    ArrowLeft: 37,
    ArrowDown: 40,
    ArrowRight: 39,
    Spacebar: 32,
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
  this.isHistorySaved = false;
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
    if (!this.isHistorySaved) {
      this.isHistorySaved = true;
      this.historyMatches();
      store();
    }
  } else {
    canvasUI.remainingScore();
  }
};

GameManager.prototype.historyMatches = function () {
  const uiBlockHistoryMatch = document.createElement("div");
  const uiTitleHistoryMatch = document.createElement("div");
  const uiTextHistoryMatch = document.createElement("div");
  const historyTitle = `${new Date().toLocaleString()}`;

  uiTitleHistoryMatch.innerHTML = historyTitle;
  uiTextHistoryMatch.innerHTML = `WINNER - ${this.endGame()} | Score - ${
    this.player1Score
  } : ${this.player2Score} | Time - ${gameMinutes}m : ${gameSeconds}s`;
  uiBlockHistoryMatch.classList.add("history-block");
  uiTitleHistoryMatch.classList.add("history-title");
  uiTextHistoryMatch.classList.add("history-text");

  uiBlockHistoryMatch.appendChild(uiTitleHistoryMatch);
  uiBlockHistoryMatch.appendChild(uiTextHistoryMatch);
  uiScrollHistoryMatch.appendChild(uiBlockHistoryMatch);
};

GameManager.prototype.matchTimer = function () {
  if (!gameManager.isGameEnded) {
    gameSeconds++;

    if (gameSeconds >= 60) {
      gameSeconds = 0;
      gameMinutes += 1;
    }

    uiTextTimer.innerHTML = `${setTextTimer(gameMinutes)}:${setTextTimer(
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
  if (indexMatchType >= optionsTextMatchTypes.length - 1) {
    return (indexMatchType = optionsTextMatchTypes.length - 1);
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
  if (indexDifficultyAI >= optionsTextDifficultiesAi.length - 1) {
    return (indexDifficultyAI = optionsTextDifficultiesAi.length - 1);
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
  if (indexMovementSpeed >= optionsTextMovementSpeeds.length - 1) {
    return (indexMovementSpeed = optionsTextMovementSpeeds.length - 1);
  }
  indexMovementSpeed++;
  store();
};

const ui_countdown = document.getElementById("ui-countdown");
const ui_text_countdown = document.getElementById("ui-text-countdown");

GameManager.prototype.startGame = function () {
  uiMenu.style.display = "none";
  ui_countdown.style.display = "block";

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
    ui_text_countdown.innerHTML = countdownValue;

    if (countdownValue == 0) {
      ui_countdown.style.display = "none";
      uiTimer.style.display = "block";
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
  context.font = "27px sans-serif";
  context.fillStyle = "white";
  context.textAlign = "center";
  context.fillText(
    gameManager.player1Score + " : " + gameManager.player2Score,
    x / 2,
    30
  );
};

CanvasUI.prototype.timer = function () {
  context.font = "18px sans-serif";
  context.fillStyle = "gray";
  context.textAlign = "center";
  context.fillText(gameMinutes + ":" + gameSeconds, x / 2, 55);
};

CanvasUI.prototype.winPlayer = function () {
  context.font = "45px sans-serif";
  context.fillStyle = "orange";
  context.textAlign = "center";
  context.fillText(gameManager.endGame() + " WIN!", x / 2, y / 2 - 30);
};

CanvasUI.prototype.sendMessage = function (mess) {
  context.font = "19px sans-serif";
  context.fillStyle = "#a0a0a0";
  context.textAlign = "center";
  context.fillText(mess, x / 2, y - 26);
};

CanvasUI.prototype.remainingScore = function () {
  context.font = "19px sans-serif";
  context.fillStyle = "rgba(144, 144, 144, 0.8)";
  context.textAlign = "center";
  context.fillText(gameManager.checkScoreToWin(), x / 2, y - 26);
};
//#endregion

//#region EVENTS
uiButtonStart.addEventListener("click", gameManager.startGame);
uiButtonExit.addEventListener("click", function () {
  window.close();
});
uiButtonMatchSettings.addEventListener("click", function () {
  switchPanel("matchSettings");
});
uiButtonGameSettings.addEventListener("click", function () {
  switchPanel("gameSettings");
});
uiButtonHistoryMatches.addEventListener("click", function () {
  switchPanel("historyMatch");
});
uiButtonUpdateList.addEventListener("click", function () {
  switchPanel("updateList");
});
uiButtonSourceCode.addEventListener("click", function () {
  open("https://github.com/paveldrobny/JS-Game_PingPong");
});
uiButtonBack.addEventListener("click", function () {
  switchPanel("main");
  uiButtonBack.style.display = "none";
});

uiButtonScoreMinus.addEventListener("click", gameManager.minusScoreToEnd);
uiButtonScorePlus.addEventListener("click", gameManager.plusScoreToEnd);
uiButtonMovementMinus.addEventListener("click", gameManager.minusMovementSpeed);
uiButtonMovementPlus.addEventListener("click", gameManager.plusMovementSpeed);
uiButtonMatchTypeMinus.addEventListener("click", gameManager.minusMatchType);
uiButtonMatchTypePlus.addEventListener("click", gameManager.plusMatchType);
uiButtonDifficultyAiMinus.addEventListener(
  "click",
  gameManager.minusAIDifficulty
);
uiButtonDifficultyAiPlus.addEventListener(
  "click",
  gameManager.plusAIDifficulty
);
uiButtonWindowZoomMinus.addEventListener("click", gameManager.minusZoom);
uiButtonWindowZoomPlus.addEventListener("click", gameManager.plusZoom);
//#endregion

const update = () => {
  context.clearRect(0, 0, WIDTH, HEIGHT);

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
    uiTextScore.innerHTML = gameManager.scoreToEnd;
    uiTextMatchType.innerHTML = optionsTextMatchTypes[indexMatchType];
    uiTextDifficultyAi.innerHTML = optionsTextDifficultiesAi[indexDifficultyAI];
    uiTextWindowZoom.innerHTML = `${indexWindowZoom}%`;
    uiTextMovementSpeed.innerHTML =
      optionsTextMovementSpeeds[indexMovementSpeed];
    document.body.style.zoom = `${indexWindowZoom}%`;
  }
  requestAnimationFrame(update);
};

update();
getValue();
