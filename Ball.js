// class Ball {
//     constructor(x, y, r, color) {
//         this.x = x;
//         this.y = y;
//         this.r = r;
//         this.color = color;
//     }

//     draw() {
//         context.beginPath();
//         context.fillStyle = this.color;
//         context.arc(this.x, this.y, this.r, Math.PI * 2, 0);
//         context.fill();
//         context.closePath();
//     };

//     move() {
//         if (this.y > HEIGHT - this.r || this.y < 0 + this.r) {
//             y_ballSpeed = -y_ballSpeed;
//         }
//         if (
//             this.x > player1.x &&
//             this.x < player1.x + 10 &&
//             this.y > player1.y &&
//             this.y < player1.y + player1.h
//         ) {
//             x_ballSpeed = -x_ballSpeed;
//         }
//         if (
//             this.x > player2.x &&
//             this.x < player2.x + 10 &&
//             this.y > player2.y &&
//             this.y < player2.y + player2.h
//         ) {
//             x_ballSpeed = -x_ballSpeed;
//         }
//         if (gameM.gameStart && gameM.gameEnd == false) {
//             this.x += x_ballSpeed;
//             this.y += y_ballSpeed;
//         }
//     };
// }

// export default Ball;

// // Ball.prototype.restart = function () {
// //     this.x = WIDTH / 2;
// //     this.y = HEIGHT / 2;
// // };