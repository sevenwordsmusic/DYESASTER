package dyesaster;

import java.util.LinkedList;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class WebsocketGameHandler extends TextWebSocketHandler {
	private static final String PLAYER_ATTRIBUTE = "PLAYER";
	private ObjectMapper mapper = new ObjectMapper();
	private AtomicInteger playerId = new AtomicInteger(0);
	private static LinkedList<Gamematch>  games= new LinkedList<Gamematch>();

	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		Player player;
		
		synchronized(this) {
			player = new Player(playerId.incrementAndGet(), session);
			session.getAttributes().put(PLAYER_ATTRIBUTE, player);
		}
	}

	@Override
	protected synchronized void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		try {
			JsonNode node = mapper.readTree(message.getPayload());
			ObjectNode msg = mapper.createObjectNode();
			
			Player player;
			player = (Player) session.getAttributes().get(PLAYER_ATTRIBUTE);
			
			switch (node.get("event").asText()) {
				case "TEST":
					msg.put("id", player.getPlayerId());
					msg.put("event", "TEST_CONFIRMATION");
					player.WSSession().sendMessage(new TextMessage(msg.toString()));
					break;
				case "NEW_GAMEMATCH":
					player.setIndex(0);
					Gamematch newGamematch= new Gamematch(player);
					newGamematch.addPlayer(player);
					games.add(newGamematch);
					player.setGameId(games.indexOf(newGamematch));
					msg.put("id", player.getPlayerId());
					msg.put("event", "NEW_LEVEL_RETURN");
					msg.put("tilemap", newGamematch.getLevel().randomize());
					player.WSSession().sendMessage(new TextMessage(msg.toString()));
					break;
				case "GET_GAMEMATCH":
					player.setIndex(games.peek().getPlayers().size());
					games.peek().addPlayer(player);
					msg.put("id", player.getPlayerId());
					msg.put("event", "NEW_LEVEL_RETURN");
					msg.put("tilemap", games.peek().getLevel().getTileMapString());
					player.WSSession().sendMessage(new TextMessage(msg.toString()));
					break;
				case "START_GAMEMATCH":
					player.start();
					if(player==games.peek().getCreator()) {
						games.peek().start();
					}
					msg.put("id", player.getPlayerId());
					msg.put("event", "START_GAMEMATCH");
					player.WSSession().sendMessage(new TextMessage(msg.toString()));
					break;
				case "UPDATE_CONTROLS":
					player.setDirection(node.get("direction").asText());
					break;
				default:
					break;
			}

		} catch (Exception e) {
			System.err.println("Exception processing message " + message.getPayload());
			e.printStackTrace(System.err);
		}
	}

	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		Player player;
		synchronized(this) {
			player = (Player) session.getAttributes().get(PLAYER_ATTRIBUTE);
		}

		games.peek().stop();
		player.stop();

	}	
	
}
