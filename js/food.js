class Food {
    constructor(canvasSize, gridSize) {
        this.canvasSize = canvasSize;
        this.gridSize = gridSize;
        this.count = canvasSize / gridSize;
        this.x = 0;
        this.y = 0;
        this.color = '#ff6b6b';
        this.generate();
    }
    
    generate() {
        // 随机生成食物位置
        this.x = Math.floor(Math.random() * this.count);
        this.y = Math.floor(Math.random() * this.count);
    }
    
    draw(ctx) {
        // 绘制食物
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.x * this.gridSize + 1,
            this.y * this.gridSize + 1,
            this.gridSize - 2,
            this.gridSize - 2
        );
        
        // 添加光泽效果
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(
            this.x * this.gridSize + 3,
            this.y * this.gridSize + 3,
            this.gridSize - 8,
            this.gridSize - 8
        );
    }
    
    getPosition() {
        return { x: this.x, y: this.y };
    }
    
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
}
