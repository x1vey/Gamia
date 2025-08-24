const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 16;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 8, y: 8 }];
let direction = { x: 0, y: 0 };
let apple = { x: 5, y: 5 };
let score = 0;
let gameOver = false;
let gameInterval = null;

function drawPixel(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
}

function draw() {
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawPixel(apple.x, apple.y, '#E53');
  snake.forEach((segment, i) => {
    drawPixel(segment.x, segment.y, i === 0 ? '#6F6' : '#3B3');
  });

  ctx.fillStyle = '#fff';
  ctx.font = '16px monospace';
  ctx.fillText('Score: ' + score, 10, 30);

  if (gameOver) {
    ctx.fillStyle = '#fff';
    ctx.font = '32px monospace';
    ctx.fillText('GAME OVER', 45, 160);
    ctx.font = '16px monospace';
    ctx.fillText('Press Enter to restart', 55, 200);
  }
}

function update() {
  if (gameOver) return;
  const newHead = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y
  };

  if (
    newHead.x < 0 || newHead.x >= tileCount ||
    newHead.y < 0 || newHead.y >= tileCount
  ) {
    gameOver = true;
    return;
  }
  if (snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
    gameOver = true;
    return;
  }
  snake.unshift(newHead);

  if (newHead.x === apple.x && newHead.y === apple.y) {
    score++;
    placeApple();
  } else {
    snake.pop();
  }
}

function placeApple() {
  let newApple;
  while (true) {
    newApple = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
    if (!snake.some(seg => seg.x === newApple.x && seg.y === newApple.y)) break;
  }
  apple = newApple;
}

function gameLoop() {
  update();
  draw();
}

function start() {
  score = 0;
  gameOver = false;
  snake = [{ x: 8, y: 8 }];
  direction = { x: 0, y: 0 };
  placeApple();
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 120);
}

function stop() {
  if (gameInterval) clearInterval(gameInterval);
  window.removeEventListener('keydown', handleKeydown);
}

function handleKeydown(e) {
  if (gameOver && e.key === 'Enter') {
    start();
    return;
  }
  switch (e.key) {
    case 'ArrowUp':
      if (direction.y === 1) break;
      direction = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
      if (direction.y === -1) break;
      direction = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
      if (direction.x === 1) break;
      direction = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
      if (direction.x === -1) break;
      direction = { x: 1, y: 0 };
      break;
  }
}

window.addEventListener('keydown', handleKeydown);

start();

if (typeof window.currentGame !== 'undefined') window.currentGame.stop();
window.currentGame = { stop };
