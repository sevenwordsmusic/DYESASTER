var MainScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MainScene ()
    {
        Phaser.Scene.call(this, { key: 'mainScene', active: true });

    },
    preload: function ()
    { 	
		// map made with Tiled in JSON format
		this.load.tilemapTiledJSON('map', 'assets/map.json');  


		// tiles in spritesheet 
		this.load.spritesheet('tiles', 'assets/tiles/00.png', {frameWidth: 96, frameHeight: 96});

		this.load.image('bulletSprite', 'assets/bullet.png');
		// load all assets tile sprites
		this.load.image('bg-0', 'assets/bg-0.png');
		this.load.image('bg-1', 'assets/bg-1.png');
		this.load.image('bg-2', 'assets/bg-2.png');
		this.load.image('bg-3', 'assets/bg-3.png');
		this.load.image('bg-4', 'assets/bg-4.png');
		this.load.image('bg-5', 'assets/bg-5.png');

		this.load.image('background', 'assets/menuBackground.png');
	   	 		
		// player animations
			for(var c=0; c<4; c++){
					this.load.atlas('playerSprite-'+c, 'assets/playerSprite-'+c+'.png', 'assets/player.json');
			}
    },

    create: function ()
    {   
		this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, "background");
		this.background.setOrigin(0, 0);
		this.background.setScrollFactor(0);
    },
    
    update: function ()
    {
    	if(game.global.receivedMsg=='NEW_LEVEL_RETURN'){
			this.cache.tilemap.entries.entries.map.data.layers[0].data = game.global.info.split(',');
			this.scene.start('loadScene');
			if (game.global.DEBUG_MODE) {
				console.log('[DEBUG] Switching to LoadScene.');
			}
    	}
    }

});
var text;
var score = 0;

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
	    scene: [MainScene, LoadScene, GameScene],
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
		isAlive: true
	},{
		x : 2888,
		y : 3264,
		colorId : 0,
		direction : "idle",
		isAlive: true
	}],
	bulletLength : 0,
	bullet : [{
		x : 0,
		y : -9999,
		direction : "right"
	}]
}
