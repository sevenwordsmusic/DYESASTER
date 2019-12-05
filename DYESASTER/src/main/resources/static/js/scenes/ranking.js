var RankingScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function RankingScene ()
    {
        Phaser.Scene.call(this, { key: 'rankingScene', active: false });
    },

    preload: function ()
    {
    	this.load.image('endScreenBackground', 'assets/endScreenBackground.png');
    	this.load.image('pst', 'assets/pressSpaceTo.png');
    	this.load.image('rtm', 'assets/returnToMenu.png');
    },
    
    create: function ()
    {
    	btnSurfer1 = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.UP, 'left': Phaser.Input.Keyboard.KeyCodes.LEFT, 'right': Phaser.Input.Keyboard.KeyCodes.RIGHT, 'down':Phaser.Input.Keyboard.KeyCodes.DOWN, 'space':Phaser.Input.Keyboard.KeyCodes.SPACE});

    	this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, "endScreenBackground");
		this.background.setOrigin(0, 0);
		this.pst = this.add.image(game.config.width/2, (game.config.height/2)+150, "pst");
		this.rtm = this.add.image(game.config.width/2, (game.config.height/2)+200, "rtm");
		
		
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
    }

});