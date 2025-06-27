const cells = document.querySelectorAll('.cell');
const currentPlayerSpan = document.getElementById('current-player');
const statusDiv = document.getElementById('game-status');
const resetBtn = document.getElementById('reset-btn');

let board = Array(9).fill('');
let currentPlayer = 'X';
let gameActive = true;

const winPatterns = [
  [0,1,2], [3,4,5], [6,7,8], // rows
  [0,3,6], [1,4,7], [2,5,8], // cols
  [0,4,8], [2,4,6]           // diags
];

function checkWin() {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function checkDraw() {
  return board.every(cell => cell);
}

function handleCellClick(e) {
  const idx = +e.target.dataset.index;
  if (!gameActive || board[idx]) return;
  board[idx] = currentPlayer;
  e.target.textContent = currentPlayer;
  const winner = checkWin();
  if (winner) {
    statusDiv.textContent = `Player ${winner} wins!`;
    gameActive = false;
    return;
  }
  if (checkDraw()) {
    statusDiv.textContent = "It's a draw!";
    gameActive = false;
    return;
  }
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  currentPlayerSpan.textContent = currentPlayer;
}

function resetGame() {
  board = Array(9).fill('');
  currentPlayer = 'X';
  gameActive = true;
  currentPlayerSpan.textContent = currentPlayer;
  statusDiv.textContent = 'Current Player: ';
  statusDiv.appendChild(currentPlayerSpan);
  cells.forEach(cell => cell.textContent = '');
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame); 