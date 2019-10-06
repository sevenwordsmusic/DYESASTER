var LevelScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function LevelScene ()
    {
        Phaser.Scene.call(this, { key: 'levelScene', active: false });

    },

    preload: function()
    {
        var FKey = this.input.keyboard.addKey('F');
        FKey.on('down', function () {
            if (this.scale.isFullscreen)
            {
                this.scale.stopFullscreen();
            }
            else
            {
                this.scale.startFullscreen();
            }
        }, this);
        
		cursors1 = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.UP, 'left': Phaser.Input.Keyboard.KeyCodes.LEFT, 'right': Phaser.Input.Keyboard.KeyCodes.RIGHT, 'shoot': Phaser.Input.Keyboard.KeyCodes.CONTROL });
		cursors2 = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.W, 'left': Phaser.Input.Keyboard.KeyCodes.A, 'right': Phaser.Input.Keyboard.KeyCodes.D, 'shoot': Phaser.Input.Keyboard.KeyCodes.SHIFT });
    },
    
    create: function ()
    {	 
		this.bg_0 = this.add.tileSprite(0, 0, game.config.width, game.config.height, "bg-0");
		this.bg_0.setOrigin(0, 0);
		this.bg_0.setScrollFactor(0);
		
		// create an tiled sprite with the size of our game screen
		this.bg_1 = this.add.tileSprite(0, 0, game.config.width, game.config.height, "bg-1");
		// Set its pivot to the top left corner
		this.bg_1.setOrigin(0, 0);
		// fix it so it won't move when the camera moves.
		// Instead we are moving its texture on the update
		this.bg_1.setScrollFactor(0);

		// Add a second background layer. Repeat as in bg_1
		this.bg_2 = this.add.tileSprite(0, 0, game.config.width, game.config.height, "bg-2");
		this.bg_2.setOrigin(0, 0);
		this.bg_2.setScrollFactor(0);
		
		this.bg_3 = this.add.tileSprite(0, 0, game.config.width, game.config.height, "bg-3");
		this.bg_3.setOrigin(0, 0);
		this.bg_3.setScrollFactor(0);
		
		this.bg_4 = this.add.tileSprite(0, 0, game.config.width, game.config.height, "bg-4");
		this.bg_4.setOrigin(0, 0);
		this.bg_4.setScrollFactor(0);
		
		this.bg_5 = this.add.tileSprite(0, 0, game.config.width, game.config.height, "bg-5");
		this.bg_5.setOrigin(0, 0);
		this.bg_5.setScrollFactor(0);
		
		// load the map 
		map = this.make.tilemap({key: 'map'});
		
		// tiles for the ground layer
		var groundTiles = map.addTilesetImage('tiles');
		// create the ground layer
		groundLayer = map.createDynamicLayer('World', groundTiles, 0, 0);
		// the player will collide with this layer
		groundLayer.setCollisionByExclusion([-1]);

		// coin image used as tileset
		//var coinTiles = map.addTilesetImage('coin');
		// add coins as tiles
		//coinLayer = map.createDynamicLayer('Coins', coinTiles, 0, 0);

		// set the boundaries of our game world
		this.physics.world.bounds.width = groundLayer.width;
		this.physics.world.bounds.height = groundLayer.height;

		// create the player sprite    
		player1 = this.physics.add.sprite(200, 8800, 'player1');
		player1.setBounce(0.2); // our player will bounce from items
		player1.setCollideWorldBounds(true); // don't go out of the map
		
		player2 = this.physics.add.sprite(600, 8800, 'player2');
		player2.setBounce(0.2); // our player will bounce from items
		player2.setCollideWorldBounds(true); // don't go out of the map
		
		
		// small fix to our player images, we resize the physics body object slightly
		player1.body.setSize(player1.width, player1.height-8);
		
		// player will collide with the level tiles 
		this.physics.add.collider(groundLayer, player1);

		

		
		
		// small fix to our player images, we resize the physics body object slightly
		player2.body.setSize(player2.width, player2.height-8);
		this.physics.add.collider(groundLayer, player2);
		
		
		
		this.physics.add.collider(player1, player2);
		this.physics.add.collider(player2, player1);
		
		//coinLayer.setTileIndexCallback(17, collectCoin, this);
		// when the player overlaps with a tile with index 17, collectCoin 
		// will be called    
		this.physics.add.overlap(player1, coinLayer);
		this.physics.add.overlap(player2, coinLayer);
		
		// player walk animation
		this.anims.create({
			key: 'walk1',
			frames: this.anims.generateFrameNames('player1', {prefix: 'p1_walk', start: 1, end: 11, zeroPad: 2}),
			frameRate: 10,
			repeat: -1
		});
		// idle with only one frame, so repeat is not neaded
		this.anims.create({
			key: 'idle1',
			frames: [{key: 'player1', frame: 'p1_stand'}],
			frameRate: 10,
		});
		
		
		// player walk animation
		this.anims.create({
			key: 'walk2',
			frames: this.anims.generateFrameNames('player2', {prefix: 'p1_walk', start: 1, end: 11, zeroPad: 2}),
			frameRate: 10,
			repeat: -1
		});
		// idle with only one frame, so repeat is not neaded
		this.anims.create({
			key: 'idle2',
			frames: [{key: 'player2', frame: 'p1_stand'}],
			frameRate: 10,
		});
	
		// set bounds so the camera won't go outside the game world
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		// make the camera follow the player
		this.cameras.main.startFollow(player1);

		// this text will show the score
		text = this.add.text(20, 570, '0', {
			fontSize: '20px',
			fill: '#ffffff'
		});
		// fix the text to the camera
		text.setScrollFactor(0);
		
    },
	
    update: function (time, delta) {
		if (cursors1.left.isDown)
		{
			player1.body.setVelocityX(-200);
			player1.anims.play('walk1', true); // walk left
			player1.flipX = true; // flip the sprite to the left
		}
		else if (cursors1.right.isDown)
		{
			player1.body.setVelocityX(200);
			player1.anims.play('walk1', true);
			player1.flipX = false; // use the original sprite looking to the right
		} else {
			player1.body.setVelocityX(0);
			player1.anims.play('idle1', true);
		}
		// jump 
		if (cursors1.up.isDown && player1.body.onFloor())
		{
			player1.body.setVelocityY(-500);        
		}
		//FIRE
		if (cursors1.shoot.isDown )
		{
			
		}
		
		if (cursors2.left.isDown)
		{
			player2.body.setVelocityX(-200);
			player2.anims.play('walk2', true); // walk left
			player2.flipX = true; // flip the sprite to the left
		}
		else if (cursors2.right.isDown)
		{
			player2.body.setVelocityX(200);
			player2.anims.play('walk2', true);
			player2.flipX = false; // use the original sprite looking to the right
		} else {
			player2.body.setVelocityX(0);
			player2.anims.play('idle2', true);
		}
		// jump 
		if (cursors2.up.isDown && player2.body.onFloor())
		{
			player2.body.setVelocityY(-500);        
		}
		//FIRE
		if (cursors2.shoot.isDown )
		{

		}
		
		// scroll the texture of the tilesprites proportionally to the camera scroll
		this.bg_1.tilePositionX = this.cameras.main.scrollX * .2;
		this.bg_2.tilePositionX = this.cameras.main.scrollX * .4;
		this.bg_3.tilePositionX = this.cameras.main.scrollX * .6;
		this.bg_4.tilePositionX = this.cameras.main.scrollX * .8;
		
		this.bg_1.tilePositionY = this.cameras.main.scrollY * .2;
		this.bg_2.tilePositionY = this.cameras.main.scrollY * .4;
		this.bg_3.tilePositionY = this.cameras.main.scrollY * .6;
		this.bg_4.tilePositionY = this.cameras.main.scrollY * .8;
		
	}

});


function collectCoin(sprite, tile) {
    coinLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
    score++; // add 10 points to the score
    return false;
}

var shootTime= 0;
var bullets;




