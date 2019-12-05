var MenuScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function MenuScene ()
    {
        Phaser.Scene.call(this, { key: 'menuScene', active: false });

    },

    create: function ()
    {   
    	
    	//deepTab= this.sound.add('deepTab');
    	//this.sound.play('deepTab', {volume: 0.25});
    	
		this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, "background");
		this.background.setOrigin(0, 0);
		this.background.setScrollFactor(0);
		
    	/*ASÍ ESTABA:
		btn1 = this.add.image(game.config.width/2, game.config.height/2, "LMimg");
		btn2 = this.add.image(game.config.width/2, game.config.height/2+150, "CMimg");
		btn3 = this.add.image(game.config.width/2, game.config.height/2+250, "JGimg");
		btn4 = this.add.image(game.config.width/2, game.config.height/2+350, "Cimg");
		btn1A = this.add.image(game.config.width/2, game.config.height/2, "LMimgA");
		btn2A = this.add.image(game.config.width/2, game.config.height/2+150, "CMimgA");
		btn3A = this.add.image(game.config.width/2, game.config.height/2+250, "JGimgA");
		btn4A = this.add.image(game.config.width/2, game.config.height/2+350, "CimgA");
		this.psts = this.add.image(game.config.width/2, (game.config.height/2)-100, "psts");
		btnSurfer = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.UP, 'down':Phaser.Input.Keyboard.KeyCodes.DOWN, 'space':Phaser.Input.Keyboard.KeyCodes.SPACE, 'enter':Phaser.Input.Keyboard.KeyCodes.ENTER});
		ASÍ LO DEJO:*/		
		for(var i=0; i< 4; i++){
			button[i] = this.add.image(game.config.width/2, game.config.height/2 + (128*i), "menuButton-" + i);
		}
		button[0].setVisible(false);
		for(var i=0; i< 4; i++){
			button_hover[i] = this.add.image(game.config.width/2, game.config.height/2 + (128*i), "menuButton_hover-" + i);
			button_hover[i].setVisible(false);
		}
		button_hover[0].setVisible(true);
		btnSurfer = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.UP, 'down':Phaser.Input.Keyboard.KeyCodes.DOWN, 'space':Phaser.Input.Keyboard.KeyCodes.SPACE, 'enter':Phaser.Input.Keyboard.KeyCodes.ENTER});
   
		var stateServer= document.getElementById("stateServer");
		stateServer.style.display= "block";
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
    			this.scene.start('controlScene');
    			if (game.global.DEBUG_MODE) {
    				console.log('[DEBUG] Switching to controlsScene.');
    			}
    		}else if(btnIndex==2){
    			this.scene.start('joinScene');
    			if (game.global.DEBUG_MODE) {
    				console.log('[DEBUG] Switching to joinScene.');
    			}
    		} else{console.log(btnIndex);
        		startUp(btnIndex);
    		}
    	}
    	if(game.global.receivedMsg=='NEW_LEVEL_RETURN'){
			this.cache.tilemap.entries.entries.map.data.layers[0].data = game.global.info.split(',');
			this.scene.start('loadScene');
			if (game.global.DEBUG_MODE) {
				console.log('[DEBUG] Switching to LoadScene.');
			}
    	} 
    	
    	serverStatus();
		if(game.global.serStatus){
			server="<span>Online</span>";
		}else{
			server="<span>Offline</span>";
		}
		
		serverDiv="<span>Server: </span>"+ server;
    	stateServer.innerHTML= serverDiv;
		
    }

});

var waiting = 10;
var btnIndex = 0;
var button = [];
var button_hover = [];