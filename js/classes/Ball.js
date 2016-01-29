function Ball(x, y, angle, speed, radius) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = speed;
    this.radius = radius;
    this.color = 'black';
}

Ball.prototype.draw = function(ctx){
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
    this.color = 'black';
};

Ball.prototype.move = function(delta){
    // add horizontal increment to the x pos
    // add vertical increment to the y pos

    var incX = this.speed * Math.cos(this.angle);
    var incY = this.speed * Math.sin(this.angle);

    this.x += (incX * delta) / 1000;
    this.y += (incY * delta) / 1000;
};

Ball.prototype.updatePosition = function(ctx, canvas, delta, monster, plopSound){
    // 1) move the ball
    this.move(delta);

    // 2) test if the ball collides with a wall
    this.testCollisionBallWall(canvas);

    // Test if the monster collides
    if (circRectsOverlap(monster.x, monster.y, monster.width, monster.height, this.x, this.y, this.radius)) {
        this.color = 'red';
        monster.dead = true;
		plopSound.play();
    }

    // 3) draw the ball
    this.draw(ctx);
};

Ball.prototype.testCollisionBallWall = function(canvas){
    // LEFT
    if (this.x < this.radius) {
        this.x = this.radius;
        this.angle = -this.angle + Math.PI;
    }
    
    // RIGHT
    if (this.x > canvas.width - (this.radius)) {
        this.x = canvas.width - (this.radius);
        this.angle = -this.angle + Math.PI;
    }
    
    // UP
    if (this.y < this.radius) {
        this.y = this.radius;
        this.angle = -this.angle;
    }
    
    // DOWN
    if (this.y > canvas.height - (this.radius)) {
        this.y = canvas.height - (this.radius);
        this.angle = -this.angle;
    }
};
