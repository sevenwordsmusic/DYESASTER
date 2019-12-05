var ControlsScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function ControlsScene ()
    {
        Phaser.Scene.call(this, { key: 'controlsScene', active: false });
    },

    preload: function ()
    {
    	this.load.image('control', 'assets/Controles.png');
    	this.load.image('pst', 'assets/pressSpaceTo.png');
    	this.load.image('rtm', 'assets/returnToMenu.png');
    },
    
    create: function ()
    {
    	btnSurfer = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.UP, 'left': Phaser.Input.Keyboard.KeyCodes.LEFT, 'right': Phaser.Input.Keyboard.KeyCodes.RIGHT, 'down':Phaser.Input.Keyboard.KeyCodes.DOWN, 'space':Phaser.Input.Keyboard.KeyCodes.SPACE});

    	this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, "control");
		this.background.setOrigin(0, 0);
		this.pst = this.add.image(game.config.width/2, (game.config.height/2)+200, "pst");
		this.rtm = this.add.image(game.config.width/2, (game.config.height/2)+250, "rtm");
		//this.background.setOrigin(0, 0);
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