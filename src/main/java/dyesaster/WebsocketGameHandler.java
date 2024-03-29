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
				case "NEW_GAMEMATCH":
					int r=0;
					boolean roomFound=false;
					while(r< rooms.size() && !roomFound) {
						if(rooms.get(r).getTypeOfGame()==1 && rooms.get(r).getMaxPlayers()==node.get("nPlayers").asInt() && rooms.get(r).getPlayers().size()< rooms.get(r).getMaxPlayers()){
							player.setGameId(rooms.indexOf(rooms.get(r)));
							player.setIndex(rooms.get(r).getPlayers().size());
							rooms.get(r).addPlayer(player);
							msg.put("id", r);
							msg.put("event", "NEW_LEVEL_RETURN");
							msg.put("index", player.getIndex());
							msg.put("tilemap", rooms.get(r).getLevel().getTileMapString());
							msg.put("nPlayers", rooms.get(r).getMaxPlayers());
							player.WSSession().sendMessage(new TextMessage(msg.toString()));
							roomFound=true;
						}
						r++;
					}
					if(!roomFound) {
						player.setIndex(0);
						Gamematch newGamematch= new Gamematch(player);
						newGamematch.addPlayer(player);
						newGamematch.setMaxPlayers(node.get("nPlayers").asInt());
						rooms.add(newGamematch);
						player.setGameId(rooms.indexOf(newGamematch));
						msg.put("id", player.getPlayerId());
						msg.put("event", "NEW_LEVEL_RETURN");
						msg.put("index", player.getIndex());
						msg.put("tilemap", newGamematch.getLevel().randomize(newGamematch.getMaxPlayers()));
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
							msg.put("tilemap", newGamematch.getLevel().randomize(2));
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
					//ESTO
					rooms.get(player.getGameId()).waitingRoom();
					//
					if(rooms.get(player.getGameId()).getMaxPlayers()==rooms.get(player.getGameId()).getPlayers().size() && !rooms.get(player.getGameId()).isRunning()) {
						rooms.get(player.getGameId()).countDown();
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
		ObjectNode msg = mapper.createObjectNode();
		synchronized(this) {
			if(!session.getAttributes().isEmpty()){
				Player player;
				player = (Player) session.getAttributes().get(PLAYER_ATTRIBUTE);
				player.setAlive(false);
				player.stop();
				rooms.get(player.getGameId()).getPlayers().remove(player);
				if(!rooms.get(player.getGameId()).isRunning()) {
					rooms.get(player.getGameId()).waitingRoom();
				}else {
					rooms.get(player.getGameId()).setIndexOfRoom(player.getGameId());
					for(int i= 0; i< rooms.get(player.getGameId()).getPlayers().size(); i++) {
						rooms.get(player.getGameId()).getPlayer(i).setAlive(false);
						msg = mapper.createObjectNode();
						msg.put("event", "FAIL");
						rooms.get(player.getGameId()).getPlayer(i).WSSession().sendMessage(new TextMessage(msg.toString()));
					}
					rooms.get(player.getGameId()).stop();
				}
			}
		}
	}
	
}
