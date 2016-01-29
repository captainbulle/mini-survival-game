function SpriteImage(ctx, sprite, x, y, width, height) {
    this.ctx = ctx;
	this.sprite = sprite;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    // xPos and yPos = position where the sprite should be drawn,
    // scale = rescaling factor between 0 and 1
    this.render = function(xPos, yPos, scale) {
        this.ctx.drawImage(
			this.sprite,
            this.x, this.y,
            this.width, this.height,
            xPos, yPos,
            this.width*scale, this.height*scale
		);
    };
}