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
    	this.background = this.add.tileSprite(0, 0, game.config.width, game.config.height, "background");
		this.background.setOrigin(0, 0);
		this.background.setScrollFactor(0);
		
		var userList= document.getElementById("userList");
		userList.style.display= "block";
		
		var stateServer= document.getElementById("stateServer");
		stateServer.style.display= "block";
		
	},
    
    update: function (time, delta) {
    	//CAMBIOS
    	apiRestRoutine();
    	if(btnSurfer1.space.isDown && a+2000<Date.now()){
    		userList.style.display= "none";
    		this.scene.start('menuScene');
    		btnIndex = 0;
    		a = Date.now();
    		if (game.global.DEBUG_MODE) {
				console.log('[DEBUG] Switching to Main.'); 
			}
    	}
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
    	
    	var userTable= "<table>";
		var serverDiv;
		var display;
		var server;
		
		
    	for(var i=0; i<playersAndRooms.length; i++){
    		
    		if(playersAndRooms[i].userActive){
    			display="<span>Online</span>";
    		}else{
    			display="<span>Offline</span>";
    		}
    		
    		userTable+="<tr><td>" + playersAndRooms[i].userNickname + "<span>: </span>" + display + "</td></tr>";
    	}
    	
    	serverStatus(activado);
		if(game.global.serStatus){
			server="<span>Online</span>";
		}else{
			server="<span>Offline</span>";
		}
		
    	userTable+="</table>";
    	userList.innerHTML= userTable;//*/
    	
    	serverDiv="<span>Server: </span>"+ server;
    	stateServer.innerHTML= serverDiv;
    	
    }

});
var a = Date.now();
var activado = false;