//var ip = "192.168.0.176"
var ip = "127.0.0.1";
var map;
var player=[""];

function startUp(typeOfGame) {
	
	document.getElementById('mainMenu').style.display='none';

	let msg = new Object();
	if(game.global.typeOfGame==0){
		msg.event = 'NEW_LOCAL_GAMEMATCH';
	}else if(game.global.typeOfGame==2){
		msg.event = 'NEW_GAMEMATCH';
		msg.gameMatch_code=document.getElementById("gameMatch_code").value;
	}
	msg.typeOfGame = game.global.typeOfGame;
	game.global.socket.send(JSON.stringify(msg));
	
}	
	
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
				game.global.info=msg.tilemap;
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
			case 'START_GAMEMATCH':
				game.global.receivedMsg=msg.event;
				if (game.global.DEBUG_MODE) {
					console.log('[DEBUG] START_GAMEMATCH the game has started.');
				}
			break
			case 'UPDATE_GAMEMATCH':
				game.global.receivedMsg=msg.event;
				game.global.blackHolePosition=msg.blackHolePosition;
				game.global.index=msg.index;
				game.global.length=msg.length;
				for(var i=0; i<msg.length; i++) {
					game.global.player[i].x=msg.player[i].posX;
					game.global.player[i].y=msg.player[i].posY;
					game.global.player[i].colorId=msg.player[i].colorId;
					game.global.player[i].direction=msg.player[i].direction;
					game.global.player[i].isAlive=msg.player[i].isAlive;
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
				if (game.global.DEBUG_MODE) {
					console.log('[DEBUG] GAME_OVER in LOCAL mode.');
				}
			break
			default :
			break
		}
	}
	
