document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("snakeGame");
  const ctx = canvas.getContext("2d");

  const width = canvas.width;
  const height = canvas.height;
  const snakeBlock = 10;
  const snakeSpeed = 100;
  let snake = [{ x: width / 2, y: height / 2 }];
  let snakeLength = 1;
  let food;
  let obstacles;
  let direction = { x: 0, y: 0 };
  let score;
  let gameInterval;
  let isGameRunning = false;

  function initializeGame() {
      snake = [{ x: width / 2, y: height / 2 }];
      snakeLength = 1;
      food = spawnFood();
      obstacles = spawnObstacles(10);
      direction = { x: 0, y: 0 }; // Direção inicial sem movimento
      score = 0;
      isGameRunning = true;
      ctx.clearRect(0, 0, width, height);
      drawFood();
      drawSnake();
      drawObstacles();
      drawScore();
  }

  function startGame() {
      initializeGame();
      clearInterval(gameInterval);
      gameInterval = setInterval(updateGame, snakeSpeed);

      // Travar a barra de rolagem ao começar o jogo
      document.body.style.overflow = 'hidden'; // Desativa o scroll da página
  }

  function drawRect(x, y, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, snakeBlock, snakeBlock);
  }

  function drawSnake() {
      snake.forEach(segment => drawRect(segment.x, segment.y, "green"));
  }

  function drawFood() {
      drawRect(food.x, food.y, "blue");
  }

  function drawObstacles() {
      obstacles.forEach(obst => drawRect(obst.x, obst.y, "gray"));
  }

  function spawnFood() {
      return {
          x: Math.floor(Math.random() * (width / snakeBlock)) * snakeBlock,
          y: Math.floor(Math.random() * (height / snakeBlock)) * snakeBlock
      };
  }

  function spawnObstacles(count) {
      let obs = [];
      for (let i = 0; i < count; i++) {
          obs.push({
              x: Math.floor(Math.random() * (width / snakeBlock)) * snakeBlock,
              y: Math.floor(Math.random() * (height / snakeBlock)) * snakeBlock
          });
      }
      return obs;
  }

  function changeDirection(event) {
      if (!isGameRunning) return;

      const keyPressed = event.key;
      if (keyPressed === "ArrowUp" && direction.y === 0) {
          direction = { x: 0, y: -snakeBlock };
      } else if (keyPressed === "ArrowDown" && direction.y === 0) {
          direction = { x: 0, y: snakeBlock };
      } else if (keyPressed === "ArrowLeft" && direction.x === 0) {
          direction = { x: -snakeBlock, y: 0 };
      } else if (keyPressed === "ArrowRight" && direction.x === 0) {
          direction = { x: snakeBlock, y: 0 };
      }
  }

  document.addEventListener("keydown", changeDirection);

  function updateGame() {
    if (direction.x === 0 && direction.y === 0) return; // Evita atualização se a direção for zero

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height || 
        snake.some(segment => segment.x === head.x && segment.y === head.y) ||
        obstacles.some(obst => obst.x === head.x && obst.y === head.y)) {
        alert("Você perdeu! Pontuação: " + score);
        clearInterval(gameInterval);
        isGameRunning = false;

        // Restaurar a rolagem da página
        document.body.style.overflow = 'auto'; // Permite rolar a página novamente

        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        food = spawnFood();
        snakeLength++;
    } else {
        snake = snake.slice(0, snakeLength);
    }

    ctx.clearRect(0, 0, width, height);
    drawFood();
    drawSnake();
    drawObstacles();
    drawScore();
}

  function drawScore() {
      ctx.fillStyle = "yellow";
      ctx.font = "20px Arial";
      ctx.fillText("Pontuação: " + score, 10, 20);
  }

  const startGameButton = document.getElementById("startGameButton");
  startGameButton.addEventListener("click", startGame);
});
