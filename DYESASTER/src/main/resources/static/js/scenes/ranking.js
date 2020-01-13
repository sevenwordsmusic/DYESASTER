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
		
		//Calculo del mvp
		maxPoints = -100;
		for(var i=0; i<2; i++){
			if(game.global.player[i].score+game.global.player[i].bulletScore>maxPoints){ maxPoints = game.global.player[i].score+game.global.player[i].bulletScore ;winner=i+1; }
		}
		this.add.text(game.config.width/2-100, (game.config.height/2),("Winner: Player "+winner),{fontSize:'64px'}).setDepth(5);
		
		//Pintado de puntuaciones
		separacionX = 100; separacionY = 120; interlineado = 50;
		stV1Name=this.add.text(game.config.width/2-100, (game.config.height/2)+separacionY+interlineado*0,"Player 1: ",{fontSize:'48px'}).setDepth(5);
		stV2Name=this.add.text(game.config.width/2-100, (game.config.height/2)+separacionY+interlineado*1,"Player 2: ",{fontSize:'48px'}).setDepth(5);
		stV1=this.add.text((game.config.width/2)+separacionX, (game.config.height/2)+separacionY+interlineado*0,game.global.player[0].score+game.global.player[0].bulletScore,{fontSize:'48px'}).setDepth(5);
		stV2=this.add.text((game.config.width/2)+separacionX, (game.config.height/2)+separacionY+interlineado*1,game.global.player[1].score+game.global.player[1].bulletScore,{fontSize:'48px'}).setDepth(5);

    },
    
    update: function ()
    {
    	if(btnSurfer1.space.isDown && a+2000<Date.now()){
    		this.scene.start('menuScene');
    		btnIndex = 0;
    		console.log("Funciona");
    		a = Date.now();
    		if (game.global.DEBUG_MODE) {
				console.log('[DEBUG] Switching to Main.'); 
			}
    	}
    	stV1.setOrigin(0.5, 0.5);
    	stV2.setOrigin(0.5, 0.5);
    	stV1Name.setOrigin(0.5, 0.5);
    	stV2Name.setOrigin(0.5, 0.5);
    }

});
var maxPoints;
var winner;
var stV1, stV2, stV1Name, stV2Name;
var separacionX;
var separacionY;
var interlineado;