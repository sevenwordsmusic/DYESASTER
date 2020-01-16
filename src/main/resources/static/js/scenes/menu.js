var MenuScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MenuScene ()
    {
        Phaser.Scene.call(this, { key: 'menuScene', active: false });

    },

    create: function ()
    {   
    	
		this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, "background");
		this.background.setOrigin(0, 0);
		this.background.setScrollFactor(0);
		
    	serverOn= this.add.image(0, 0, "serverOnline");
    	serverOff= this.add.image(0, 0, "serverOffline");
    	serverOff.setVisible(false);
    		
		for(var i=0; i< 5; i++){
			button[i] = this.add.image(game.config.width/2, game.config.height/2 + (100*i), "menuButton-" + i);
		}
		button[0].setVisible(false);
		for(var i=0; i< 5; i++){
			button_hover[i] = this.add.image(game.config.width/2, game.config.height/2 + (100*i), "menuButton_hover-" + i);
			button_hover[i].setVisible(false);
		}
		button_hover[0].setVisible(true);
		btnSurfer = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.UP, 'down':Phaser.Input.Keyboard.KeyCodes.DOWN, 'space':Phaser.Input.Keyboard.KeyCodes.SPACE, 'enter':Phaser.Input.Keyboard.KeyCodes.ENTER});
    },
    
    update: function (time, delta) {
    	apiRestRoutine();
    	waiting++;
    	if(btnSurfer.up.isDown && waiting>10){
    		button_hover[btnIndex].setVisible(false);
    		button[btnIndex].setVisible(true);
    		btnIndex--;
    		if(btnIndex<0){
    			btnIndex=button.length-1;
    		}
    		button[btnIndex].setVisible(false);
    		button_hover[btnIndex].setVisible(true);
    		waiting = 0;
    	}
    	if(btnSurfer.down.isDown && waiting>10){
    		button_hover[btnIndex].setVisible(false);
    		button[btnIndex].setVisible(true);
    		btnIndex++;
    		if(btnIndex>button.length-1){
    			btnIndex=0;
    		}
    		button[btnIndex].setVisible(false);
    		button_hover[btnIndex].setVisible(true);
    		waiting = 0;	
    	}
    	
    
    	if((btnSurfer.space.isDown || btnSurfer.enter.isDown) && waiting>10){
    		this.sound.play('button');
    		waiting = 0;
    		if(btnIndex==3){
    			this.scene.start('controlsScene');
    			if (game.global.DEBUG_MODE) {
    				console.log('[DEBUG] Switching to controlsScene.');
    			}
    		}else if(btnIndex==2){
    			this.scene.start('joinScene');
    			if (game.global.DEBUG_MODE) {
    				console.log('[DEBUG] Switching to joinScene.');
    			}
    		}else if(btnIndex==4){
    			this.scene.start('creditsScene');
    			if (game.global.DEBUG_MODE) {
    				console.log('[DEBUG] Switching to creditsScene.');
    			}
    		}else if(btnIndex==1){
    			this.scene.start('newScene');
    			if (game.global.DEBUG_MODE) {
    				console.log('[DEBUG] Switching to newScene.');
    			}
    		}else {
    				game.global.typeOfGame=0;
    				let msg = new Object();
    				msg.event = 'NEW_LOCAL_GAMEMATCH';

    				msg.typeOfGame = game.global.typeOfGame;
    				game.global.socket.send(JSON.stringify(msg));
    				
    				if (game.global.DEBUG_MODE) {
    					console.log('[DEBUG] ' + msg.event + '  waiting for response...');
    				}
    				
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

var waiting = 10;
var btnIndex = 0;
var button = [];
var button_hover = [];