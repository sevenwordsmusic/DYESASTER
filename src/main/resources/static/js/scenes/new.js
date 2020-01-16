var NewScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function NewScene ()
    {
        Phaser.Scene.call(this, { key: 'newScene', active: false });
    },

    create: function ()
    {

    	this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, "newBackground");
		this.background.setOrigin(0, 0);
		this.background.setScrollFactor(0);
		
    	game.global.typeOfGame=1;
    	nPlayers=3;
    	done=false;
    	btnSurfer = this.input.keyboard.addKeys({ 'two': Phaser.Input.Keyboard.KeyCodes.TWO,'three': Phaser.Input.Keyboard.KeyCodes.THREE,'four': Phaser.Input.Keyboard.KeyCodes.FOUR, 'space':Phaser.Input.Keyboard.KeyCodes.SPACE});
    	waiting= 10;    	
    },
    
    update: function ()
    {
    	waiting++;

    	if(btnSurfer.two.isDown && waiting>10 && !done){
    		game.global.nJugadoresSala=2;
        	done=newGamematch(2);
    	}else if(btnSurfer.three.isDown && waiting>10 && !done){
    		game.global.nJugadoresSala=3;
    		done=newGamematch(3);
    	}else if(btnSurfer.four.isDown && waiting>10 && !done){
    		game.global.nJugadoresSala=4;
    		done=newGamematch(4);
    	}else if(btnSurfer.space.isDown && waiting>10 && !done){
    		done=true;
    		this.scene.start('menuScene');
    		if (game.global.DEBUG_MODE) {
				console.log('[DEBUG] Switching to Main.'); 
			}
    	}

    	if(game.global.receivedMsg=='NEW_LEVEL_RETURN'){
			this.cache.tilemap.entries.entries.map.data.layers[0].data = game.global.info.split(',');
			this.scene.start('loadScene');
			if (game.global.DEBUG_MODE) {
				console.log('[DEBUG] Switching to LoadScene.');
			}
    	}  

    }

});

function newGamematch(n){
	let msg = new Object();
	msg.event = 'NEW_GAMEMATCH';
	msg.typeOfGame = game.global.typeOfGame;
	msg.nPlayers = n;
	game.global.socket.send(JSON.stringify(msg));
	
	if (game.global.DEBUG_MODE) {
		console.log('[DEBUG] ' + msg.event + '  waiting for response...');
	}
	return true;
}