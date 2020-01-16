var CreditsScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function ControlsScene ()
    {
        Phaser.Scene.call(this, { key: 'creditsScene', active: false });
    },

    preload: function ()
    {
    	
    },
    
    create: function ()
    {
    	btnSurfer1 = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.UP, 'left': Phaser.Input.Keyboard.KeyCodes.LEFT, 'right': Phaser.Input.Keyboard.KeyCodes.RIGHT, 'down':Phaser.Input.Keyboard.KeyCodes.DOWN, 'space':Phaser.Input.Keyboard.KeyCodes.SPACE});

    	this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, "creditos");
		this.background.setOrigin(0, 0);
    },
    
    update: function ()
    {
    	if(btnSurfer1.space.isDown && a+2000<Date.now()){
    		this.scene.start('menuScene');
    		btnIndex = 0;
    		a = Date.now();
    		if (game.global.DEBUG_MODE) {
				console.log('[DEBUG] Switching to Main.'); 
			}
    	}
    }

});