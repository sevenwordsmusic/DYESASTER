var NewScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function NewScene ()
    {
        Phaser.Scene.call(this, { key: 'newScene', active: false });
    },

    create: function ()
    {
    	game.global.typeOfGame=1;
    	
    	nPlayers=1;	//De 1 a 4 (es decir, por equipo)
    	btnIndex=4;	//4 será el índice del botón CREATE, así que luego esto se inicializará a 0 (5 botones, índice 0 a 3 para los de escoger nPlayers y el 4 para el CREATE)
    	btnSurfer = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.UP, 'left': Phaser.Input.Keyboard.KeyCodes.LEFT, 'right': Phaser.Input.Keyboard.KeyCodes.RIGHT, 'down':Phaser.Input.Keyboard.KeyCodes.DOWN, 'space':Phaser.Input.Keyboard.KeyCodes.SPACE});
    	waiting= 10;
    	
    	/*
    	 * 
    	 * LO NECESARIO PARA IMPRIMIR SELECCIONAR 1, 2 ,3 o 4
    	 * Y UN BOTON DE
    	 * 
    	 */
    },
    
    update: function ()
    {
    	waiting++;
    	/*
    	 * 
    	 * LO NECESARIO PARA ESCOGER 1, 2, 3 o 4
    	 * 
    	 */
    	
    	if(btnIndex==4 && btnSurfer.space.isDown && waiting>10){
    		let msg = new Object();
    		msg.event = 'NEW_GAMEMATCH';
    		msg.typeOfGame = game.global.typeOfGame;
    		msg.nPlayers = nPlayers;
        	game.global.socket.send(JSON.stringify(msg));
        	
        	if (game.global.DEBUG_MODE) {
        		console.log('[DEBUG] ' + msg.event + '  waiting for response...');
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