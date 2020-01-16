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
          
		
		// load all assets tile sprites
		this.load.image('bg-0', 'assets/bg-0.png');
		this.load.image('bg-1', 'assets/bg-1.png');
		this.load.image('bg-2', 'assets/bg-2.png');
		this.load.image('bg-3', 'assets/bg-3.png');
		this.load.image('bg-4', 'assets/separador.png');
		

		// map made with Tiled in JSON format
		this.load.tilemapTiledJSON('map', 'assets/map.json');  

		// tiles in spritesheet 
		this.load.spritesheet('tiles', 'assets/tiles/00.png', {frameWidth: 96, frameHeight: 96});
		this.load.image('bulletSprite', 'assets/bullet.png');
		
		
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

		this.load.image('menuButton-4','assets/buttons/credits.png');
		this.load.image('menuButton_hover-4','assets/buttons/creditsHover.png');
		
		this.load.image('incPasButton','assets/wrongPS.png');
		
		this.load.image('psts', 'assets/pressSpaceToSelect.png');
		
		//this.load.spritesheet('HUDSelect','assets/HUDAnim.png',{ frameWidth: 70, frameHeight: 60 });
		this.load.image('endScreenBackground','assets/endScreenBackground.png');
		this.load.image('background', 'assets/menuBackground.png');
		this.load.image('backgroundVolver', 'assets/menuBackgroundVolver.png');
		this.load.image('ServerOff', 'assets/ServerOff.png');
		this.load.image('serverOffline', 'assets/serverOffline.png');
		this.load.image('serverOnline', 'assets/serverOnline.png');
		this.load.image('loadBackground', 'assets/waiting.png');
		this.load.image('newBackground', 'assets/chooseYourRoom.png');
		this.load.image('creditos', 'assets/creditos.png');
		this.load.image('fail', 'assets/fail.png');
		
		//LoadAssets
		this.load.image('playerJoin1', 'assets/playerJoin1.png');
		this.load.image('playerJoin2', 'assets/playerJoin2.png');
		this.load.image('playerJoin3', 'assets/playerJoin3.png');
		this.load.image('playerJoin4', 'assets/playerJoin4.png');
		//this.load.bitmapFont('myfont', 'assets/font.png', 'assets/font.fnt');
	   	 
		// player animations
			for(var c=0; c<4; c++){
					this.load.atlas('playerSprite-'+c, 'assets/playerSprite-'+c+'.png', 'assets/player.json');
			}
			
    },

    create: function ()
    {   
    	serverOn= this.add.image(0, 0, "serverOnline");
    	serverOff= this.add.image(0, 0, "serverOffline");
    	serverOff.setVisible(false);
    	
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
		
		incorrect = this.add.image(game.config.width/2, game.config.height/2 + 300, "incPasButton");
		btnSurfer = this.input.keyboard.addKeys({ 'space':Phaser.Input.Keyboard.KeyCodes.SPACE, 'enter':Phaser.Input.Keyboard.KeyCodes.ENTER});
		
		//cambios
		var nickname=document.getElementById("nickname");
		var password=document.getElementById("password");
		nickname.style.display= "block";
		password.style.display= "block";
		
		var waitingLog=10;
		
		//game.global.ipServer=prompt("Introducir IP del servidor: ", ip);
		
    },
    
    update: function (time, delta) {
    	apiRestRoutine();
    	waitingLog++;
    	if((btnSurfer.space.isDown || btnSurfer.enter.isDown ) && waitingLog>10){
    		waitingLog=0;
    		if(nickname.value.length>0 && password.value.length>0){
    	        var item = {
    	                id: -1,
    	                success: false
    	        }
    	        createUser(item, function (itemWithId) {
    	        	sessionStart(itemWithId);
    	        });
    		}
    	}
		if(success){
	    	
	    	deepTab= this.sound.add('deepTab');
	    	this.sound.play('deepTab', {volume: 0.25, loop: true});
	    	
    		nickname.style.display= "none";
    		password.style.display= "none";
    		this.sound.play('button');
    		this.scene.start('menuScene');
    		if (game.global.DEBUG_MODE) {
    			console.log('[DEBUG] Switching to menuScene.');
    		}
		}
		
		game.global.tempaux++;
		if(game.global.incPas){
			incorrect.setVisible(true);
			if(!restart){game.global.tempaux = 0; restart = true;}
			if(game.global.tempaux > game.global.temp){
				restart = false;
				incorrect.setVisible(false);
				game.global.incPas=false;
			}
		}else{
			incorrect.setVisible(false);
		}	
    }

});
//fin de cambios


var config = {
	    type: Phaser.AUTO,
	    scale: {
	        mode: Phaser.Scale.FIT,
	        autoCenter: Phaser.Scale.CENTER_BOTH,
	        width: 1920,
	        height: 1080
	    },
	    physics: {
	        default: 'arcade'
	    },
	    scene: [MainScene, MenuScene, NewScene, JoinScene, LoadScene, GameScene, RankingScene, InProgress, ControlsScene,CreditsScene, PlayerDesconectionScene ,DownScene],
	    roundPixels: true
};

game = new Phaser.Game(config);

// GLOBAL VARIABLES
game.global = {
	typeOfGame : 0,
	nPlayers : 2,
	DEBUG_MODE : true,
	socket : "",
	event : "",
	receivedMsg : "",
	info : "",
	blackHolePosition : 96,
	index : 0,
	length : 1,
	incPas: false,
	temp: 170,
	tempaux: 0,
	teamScore:[0,0],
	nJugadoresSala: 2,
	player : [{
		x : 0,
		y : 0,
		colorId : 0,
		direction : "idle",
		isAlive: false,
		jump: false,
		ground: false,
		nickname: "",
		score: 0,
		bulletScore: 0,
	},{
		x : 0,
		y : 0,
		colorId : 0,
		direction : "idle",
		isAlive: false,
		jump: false,
		ground: false,
		nickname: "",
		score: 0,
		bulletScore: 0,
	},{
		x : 0,
		y : 0,
		colorId : 0,
		direction : "idle",
		isAlive: false,
		jump: false,
		ground: false,
		nickname: "",
		score: 0,
		bulletScore: 0,
	},{
		x : 0,
		y : 0,
		colorId : 0,
		direction : "idle",
		isAlive: false,
		jump: false,
		ground: false,
		nickname: "",
		score: 0,
		bulletScore: 0,
	},{
		x : 0,
		y : 0,
		colorId : 0,
		direction : "idle",
		isAlive: false,
		jump: false,
		ground: false,
		nickname: "",
		score: 0,
		bulletScore: 0,
	},{
		x : 0,
		y : 0,
		colorId : 0,
		direction : "idle",
		isAlive: false,
		jump: false,
		ground: false,
		nickname: "",
		score: 0,
		bulletScore: 0,
	},{
		x : 0,
		y : 0,
		colorId : 0,
		direction : "idle",
		isAlive: false,
		jump: false,
		ground: false,
		nickname: "",
		score: 0,
		bulletScore: 0,
	},{
		x : 0,
		y : 0,
		colorId : 0,
		direction : "idle",
		isAlive: false,
		jump: false,
		ground: false,
		nickname: "",
		score: 0,
		bulletScore: 0
	}],
	bulletLength : 0,
	bullet : [{
		x : 0,
		y : -9999,
		direction : "right"
	}]
}
var gameRestart= game.global;
var incorrect;
var restart = false;