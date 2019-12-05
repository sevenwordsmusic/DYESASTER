var MainScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MainScene ()
    {
        Phaser.Scene.call(this, { key: 'mainScene', active: true });

    },
    preload: function ()
    { 	
        this.load.audio('button', 'assets/sfx/button.mp3');
        this.load.audio('jump', 'assets/sfx/jump.mp3');
        this.load.audio('bump', 'assets/sfx/bump.mp3',);
        this.load.audio('shoot', 'assets/sfx/shoot.mp3');
        this.load.audio('death', 'assets/sfx/death.mp3');
        this.load.audio('punch', 'assets/sfx/punch.mp3');
        this.load.audio('steps', 'assets/sfx/steps.mp3');
        this.load.audio('deepTab', 'assets/bgm/deepTab_By_SevenWordsMusic.mp3');
          
        
		// map made with Tiled in JSON format
		this.load.tilemapTiledJSON('map', 'assets/map.json');  


		// tiles in spritesheet 
		this.load.spritesheet('tiles', 'assets/tiles/tt6.png', {frameWidth: 96, frameHeight: 96});

		this.load.image('bulletSprite', 'assets/bullet.png');
		// load all assets tile sprites
		this.load.image('bg-0', 'assets/bg-0.png');
		this.load.image('bg-1', 'assets/bg-1.png');
		this.load.image('bg-2', 'assets/bg-2.png');
		this.load.image('bg-3', 'assets/bg-3.png');
		this.load.image('bg-4', 'assets/separador.png');
		this.load.image('bg-5', 'assets/bg-5.png');
		this.load.image('quidi','assets/quidi.png');
		this.load.image('hud','assets/HUD.png');
		this.load.image('iAzul','assets/iAzul.png');
		this.load.image('iRosa','assets/iRosa.png');
		this.load.image('iVerde','assets/iVerde.png');
		this.load.image('iAmarillo','assets/iAmarillo.png');
		this.load.spritesheet('HUDSelect','assets/HUDAnim.png',{frameWidth:70 ,frameHeight:60});
		this.load.image('LMimg','assets/buttons/localMatch.png');
		this.load.image('CMimg','assets/buttons/newGame.png');
		this.load.image('JGimg','assets/buttons/joinGame.png');
		this.load.image('Cimg','assets/buttons/controls.png');
		this.load.image('LMimgA','assets/buttons/localMatchHover.png');
		this.load.image('CMimgA','assets/buttons/newGameHover.png');
		this.load.image('JGimgA','assets/buttons/joinGameHover.png');
		this.load.image('CimgA','assets/buttons/controlsHover.png');
		this.load.image('psts', 'assets/pressSpaceToSelect.png');
		//this.load.spritesheet('HUDSelect','assets/HUDAnim.png',{ frameWidth: 70, frameHeight: 60 });
		this.load.image('bgGameOver','assets/bgGameOver.png');
		this.load.image('background', 'assets/menuBackground.png');
	   	 		
		// player animations
			for(var c=0; c<4; c++){
					this.load.atlas('playerSprite-'+c, 'assets/playerSprite-'+c+'.png', 'assets/player.json');
			}
			
    },

    create: function ()
    {   
    	
    	this.scale.startFullscreen();
    	deepTab= this.sound.add('deepTab');
    	this.sound.play('deepTab', {volume: 0.25});
    	this.sound.add('button');
    	this.sound.add('jump');
    	this.sound.add('bump');
    	this.sound.add('punch');
    	this.sound.add('shoot');
    	this.sound.add('steps');
		this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, "background");
		this.background.setOrigin(0, 0);
		this.background.setScrollFactor(0);
		document.getElementById('mainMenu').style.opacity='1.0';
		
		btn1 = this.add.image(game.config.width/2, game.config.height/2, "LMimg");
		btn2 = this.add.image(game.config.width/2, game.config.height/2+150, "CMimg");
		btn3 = this.add.image(game.config.width/2, game.config.height/2+250, "JGimg");
		btn4 = this.add.image(game.config.width/2, game.config.height/2+350, "Cimg");
		btn1A = this.add.image(game.config.width/2, game.config.height/2, "LMimgA");
		btn2A = this.add.image(game.config.width/2, game.config.height/2+150, "CMimgA");
		btn3A = this.add.image(game.config.width/2, game.config.height/2+250, "JGimgA");
		btn4A = this.add.image(game.config.width/2, game.config.height/2+350, "CimgA");
		this.psts = this.add.image(game.config.width/2, (game.config.height/2)-100, "psts");
		btnSurfer = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.UP, 'down':Phaser.Input.Keyboard.KeyCodes.DOWN, 'space':Phaser.Input.Keyboard.KeyCodes.SPACE, 'intro':Phaser.Input.Keyboard.KeyCodes.INTRO});
    },
    
    update: function ()
    {
    	waiting++;
    	if(btnSurfer.up.isDown && waiting>=10){
    		btnIndex--;
    		if(btnIndex<0 ){
    			btnIndex=numBtn-1;
    		}
    		if(btnIndex>=numBtn){
    			btnIndex=0;
    		}
    		console.log(btn[btnIndex]);
    		waiting = 0;
    		
    	}
    	if(btnSurfer.down.isDown && waiting>=10){
    		btnIndex++;
    		if(btnIndex>=numBtn){
    			btnIndex=0;
    		}
    		if(btnIndex<0 ){
    			btnIndex=numBtn-1;
    		}
    		console.log(btn[btnIndex]);
    		waiting = 0;
    		
    	}
    	switch(btnIndex){
    		case 0:
    			btn1.setVisible(false);
    			btn2.setVisible(true);
    			btn3.setVisible(true);
    			btn4.setVisible(true);
    			btn1A.setVisible(true); 
    			btn2A.setVisible(false);
    			btn3A.setVisible(false);
    			btn4A.setVisible(false);
    			break
    		case 1:
    			btn1.setVisible(true);
    			btn2.setVisible(false);
    			btn3.setVisible(true);
    			btn4.setVisible(true);
    			btn1A.setVisible(false); 
    			btn2A.setVisible(true);
    			btn3A.setVisible(false);
    			btn4A.setVisible(false);
        		break
    		case 2:
    			btn1.setVisible(true);
    			btn2.setVisible(true);
    			btn3.setVisible(false);
    			btn4.setVisible(true);
    			btn1A.setVisible(false); 
    			btn2A.setVisible(false);
    			btn3A.setVisible(true);
    			btn4A.setVisible(false);
        		break
    		case 3:
    			btn1.setVisible(true);
    			btn2.setVisible(true);
    			btn3.setVisible(true);
    			btn4.setVisible(false);
    			btn1A.setVisible(false); 
    			btn2A.setVisible(false);
    			btn3A.setVisible(false);
    			btn4A.setVisible(true);
        		break
        	default:
        		break
    	
    	}
    	if((btnSurfer.space.isDown || btnSurfer.intro.isDown) && waiting>=10){
    		if(btnIndex==0){console.log('Action from Btn1'); waiting = 0; startUp(0);}
    		if(btnIndex==1){console.log('Action from Btn2'); waiting = 0; startUp(0);}
    		if(btnIndex==2){console.log('Action from Btn3'); waiting = 0; startUp(0);}
    		if(btnIndex==3){console.log('Action from Btn4'); waiting = 0; startUp(0);}
    	}
    	
    	
    	if(game.global.receivedMsg=='NEW_LEVEL_RETURN'){
        	this.sound.play('button');
			this.cache.tilemap.entries.entries.map.data.layers[0].data = game.global.info.split(',');
			if(btnIndex==0){console.log('Action from Btn1'); this.scene.start('loadScene'); }
			if(btnIndex==1){console.log('Action from Btn2'); this.scene.start('inProgScene');}
			if(btnIndex==2){console.log('Action from Btn3'); this.scene.start('inProgScene');}
			if(btnIndex==3){console.log('Action from Btn4'); this.scene.start('controlsScene');}
			//this.scene.start('loadScene');
			if (game.global.DEBUG_MODE) {
				console.log('[DEBUG] Switching to LoadScene.');
			}
    	}
    }

});
var text;
var score = 0;
var waiting = 10;
var btnSurfer;
var btnIndex = 0
var numBtn = 4;
var btn = ['btn1', 'btn2', 'btn3', 'btn4'];

var config = {
	    type: Phaser.AUTO,
	    scale: {
	        mode: Phaser.Scale.FIT,
	        autoCenter: Phaser.Scale.CENTER_BOTH,
	        width: 1536,
	        height: 864
	    },
	    physics: {
	        default: 'arcade'
	    },
	    scene: [MainScene, LoadScene, GameScene, RankingScene, InProgress, Controls],
	    roundPixels: true
};

game = new Phaser.Game(config);

// GLOBAL VARIABLES
game.global = {
	typeOfGame : 0,
	DEBUG_MODE : true,
	socket : "",
	event : "",
	receivedMsg : "",
	info : "",
	blackHolePosition : 96,
	index : 0,
	length : 1,
	player : [{
		x : 2888,
		y : 8612,
		colorId : 0,
		direction : "idle",
		isAlive: true,
		jump: false,
		ground: false
	},{
		x : 2888,
		y : 3264,
		colorId : 0,
		direction : "idle",
		isAlive: true,
		jump: false,
		ground: false
	}],
	bulletLength : 0,
	bullet : [{
		x : 0,
		y : -9999,
		direction : "right"
	}]
}
