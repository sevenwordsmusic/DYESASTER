//var ip = "192.168.0.176"
var ip = "127.0.0.1";
	
window.onload = function() {

	// GLOBAL VARIABLES
	game.global = {
		DEBUG_MODE : true,
		socket : "",
		receivedMsg : null,
		info : ""
	}

	// WEBSOCKET CONFIGURATOR
	game.global.socket = new WebSocket("ws://"+ip+":8080/dyesaster")
	
	game.global.socket.onopen = () => {
		if (game.global.DEBUG_MODE) {
			console.log('[DEBUG] WebSocket connection opened.')
		}
			let msg = new Object();
			msg.event = 'TEST';
			game.global.socket.send(JSON.stringify(msg));
			
		if (game.global.DEBUG_MODE) {
			console.log('[DEBUG] TEST msg sent, waiting for confirmation...');
		}
	}

	game.global.socket.onclose = () => {
		if (game.global.DEBUG_MODE) {
			console.log('[DEBUG] WebSocket connection closed.')
		}
	}
	
	game.global.socket.onmessage = (message) => {
		var msg = JSON.parse(message.data)
		switch (msg.event) {
			case 'TEST_CONFIRMATION':
				if (game.global.DEBUG_MODE) {
					console.log('[DEBUG] TEST_CONFIRMATION received, all is well for player #' + msg.id + ' <3');
				}	
			break
			case 'UPDATE':
				
				break
			case 'NEW_LEVEL_RETURN':
				game.global.receivedMsg=msg.event;
				game.global.info=msg.tilemap;
				if (game.global.DEBUG_MODE) {
					console.log('[DEBUG] NEW_LEVEL_RETURN new tilemap generated.');
				}
			break
			default :
			break
		}
	}
	
}