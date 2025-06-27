const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const resetBtn = document.getElementById('reset-btn');

const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake, direction, food, score, gameInterval, gameActive;

function resetGame() {
  snake = [
    { x: 8, y: 10 },
    { x: 7, y: 10 },
    { x: 6, y: 10 }
  ];
  direction = { x: 1, y: 0 };
  score = 0;
  scoreDisplay.textContent = score;
  spawnFood();
  gameActive = true;
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 100);
}

function spawnFood() {
  let valid = false;
  while (!valid) {
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
    valid = !snake.some(segment => segment.x === food.x && segment.y === food.y);
  }
}

function gameLoop() {
  // Move snake
  const newHead = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  // Collision: wall
  if (
    newHead.x < 0 || newHead.x >= tileCount ||
    newHead.y < 0 || newHead.y >= tileCount
  ) {
    endGame();
    return;
  }

  // Collision: self
  if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
    endGame();
    return;
  }

  snake.unshift(newHead);

  // Eat food
  if (newHead.x === food.x && newHead.y === food.y) {
    score++;
    scoreDisplay.textContent = score;
    spawnFood();
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw food
  ctx.fillStyle = '#ff4136';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  // Draw snake
  ctx.fillStyle = '#00ff00';
  snake.forEach((segment, i) => {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  });
}

function endGame() {
  gameActive = false;
  clearInterval(gameInterval);
  ctx.fillStyle = '#fff';
  ctx.font = '32px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
}

window.addEventListener('keydown', e => {
  if (!gameActive) return;
  switch (e.key) {
    case 'ArrowUp':
      if (direction.y !== 1) direction = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
      if (direction.y !== -1) direction = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
      if (direction.x !== 1) direction = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
      if (direction.x !== -1) direction = { x: 1, y: 0 };
      break;
  }
});

resetBtn.addEventListener('click', resetGame);

// Start game on load
resetGame(); 