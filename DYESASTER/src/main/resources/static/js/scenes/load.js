var LoadScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function LoadScene ()
    {
        Phaser.Scene.call(this, { key: 'loadScene', active: false });
    },

    create: function ()
    {
    	startGamematch();
    },
    
    update: function ()
    {
    	if(game.global.receivedMsg=='START_GAMEMATCH'){
			this.scene.start('gameScene');
			if (game.global.DEBUG_MODE) {
				console.log('[DEBUG] Switching to gameScene.');
			}
    	}
    }

});


function startGamematch(){
	let msg = new Object();
	msg.event = 'START_GAMEMATCH';
	game.global.socket.send(JSON.stringify(msg));
}