var spritesLink = {
    // As many sprites as direction
    // Each element in this array contains n images
    sprites : []
};

// Vars relative to the canvas
var canvas, ctx;

function initSprites(sprite, spriteWidth, spriteHeight, nbLinesOfSprites, nbSpritesPerLine) {

    // sprite extraction
    for(var i = 0; i < nbLinesOfSprites; i++) {
        var yLineForCurrentDir = i*spriteHeight;

        var sprite = new Sprite(ctx, sprite, 0, yLineForCurrentDir,
            spriteWidth, spriteHeight,
            nbSpritesPerLine,
            3	// draw every 1s
		); 
        spritesLink[i] = sprite;
    }
}

// Inits
window.onload = function init() {
    var game = new GF();
	
	// load the sprite
    sprite = new Image();
    sprite.src = "sprites/guy.png";
	console.log(sprite.src);

    sprite.onload = function() {

        // info about sprite
		var NB_FRAMES = 16;
        var SPRITE_WIDTH = 8; // 128 / NB_FRAMES -> 8
        var SPRITE_HEIGHT = 12; // 192 / NB_FRAMES -> 12
        var nbLinesOfSprites = 4;
		var nbSpritesPerLine = 4;

        initSprites(sprite, SPRITE_WIDTH, SPRITE_HEIGHT, nbLinesOfSprites, nbSpritesPerLine);
    };
    game.start();
};

