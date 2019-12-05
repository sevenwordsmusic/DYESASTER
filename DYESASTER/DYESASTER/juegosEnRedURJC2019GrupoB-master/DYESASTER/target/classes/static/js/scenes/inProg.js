var InProgress = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function InProgress ()
    {
        Phaser.Scene.call(this, { key: 'inProgScene', active: false });
    },

    preload: function ()
    {
    	this.load.image('wip', 'assets/wip.png');
    	this.load.image('pst', 'assets/pressSpaceTo.png');
    },
    
    create: function ()
    {
    	btnSurfer = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.UP, 'left': Phaser.Input.Keyboard.KeyCodes.LEFT, 'right': Phaser.Input.Keyboard.KeyCodes.RIGHT, 'down':Phaser.Input.Keyboard.KeyCodes.DOWN, 'space':Phaser.Input.Keyboard.KeyCodes.SPACE});

    	this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, "wip");
		this.background.setOrigin(0, 0);
		this.pst = this.add.image(game.config.width/2, (game.config.height/2)+20, "pst");
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