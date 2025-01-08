'use client';
import './game.css';
import { useEffect } from 'react';

export default function SnakeGame() {
  useEffect(() => {
    // Game initialization
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Game variables
    let snake = [{x: 150, y: 150}];
    let food = {x: 0, y: 0};
    let direction = {x: 0, y: 0};
    let score = 0;
    let gameSpeed = 100;

    // Game functions
    function drawGame() {
      // Clear canvas
      ctx!.fillStyle = 'black';
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

      // Draw snake
      ctx!.fillStyle = 'lime';
      snake.forEach(part => {
        ctx!.fillRect(part.x, part.y, 10, 10);
        ctx!.strokeStyle = 'darkgreen';
        ctx!.strokeRect(part.x, part.y, 10, 10);
      });

      // Draw food
      ctx!.fillStyle = 'red';
      ctx!.fillRect(food.x, food.y, 10, 10);

      // Draw score
      ctx!.fillStyle = 'white';
      ctx!.font = '15px Arial';
      ctx!.fillText(`Score: ${score}`, 10, 20);
    }

    function updateGame() {
      // Move snake
      const head = {x: snake[0].x + direction.x * 10, y: snake[0].y + direction.y * 10};
      snake.unshift(head);
      
      // Check for food collision
      if (head.x === food.x && head.y === food.y) {
        score += 10;
        placeFood();
      } else {
        snake.pop();
      }

      // Check for collisions
      if (
        head.x < 0 || head.x >= canvas!.width ||
        head.y < 0 || head.y >= canvas!.height ||
        snake.slice(1).some(part => part.x === head.x && part.y === head.y)
      ) {
        clearInterval(gameLoop);
        alert('Game Over!');
        return;
      }

      drawGame();
    }

    function placeFood() {
      food = {
        x: Math.floor(Math.random() * (canvas!.width / 10)) * 10,
        y: Math.floor(Math.random() * (canvas!.height / 10)) * 10
      };
      
      // Make sure food doesn't spawn on snake
      while (snake.some(part => part.x === food.x && part.y === food.y)) {
        placeFood();
      }
    }

    function changeDirection(event: KeyboardEvent) {
      const key = event.key;
      if (key === 'ArrowUp' && direction.y === 0) {
        direction = {x: 0, y: -1};
      } else if (key === 'ArrowDown' && direction.y === 0) {
        direction = {x: 0, y: 1};
      } else if (key === 'ArrowLeft' && direction.x === 0) {
        direction = {x: -1, y: 0};
      } else if (key === 'ArrowRight' && direction.x === 0) {
        direction = {x: 1, y: 0};
      }
    }

    // Initial setup
    placeFood();
    const gameLoop = setInterval(updateGame, gameSpeed);
    window.addEventListener('keydown', changeDirection);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', changeDirection);
    };
  }, []);

  return (
    <div className="game-container">
      <canvas id="gameCanvas" width="300" height="300"></canvas>
    </div>
  );
}
