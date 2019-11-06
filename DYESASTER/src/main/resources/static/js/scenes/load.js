var LoadScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function LoadScene ()
    {
        Phaser.Scene.call(this, { key: 'loadScene', active: false });
    },

    create: function ()
    {
    	this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, "controls");
		this.background.setOrigin(0, 0);

    	this.countdown_3 = this.add.image(game.config.width/2, game.config.height/2, "3");
    	
    	
    	let msg = new Object();
    	msg.event = 'LOAD_GAMEMATCH';
    	game.global.socket.send(JSON.stringify(msg));
    },
    
    update: function ()
    {
    	if(game.global.receivedMsg=='LOAD_GAMEMATCH' && game.global.info=='2'){
    		this.countdown_3.destroy();
    		this.countdown_2 = this.add.image(game.config.width/2, game.config.height/2, "2");
		}else if(game.global.receivedMsg=='LOAD_GAMEMATCH' && game.global.info=='1'){
    		this.countdown_2.destroy();
			this.countdown_1 = this.add.image(game.config.width/2, game.config.height/2, "1");
		}else if(game.global.receivedMsg=='LOAD_GAMEMATCH'){
			this.scene.start('gameScene');
			if (game.global.DEBUG_MODE) {
				console.log('[DEBUG] Switching to gameScene.');
			}
    	}
    	game.global.receivedMsg=null;
    }

});