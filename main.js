let currentGame = null;
let interval = null;

function startGame(game) {
  document.getElementById('menu').style.display = 'none';
  document.getElementById('gameCanvas').style.display = 'block';
  document.getElementById('backBtn').style.display = 'inline-block';

  if (game === 'snake') {
    loadGameScript('snake.js');
  } else if (game === 'breakout') {
    loadGameScript('breakout.js');
  } else if (game === 'spaceinvaders') {
    loadGameScript('spaceinvaders.js');
  }
}

function backToMenu() {
  document.getElementById('menu').style.display = 'block';
  document.getElementById('gameCanvas').style.display = 'none';
  document.getElementById('backBtn').style.display = 'none';
  if (currentGame && typeof currentGame.stop === 'function') currentGame.stop();
  currentGame = null;
  removeGameScript();
}

function loadGameScript(scriptName) {
  removeGameScript();
  const script = document.createElement('script');
  script.src = scriptName;
  script.id = 'currentGameScript';
  document.body.appendChild(script);
}

function removeGameScript() {
  const oldScript = document.getElementById('currentGameScript');
  if (oldScript) oldScript.remove();
}
