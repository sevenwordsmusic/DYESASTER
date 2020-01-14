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
	private static LinkedList<Gamematch> rooms= new LinkedList<Gamematch>();
	
	public static LinkedList<Gamematch> getRooms(){
		return rooms;
	}
	
	
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
				case "JOIN_GAMEMATCH":
					if(node.get("typeOfGame").asInt()==2) {
						//int gameMatch_code= node.get("gameMatch_code").asInt();
						int gameMatch_code= rooms.size()-1;
						if( gameMatch_code < rooms.size()){
							player.setGameId(gameMatch_code);
							player.setIndex(rooms.get(gameMatch_code).getPlayers().size());
							rooms.get(gameMatch_code).addPlayer(player);
							msg.put("id", gameMatch_code);
							msg.put("event", "NEW_LEVEL_RETURN");
							msg.put("index", player.getIndex());
							msg.put("tilemap", rooms.get(gameMatch_code).getLevel().getTileMapString());
							msg.put("nPlayers", rooms.get(gameMatch_code).getMaxPlayers());
							player.WSSession().sendMessage(new TextMessage(msg.toString()));
						}
					}
					break;
				case "NEW_GAMEMATCH":
					if(node.get("typeOfGame").asInt()==1 && (node.get("nPlayers").asInt()>0 && node.get("nPlayers").asInt()<5 )) {
						player.setIndex(0);
						Gamematch newGamematch= new Gamematch(player);
						newGamematch.addPlayer(player);
						newGamematch.setMaxPlayers(node.get("nPlayers").asInt()*2);
						rooms.add(newGamematch);
						player.setGameId(rooms.indexOf(newGamematch));
						msg.put("id", player.getPlayerId());
						msg.put("event", "NEW_LEVEL_RETURN");
						msg.put("index", player.getIndex());
						msg.put("tilemap", newGamematch.getLevel().randomize());
						msg.put("nPlayers", newGamematch.getMaxPlayers());
						msg.put("gameMatch_code", rooms.indexOf(newGamematch));
						player.WSSession().sendMessage(new TextMessage(msg.toString()));
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
							rooms.add(newGamematch);
								
							player.setGameId(rooms.indexOf(newGamematch));
							player_B.setGameId(rooms.indexOf(newGamematch));
							
							msg.put("id", player.getPlayerId());
							msg.put("event", "NEW_LEVEL_RETURN");
							msg.put("index", player.getIndex());
							msg.put("tilemap", newGamematch.getLevel().randomize());
							msg.put("nPlayers", 2);
							player.WSSession().sendMessage(new TextMessage(msg.toString()));
					}
					break;
				case "LOAD_GAMEMATCH":
					msg.put("id", player.getPlayerId());
					msg.put("event", "LOAD_GAMEMATCH");
					player.WSSession().sendMessage(new TextMessage(msg.toString()));
					break;
				case "START_GAMEMATCH":
					player.setNickname(node.get("nickname").asText());
					msg.put("id", player.getPlayerId());
					msg.put("event", "START_GAMEMATCH");
					player.WSSession().sendMessage(new TextMessage(msg.toString()));
					if(rooms.get(player.getGameId()).getMaxPlayers()==rooms.get(player.getGameId()).getPlayers().size()) {
						rooms.get(player.getGameId()).start();
					}
					break;
				case "UPDATE_CONTROLS":
					Gamematch currentGame=rooms.get(player.getGameId());
					player.setDirection(node.get("direction").asText());
					player.setJump(node.get("jump").asBoolean());
					if(node.get("changeColor").asBoolean()) {
						player.changeColor();
					}
					if(node.get("shoot").asBoolean() ) {
						Bullet newBullet = player.shoot(currentGame.getPlayers());
						if(newBullet!=null) {
							newBullet.setTeamId(player.getPlayerId());
							currentGame.addBullet(newBullet);
						}
					}
					if(currentGame.getTypeOfGame()==0) {
						Player player_B=currentGame.getPlayer(1);
						player_B.setDirection(node.get("direction_B").asText());
						player_B.setJump(node.get("jump_B").asBoolean());
						if(node.get("changeColor_B").asBoolean()) {
							player_B.changeColor();
						}
						if(node.get("shoot_B").asBoolean() ) {
							Bullet newBullet = player_B.shoot(currentGame.getPlayers());
							if(newBullet!=null) {
								newBullet.setTeamId(player_B.getPlayerId());
								currentGame.addBullet(newBullet);
							}
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
		synchronized(this) {
			if(!session.getAttributes().isEmpty()){
				Player player;
				player = (Player) session.getAttributes().get(PLAYER_ATTRIBUTE);
				if(rooms.size()>0) {
					if(rooms.get(player.getGameId()).getCreator().getPlayerId()==player.getPlayerId()) {
						rooms.get(player.getGameId()).stop();
					}
					player.stop();
				}
			}
		}
	}
	
}
