package dyesaster;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

public class Player {
	private final WebSocketSession session;
	private final int playerId;

	
	public Player(int playerId, WebSocketSession session) {
		this.playerId = playerId;
		this.session = session;
	}

	public int getPlayerId() {
		return this.playerId;
	}

	public WebSocketSession WSSession() {
		return this.session;
	}

	public void sendMessage(String msg) throws Exception {
		this.session.sendMessage(new TextMessage(msg));
	}

}
