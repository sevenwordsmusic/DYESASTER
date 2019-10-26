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
		
		// player animations
		this.load.atlas('player', 'assets/player.png', 'assets/player.json');
		this.load.atlas('player2', 'assets/player.png', 'assets/player.json');
    },

    create: function ()
    {
    	newGamematch();	
    },
    
    update: function ()
    {
    	if(game.global.receivedMsg=='NEW_LEVEL_RETURN'){
			this.cache.tilemap.entries.entries.map.data.layers[0].data = game.global.info.split(',');
			this.scene.start('gameScene');
			if (game.global.DEBUG_MODE) {
				console.log('[DEBUG] Switching to GameScene.');
			}
    	}
    }

});


function newGamematch(){
	let msg = new Object();
	msg.event = 'GET_GAMEMATCH';
	game.global.socket.send(JSON.stringify(msg));
}

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

var map;
var player=[""];
var cursors;
var text;
var score = 0;

var game = new Phaser.Game(config);

startUp();
