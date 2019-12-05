var RankingScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function RankingScene ()
    {
        Phaser.Scene.call(this, { key: 'rankingScene', active: false });
    },

    preload: function ()
    {
    	this.load.image('endScreenBackground', 'assets/bgGameOver.png');
    	this.load.image('pst', 'assets/pressSpaceTo.png');
    	this.load.image('rtm', 'assets/returnToMenu.png');
    	//this.load.image('p1', 'assets/player1.png');
    	//this.load.image('p2', 'assets/player2.png');
    },
    
    create: function ()
    {
    	btnSurfer = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.UP, 'left': Phaser.Input.Keyboard.KeyCodes.LEFT, 'right': Phaser.Input.Keyboard.KeyCodes.RIGHT, 'down':Phaser.Input.Keyboard.KeyCodes.DOWN, 'space':Phaser.Input.Keyboard.KeyCodes.SPACE});

    	this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, "endScreenBackground");
		this.background.setOrigin(0, 0);
		this.pst = this.add.image(game.config.width/2, (game.config.height/2)+150, "pst");
		this.rtm = this.add.image(game.config.width/2, (game.config.height/2)+200, "rtm");
		/*if(game.global.player[0].isAlive){
			p1.setVisible(true);
		}
		if(game.global.player[1].isAlive){
			p2.setVisible(true);
		}*/
		
    },
    
    update: function ()
    {
    	if(btnSurfer.space.isDown){
    		window.location.reload(true);
			if (game.global.DEBUG_MODE) {
				console.log('[DEBUG] Switching to load.');
			}
    	}
    }

});