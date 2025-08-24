const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerWidth = 32, playerHeight = 12;
let playerX = (canvas.width - playerWidth) / 2;
const bulletWidth = 4, bulletHeight = 8;
let bullets = [];
const invaderRowCount = 3, invaderColCount = 8, invaderWidth = 20, invaderHeight = 16, invaderPadding = 8, invaderOffsetTop = 30, invaderOffsetLeft = 16;
let invaders = [];
let invaderDX = 1;
let score = 0;
let gameOver = false;
let gameInterval = null;

function setupInvaders() {
  invaders = [];
  for(let r=0; r<invaderRowCount; r++) {
    for(let c=0; c<invaderColCount; c++) {
      invaders.push({
        x: c*(invaderWidth+invaderPadding)+invaderOffsetLeft,
        y: r*(invaderHeight+invaderPadding)+invaderOffsetTop,
        status: 1
      });
    }
  }
}

function drawInvaders() {
  invaders.forEach(inv => {
    if(inv.status === 1) {
      ctx.fillStyle = "#E53";
      ctx.fillRect(inv.x, inv.y, invaderWidth, invaderHeight);
    }
  });
}

function drawPlayer() {
  ctx.fillStyle = "#6F6";
  ctx.fillRect(playerX, canvas.height - playerHeight - 8, playerWidth, playerHeight);
}

function drawBullets() {
  bullets.forEach(b => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(b.x, b.y, bulletWidth, bulletHeight);
  });
}

function drawScore() {
  ctx.fillStyle = "#fff";
  ctx.font = '16px monospace';
  ctx.fillText("Score: " + score, 10, 30);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawInvaders();
  drawPlayer();
  drawBullets();
  drawScore();

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

  // Move invaders
  let rightEdge = Math.max(...invaders.filter(i => i.status).map(i => i.x + invaderWidth));
  let leftEdge = Math.min(...invaders.filter(i => i.status).map(i => i.x));
  if(rightEdge > canvas.width - 4 || leftEdge < 4) invaderDX = -invaderDX;
  invaders.forEach(inv => {
    if(inv.status === 1) inv.x += invaderDX;
  });

  // Move bullets
  bullets.forEach(b => b.y -= 6);
  bullets = bullets.filter(b => b.y > 0);

  // Bullet collision
  bullets.forEach(b => {
    invaders.forEach(inv => {
      if(inv.status === 1 &&
         b.x < inv.x + invaderWidth && b.x + bulletWidth > inv.x &&
         b.y < inv.y + invaderHeight && b.y + bulletHeight > inv.y) {
        inv.status = 0;
        b.y = -10;
        score++;
        if(score === invaderRowCount * invaderColCount) gameOver = true;
      }
    });
  });

  // Invader collision with player
  invaders.forEach(inv => {
    if(inv.status === 1 && inv.y + invaderHeight > canvas.height - playerHeight - 8) {
      gameOver = true;
    }
  });
}

function gameLoop() {
  update();
  draw();
}

function start() {
  playerX = (canvas.width - playerWidth) / 2;
  bullets = [];
  score = 0;
  gameOver = false;
  invaderDX = 1;
  setupInvaders();
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, 16);
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
  if(e.key === 'ArrowLeft' && playerX > 0) playerX -= 12;
  if(e.key === 'ArrowRight' && playerX < canvas.width - playerWidth) playerX += 12;
  if(e.key === ' ' || e.key === 'Spacebar') {
    bullets.push({ x: playerX + playerWidth/2 - bulletWidth/2, y: canvas.height - playerHeight - 16 });
  }
}

window.addEventListener('keydown', handleKeydown);

start();

if (typeof window.currentGame !== 'undefined') window.currentGame.stop();
window.currentGame = { stop };
