class Snake {
    constructor(gridSize) {
        this.gridSize = gridSize;
        this.body = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        this.dx = 1;
        this.dy = 0;
        this.nextDx = 1;
        this.nextDy = 0;
        this.grow = false;
    }
    
    getHead() {
        return this.body[0];
    }
    
    getBody() {
        return this.body;
    }
    
    getLength() {
        return this.body.length;
    }
    
    changeDirection(dx, dy) {
        // 防止反向移动
        if (this.dx === -dx && this.dy === -dy) {
            return;
        }
        this.nextDx = dx;
        this.nextDy = dy;
    }
    
    move() {
        // 更新方向
        this.dx = this.nextDx;
        this.dy = this.nextDy;
        
        // 计算新头部位置
        const head = this.getHead();
        const newHead = {
            x: head.x + this.dx,
            y: head.y + this.dy
        };
        
        // 插入新头部
        this.body.unshift(newHead);
        
        // 如果不 grow，移除尾部
        if (!this.grow) {
            this.body.pop();
        } else {
            this.grow = false;
        }
    }
    
    growNextMove() {
        this.grow = true;
    }
    
    checkSelfCollision() {
        const head = this.getHead();
        // 检查头部是否与身体其他部分重叠
        for (let i = 1; i < this.body.length; i++) {
            if (this.body[i].x === head.x && this.body[i].y === head.y) {
                return true;
            }
        }
        return false;
    }
    
    checkWallCollision(canvasSize) {
        const head = this.getHead();
        const count = canvasSize / this.gridSize;
        
        // 检查是否撞墙
        if (head.x < 0 || head.x >= count || head.y < 0 || head.y >= count) {
            return true;
        }
        return false;
    }
    
    reset() {
        this.body = [
            { x: 10, y: 10 },
            { x: 9, y: 10 },
            { x: 8, y: 10 }
        ];
        this.dx = 1;
        this.dy = 0;
        this.nextDx = 1;
        this.nextDy = 0;
        this.grow = false;
    }
    
    draw(ctx) {
        // 绘制蛇身
        this.body.forEach((segment, index) => {
            // 头部颜色不同
            if (index === 0) {
                ctx.fillStyle = '#667eea';
            } else {
                // 身体渐变色
                const gradient = (this.body.length - index) / this.body.length;
                ctx.fillStyle = this.interpolateColor(
                    '#764ba2',
                    '#667eea',
                    gradient
                );
            }
            
            ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize,
                this.gridSize
            );
            
            // 绘制边框
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.strokeRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize,
                this.gridSize
            );
            
            // 绘制眼睛（头部）
            if (index === 0) {
                ctx.fillStyle = '#fff';
                const eyeSize = this.gridSize / 5;
                const eyeOffset = this.gridSize / 3;
                
                // 根据方向绘制眼睛
                if (this.dx === 1) { // 向右
                    ctx.fillRect(
                        segment.x * this.gridSize + this.gridSize - eyeOffset,
                        segment.y * this.gridSize + eyeOffset,
                        eyeSize,
                        eyeSize
                    );
                    ctx.fillRect(
                        segment.x * this.gridSize + this.gridSize - eyeOffset,
                        segment.y * this.gridSize + this.gridSize - eyeOffset - eyeSize,
                        eyeSize,
                        eyeSize
                    );
                } else if (this.dx === -1) { // 向左
                    ctx.fillRect(
                        segment.x * this.gridSize + eyeOffset,
                        segment.y * this.gridSize + eyeOffset,
                        eyeSize,
                        eyeSize
                    );
                    ctx.fillRect(
                        segment.x * this.gridSize + eyeOffset,
                        segment.y * this.gridSize + this.gridSize - eyeOffset - eyeSize,
                        eyeSize,
                        eyeSize
                    );
                } else if (this.dy === -1) { // 向上
                    ctx.fillRect(
                        segment.x * this.gridSize + eyeOffset,
                        segment.y * this.gridSize + eyeOffset,
                        eyeSize,
                        eyeSize
                    );
                    ctx.fillRect(
                        segment.x * this.gridSize + this.gridSize - eyeOffset - eyeSize,
                        segment.y * this.gridSize + eyeOffset,
                        eyeSize,
                        eyeSize
                    );
                } else if (this.dy === 1) { // 向下
                    ctx.fillRect(
                        segment.x * this.gridSize + eyeOffset,
                        segment.y * this.gridSize + this.gridSize - eyeOffset - eyeSize,
                        eyeSize,
                        eyeSize
                    );
                    ctx.fillRect(
                        segment.x * this.gridSize + this.gridSize - eyeOffset - eyeSize,
                        segment.y * this.gridSize + this.gridSize - eyeOffset - eyeSize,
                        eyeSize,
                        eyeSize
                    );
                }
            }
        });
    }
    
    interpolateColor(color1, color2, factor) {
        // 简单的颜色插值
        const r1 = parseInt(color1.substring(1, 3), 16);
        const g1 = parseInt(color1.substring(3, 5), 16);
        const b1 = parseInt(color1.substring(5, 7), 16);
        
        const r2 = parseInt(color2.substring(1, 3), 16);
        const g2 = parseInt(color2.substring(3, 5), 16);
        const b2 = parseInt(color2.substring(5, 7), 16);
        
        const r = Math.round(r1 + factor * (r2 - r1));
        const g = Math.round(g1 + factor * (g2 - g1));
        const b = Math.round(b1 + factor * (b2 - b1));
        
        return `rgb(${r}, ${g}, ${b})`;
    }
}
