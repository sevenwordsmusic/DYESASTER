var map;
var player=[""];

	
	// WEBSOCKET CONFIGURATOR
	game.global.socket = new WebSocket("ws://"+ip+":8080/dyesaster");
	
	game.global.socket.onopen = () => {
		if (game.global.DEBUG_MODE) {
			console.log('[DEBUG] WebSocket connection opened.');
		}
	}

	game.global.socket.onclose = () => {
		if (game.global.DEBUG_MODE) {
			console.log('[DEBUG] WebSocket connection closed.')
		}
	}
	
	game.global.socket.onmessage = (message) => {
		var msg = JSON.parse(message.data);
		switch (msg.event) {
			case 'NEW_LEVEL_RETURN':
				game.global.receivedMsg=msg.event;
				game.global.index=msg.index;
				game.global.info=msg.tilemap;
				game.global.nPlayers=msg.nPlayers;
				if (game.global.DEBUG_MODE) {
					console.log('[DEBUG] NEW_LEVEL_RETURN new tilemap generated.');
				}
			break
			case 'LOAD_GAMEMATCH':
				game.global.receivedMsg=msg.event;
				if (game.global.DEBUG_MODE) {
					console.log('[DEBUG] LOAD_GAMEMATCH the game has been loaded.');
				}
			break
			//ESTO
			case 'WAITING_ROOM':
				game.global.receivedMsg=msg.event;
				game.global.length=msg.length;
				game.global.info=msg.maxPlayers;
				for(var i=0; i<msg.length; i++) {
					game.global.player[i].nickname=msg.player[i].nickname;
				}
				if (game.global.DEBUG_MODE) {
					console.log('[DEBUG] WAITING_ROOM waiting for players.');
				}
			break
			case 'COUNTDOWN':
				game.global.receivedMsg=msg.event;
				game.global.length=msg.length;
				for(var i=0; i<msg.length; i++) {
					game.global.player[i].nickname=msg.player[i].nickname;
				}
				game.global.info=msg.countdown;
				if (game.global.DEBUG_MODE) {
					console.log('[DEBUG] COUNTDOWN ' + game.global.info);
				}
			break
			//
			case 'START_GAMEMATCH':
				game.global.receivedMsg=msg.event;
				if (game.global.DEBUG_MODE) {
					console.log('[DEBUG] START_GAMEMATCH the game has started.');
				}
			break
			case 'UPDATE_GAMEMATCH':
				game.global.receivedMsg=msg.event;
				game.global.typeOfGame=msg.typeOfGame;
				game.global.blackHolePosition=msg.blackHolePosition;
				game.global.index=msg.index;
				game.global.length=msg.length;
				for(var i=0; i<msg.length; i++) {
					if(game.global.typeOfGame!=0){game.global.player[i].nickname=msg.player[i].nickname;}
					game.global.player[i].x=msg.player[i].posX;
					game.global.player[i].y=msg.player[i].posY;
					game.global.player[i].colorId=msg.player[i].colorId;
					game.global.player[i].direction=msg.player[i].direction;
					game.global.player[i].isAlive=msg.player[i].isAlive;
					game.global.player[i].jump=msg.player[i].isJumping;
					game.global.player[i].ground=msg.player[i].isGrounded;game.global.player[i].score=msg.player[i].score;
					game.global.player[i].bulletScore=msg.player[i].bulletScore;
				}
				game.global.bulletLength=msg.bulletLength;
					for(var i=0; i<msg.bulletLength; i++) {
						if(msg.bullet[i]!=undefined){
							game.global.bullet[i]= {
								x: msg.bullet[i].posX,
								y: msg.bullet[i].posY,
								direction: msg.bullet[i].direction
							}
						}
					}
				if (game.global.DEBUG_MODE) {
					if(game.global.typeOfGame==0){
						console.log('[DEBUG] UPDATE_GAMEMATCH in LOCAL mode.');
					}else{
						console.log('[DEBUG] UPDATE_GAMEMATCH for player #' + msg.id + '.');
					}	
				}
			break
			case 'GAME_OVER':
				game.global.receivedMsg=msg.event;
				game.global.typeOfGame=msg.typeOfGame;
				game.global.blackHolePosition=msg.blackHolePosition;
				game.global.index=msg.index;
				game.global.length=msg.length;
				for(var i=0; i<msg.length; i++) {
					game.global.player[i].nickname=msg.player[i].nickname;
					game.global.player[i].x=msg.player[i].posX;
					game.global.player[i].y=msg.player[i].posY;
					game.global.player[i].colorId=msg.player[i].colorId;
					game.global.player[i].direction=msg.player[i].direction;
					game.global.player[i].isAlive=msg.player[i].isAlive;
					game.global.player[i].jump=msg.player[i].isJumping;
					game.global.player[i].ground=msg.player[i].isGrounded;game.global.player[i].score=msg.player[i].score;
					game.global.player[i].bulletScore=msg.player[i].bulletScore;
				}
				game.global.bulletLength=msg.bulletLength;
					for(var i=0; i<msg.bulletLength; i++) {
						if(msg.bullet[i]!=undefined){
							game.global.bullet[i]= {
								x: msg.bullet[i].posX,
								y: msg.bullet[i].posY,
								direction: msg.bullet[i].direction
							}
						}
					}
					
				console.log(game.global.player);
				if (game.global.DEBUG_MODE) {
					if(game.global.typeOfGame==0){
						console.log('[DEBUG] GAME_OVER in LOCAL mode.');
					}else{
						console.log('[DEBUG] GAME_OVER.');
					}	
				}
			break
			case 'FAIL':


				if (game.global.DEBUG_MODE) {
					if(game.global.typeOfGame==0){
						game.global.event = "FAIL_LOCAL";
						console.log('[DEBUG] FAIL in LOCAL mode.');
					}else{
						game.global.event = "FAIL_GLOBAL";
						console.log('[DEBUG] FAIL.');
					}	
				}
			break
			default :
			break
		}
	}
	
