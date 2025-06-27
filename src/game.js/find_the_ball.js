const dot = document.getElementById('dot');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');

let score = 0;
let timeLeft = 30;
let gameActive = false;
let timerInterval;

function randomPosition() {
  const containerRect = gameContainer.getBoundingClientRect();
  const dotSize = 40;
  const maxLeft = containerRect.width - dotSize;
  const maxTop = containerRect.height - dotSize;
  const left = Math.random() * maxLeft;
  const top = Math.random() * maxTop;
  dot.style.left = `${left}px`;
  dot.style.top = `${top}px`;
}

function startGame() {
  score = 0;
  timeLeft = 30;
  gameActive = true;
  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  startBtn.disabled = true;
  dot.style.display = 'block';
  randomPosition();
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  gameActive = false;
  clearInterval(timerInterval);
  dot.style.display = 'none';
  startBtn.disabled = false;
  alert(`Time's up! Your score: ${score}`);
}

dot.addEventListener('click', () => {
  if (!gameActive) return;
  score++;
  scoreDisplay.textContent = score;
  randomPosition();
});

startBtn.addEventListener('click', startGame);

dot.style.display = 'none';