// GAME FRAMEWORK STARTS HERE
var GF = function () {
    // vars for handling inputs
    var inputStates = {};

    // game states
    var gameStates = {
        mainMenu: 0,
        gameRunning: 1,
        gameOver: 2
    };
	
    var currentGameState = gameStates.gameRunning;
    var currentLevel = 1;
    var TIME_BETWEEN_LEVELS = 5000; 
    var currentLevelTime = TIME_BETWEEN_LEVELS;
    
    var level1 = new Map("level1");

    //var player = new Character("guy.png", 7, 14, DIRECTION.DOWN);
    //level1.addCharacter(player);

    var obstacles = [];
	
	var monster = {
        dead: false,
        x: 10,
        y: 10,
        width: 35,
        height: 50,
        speed: 300    // pixels / s 
    };
  
    var balls = [];
    var nbBalls = 5;
	
	DIR_S = 1; // player walk to the south
    DIR_W = 2; // player walk to the west
    DIR_N = 4; // player walk to the north
    DIR_E = 3; // player walk to the east
    var dir = DIR_S;
    var moving = false;
    var scale = 0.5;
	
	document.onkeyup = function(e) {
        moving = false;
    };

    // clears the canvas content
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    var mainLoop = function (time) {
        //main function, called each frame 
        measureFPS(time);

        // number of ms since last frame draw
        delta = timer(time);

        // Clear the canvas
        clearCanvas();

        if (monster.dead) {
            currentGameState = gameStates.gameOver;
        }

        switch (currentGameState) {
            case gameStates.gameRunning:

                // draw the map
                level1.drawMap(ctx);
				
				updateMonsterPosition(delta);

                // update and draw balls
                var length = balls.length;
                for(var i = 0; i < length; i++) {
                    balls[i].updatePosition(ctx, canvas, delta, monster, plopSound);
                }
                
                //update and draw obstacle(s)
                length = obstacles.length;
                for(i = 0; i < length; i++) {
                    obstacles[i].updatePosition(ctx, canvas, delta);
                }
            
                // display Score
                displayScore();

                // decrease currentLevelTime. 
                currentLevelTime -= delta;

				if (currentLevelTime < 0) {
                    goToNextLevel();
                }

                break;
            case gameStates.mainMenu:
                // TO DO !
                break;
            case gameStates.gameOver:
                ctx.fillText("GAME OVER", 50, 100);
				ctx.fillText("Congratulations, you made to the level " + currentLevel, 50, 150);
                ctx.fillText("Press SPACE to start again", 50, 200);
                ctx.fillText("Move with arrow keys", 50, 250);
                ctx.fillText("Survive 5 seconds for next level", 50, 300);
                if (inputStates.space) {
                    startNewGame();
                }
                break;
        }
		
		if(!moving) {
            spritesLink[dir].render(monster.x-5, monster.y-10, scale);
        } else {
            spritesLink[dir].renderMoving(monster.x, monster.y, scale);
        }

        // call the animation loop every 1/60th of second
        requestAnimationFrame(mainLoop);
    };
  
    function startNewGame() {
        monster.dead = false;
        currentLevelTime = 5000;
        currentLevel = 1;
        nbBalls = 5;
        createBalls(nbBalls);
        currentGameState = gameStates.gameRunning;
    }

    function goToNextLevel() {
        // reset time available for next level
        currentLevelTime = 5000;
        currentLevel++;
        nbBalls += 2;
        createBalls(nbBalls);
    }

    function displayScore() {
        ctx.save();
        ctx.fillStyle = 'Black';
        ctx.fillText("Level: " + currentLevel, 900, 30);
        ctx.fillText("Time: " + (currentLevelTime / 1000).toFixed(1), 900, 60);
        ctx.fillText("Balls: " + nbBalls, 900, 90);
        ctx.restore();
    }
	
	function updateMonsterPosition(delta) {
        monster.speedX = monster.speedY = 0;

        if (inputStates.left) {
            monster.speedX = -monster.speed;
            dir = DIR_W;
            moving = true;
        }
        if (inputStates.up) {
            monster.speedY = -monster.speed;
            dir = DIR_N;
            moving = true;
        }
        if (inputStates.right) {
            monster.speedX = monster.speed;
            dir = DIR_E;
            moving = true;
        }
        if (inputStates.down) {
            monster.speedY = monster.speed;
            dir = DIR_S;
            moving = true;
        }
        if (inputStates.space) { }
		
        if (inputStates.mousePos) { }
		
        if (inputStates.mousedown) {
            //monster.speed = 500;
        } else {
            // mouse up
            // monster.speed = 100;
        }

        // Compute the incX and inY in pixels depending
        // on the time elapsed since last redraw
        newX = monster.x + calcDistanceToMove(delta, monster.speedX);
        newY = monster.y + calcDistanceToMove(delta, monster.speedY);

        if (!(newX < 0) && !(newX + monster.width + 10 > canvas.width)) {
            monster.x = newX;
        }
        if (!(newY < 0) && !(newY + monster.height > canvas.height)) {
            monster.y = newY;
        }
    }

    function createBalls(numberOfBalls) {
        // Start from an empty array
        balls = [];
		
		var radius = 15;
		var ball = new Array();
        for (var i = 0; i < numberOfBalls; i++) {
            // Create a ball with random position and speed.
            ball = new Ball(
				canvas.width * Math.random(),  // x
				canvas.height * Math.random(), // y
				2 * Math.PI * Math.random(),   // angle
				80 * Math.random(),            // speed
				radius
			);

            // Do not create a ball on the monster. We augmented the ball radius 
            // to sure the ball is created far from the monster.
            if (
				!circRectsOverlap(
					monster.x, monster.y, monster.width, monster.height, ball.x, ball.y, ball.radius * 3
				)
			) {
                balls.push(ball);
            } else {
                i--;
            }
        }
    }

    function createObstacles() {
        obstacles.push(new Obstacle(100, 0, 20, 200, 0, 100));

        obstacles.push(new Obstacle(200, 200, 20, 200, 0, 0));

        obstacles.push(new Obstacle(300, 0, 20, 200, 0, 0));
    }
    
    function loadAssets(callback) {
        // here we should load the souds, the sprite sheets etc.
        // then at the end call the callback function

        // simple example that loads a sound and then calls the callback. We used the howler.js WebAudio lib here.
        // Load sounds asynchronously using howler.js
        plopSound = new Howl({
            urls: ['http://mainline.i3s.unice.fr/mooc/plop.mp3'],
            autoplay: false,
            volume: 1,
            onload: function () {
                console.log("all sounds loaded");
                // We're done!
                callback();
            }
        });
    }
    
    var start = function () {
		initFPSCounter();

        canvas = document.querySelector("#gameCanvas");

        // map
        canvas.width = level1.getWidth() * 32;
    	canvas.height = level1.getHeight() * 32;

        ctx = canvas.getContext('2d');
        ctx.font = "bold 24px Arial";
		
		// Create the different key and mouse listeners
        addListeners(inputStates, canvas);
        
        // We create the balls
        createBalls(nbBalls);
        
        createObstacles();
        
        loadAssets(function () {
            // all assets (images, sounds) loaded, we can start the animation
            requestAnimationFrame(mainLoop);
        });
    };

    // our GameFramework returns a public API visible from outside its scope
    return {
        start: start
    };
};


