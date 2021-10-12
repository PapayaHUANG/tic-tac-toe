let originBoard;
let huPlayer;
let aiPlayer;
const restartButton = document.getElementById('restartButton');
const xButton = document.getElementById('xButton');
const oButton = document.getElementById('oButton');
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [2, 4, 6],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
];

const cells = document.querySelectorAll('.cell');

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
  document.querySelector('.startgame').style.display = 'flex';
  document.querySelector('.endgame').style.display = 'none';
  //bind div ID with board
  originBoard = Array.from(Array(9).keys());
  //remove Xs and Os
  for (let cell of cells) {
    cell.innerText = '';
    cell.addEventListener('click', turnClick);
    cell.style.removeProperty('background-color');
  }
  xButton.addEventListener('click', chooseSign);
  oButton.addEventListener('click', chooseSign);
}

function chooseSign(e) {
  if (e.target.id == 'xButton') {
    huPlayer = 'X';
    aiPlayer = 'O';
  } else if (e.target.id == 'oButton') {
    huPlayer = 'O';
    aiPlayer = 'X';
  }
  document.querySelector('.startgame').style.display = 'none';
}
function turnClick(square) {
  //square is equal to event in normal case;
  // Here I pass argu to func turn.

  if (typeof originBoard[square.target.id] == 'number') {
    turn(square.target.id, huPlayer);
    if (!checkTie()) {
      turn(bestSpot(), aiPlayer);
    }
  }
}

function turn(squareId, player) {
  document.getElementById([squareId]).innerText = player;
  document.getElementById([squareId]).style.color =
    player == huPlayer ? 'white' : 'black';
  //This syntax is for the sake of fuc checkWin.
  originBoard[squareId] = player;
  gameWon = checkWin(originBoard, player);
  console.log(gameWon);
  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  //To get the array of the moves player took
  let checkedSquare = board.reduce(
    (accum, curr, i) => (curr === player ? accum.concat(i) : accum),
    []
  );
  //To check if the moves match every element in winCombos.
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every((element) => checkedSquare.indexOf(element) > -1)) {
      gameWon = { index, player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player === huPlayer ? '#eb8d2f' : '#f0c5ed';
  }
  for (let cell of cells) {
    cell.removeEventListener('click', turnClick);
  }
  declareWinner(gameWon.player == huPlayer ? 'You Win!' : 'You lose.');
}

function declareWinner(who) {
  document.querySelector('.endgame').style.display = 'flex';
  document.querySelector('.text').innerText = who;
}

function emptySquares() {
  return originBoard.filter((s) => typeof s == 'number');
}

function bestSpot() {
  return minimax(originBoard, aiPlayer).index;
}

function checkTie() {
  if (emptySquares().length == 0) {
    for (let cell of cells) {
      cell.style.backgroundColor = '#d5dedb';
      cell.removeEventListener('click', turnClick);
    }
    declareWinner('Tie Game!');
    return true;
  }
  return false;
}

function minimax(newBoard, player) {
  let availSpots = emptySquares();

  if (checkWin(newBoard, huPlayer)) {
    return { score: -10 };
  }
  if (checkWin(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  let moves = [];
  for (let spot of availSpots) {
    let move = {};
    move.index = newBoard[spot];
    newBoard[spot] = player;
    //recursion starts here
    if (player == aiPlayer) {
      let result = minimax(newBoard, huPlayer);
      move.score = result.score;
    } else {
      let result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }
    newBoard[spot] = move.index;
    moves.push(move);
  }
  let bestMove;
  if (player === aiPlayer) {
    let bestScore = -1000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 1000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}
