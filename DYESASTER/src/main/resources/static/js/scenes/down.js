var DownScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function DownScene ()
    {
        Phaser.Scene.call(this, { key: 'downScene', active: false });

    },
    preload: function ()
    { 	

    },

    create: function ()
    {   	
		this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, "background");
		this.background.setOrigin(0, 0);
		this.background.setScrollFactor(0);
		
	},
    
    update: function (time, delta) {
    	//CAMBIOS
    	apiRestRoutine();
    	if(serverState){
    		this.scene.start('joinScene');
    		if (game.global.DEBUG_MODE) {
    			console.log('[DEBUG] Switching to joinScene.');
			}
    	}
    	//FIN CAMBIOS

    }

});

