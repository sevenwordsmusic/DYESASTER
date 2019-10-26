var GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function GameScene ()
    {
        Phaser.Scene.call(this, { key: 'gameScene', active: false });

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
        
		cursors = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.UP, 'left': Phaser.Input.Keyboard.KeyCodes.LEFT, 'right': Phaser.Input.Keyboard.KeyCodes.RIGHT, 'shoot': Phaser.Input.Keyboard.KeyCodes.CONTROL, 'color': Phaser.Input.Keyboard.KeyCodes.SPACE });
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
		allTiles = map.addTilesetImage('tiles');
		// create the ground layer
		groundLayer = map.createDynamicLayer('World', allTiles, 0, 0);
		// the player will collide with this layer
		groundLayer.setCollisionByExclusion([-1]);
		
		
		blackHoleLayer = map.createDynamicLayer('BlackHole', allTiles, 0, 0);
		blackHoleLayer.setCollisionByExclusion([-1]);
		blackHoleLayer.setPosition(0, 96);

    	//this.animatedTiles.init(map);
		
		// coin image used as tileset
		//var coinTiles = map.addTilesetImage('coin');
		// add coins as tiles
		//coinLayer = map.createDynamicLayer('Coins', coinTiles, 0, 0);

		// set the boundaries of our game world
		this.physics.world.bounds.width = groundLayer.width;
		this.physics.world.bounds.height = groundLayer.height;


		// create the player sprite    
		player[0] = this.physics.add.sprite(200, 8688, 'playerSprite-0');
		player[0].setBounce(0.2); // our player will bounce from items
		player[0].setCollideWorldBounds(true); // don't go out of the map
		// small fix to our player images, we resize the physics body object slightly
		player[0].body.setSize(player[0].width, player[0].height-8);
		
		player[1] = this.physics.add.sprite(600, 8688, 'playerSprite-0');
		player[1].setBounce(0.2); // our player will bounce from items
		player[1].setCollideWorldBounds(true); // don't go out of the map
		// small fix to our player images, we resize the physics body object slightly
		player[1].body.setSize(player[1].width, player[1].height-8);

		
		// player will collide with the level tiles 
		this.physics.add.collider(groundLayer, player[0]);
		
		this.physics.add.collider(groundLayer, player[1]);
		
		this.physics.add.collider(player[0], player[1]);
		this.physics.add.collider(player[1], player[0]);
		
		blackHoleLayer.setTileIndexCallback(211, deathByBlackHole, this);
		this.physics.add.overlap(player[0], blackHoleLayer);
		this.physics.add.overlap(player[1], blackHoleLayer);

		
		

		for(var c=0; c<4; c++){//For every color:
			// player walk animation
				this.anims.create({
					key: 'walk-'+c,	//We create 4 walk anims...
					frames: this.anims.generateFrameNames('playerSprite-'+c, {prefix: 'p1_walk', start: 1, end: 11, zeroPad: 2}),
					frameRate: 15,
					repeat: -1
				});
				// idle with only one frame, so repeat is not neaded
				this.anims.create({
					key: 'idle-'+c,	//And 4 idle anims...
					frames: [{key: 'playerSprite-'+c, frame: 'p1_stand'}],
					frameRate: 15,
				});
		}
		


		
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		this.cameraDolly = new Phaser.Geom.Point(player[0].x, player[0].y);
		this.cameras.main.startFollow(this.cameraDolly);


		
    },
	
    update: function (time, delta) {
	    	blackHoleLayer.y= game.global.blackHolePosition;
			for(var i=0; i<game.global.length; i++) {
				player[i].setPosition(game.global.player[i].x,game.global.player[i].y);
				//game.global.player[i].colorId=game.global.player[i].colorId;
		    	if(player[i].body){			
					switch(game.global.player[i].direction){
						case 'left':
							player[i].anims.play('walk-'+game.global.player[i].colorId, true); // walk left
							player[i].flipX = true; // flip the sprite to the left
						break
						case 'right':
							player[i].anims.play('walk-'+game.global.player[i].colorId, true);
							player[i].flipX = false; // use the original sprite looking to the right
						break
						default :
							player[i].anims.play('idle-'+game.global.player[i].colorId, true);
						break
					}
		    	}
			}
					
	    this.physics.world.bounds.height = groundLayer.height - 96 + game.global.blackHolePosition;
	    this.cameras.main.setBounds(0, 0, map.widthInPixels, this.physics.world.bounds.height);
    	
        this.cameraDolly.x = player[game.global.index].x;
        this.cameraDolly.y = player[game.global.index].y; 
		
    	let msg = new Object();
    	msg.event = 'UPDATE_CONTROLS';
		if (cursors.left.isDown)
		{
			msg.direction = "left";
		}
		else if (cursors.right.isDown)
		{
			msg.direction = "right";
		}else if (cursors.up.isDown)
		{
			msg.direction = "jump";      
		}else{
			msg.direction = "idle";
		}
		//COLOR
		msg.changeColor = cursors.color.isDown;
		//FIRE
		if (cursors.shoot.isDown )
		{}
		//JUST ONE CONTROLS MSG IS SENT.
		game.global.socket.send(JSON.stringify(msg));
		
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


function deathByBlackHole(sprite, tile) {
    sprite.destroy();
    return false;
}

var shootTime= 0;
var bullets;
var groundLayer, blackHoleLayer, coinLayer;