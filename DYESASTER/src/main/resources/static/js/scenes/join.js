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
    	btnSurfer1 = this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.UP, 'left': Phaser.Input.Keyboard.KeyCodes.LEFT, 'right': Phaser.Input.Keyboard.KeyCodes.RIGHT, 'down':Phaser.Input.Keyboard.KeyCodes.DOWN, 'space':Phaser.Input.Keyboard.KeyCodes.SPACE});
    	
		this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, "backgroundVolver");
		this.background.setOrigin(0, 0);
		this.background.setScrollFactor(0);
		
		var userList= document.getElementById("userList");
		userList.style.display= "block";
		
    	serverOn= this.add.image(0, 0, "serverOnline");
    	serverOff= this.add.image(0, 0, "serverOffline");
    	serverOff.setVisible(false);
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
    	if(btnSurfer1.space.isDown && a+2000<Date.now()){
    		userList.style.display= "none";
    		this.scene.start('menuScene');
    		btnIndex = 0;
    		a = Date.now();
    		if (game.global.DEBUG_MODE) {
				console.log('[DEBUG] Switching to Main.'); 
			}
    	}
    	//FIN CAMBIOS
    	
		var userTable= "<table>";
    	for(var i=0; i<playersAndRooms.length; i++){
    		if(playersAndRooms[i].userActive){
    			activeInactive="<i style='color: #00FF00;'>online</i>";
    		}else{
    			activeInactive="<i style='color: #FF7777;'>offline</i>";
    		}
    		userTable+="<tr><td>" + playersAndRooms[i].userNickname + "</td><td>" + activeInactive + "</td></tr>";
    	}
    	userTable+="</table>";
    	userList.innerHTML= userTable;
    }

});

var a = Date.now();