let canvas = document.getElementById("canvas"),
  context = canvas.getContext("2d");

canvas.width = 650;
canvas.height = 450;

let gameStart = true,
  gameEnd = false,
  gameEndScore = 3;

let p1X = 30,
  p1Y = canvas.height / 2 - 30,
  p2X = canvas.width - 39,
  p2Y = canvas.height / 2 - 30,
  pSpeed = 6,
  pH = 60,
  p1KeyUp = false,
  p1KeyDown = false,
  p2KeyUp = false,
  p2KeyDown = false;

let bX = canvas.width / 2,
  bY = canvas.height / 2,
  ballR = 10,
  bXS = 4,
  bYS = -4;

let p1Score = 0,
  p2Score = 0;

function player1() {
  context.beginPath();
  context.rect(p1X, p1Y, 10, pH);
  context.fillStyle = "green";
  context.fill();
  context.closePath();
}

function player2() {
  context.beginPath();
  context.rect(p2X, p2Y, 10, pH);
  context.fillStyle = "red";
  context.fill();
  context.closePath();
}

let Ball = function() {
  this.drawBall = function() {
    context.beginPath();
    context.arc(bX, bY, ballR, 0, Math.PI * 2);
    context.fillStyle = "gray";
    context.fill();
    context.closePath();
  };
  this.moveBall = function() {
    if (bY > canvas.height - ballR || bY < 0 + ballR) {
      bYS = -bYS;
    }

    if (bX > p1X && bX < p1X + 10 && bY > p1Y && bY < p1Y + pH) {
      bXS = -bXS;
    }
    if (bX > p2X && bX < p2X + 10 && bY > p2Y && bY < p2Y + pH) {
      bXS = -bXS;
    }
    if (!gameEnd) {
      bX += bXS;
      bY += bYS;
    }
  };
  this.restartBall = function() {
    bX = canvas.width / 2;
    bY = canvas.height / 2;
  };
};

let Game = function() {
  this.StartGame = function() {
    gameStart = true;
  };
  this.Area = function() {
    if (p1Y < 0) {
      p1Y = 0;
    }
    if (p1Y > canvas.height - pH) {
      p1Y = canvas.height - pH;
    }
    if (p2Y < 0) {
      p2Y = 0;
    }
    if (p2Y > canvas.height - pH) {
      p2Y = canvas.height - pH;
    }
  };
  this.AddScore = function() {
    if (bX > canvas.width - ballR) {
      p1Score++;
      ball.restartBall();
    }
    if (bX < 0 + ballR) {
      p2Score++;
      ball.restartBall();
    }
  };
  this.WinPlayer = function() {
    if (p1Score >= gameEndScore || p2Score >= gameEndScore) {
      hud.Win();
      hud.ReturnToMenu();
    }
  };
  this.WinScore = function(a, b) {
    a = p1Score;
    b = p2Score;
    gameEnd = true;
    if (a > b) return "player1";
    else return "player2";
  };
};

let HUD = function() {
  this.Score = function() {
    context.font = "30px sans-serif";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.fillText(p1Score + " : " + p2Score, canvas.width / 2, 41);
  };
  this.Win = function() {
    context.font = "50px sans-serif";
    context.fillStyle = "orange";
    context.textAlign = "center";
    context.fillText(
      "Победа: " + game.WinScore(),
      canvas.width / 2,
      canvas.height / 2 - 35
    );
  };
  this.ReturnToMenu = function() {
    context.font = "23px sans-serif";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.fillText(
      "Space - начать заново",
      canvas.width / 2,
      canvas.height - 30
    );
  };
};

window.addEventListener("keydown", keyPress);
window.addEventListener("keyup", keyUp);

function keyPress(e) {
  let kC = e.keyCode;
  if (kC == 87) {
    p1KeyUp = true;
  }
  if (kC == 83) {
    p1KeyDown = true;
  }
  if (kC == 38) {
    p2KeyUp = true;
  }
  if (kC == 40) {
    p2KeyDown = true;
  }
  if (e.keyCode == 32 && gameEnd) {
    location.reload();
  }
}

function keyUp(e) {
  let kC = e.keyCode;
  if (kC == 87) {
    p1KeyUp = false;
  }
  if (kC == 83) {
    p1KeyDown = false;
  }
  if (kC == 38) {
    p2KeyUp = false;
  }
  if (kC == 40) {
    p2KeyDown = false;
  }
}

function detectMove() {
  if (p1KeyUp) {
    p1Y -= pSpeed;
  }
  if (p1KeyDown) {
    p1Y += pSpeed;
  }
  if (p2KeyUp) {
    p2Y -= pSpeed;
  }
  if (p2KeyDown) {
    p2Y += pSpeed;
  }
}

let ball = new Ball();
let hud = new HUD();
let game = new Game();

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (gameStart) {
    player1();
    player2();
    detectMove();
    ball.drawBall();
    ball.moveBall();
    hud.Score();
    game.Area();
    game.AddScore();
    game.WinPlayer();
  }
  requestAnimationFrame(draw);
}

draw();
