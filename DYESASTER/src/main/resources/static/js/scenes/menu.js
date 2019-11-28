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
    },
    
    update: function (time, delta) {
    	apiRestRoutine();
    	/*ASÍ ESTABA:
    	waiting++;
    	if(btnSurfer.up.isDown && waiting>=10){
    		btnIndex--;
    		if(btnIndex<0 ){
    			btnIndex=numBtn-1;
    		}
    		if(btnIndex>=numBtn){
    			btnIndex=0;
    		}
    		console.log(btn[btnIndex]);
    		waiting = 0;
    		
    	}
    	if(btnSurfer.down.isDown && waiting>=10){
    		btnIndex++;
    		if(btnIndex>=numBtn){
    			btnIndex=0;
    		}
    		if(btnIndex<0 ){
    			btnIndex=numBtn-1;
    		}
    		console.log(btn[btnIndex]);
    		waiting = 0;
    		
    	}    
    	switch(btnIndex){
    		case 0:
    			btn1.setVisible(false);
    			btn2.setVisible(true);
    			btn3.setVisible(true);
    			btn4.setVisible(true);
    			btn1A.setVisible(true); 
    			btn2A.setVisible(false);
    			btn3A.setVisible(false);
    			btn4A.setVisible(false);
    			break
    		case 1:
    			btn1.setVisible(true);
    			btn2.setVisible(false);
    			btn3.setVisible(true);
    			btn4.setVisible(true);
    			btn1A.setVisible(false); 
    			btn2A.setVisible(true);
    			btn3A.setVisible(false);
    			btn4A.setVisible(false);
        		break
    		case 2:
    			btn1.setVisible(true);
    			btn2.setVisible(true);
    			btn3.setVisible(false);
    			btn4.setVisible(true);
    			btn1A.setVisible(false); 
    			btn2A.setVisible(false);
    			btn3A.setVisible(true);
    			btn4A.setVisible(false);
        		break
    		case 3:
    			btn1.setVisible(true);
    			btn2.setVisible(true);
    			btn3.setVisible(true);
    			btn4.setVisible(false);
    			btn1A.setVisible(false); 
    			btn2A.setVisible(false);
    			btn3A.setVisible(false);
    			btn4A.setVisible(true);
        		break
        	default:
        		break
    	
    	}
    	ASÍ LO DEJO:*/
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
    	
    	/*ASÍ ESTABA:
    	if((btnSurfer.space.isDown || btnSurfer.intro.isDown) && waiting>=10){
    		if(btnIndex==0){console.log('Action from Btn1'); waiting = 0; startUp(0);}
    		if(btnIndex==1){console.log('Action from Btn2'); waiting = 0; startUp(0);}
    		if(btnIndex==2){console.log('Action from Btn3'); waiting = 0; startUp(0);}
    		if(btnIndex==3){console.log('Action from Btn4'); waiting = 0; startUp(0);}
    	}
    	if(game.global.receivedMsg=='NEW_LEVEL_RETURN'){
        	this.sound.play('button');
			this.cache.tilemap.entries.entries.map.data.layers[0].data = game.global.info.split(',');
			if(btnIndex==0){console.log('Action from Btn1'); this.scene.start('loadScene'); }
			if(btnIndex==1){console.log('Action from Btn2'); this.scene.start('loadScene');}
			if(btnIndex==2){console.log('Action from Btn3'); this.scene.start('inProgScene');}
			if(btnIndex==3){console.log('Action from Btn4'); this.scene.start('controlsScene');}
			//this.scene.start('loadScene');
			if (game.global.DEBUG_MODE) {
				console.log('[DEBUG] Switching to LoadScene.');
			}
    	}    	
    	ASÍ LO DEJO*/
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
    }

});

var waiting = 10;
var btnIndex = 0;
var button = [];
var button_hover = [];