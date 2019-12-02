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
		
		this.load.image('mainButton','assets/buttons/localMatch.png');	//ESTE
		this.load.image('menuButton-0','assets/buttons/localMatch.png');
		this.load.image('menuButton-1','assets/buttons/newGame.png');
		this.load.image('menuButton-2','assets/buttons/joinGame.png');
		this.load.image('menuButton-3','assets/buttons/controls.png');
		this.load.image('menuButton_hover-0','assets/buttons/localMatchHover.png');
		this.load.image('menuButton_hover-1','assets/buttons/newGameHover.png');
		this.load.image('menuButton_hover-2','assets/buttons/joinGameHover.png');
		this.load.image('menuButton_hover-3','assets/buttons/controlsHover.png');
		
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
    	
    	//deepTab= this.sound.add('deepTab');
    	//this.sound.play('deepTab', {volume: 0.25});
    	this.sound.add('button');
    	this.sound.add('jump');
    	this.sound.add('bump');
    	this.sound.add('punch');
    	this.sound.add('shoot');
    	this.sound.add('steps');
    	
		this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, "background");
		this.background.setOrigin(0, 0);
		this.background.setScrollFactor(0);
		
		mainButton = this.add.image(game.config.width/2, game.config.height/2 + 128, "mainButton");
		btnSurfer = this.input.keyboard.addKeys({ 'space':Phaser.Input.Keyboard.KeyCodes.SPACE, 'enter':Phaser.Input.Keyboard.KeyCodes.ENTER});
		
		var nickname= document.getElementById("nickname");
		nickname.style.display= "block";
    },
    
    update: function (time, delta) {
    	if(btnSurfer.space.isDown || btnSurfer.enter.isDown){
    		if(nickname.value.length>0){
    			if(createUser(nickname.value)){
	    			nickname.style.display= "none";
	        		this.sound.play('button');
	    			this.scene.start('menuScene');
	    			if (game.global.DEBUG_MODE) {
	    				console.log('[DEBUG] Switching to menuScene.');
	    			}
    			}else{
    				//EL USUARIO YA EXISTE O NO SE HA PODIDO CONECTAR CON EL SERVIDOR
    			}
    		}
    	}
    }

});

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
	    scene: [MainScene, MenuScene, JoinScene, LoadScene, GameScene, RankingScene, InProgress, ControlsScene, DownScene],
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
