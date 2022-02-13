// class Input {
//     constructor() {
//         this.keyW = 87;
//         this.keyS = 83;
//         this.keyA = 65;
//         this.keyD = 68;
//         this.keyArrowUp = 38;
//         this.keyArrowDown = 40;
//         this.keyArrowLeft = 37;
//         this.keyArrowRight = 39;
//         this.keySpace = 32;
//         this.keyEnter = 13;
//     }

//     keyDown(e) {
//         if (e.keyCode == keyW) {
//             player1.isUpKey = true;
//         }
//         if (e.keyCode == keyS) {
//             player1.isDownKey = true;
//         }
//         if (e.keyCode == keyArrowUp) {
//             player2.isUpKey = true;
//         }
//         if (e.keyCode == keyArrowDown) {
//             player2.isDownKey = true;
//         }
//         if (gameM.gameEnd) {
//             if (e.keyCode == keySpace) {
//                 gameM.gameStart = false;
//                 location.reload();
//             }
//         }
//     };

// }

// export default Input;

// // Input.prototype.keyDown = function (e) {
// //     if (e.keyCode == keyW) {
// //         player1.isUpKey = true;
// //     }
// //     if (e.keyCode == keyS) {
// //         player1.isDownKey = true;
// //     }
// //     if (e.keyCode == keyArrowUp) {
// //         player2.isUpKey = true;
// //     }
// //     if (e.keyCode == keyArrowDown) {
// //         player2.isDownKey = true;
// //     }
// //     if (gameM.gameEnd) {
// //         if (e.keyCode == keySpace) {
// //             gameM.gameStart = false;
// //             location.reload();
// //         }
// //     }
// // };

// // Input.prototype.keyUp = function (e) {
// //     if (e.keyCode == keyW) {
// //         player1.isUpKey = false;
// //     }
// //     if (e.keyCode == keyS) {
// //         player1.isDownKey = false;
// //     }
// //     if (e.keyCode == keyArrowUp) {
// //         player2.isUpKey = false;
// //     }
// //     if (e.keyCode == keyArrowDown) {
// //         player2.isDownKey = false;
// //     }
// // };

// // Input.prototype.keyDetect = function (e) {
// //     if (player1.isUpKey) {
// //         player1.y -= player1.speed;
// //     }
// //     if (player1.isDownKey) {
// //         player1.y += player1.speed;
// //     }
// //     if (player2.isUpKey) {
// //         player2.y -= player2.speed;
// //     }
// //     if (player2.isDownKey) {
// //         player2.y += player2.speed;
// //     }
// // };