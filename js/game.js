// 游戏配置
const CANVAS_SIZE = 400;
const GRID_SIZE = 20;
const COUNT = CANVAS_SIZE / GRID_SIZE;

class Game {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.snake = new Snake(GRID_SIZE);
        this.food = new Food(CANVAS_SIZE, GRID_SIZE);
        
        this.score = 0;
        this.targetScore = 10;
        this.lives = 1;
        this.speed = 100;
        this.isRunning = false;
        this.isPaused = false;
        this.gameInterval = null;
        
        this.initEventListeners();
        this.updateUI();
    }
    
    initEventListeners() {
        // 键盘控制
        document.addEventListener('keydown', (e) => {
            if (!this.isRunning) return;
            
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    this.snake.changeDirection(0, -1);
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    this.snake.changeDirection(0, 1);
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    this.snake.changeDirection(-1, 0);
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    this.snake.changeDirection(1, 0);
                    break;
                case ' ':
                case 'Spacebar':
                    this.pause();
                    break;
            }
        });
        
        // 按钮事件
        document.getElementById('start-btn').addEventListener('click', () => this.startFromConfig());
        document.getElementById('pause-btn').addEventListener('click', () => this.pause());
        document.getElementById('restart-btn').addEventListener('click', () => this.restart());
        document.getElementById('back-btn').addEventListener('click', () => this.showConfig());
        document.getElementById('play-again-btn').addEventListener('click', () => this.restart());
        document.getElementById('menu-btn').addEventListener('click', () => this.showConfig());
    }
    
    startFromConfig() {
        // 从配置界面获取设置
        this.speed = parseInt(document.getElementById('speed').value);
        this.targetScore = parseInt(document.getElementById('target-score').value);
        this.lives = parseInt(document.getElementById('lives').value);
        
        this.start();
    }
    
    start() {
        this.score = 0;
        this.lives = parseInt(document.getElementById('lives').value);
        this.isRunning = true;
        this.isPaused = false;
        
        this.snake.reset();
        this.food.generate();
        
        this.updateUI();
        this.switchScreen('game-screen');
        
        // 开始游戏循环
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
        }
        this.gameInterval = setInterval(() => this.gameLoop(), this.speed);
    }
    
    gameLoop() {
        if (this.isPaused) return;
        
        // 移动蛇
        this.snake.move();
        
        // 检查碰撞
        if (this.snake.checkWallCollision(CANVAS_SIZE)) {
            if (!this.handleDeath()) {
                return;
            }
        } else if (this.snake.checkSelfCollision()) {
            if (!this.handleDeath()) {
                return;
            }
        }
        
        // 检查是否吃到食物
        const head = this.snake.getHead();
        const foodPos = this.food.getPosition();
        
        if (head.x === foodPos.x && head.y === foodPos.y) {
            this.score++;
            this.snake.growNextMove();
            this.food.generate();
            
            // 检查是否达到目标分数
            if (this.score >= this.targetScore) {
                this.gameOver(true);
                return;
            }
        }
        
        this.draw();
        this.updateUI();
    }
    
    handleDeath() {
        this.lives--;
        this.updateUI();
        
        if (this.lives <= 0) {
            this.gameOver(false);
            return false;
        } else {
            // 复活：重置蛇的位置和长度
            this.snake.reset();
            return true;
        }
    }
    
    draw() {
        // 清空画布
        this.ctx.fillStyle = '#f8f9fa';
        this.ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        
        // 绘制网格线
        this.drawGrid();
        
        // 绘制食物和蛇
        this.food.draw(this.ctx);
        this.snake.draw(this.ctx);
    }
    
    drawGrid() {
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i <= COUNT; i++) {
            // 垂直线
            this.ctx.beginPath();
            this.ctx.moveTo(i * GRID_SIZE, 0);
            this.ctx.lineTo(i * GRID_SIZE, CANVAS_SIZE);
            this.ctx.stroke();
            
            // 水平线
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * GRID_SIZE);
            this.ctx.lineTo(CANVAS_SIZE, i * GRID_SIZE);
            this.ctx.stroke();
        }
    }
    
    pause() {
        if (!this.isRunning) return;
        
        this.isPaused = !this.isPaused;
        
        const pauseBtn = document.getElementById('pause-btn');
        if (this.isPaused) {
            pauseBtn.textContent = '▶️ 继续';
            this.showOverlay('Paused');
        } else {
            pauseBtn.textContent = '⏸️ 暂停';
            this.draw();
        }
    }
    
    showOverlay(text) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, CANVAS_SIZE / 2, CANVAS_SIZE / 2);
        
        this.ctx.font = '16px Arial';
        this.ctx.fillText('按空格键继续', CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 40);
    }
    
    restart() {
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
        }
        this.start();
    }
    
    gameOver(isWin) {
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
        }
        
        this.isRunning = false;
        this.showGameOverScreen(isWin);
    }
    
    showGameOverScreen(isWin) {
        document.getElementById('game-over-title').textContent = isWin ? '🎉 胜利！' : '💀 游戏结束';
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('final-target').textContent = this.targetScore;
        this.switchScreen('game-over-screen');
    }
    
    showConfig() {
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
        }
        this.isRunning = false;
        
        // 更新配置界面的显示
        document.getElementById('target-score-display').textContent = this.targetScore;
        this.switchScreen('config-screen');
    }
    
    switchScreen(screenId) {
        // 隐藏所有屏幕
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // 显示目标屏幕
        document.getElementById(screenId).classList.add('active');
    }
    
    updateUI() {
        document.getElementById('current-score').textContent = this.score;
        document.getElementById('target-score-display').textContent = this.targetScore;
        document.getElementById('lives-display').textContent = this.lives;
        
        // 更新暂停按钮状态
        const pauseBtn = document.getElementById('pause-btn');
        if (this.isRunning) {
            pauseBtn.textContent = this.isPaused ? '▶️ 继续' : '⏸️ 暂停';
            document.getElementById('restart-btn').disabled = false;
            document.getElementById('back-btn').disabled = false;
        } else {
            pauseBtn.textContent = '⏸️ 暂停';
            document.getElementById('restart-btn').disabled = true;
            document.getElementById('back-btn').disabled = false;
        }
    }
}

// 初始化游戏
let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new Game();
    
    // 初始绘制
    game.draw();
});
