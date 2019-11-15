var LoadScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function LoadScene ()
    {
        Phaser.Scene.call(this, { key: 'loadScene', active: false });
    },

    create: function ()
    {
    	let msg = new Object();
    	msg.event = 'LOAD_GAMEMATCH';
    	game.global.socket.send(JSON.stringify(msg));
    },
    
    update: function ()
    {
    	if(game.global.receivedMsg=='LOAD_GAMEMATCH'){
			this.scene.start('gameScene');
			if (game.global.DEBUG_MODE) {
				console.log('[DEBUG] Switching to gameScene.');
			}
    	}
    }

});