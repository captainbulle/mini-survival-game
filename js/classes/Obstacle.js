function Obstacle(x, y, width, height, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speedX = speedX;
    this.speedY = speedY;
    this.color = 'black';
}

Obstacle.prototype.move = function(delta){
    // add horizontal increment to the x pos
    // add vertical increment to the y pos
    this.x += (this.speedX * delta) / 1000;
    this.y += (this.speedY * delta) / 1000;
};

Obstacle.prototype.draw = function(ctx){
    ctx.save();
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.restore();
    this.color = 'black';
};

Obstacle.prototype.updatePosition = function(ctx, canvas, delta){
    this.move(delta);
    this.testCollisionObstacleWall(canvas);
    this.draw(ctx);
};

Obstacle.prototype.testCollisionObstacleWall = function(canvas){
    if((this.y + this.height) > canvas.height) {
        this.y = canvas.height-this.height;
        this.speedY = - this.speedY;
    }
    if(this.y < 0 ) {
        this.y = 0;
        this.speedY = - this.speedY;
    }
    if((this.x + this.width) > canvas.width) {
        this.x = canvas.width -this.width;
        this.speedX = - this.speedX;
    } 
    if(this.x < 0) {
        this.x = 0;
        this.speedX = - this.speedX;
    }
};
