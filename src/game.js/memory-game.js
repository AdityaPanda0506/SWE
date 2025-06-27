const board = document.getElementById('game-board');
const moveCount = document.getElementById('move-count');
const timerDisplay = document.getElementById('timer');
const resetBtn = document.getElementById('reset-btn');

const emojis = ['🍕','🍔','🍟','🌭','🍿','🍩','🍪','🍦'];
let cards = [];
let flippedCards = [];
let matched = 0;
let moves = 0;
let timer = 0;
let timerInterval = null;
let lockBoard = false;

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startGame() {
  // Reset state
  board.innerHTML = '';
  cards = shuffle([...emojis, ...emojis]);
  flippedCards = [];
  matched = 0;
  moves = 0;
  moveCount.textContent = moves;
  timer = 0;
  timerDisplay.textContent = timer;
  lockBoard = false;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timer++;
    timerDisplay.textContent = timer;
  }, 1000);

  // Create cards
  cards.forEach((emoji, idx) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.dataset.index = idx;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back">${emoji}</div>
      </div>
    `;
    card.addEventListener('click', handleCardClick);
    board.appendChild(card);
  });
}

function handleCardClick(e) {
  if (lockBoard) return;
  const card = e.currentTarget;
  if (card.classList.contains('flipped')) return;
  card.classList.add('flipped');
  flippedCards.push(card);
  if (flippedCards.length === 1 && moves === 0 && timer === 0) {
    // Start timer on first flip
    timerInterval = setInterval(() => {
      timer++;
      timerDisplay.textContent = timer;
    }, 1000);
  }
  if (flippedCards.length === 2) {
    moves++;
    moveCount.textContent = moves;
    checkForMatch();
  }
}

function checkForMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.emoji === card2.dataset.emoji) {
    matched += 2;
    flippedCards = [];
    if (matched === 16) {
      clearInterval(timerInterval);
      setTimeout(() => {
        alert(`You won in ${moves} moves and ${timer} seconds!`);
      }, 500);
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
      lockBoard = false;
    }, 900);
  }
}

resetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  startGame();
});

// Start the game on load
startGame(); 