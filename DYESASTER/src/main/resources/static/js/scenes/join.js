var JoinScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function JoinScene ()
    {
        Phaser.Scene.call(this, { key: 'joinScene', active: false });

    },
    preload: function ()
    { 	

    },

    create: function ()
    {   	
		this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, "background");
		this.background.setOrigin(0, 0);
		this.background.setScrollFactor(0);
		
		texto= this.add.text(game.config.width/2, game.config.height/2, 'TEXTO', {fontFamily: 'Verdana'});
	},
    
    update: function (time, delta) {
    	apiRestRoutine();
    	texto.text= playersAndRooms;
    	if(ifafagaggfa==0){
    		console.log(playersAndRooms[1].userActive);
    	}
    	ifafagaggfa++;
    }

});

var ifafagaggfa = 0;