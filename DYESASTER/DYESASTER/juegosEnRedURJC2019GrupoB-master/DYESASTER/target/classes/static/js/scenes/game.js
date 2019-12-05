var GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function GameScene ()
    {
        Phaser.Scene.call(this, { key: 'gameScene', active: false });

    },

    preload: function()
    {
    	//this.load.spritesheet("HUDSelect", "assets/HUDAnim.png", {frameWidth:70 ,frameHeight:60})
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

    	/*
		this.bg_0 = this.add.tileSprite(0, 0, game.config.width, game.config.height, "bg-0");
		this.bg_0.setOrigin(0, 0);
		this.bg_0.setScrollFactor(0);
		
		this.bg_1 = this.add.tileSprite(0, 0, game.config.width, game.config.height, "bg-1");
		this.bg_1.setOrigin(0, 0);
		this.bg_1.setScrollFactor(0);

		this.bg_2 = this.add.tileSprite(0, 0, game.config.width, game.config.height, "bg-2");
		this.bg_2.setOrigin(0, 0);
		this.bg_2.setScrollFactor(0);
		
		this.bg_3 = this.add.tileSprite(0, 0, game.config.width, game.config.height, "bg-3");
		this.bg_3.setOrigin(0, 0);
		this.bg_3.setScrollFactor(0);
		//*/
    	for(var i = 0; i<3; i++){
	    		
				let bg_0 =this.add.image(0,0+(i*game.config.height*4),"bg-0");
				if(i===1){bg_0.flipY=true};
		    	bg_0.displayHeight = game.config.height*4;
		    	bg_0.scaleX=bg_0.scaleY;
		    	bg_0.y=(game.config.height*4*i)+(game.config.height/2)*4;
		    	bg_0.x=(game.config.width/2)*4;
		    	
		    	let bg_1 =this.add.image(0,0+(i*game.config.height*4),"bg-1");
		    	if(i===1){bg_1.flipY=true};
		    	bg_1.displayHeight = game.config.height*4;
		    	bg_1.scaleX=bg_1.scaleY;
		    	bg_1.y=(game.config.height*4*i)+(game.config.height/2)*4;
		    	bg_1.x=(game.config.width/2)*4;
		    	
		    	let bg_2 = this.add.image(0,0+(i*game.config.height*4),"bg-2");
		    	if(i===1){bg_2.flipY=true};
		    	bg_2.displayHeight = game.config.height*4;
		    	bg_2.scaleX=bg_2.scaleY;
		    	bg_2.y=(game.config.height*4*i)+(game.config.height/2)*4;
		    	bg_2.x=(game.config.width/2)*4;
	
		    	let bg_3 =this.add.image(0,0+(i*game.config.height*4),"bg-3");
		    	if(i===1){bg_3.flipY=true};
		    	bg_3.displayHeight = game.config.height*4;
		    	bg_3.scaleX=bg_3.scaleY;
		    	bg_3.y=(game.config.height*4*i)+(game.config.height/2)*4;
		    	bg_3.x=(game.config.width/2)*4;
		}
		
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

		// small fix to our player images, we resize the physics body object slightly
		player[0].body.setSize(player[0].width, player[0].height);
		
		player[1] = this.physics.add.sprite(600, 8688, 'playerSprite-0');
		player[1].setBounce(0.2); // our player will bounce from items

		// small fix to our player images, we resize the physics body object slightly
		player[1].body.setSize(player[1].width, player[1].height);

		
		
		
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
		this.anims.create({
			key: 'selectAnim',	
			frames: this.anims.generateFrameNumbers('HUDSelect',{start: 0, end: 3}),
			frameRate: 15,
			repeat: -1
		});
		this.anims.create({
            key: 'laserNonLethalS',
            frames: this.anims.generateFrameNumbers('laserNonLethal', { start: 0, end: 16}),
            frameRate: 8,
            repeat: 1
        });
		

    	let msg = new Object();
    	msg.event = 'START_GAMEMATCH';
    	game.global.socket.send(JSON.stringify(msg));
		
    	
    	this.cameras.main.setSize(768, 864);

        camera = this.cameras.main;
        camera_B = this.cameras.add(768, 0, 768, 864);
        
        HUD = this.cameras.add(0,0,1536,864);
        
        this.pb = this.add.image(10000,1000,"iRosa");
        
        this.barra = this.add.image(10000,1000,"bg-4");
        this.barra.scaleX=0.25;
        
        c1=895;c2=965;c3=1035;c4=1105;Ax=72;Bx=68;
        
        
        this.hudPngA = this.add.image(10000-(game.config.width/2)+70,1000,"hud");
        this.hudPngA.displayHeight = game.config.height/3;
        this.hudPngA.scaleX=this.hudPngA.scaleY;
        
        azulA = this.add.image(10000-(game.config.width/2)+Ax,c1,"iAzul");
        rosaA = this.add.image(10000-(game.config.width/2)+Ax,c2,"iRosa");
        amarilloA = this.add.image(10000-(game.config.width/2)+Ax,c3,"iAmarillo");
        verdeA = this.add.image(10000-(game.config.width/2)+Ax,c4,"iVerde");
        
        HUDSAZA = this.add.image(10000-(game.config.width/2)+Ax,c1,"HUDSelect").setVisible(true);
        HUDSRA = this.add.image(10000-(game.config.width/2)+Ax,c2,"HUDSelect").setVisible(false);
        HUDSAMA = this.add.image(10000-(game.config.width/2)+Ax,c3,"HUDSelect").setVisible(false);
        HUDSVA = this.add.image(10000-(game.config.width/2)+Ax,c4,"HUDSelect").setVisible(false);
        /*HUDSAZA.anims.play('selectAnim', true);
        HUDSRA.anims.play('selectAnim', true);
        HUDSAMA.anims.play('selectAnim', true);
        HUDSVA.anims.play('selectAnim', true);//*/
        
        this.hudPngB = this.add.image(10000+(game.config.width/2)-70,1000,"hud");
        this.hudPngB.displayHeight = game.config.height/3;
        this.hudPngB.scaleX=this.hudPngB.scaleY;
        
        azulB = this.add.image(10000+(game.config.width/2)-Bx,c1,"iAzul");
        rosaB = this.add.image(10000+(game.config.width/2)-Bx,c2,"iRosa");
        amarilloB = this.add.image(10000+(game.config.width/2)-Bx,c3,"iAmarillo");
        verdeB = this.add.image(10000+(game.config.width/2)-Bx,c4,"iVerde");
        
        HUDSAZB = this.add.sprite(10000+(game.config.width/2)-Bx,c1,"HUDSelect").setVisible(true);
        HUDSRB = this.add.image(10000+(game.config.width/2)-Bx,c2,"HUDSelect").setVisible(false);
        HUDSAMB = this.add.image(10000+(game.config.width/2)-Bx,c3,"HUDSelect").setVisible(false);
        HUDSVB = this.add.image(10000+(game.config.width/2)-Bx,c4,"HUDSelect").setVisible(false);
        /*HUDSAZB.anims.play('selectAnim', true);
        HUDSRB.anims.play('selectAnim', true);
        HUDSAMB.anims.play('selectAnim', true);
        HUDSVB.anims.play('selectAnim', true);//*/
        
        HUD.startFollow(this.pb)
        HUD.ignore(this.pb)
        //HUD.setZoom(0.2);
        
        
    	camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        camera.setZoom(0.6);
        
        camera_B.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        camera_B.setZoom(0.6);
        
        camera.startFollow(player[0]);
		camera_B.startFollow(player[1]);
    	
    	/*this.cameras.main.setSize(768, 864);

        camera = this.cameras.main;
        camera_B = this.cameras.add(768, 0, 768, 864);
    	
    	
        camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        //camera.setZoom(0.5);
        camera_B.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        //camera_B.setZoom(0.5);
		this.cameraDolly = new Phaser.Geom.Point(player[0].x, player[0].y);
		camera.startFollow(this.cameraDolly);
		this.cameraDolly_B = new Phaser.Geom.Point(player[1].x, player[1].y);
		camera_B.startFollow(this.cameraDolly_B);
		//*/
	
    },
	
    update: function (time, delta) {
	    	blackHoleLayer.y= game.global.blackHolePosition;
	    	
			for(var i=0; i<bullet.length; i++) {
				bullet[i].destroy();
			}
			bullet= new Array(game.global.bulletLength);
	    	
	    	
			for(var i=0; i<game.global.length; i++) {
				if(game.global.player[i].isAlive){
					player[i].setPosition(game.global.player[i].x,game.global.player[i].y);
					colorHudManager(i,game.global.player[i].colorId)
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
					this.load.audio('death', 'assets/sfx/death.mp3');
					player[i].destroy();
				}
			}
			
			for(var i=0; i<bullet.length; i++) {
				bullet[i] = this.add.sprite(game.global.bullet[i].x, game.global.bullet[i].y, 'bulletSprite');
				switch(game.global.bullet[i].direction){
					case 'left':
						bullet[i].flipX = true;
						bullet[i].x+=78;
						bullet[i].y+=12;
					break
					case 'right':
						bullet[i].flipX = false;
						bullet[i].x-=78;
						bullet[i].y+=12;
					break
					default :
					break
				}
			}
					
	    this.physics.world.bounds.height = groundLayer.height - 96 + game.global.blackHolePosition;
        camera.setBounds(0, 0, map.widthInPixels, this.physics.world.bounds.height);
        camera_B.setBounds(0, 0, map.widthInPixels, this.physics.world.bounds.height);
        
        /*this.cameraDolly.x = player[0].x;
        this.cameraDolly.y = player[0].y; 
        this.cameraDolly_B.x = player[1].x;
        this.cameraDolly_B.y = player[1].y;
        //*/ 
        
        
    	let msg = new Object();
    	msg.event = 'UPDATE_CONTROLS';
		//PLAYER A
		if (cursors.left.isDown)
		{
			if(steps+300 < Date.now()  && game.global.player[0].ground  && !cursors.up.isDown){
				this.sound.play('steps');
				steps=Date.now();
			}
			msg.direction = "left";
		}
		else if (cursors.right.isDown)
		{
			if(steps+300 < Date.now()  && game.global.player[0].ground  && !cursors.up.isDown){
				this.sound.play('steps');
				steps=Date.now();
			}
			msg.direction = "right";
		}else{

			msg.direction = "idle";
		}
		msg.jump = cursors.up.isDown;
		if(cursors.up.isDown && jumping+250 < Date.now() && game.global.player[0].ground){

			this.sound.play('jump');
			jumping=Date.now();
		}
		//COLOR
		msg.changeColor = cursors.color.isDown;
		//FIRE
		msg.shoot = cursors.shoot.isDown;
		if(cursors.shoot.isDown && shooting+354 < Date.now() ){
			this.sound.play('shoot');
			shooting=Date.now();
		}
		
		//PLAYER B
		if (cursors_B.left.isDown)
		{
			if(steps+300 < Date.now()  && game.global.player[1].ground  && !cursors_B.up.isDown){
				this.sound.play('steps');
				steps=Date.now();
			}
			msg.direction_B = "left";
		}
		else if (cursors_B.right.isDown)
		{
			if(steps+300 < Date.now()  && game.global.player[1].ground  && !cursors_B.up.isDown ){
				this.sound.play('steps');
				steps=Date.now();
			}
			msg.direction_B = "right";
		}else{

			msg.direction_B = "idle";
		}
		msg.jump_B = cursors_B.up.isDown;
		if(cursors_B.up.isDown && jumping_B+250 < Date.now() && game.global.player[1].ground){
	
			this.sound.play('jump');
			jumping_B=Date.now();
		}
		//COLOR
		msg.changeColor_B = cursors_B.color.isDown;
		//FIRE
		msg.shoot_B = cursors_B.shoot.isDown;
		if(cursors_B.shoot.isDown && shooting_B+354 < Date.now() ){
			this.sound.play('shoot');
			shooting_B=Date.now();
		}

		
		//JUST ONE CONTROLS MSG IS SENT.
		game.global.socket.send(JSON.stringify(msg));
		
		/*
		// scroll the texture of the tilesprites proportionally to the camera scroll
		this.bg_1.tilePositionX = (camera.scrollX + camera_B.scrollX /2)* .002;
		this.bg_2.tilePositionX = (camera.scrollX + camera_B.scrollX /2)* .006;
		this.bg_3.tilePositionX = (camera.scrollX + camera_B.scrollX /2)* .008;
		
		this.bg_1.tilePositionY = (camera.scrollY + camera_B.scrollY /2)* .2;
		this.bg_2.tilePositionY = (camera.scrollY + camera_B.scrollY /2)* .6;
		this.bg_3.tilePositionY = (camera.scrollY + camera_B.scrollY /2)* .8;
		//*/
		if(nextFrameUpdate<Date.now()){
			animatedTilesBySeven(211,15);
			nextFrameUpdate=Date.now()+updateLapse;
		}
		
		if(game.global.receivedMsg=='GAME_OVER'){
			this.scene.start('rankingScene');
			if (game.global.DEBUG_MODE) {
				console.log('[DEBUG] Switching to ranking.');
			}
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

function colorHudManager(id,color){
	switch(id){
	case 0:
		colorHudInvisible(color)
	break
	case 1:
		
	break
	}
}
function colorHudManager(id,color){
	switch(id){	
	case 1:
		switch(color){
		case 0:
			
			HUDSAZB.setVisible(true);
			HUDSVB.setVisible(false);
		break
		case 1:
			HUDSAZB.setVisible(false);
			HUDSRB.setVisible(true);
		break
		case 2:
			HUDSRB.setVisible(false);
			HUDSAMB.setVisible(true);
		break
		case 3:
			HUDSAMB.setVisible(false);
			HUDSVB.setVisible(true);
		break
		}
	break
	case 0:
		switch(color){
		case 0:
			HUDSAZA.setVisible(true);
			HUDSVA.setVisible(false);
		break
		case 1:
			HUDSAZA.setVisible(false);
			HUDSRA.setVisible(true);
		break
		case 2:
			HUDSRA.setVisible(false);
			HUDSAMA.setVisible(true);
		break
		case 3:
			HUDSAMA.setVisible(false);
			HUDSVA.setVisible(true);
		break
		}
	break
	}
}
var c1,c2,c3,c4,Ax,Bx;

var azulA, verdeA, rosaA, amarilloA;
var azulB, verdeB, rosaB, amarilloB;
var HUDSAZA, HUDSVA, HUDSRA, HUDSAMA;
var HUDSAZB, HUDSVB, HUDSRB, HUDSAMB;

var fps=15, nextFrameUpdate=Date.now(), updateLapse=1000/fps;
var jumping=Date.now(), shooting=Date.now(), jumping_B=Date.now(), shooting_B=Date.now(), steps=Date.now();
var shootTime= 0;
var steps=[];
var bullet=new Array();
var groundLayer, blackHoleLayer, coinLayer;
var camera, camera_B, HUD;