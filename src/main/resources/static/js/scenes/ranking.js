var RankingScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function RankingScene ()
    {
        Phaser.Scene.call(this, { key: 'rankingScene', active: false });
    },

    preload: function ()
    {
    	
    },
    
    create: function ()
    {
    	btnSurfer1 = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.UP, 'left': Phaser.Input.Keyboard.KeyCodes.LEFT, 'right': Phaser.Input.Keyboard.KeyCodes.RIGHT, 'down':Phaser.Input.Keyboard.KeyCodes.DOWN, 'space':Phaser.Input.Keyboard.KeyCodes.SPACE});

    	this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, "endScreenBackground");
		this.background.setOrigin(0, 0);
		
		if(game.global.typeOfGame==0){game.global.player[0].nickname = "Left Player"; game.global.player[1].nickname = "Right Player";}
		//Calculo del MVP y lastSurvivor
		maxPoints = -100;
		for(var i=0; i<game.global.nJugadoresSala; i++){
			if(game.global.player[i].score+game.global.player[i].bulletScore>maxPoints){ maxPoints = game.global.player[i].score+game.global.player[i].bulletScore ;mvp=game.global.player[i].nickname; }
			if(game.global.player[i].isAlive){lastSurvivor = game.global.player[i].nickname; empate = false;}
		}
		if(empate){
			lastSurvivor="No Survivors";
		}
		
		this.add.text((game.config.width/2)-370, (game.config.height/2)+170,mvp,{fontSize:'64px'}).setOrigin(0.5,0.5);
		this.add.text((game.config.width/2)-370, (game.config.height/2)-60,lastSurvivor,{fontSize:'64px'}).setOrigin(0.5,0.5);
		
		
		
		//Pintado de puntuaciones
		separacionX = 350; separacionY = 0; interlineado = 80;
		stV1Name=this.add.text((game.config.width/2)+separacionX, 
				(game.config.height/2)+separacionY+interlineado*0,
				game.global.player[0].nickname+": "+(game.global.player[0].score+game.global.player[0].bulletScore),
				{fontSize:'64px'}).setDepth(5);
		/*stV1=this.add.text(
				(game.config.width/2)+separacionX, 
				(game.config.height/2)+separacionY+interlineado*0,
				(game.global.player[0].score+game.global.player[0].bulletScore),
				{fontSize:'48px'}).setDepth(5);*/
		stV2Name=this.add.text((game.config.width/2)+separacionX,
				(game.config.height/2)+separacionY+interlineado*1,
				game.global.player[1].nickname+": "+(game.global.player[1].score+game.global.player[1].bulletScore),
				{fontSize:'64px'}).setDepth(5);
		/*stV2=this.add.text((game.config.width/2)+separacionX, 
				(game.config.height/2)+separacionY+interlineado*1,
				(game.global.player[1].score+game.global.player[1].bulletScore),
				{fontSize:'48px'}).setDepth(5);stV1.setOrigin(0.5, 0.5);*/
		    	
				/*stV1.setOrigin(0.5, 0.5);
		    	stV2.setOrigin(0.5, 0.5);*/
		    	stV1Name.setOrigin(0.5, 0.5);
		    	stV2Name.setOrigin(0.5, 0.5);
		
		if(game.global.nJugadoresSala==3||game.global.nJugadoresSala==4){
			stV3Name=this.add.text((game.config.width/2)+separacionX, 
					(game.config.height/2)+separacionY+interlineado*2,
					game.global.player[2].nickname+": "+(game.global.player[2].score+game.global.player[2].bulletScore),
					{fontSize:'64px'}).setDepth(5);
			/*stV3=this.add.text(
					(game.config.width/2)+separacionX, 
					(game.config.height/2)+separacionY+interlineado*2,
					game.global.player[2].score+game.global.player[2].bulletScore,
					{fontSize:'48px'}).setDepth(5);*/
			//stV3.setOrigin(0.5, 0.5);
			stV3Name.setOrigin(0.5, 0.5);
		}
		if(game.global.nJugadoresSala==4){
			stV4Name=this.add.text((game.config.width/2)+separacionX, 
					(game.config.height/2)+separacionY+interlineado*3,
					game.global.player[3].nickname+": "+(game.global.player[3].score+game.global.player[3].bulletScore),
					{fontSize:'64px'}).setDepth(5);
			/*stV4=this.add.text((game.config.width/2)+separacionX, 
					(game.config.height/2)+separacionY+interlineado*3,
					game.global.player[3].score+game.global.player[3].bulletScore,
					{fontSize:'48px'}).setDepth(5);*/
			//stV4.setOrigin(0.5, 0.5);
			stV4Name.setOrigin(0.5, 0.5);
		}
		console.log(game.global.player[0].nickname+" "+game.global.player[0].isAlive);
		console.log(game.global.player[1].nickname+" "+game.global.player[1].isAlive);
		console.log(game.global.player[2].nickname+" "+game.global.player[2].isAlive);
		console.log(game.global.player[3].nickname+" "+game.global.player[3].isAlive);
    },
    
    update: function ()
    {
    	if(btnSurfer1.space.isDown && a+2000<Date.now()){
    		game.global=gameRestart;
    		this.scene.start('menuScene');
    		btnIndex = 0;
    		a = Date.now();
    		if (game.global.DEBUG_MODE) {
				console.log('[DEBUG] Switching to Menu.'); 
			}
    	}
    }

});
var maxPoints, maxTime;
var mvp, lastSurvivor;
var stV1, stV2, stV1Name, stV2Name, stV3, stV4, stV3Name, stV4Name;
var separacionX;
var separacionY;
var interlineado;
var empate=true;