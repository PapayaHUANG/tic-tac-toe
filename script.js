//变量声明
let originBoard;
let huPlayer;
let aiPlayer;
const circlePng = './circle.png';
const crossPng = './cross.png';
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

//单元格绑定
const cells = document.querySelectorAll('.cell');
document.querySelector('.endgame').style.display = 'none';

restartButton.addEventListener('click', reStartGame);
xButton.addEventListener('click', chooseSign);
oButton.addEventListener('click', chooseSign);

function reStartGame() {
  document.querySelector('.startgame').style.display = 'flex';
  startGame();
}

//确认人机标识
function chooseSign(e) {
  if (e.target.id === 'xButton') {
    huPlayer = crossPng;
    aiPlayer = circlePng;
  } else if (e.target.id === 'oButton') {
    huPlayer = circlePng;
    aiPlayer = crossPng;
  }
  //关闭提示框
  document.querySelector('.startgame').style.display = 'none';
  startGame();
}
function startGame() {
  //控制提示框弹出和关闭
  document.querySelector('.endgame').style.display = 'none';

  //创建一个九宫格棋盘数组，元素为0-9
  originBoard = Array.from(Array(9).keys());

  //给HTML上的单元格绑定事件监听器
  for (let cell of cells) {
    cell.addEventListener('click', turnClick);
    cell.style.removeProperty('background-color');
    cell.innerHTML = '';
  }

  //给提示框选标识绑定事件监听器
  xButton.addEventListener('click', chooseSign);
  oButton.addEventListener('click', chooseSign);
}

//确认人点击的九宫格
function turnClick(square) {
  //square is equal to event in normal case;
  // Here I pass argu to func turn.

  if (typeof originBoard[square.target.id] === 'number') {
    turn(square.target.id, huPlayer);
    if (!checkTie()) {
      turn(bestSpot(), aiPlayer);
    }
  }
}

//给点击的九宫格画上标记
function turn(squareId, player) {
  const newChild = document.createElement('img');
  newChild.src = player;
  document.getElementById([squareId]).appendChild(newChild);

  //This syntax is for the sake of fuc checkWin.
  originBoard[squareId] = player;
  gameWon = checkWin(originBoard, player);

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
    const selectedCells = document.getElementById(index);
    selectedCells.style.backgroundColor = '#f2a84e';
    selectedCells.style.animation = 'highlight 1s 4';
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
