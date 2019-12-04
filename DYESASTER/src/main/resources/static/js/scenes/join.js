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
		
		var userList= document.getElementById("userList");
		userList.style.display= "block";
	},
    
    update: function (time, delta) {
    	//CAMBIOS
    	apiRestRoutine();
    	if(!serverState){
	    	userList.style.display= "none";
			this.scene.start('downScene');
			if (game.global.DEBUG_MODE) {
				console.log('[DEBUG] Switching to downScene.');
			}
    	}
    	//FIN CAMBIOS
    	
		var userTable= "<table>";
    	for(var i=0; i<playersAndRooms.length; i++){
    		userTable+="<tr><td>" + playersAndRooms[i].userNickname + "</td><td>" + playersAndRooms[i].userActive + "</td></tr>";
    	}
    	userTable+="</table>";
    	userList.innerHTML= userTable;
    }

});

