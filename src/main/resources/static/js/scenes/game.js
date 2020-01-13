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
		if(game.global.typeOfGame==0){
			cursors_B = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.UP, 'left': Phaser.Input.Keyboard.KeyCodes.LEFT, 'right': Phaser.Input.Keyboard.KeyCodes.RIGHT, 'shoot': Phaser.Input.Keyboard.KeyCodes.L, 'color': Phaser.Input.Keyboard.KeyCodes.K });
		}
	},
    
    create: function ()
    {
    	for(var i = 0; i<3; i++){
	    		
				let bg_0 = this.add.image(0,0+(i*game.config.height*4),"bg-0");
				if(i===1){bg_0.flipY=true};
		    	bg_0.displayHeight = game.config.height*4;
		    	bg_0.scaleX=bg_0.scaleY;
		    	bg_0.y=(game.config.height*4*i)+(game.config.height/2)*4;
		    	bg_0.x=(game.config.width/2)*4;
		    	
		    	let bg_1 = this.add.image(0,0+(i*game.config.height*4),"bg-1");
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

		// set the boundaries of our game world
		this.physics.world.bounds.width = groundLayer.width;
		this.physics.world.bounds.height = groundLayer.height;

		nicknames= new Array();
		for(var i=0; i < game.global.nPlayers; i++){//For every player:
			// create the player sprite    
			player[i] = this.physics.add.sprite(200, 8688, 'playerSprite-'+i);
			
			// small fix to our player images, we resize the physics body object slightly
			player[i].body.setSize(player[i].width, player[i].height);
			
			nicknames[i] = this.add.text(200, 8688, "", { font: "40px Arial", fill: "#FF0000", fontWeight: "bold", align: "center" });

		}
		
		
		
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
    	msg.nickname = userNickname;
    	game.global.socket.send(JSON.stringify(msg));
		 
        if(game.global.typeOfGame==0){
        	this.cameras.main.setSize(game.config.width/2, game.config.height);
        	camera = this.cameras.main;
        	camera_B = this.cameras.add(game.config.width/2, 0, game.config.width/2, game.config.height);
        }else{
        	this.cameras.main.setSize(game.config.width, game.config.height);
        	camera = this.cameras.main;
        }
        
        HUD = this.cameras.add(0,0,game.config.width,game.config.height);
        
        this.pb = this.add.image(10000,1000,"iRosa");
        
        //Puntuacion
        stV1=0;
        startScoreV1=false;
        stV1=this.add.text(10000-(game.config.width/2)+350,500,"Max Altitude: "+game.global.score[0],{fontSize:'48px'}).setDepth(1);
        stV1.setOrigin(0.5,0.5);
        
        if(game.global.typeOfGame==0){
        	stV2=0;
        	startScoreV2=false;
	        stV2=this.add.text(10000+(game.config.width/2)-350,500,"Max Altitude: "+game.global.score[1],{fontSize:'48px'}).setDepth(1);
	        stV2.setOrigin(0.5,0.5);
	        
	        this.barra = this.add.image(10000,1000,"bg-4");
	        this.barra.scaleX=0.25;
	        this.barra.scaleY=2;
        }
        
        //Hud
        
        HUD.startFollow(this.pb)
        HUD.ignore(this.pb)
        
    	camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        camera.setZoom(0.6);
        camera.startFollow(player[game.global.index]);
        
        if(game.global.typeOfGame==0){
	        camera_B.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
	        camera_B.setZoom(0.6);
			camera_B.startFollow(player[1]);
        }
        
        c1=870;c2=955;c3=1045;c4=1130;Ax=72;Bx=68;
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


	
    },
	
    update: function (time, delta) {
	    	blackHoleLayer.y= game.global.blackHolePosition;
	    	
			
		    this.physics.world.bounds.height = groundLayer.height - 96 + game.global.blackHolePosition;
	        
	       
	    	
	    	
	    	//Update puntuacion
		    camera.setBounds(0, 0, map.widthInPixels, this.physics.world.bounds.height);
	    	if(startScoreV1){game.global.score[0]=Math.max(scoreInit-player[0].y,game.global.score[0]);}else{game.global.score[0]=0;}
	    	stV1.setText("Max Altitude: "+game.global.score[game.global.index]);
	    	
	    	if(game.global.typeOfGame==0){
	    		camera_B.setBounds(0, 0, map.widthInPixels, this.physics.world.bounds.height);
	    		if(startScoreV2){game.global.score[1]=Math.max(scoreInit-player[1].y,game.global.score[1]);}else{game.global.score[1]=0;}
	    		stV2.setText("Max Altitude: "+game.global.score[1]);
	    	}
	    	
			for(var i=0; i<bullet.length; i++) {
				bullet[i].destroy();
			}
			
			bullet= new Array(game.global.bulletLength);
	    	
			for(var i=0; i<game.global.length; i++) {
				if(game.global.player[i].isAlive){
					player[i].setPosition(game.global.player[i].x,game.global.player[i].y);
					nicknames[i].text=game.global.player[i].nickname;
					nicknames[i].x=game.global.player[i].x - 32;
					nicknames[i].y=game.global.player[i].y - 128;
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
        
    	let msg = new Object();
    	msg.event = 'UPDATE_CONTROLS';
		//PLAYER A
		if (cursors.left.isDown)
		{
			if(steps+300 < Date.now()  && game.global.player[game.global.index].ground  && !cursors.up.isDown){
				this.sound.play('steps');
				steps=Date.now();
			}
			msg.direction = "left";
		}
		else if (cursors.right.isDown)
		{
			if(steps+300 < Date.now()  && game.global.player[game.global.index].ground  && !cursors.up.isDown){
				this.sound.play('steps');
				steps=Date.now();
			}
			msg.direction = "right";
		}else{

			msg.direction = "idle";
		}
		msg.jump = cursors.up.isDown;
		if(cursors.up.isDown && !startScoreV1){startScoreV1=true;}
		if(cursors.up.isDown && jumping+250 < Date.now() && game.global.player[game.global.index].ground){

			this.sound.play('jump');
			jumping=Date.now();
		}
		//COLOR
		msg.changeColor = cursors.color.isDown;
		//FIRE
		msg.shoot = cursors.shoot.isDown;
		if(cursors.shoot.isDown && shooting+120 < Date.now() ){
			this.sound.play('shoot');
			shooting=Date.now();
		}
		
		if(game.global.typeOfGame==0){
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
			if(cursors_B.up.isDown && !startScoreV2){startScoreV2=true;}
			if(cursors_B.up.isDown && jumping_B+250 < Date.now() && game.global.player[1].ground){
		
				this.sound.play('jump');
				jumping_B=Date.now();
			}
			//COLOR
			msg.changeColor_B = cursors_B.color.isDown;
			//FIRE
			msg.shoot_B = cursors_B.shoot.isDown;
			if(cursors_B.shoot.isDown && shooting_B+120 < Date.now() ){
				this.sound.play('shoot');
				shooting_B=Date.now();
			}
		}
		
		//JUST ONE CONTROLS MSG IS SENT.
		game.global.socket.send(JSON.stringify(msg));
		
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
var scoreText, scoreV1, scoreV2;
var scoreInit = 8647;
var stV1, stV2;
var startScoreV1, startScoreV2;

var fps=15, nextFrameUpdate=Date.now(), updateLapse=1000/fps;
var jumping=Date.now(), shooting=Date.now(), jumping_B=Date.now(), shooting_B=Date.now(), steps=Date.now();
var shootTime= 0;
var steps=[];
var bullet=new Array();
var groundLayer, blackHoleLayer, coinLayer;
var camera, camera_B, HUD;