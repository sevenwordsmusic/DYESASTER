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
	private static LinkedList<Gamematch> games= new LinkedList<Gamematch>();

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
				case "NEW_GAMEMATCH":
					if(node.get("typeOfGame").asInt()==1) {
						player.setIndex(0);
						Gamematch newGamematch= new Gamematch(player);
						newGamematch.addPlayer(player);
						games.add(newGamematch);
						System.out.println("NEW ID GENERATED :" + games.indexOf(newGamematch));
						player.setGameId(games.indexOf(newGamematch));
						msg.put("id", player.getPlayerId());
						msg.put("event", "NEW_LEVEL_RETURN");
						msg.put("tilemap", newGamematch.getLevel().randomize());
						player.WSSession().sendMessage(new TextMessage(msg.toString()));
					}else if(node.get("typeOfGame").asInt()==2) {
						if(node.get("gameMatch_code").asInt() < games.size()){
							player.setGameId(node.get("gameMatch_code").asInt());
							player.setIndex(games.get(player.getGameId()).getPlayers().size());
							games.get(node.get("gameMatch_code").asInt()).addPlayer(player);
							msg.put("id", player.getPlayerId());
							msg.put("event", "NEW_LEVEL_RETURN");
							msg.put("tilemap", games.get(node.get("gameMatch_code").asInt()).getLevel().getTileMapString());
							player.WSSession().sendMessage(new TextMessage(msg.toString()));
						}
					}
					break;
				case "NEW_LOCAL_GAMEMATCH":
					if(node.get("typeOfGame").asInt()==0) {
							player.setIndex(0);
							Player player_B = new Player(playerId.incrementAndGet(), session);
							player_B.setIndex(1);
							
							Gamematch newGamematch= new Gamematch(player);
							newGamematch.addPlayer(player);
							newGamematch.addPlayer(player_B);
							newGamematch.setTypeOfGame(0);
							games.add(newGamematch);
								
							player.setGameId(games.indexOf(newGamematch));
							player_B.setGameId(games.indexOf(newGamematch));
							
							msg.put("id", player.getPlayerId());
							msg.put("event", "NEW_LEVEL_RETURN");
							msg.put("tilemap", newGamematch.getLevel().randomize());
							player.WSSession().sendMessage(new TextMessage(msg.toString()));
					}
					break;
				case "LOAD_GAMEMATCH":
					msg.put("id", player.getPlayerId());
					msg.put("event", "LOAD_GAMEMATCH");
					player.WSSession().sendMessage(new TextMessage(msg.toString()));
					break;
				case "START_GAMEMATCH":
					games.get(player.getGameId()).start();
					msg.put("id", player.getPlayerId());
					msg.put("event", "START_GAMEMATCH");
					player.WSSession().sendMessage(new TextMessage(msg.toString()));
					break;
				case "UPDATE_CONTROLS":
					Gamematch currentGame=games.get(player.getGameId());
					player.setDirection(node.get("direction").asText());
					player.setJump(node.get("jump").asBoolean());
					if(node.get("changeColor").asBoolean()) {
						player.changeColor();
					}
					if(currentGame.getTypeOfGame()==0) {
						currentGame.getPlayer(1).setDirection(node.get("direction_B").asText());
						currentGame.getPlayer(1).setJump(node.get("jump_B").asBoolean());
						if(node.get("changeColor_B").asBoolean()) {
							currentGame.getPlayer(1).changeColor();
						}
					}
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
		if(games.get(player.getGameId()).getCreator().getPlayerId()==player.getPlayerId()) {
			games.get(player.getGameId()).stop();
		}
		player.stop();

	}
	
}
