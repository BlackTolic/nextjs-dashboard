'use client';
import './game.css';
import { useEffect, useState } from 'react';

export default function SnakeGame() {
  const [highScore, setHighScore] = useState(0);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  
  // 将 startGame 声明为组件级别的函数
  const startGame = () => {
    const event = new Event('startGame');
    window.dispatchEvent(event);
  };

  useEffect(() => {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let snake = [{x: 150, y: 150}];
    let food = {x: 0, y: 0};
    let direction = {x: 0, y: 0};
    let score = 0;
    let gameSpeed = 100;
    let gameLoop: NodeJS.Timeout | null = null;

    function drawGame() {
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
      ctx!.fillText(`High Score: ${highScore}`, 10, 40);
    }

    function updateGame() {
      const head = {x: snake[0].x + direction.x * 10, y: snake[0].y + direction.y * 10};
      snake.unshift(head);
      
      if (head.x === food.x && head.y === food.y) {
        score += 10;
        setCurrentScore(score);
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('snakeHighScore', score.toString());
        }
        placeFood();
      } else {
        snake.pop();
      }

      if (
        head.x < 0 || head.x >= canvas!.width ||
        head.y < 0 || head.y >= canvas!.height ||
        snake.slice(1).some(part => part.x === head.x && part.y === head.y)
      ) {
        gameOver();
        return;
      }

      drawGame();
    }

    function gameOver() {
      if (gameLoop) clearInterval(gameLoop);
      setIsGameRunning(false);
      alert(`游戏结束！得分：${score}`);
    }

    function startGame() {
      console.log("startGame");
      snake = [{x: 150, y: 150}];
      direction = {x: 0, y: 0};
      score = 0;
      setCurrentScore(0);
      placeFood();
      if (gameLoop) clearInterval(gameLoop);
      gameLoop = setInterval(updateGame, gameSpeed);
      setIsGameRunning(true);
    }

    function placeFood() {
      food = {
        x: Math.floor(Math.random() * (canvas!.width / 10)) * 10,
        y: Math.floor(Math.random() * (canvas!.height / 10)) * 10
      };
      
      while (snake.some(part => part.x === food.x && part.y === food.y)) {
        placeFood();
      }
    }

    function changeDirection(event: KeyboardEvent) {
      if (!isGameRunning) return;
      
      const key = event.key;
      if (key === 'ArrowUp' && direction.y === 0) {
        direction = {x: 0, y: -1};
      } else if (key === 'ArrowDown' && direction.y === 0) {
        direction = {x: 0, y: 1};
      } else if (key === 'ArrowLeft' && direction.x === 0) {
        direction = {x: -1, y: 0};
      } else if (key === 'ArrowRight' && direction.x === 0) {
        direction = {x: 1, y: 0};
      } else if (key === ' ') { // 空格键暂停/继续
        togglePause();
      }
    }

    function togglePause() {
      if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
        setIsGameRunning(false);
      } else {
        gameLoop = setInterval(updateGame, gameSpeed);
        setIsGameRunning(true);
      }
    }

    // 加载最高分
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }

    // 添加 startGame 事件监听器
    window.addEventListener('startGame', startGame);

    // 初始化游戏画面
    drawGame();
    window.addEventListener('keydown', changeDirection);

    return () => {
      if (gameLoop) clearInterval(gameLoop);
      window.removeEventListener('keydown', changeDirection);
      window.removeEventListener('startGame', startGame); // 清理事件监听器
    };
  }, [highScore, isGameRunning]);

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>贪吃蛇游戏</h1>
        <p>当前得分: {currentScore} | 最高分: {highScore}</p>
      </div>
      <canvas id="gameCanvas" width="300" height="300"></canvas>
      <div className="game-controls">
        <button 
          className="game-button"
          onClick={() => startGame()}
        >
          {isGameRunning ? '重新开始' : '开始游戏'}
        </button>
        <button 
          className="game-button"
          onClick={() => {
            const event = new KeyboardEvent('keydown', { key: ' ' });
            window.dispatchEvent(event);
          }}
        >
          {isGameRunning ? '暂停' : '继续'}
        </button>
      </div>
      <div className="game-instructions" style={{color: 'white', marginTop: '20px'}}>
        <p>使用方向键控制蛇的移动</p>
        <p>空格键暂停/继续游戏</p>
      </div>
    </div>
  );
}
