var GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function GameScene ()
    {
        Phaser.Scene.call(this, { key: 'gameScene', active: false });

    },

    preload: function()
    {
        var FKey = this.input.keyboard.addKey('V');
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
        
		cursors = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.W, 'left': Phaser.Input.Keyboard.KeyCodes.A, 'right': Phaser.Input.Keyboard.KeyCodes.D, 'shoot': Phaser.Input.Keyboard.KeyCodes.F, 'color': Phaser.Input.Keyboard.KeyCodes.G });
		cursors_B = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.UP, 'left': Phaser.Input.Keyboard.KeyCodes.LEFT, 'right': Phaser.Input.Keyboard.KeyCodes.RIGHT, 'shoot': Phaser.Input.Keyboard.KeyCodes.L, 'color': Phaser.Input.Keyboard.KeyCodes.K });
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
		
		//this.bg_3 = this.add.tileSprite(0, 0, game.config.width, game.config.height, "bg-3");
		//this.bg_3.setOrigin(0, 0);
		//this.bg_3.setScrollFactor(0);
		
		
		// load the map 
		map = this.make.tilemap({key: 'map'});

		// tiles for the ground layer
		allTiles = map.addTilesetImage('tiles');
		// create the ground layer
		groundLayer = map.createDynamicLayer('World', allTiles, 0, 0);
		// the player will collide with this layer
		//groundLayer.setCollisionByExclusion([-1]);
		
		
		blackHoleLayer = map.createDynamicLayer('BlackHole', allTiles, 0, 0);
		//blackHoleLayer.setCollisionByExclusion([-1]);
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
		
		
		this.physics.add.overlap(player[0], blackHoleLayer);
		this.physics.add.overlap(player[1], blackHoleLayer);
		
		for(var c=0; c<4; c++){//For every color:
			// player walk animation
				this.anims.create({
					key: 'walk-'+c,	//We create 4 walk anims...
					frames: this.anims.generateFrameNames('playerSprite-'+c, {prefix: 'walk_0', start: 0, end: 7, zeroPad: 0}),
					frameRate: 15,
					repeat: -1
				});
				// idle with only one frame, so repeat is not neaded
				this.anims.create({
					key: 'idle-'+c,	//And 4 idle anims...
					frames: [{key: 'playerSprite-'+c, frame: 'stand'}],
					frameRate: 15,
				});
		}
		

    	let msg = new Object();
    	msg.event = 'START_GAMEMATCH';
    	game.global.socket.send(JSON.stringify(msg));
		
    	
        this.cameras.main.setSize(768, 864);

        camera = this.cameras.main;
        camera_B = this.cameras.add(768, 0, 768, 864);
    	
    	
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        camera.setZoom(0.5);
        camera_B.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        camera_B.setZoom(0.5);
		this.cameraDolly = new Phaser.Geom.Point(player[0].x, player[0].y);
		camera.startFollow(this.cameraDolly);
		this.cameraDolly_B = new Phaser.Geom.Point(player[1].x, player[1].y);
		camera_B.startFollow(this.cameraDolly_B);
		
    },
	
    update: function (time, delta) {
	    	blackHoleLayer.y= game.global.blackHolePosition;
			for(var i=0; i<game.global.length; i++) {
				if(game.global.player[i].isAlive){
					player[i].setPosition(game.global.player[i].x,game.global.player[i].y);
					//game.global.player[i].colorId=game.global.player[i].colorId;
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
				}else if(player[i].body){
					player[i].destroy();
				}
			}
					
	    this.physics.world.bounds.height = groundLayer.height - 96 + game.global.blackHolePosition;
        camera.setBounds(0, 0, map.widthInPixels, this.physics.world.bounds.height);
        camera_B.setBounds(0, 0, map.widthInPixels, this.physics.world.bounds.height);
        
        this.cameraDolly.x = player[0].x;
        this.cameraDolly.y = player[0].y; 
        this.cameraDolly_B.x = player[1].x;
        this.cameraDolly_B.y = player[1].y; 
        
        
    	let msg = new Object();
    	msg.event = 'UPDATE_CONTROLS';
		if (cursors.left.isDown)
		{
			msg.direction = "left";
		}
		else if (cursors.right.isDown)
		{
			msg.direction = "right";
		}else{
			msg.direction = "idle";
		}
		msg.jump = cursors.up.isDown;
		//COLOR
		msg.changeColor = cursors.color.isDown;
		//FIRE
		if (cursors.shoot.isDown )
		{}
		
		if (cursors_B.left.isDown)
		{
			msg.direction_B = "left";
		}
		else if (cursors_B.right.isDown)
		{
			msg.direction_B = "right";
		}else{
			msg.direction_B = "idle";
		}
		msg.jump_B = cursors_B.up.isDown;
		//COLOR
		msg.changeColor_B = cursors_B.color.isDown;
		//FIRE
		if (cursors_B.shoot.isDown )
		{}
		//JUST ONE CONTROLS MSG IS SENT.
		game.global.socket.send(JSON.stringify(msg));
		
		// scroll the texture of the tilesprites proportionally to the camera scroll
		this.bg_1.tilePositionX = this.cameras.main.scrollX * .002;
		this.bg_2.tilePositionX = this.cameras.main.scrollX * .004;
		
		this.bg_1.tilePositionY = this.cameras.main.scrollY * .2;
		this.bg_2.tilePositionY = this.cameras.main.scrollY * .4;

		if(nextFrameUpdate<Date.now()){
			animatedTilesBySeven(211,15);
			nextFrameUpdate=Date.now()+updateLapse;
		}
	}
});
function animatedTilesBySeven(animatedTile,totalFrames){
		for(var i=0; i< totalFrames; i++){
			blackHoleLayer.replaceByIndex(animatedTile+i, animatedTile+i+15);
		}
		for(var i=0; i< totalFrames; i++){
			if(i==totalFrames-1){
				blackHoleLayer.replaceByIndex(animatedTile+i+15, animatedTile);
			}else{
				blackHoleLayer.replaceByIndex(animatedTile+i+15, animatedTile+i+1);
			}
		}	
}


var fps=15, nextFrameUpdate=Date.now(), updateLapse=1000/fps;

var shootTime= 0;
var bullets;
var groundLayer, blackHoleLayer, coinLayer;
var camera, camera_B;