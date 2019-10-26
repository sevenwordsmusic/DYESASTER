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
			for(var c=0; c<4; c++){
					this.load.atlas('playerSprite-'+c, 'assets/playerSprite-'+c+'.png', 'assets/player.json');
			}
    },

    create: function ()
    {
    	let msg = new Object();
    	msg.event = 'NEW_GAMEMATCH';
    	msg.typeOfGame = game.global.typeOfGame;
    	if(game.global.typeOfGame=2){
    		msg.gameMatch_code=document.getElementById("gameMatch_code").value;
    	}  	
    	game.global.socket.send(JSON.stringify(msg));
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
