var LoadScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function LoadScene ()
    {
        Phaser.Scene.call(this, { key: 'loadScene', active: false });
    },

    create: function ()
    {
    	this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, "loadBackground");
		this.background.setOrigin(0, 0);
		this.background.setScrollFactor(0);
		
    	let msg = new Object();
    	msg.event = 'LOAD_GAMEMATCH';
    	game.global.socket.send(JSON.stringify(msg));
    	onCountDown=false;
    },
    
    update: function ()
    {
    	console.log(game.global.event);
    	if(game.global.typeOfGame==0){game.global.player[0].nickname = "LeftP"; game.global.player[1].nickname = "RightP";}
    	if(game.global.receivedMsg=='LOAD_GAMEMATCH' && !onCountDown){
        	let msg = new Object();
        	msg.event = 'START_GAMEMATCH';
        	msg.nickname = userNickname;
        	game.global.socket.send(JSON.stringify(msg));
    	}else if(game.global.receivedMsg=='WAITING_ROOM' && !onCountDown){
    		console.log("TOTAL JUGADORES: " + game.global.info);
    		console.log("CONECTADOS: " + game.global.length);
    		console.log("LAST EVENT: "+game.global.event);
    		for(var i=0; i<game.global.length; i++){
    			this.add.image( 370 + i * 370, game.config.height/2 , "playerJoin" + (i+1)).setOrigin(0.5, 0.5);
    			this.add.text(320 + i * 370, game.config.height/2 + 180, game.global.player[i].nickname, { fontFamily: '"Impact"', fontSize: "40px", color: "#00ffff"  }).setOrigin(0.5, 0.5);
    			
    			console.log("NICKNAMES: " + game.global.player[i].nickname);
    		}
    		//ESTO ES LA ESPERA
    		
    		
    		
    		//
    	}else if(game.global.receivedMsg=='COUNTDOWN'){
    		if(game.global.info==1){
    			onCountDown=true;
    		}
    		console.log("CONECTADOS: " + game.global.length);
    		for(var i=0; i<game.global.length; i++){
    			console.log("NICKNAMES: " + game.global.player[i].nickname);
    		}
    		console.log("CUENTA: " + game.global.info);
    		//ESTO ES LA CUENTA ATRÁS
    		

    		
    		//
    	}else if(game.global.receivedMsg=='UPDATE_GAMEMATCH'){
			this.scene.start('gameScene');
			if (game.global.DEBUG_MODE) {
				console.log('[DEBUG] Switching to gameScene.');
			}
    	}
    }

});