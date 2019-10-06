var GameScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function GameScene ()
    {
        Phaser.Scene.call(this, { key: 'gameScene', active: true });

    },

    preload: function ()
    {   
		// map made with Tiled in JSON format
		this.load.tilemapTiledJSON('map', 'assets/map.json');  
		
		// tiles in spritesheet 
		this.load.spritesheet('tiles', 'assets/tiles/00.png', {frameWidth: 96, frameHeight: 96});
		// simple coin image
		this.load.image('coin', 'assets/coinGold.png');
		this.load.image('bullet', 'assets/coinGold.png');
		// load all assets tile sprites
		this.load.image('bg-0', 'assets/bg-0.png');
		this.load.image('bg-1', 'assets/bg-1.png');
		this.load.image('bg-2', 'assets/bg-2.png');
		this.load.image('bg-3', 'assets/bg-3.png');
		this.load.image('bg-4', 'assets/bg-4.png');
		this.load.image('bg-5', 'assets/bg-5.png');
		
		this.load.image('blackHole', 'assets/blackHole.png');

		// player animations
		this.load.atlas('player1', 'assets/player.png', 'assets/player.json');
		this.load.atlas('player2', 'assets/player.png', 'assets/player.json'); 
				
    },

    create: function ()
    {
        getNewLevel();
		
    },
    
    update: function ()
    {
    	if(game.global.receivedMsg=='NEW_LEVEL_RETURN'){
			game.global.receivedMsg=null;
			this.cache.tilemap.entries.entries.map.data.layers[0].data = game.global.info.split(',');
			this.scene.start('levelScene');
			if (game.global.DEBUG_MODE) {
				console.log('[DEBUG] Switching to levelScene.');
			}
    	}
    }

});

function getNewLevel(){
	let msg = new Object();
	msg.event = 'NEW_LEVEL';
	game.global.socket.send(JSON.stringify(msg));
}

var config = {
	    type: Phaser.WEBGL,
	    scale: {
	        mode: Phaser.Scale.FIT,
	        autoCenter: Phaser.Scale.CENTER_BOTH,
	        width: 1536,
	        height: 864
	    },
	    physics: {
	        default: 'arcade',
	        arcade: {
	            gravity: { y: 400 },
	            debug: false
	        }
	    },
	    scene: [GameScene, LevelScene],
	    roundPixels: true
	};

var map;
var player1, player2;
var cursors1, cursors2;
var groundLayer, coinLayer;
var text;
var score = 0;

var game = new Phaser.Game(config);
