package dyesaster;

import java.io.IOException;
import java.util.LinkedList;

import org.springframework.web.socket.TextMessage;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class Gamematch{
	private final Player creator;
	private final Level level;
	private LinkedList<Player> players= new LinkedList<Player>();
	private final long updateTime;
	private double blackHolePosition;
	private final long updateBlackHoleTime;
	private ObjectMapper mapper = new ObjectMapper();
	private boolean go;
	
	public Gamematch(Player player){
		this.creator= player;
		this.level= new Level();
		this.updateTime= 25;
		this.blackHolePosition= 96;
		this.updateBlackHoleTime= 25;
		this.go= true;
	}
	
	public Player getCreator() {
		return creator;
	}

	public Level getLevel() {
		return level;
	}

	public LinkedList<Player> getPlayers() {
		return players;
	}

	public void setPlayers(LinkedList<Player> players) {
		this.players = players;
	}
	
	public void addPlayer(Player player){
		players.add(player);
	}
	
	public Player getPlayer(int index){
		return players.get(index);
	}

	public void stop() {
		go=false;
	}

	public void start() {
		new Thread(() -> {
			try {
				updateBlackHole();
			} catch (IOException e) {}
		}).start();
		new Thread(() -> {
			try {
				sendUpdate();
			} catch (IOException e) {}
		}).start();
	}
	
	private void sendUpdate() throws IOException {
		ObjectNode msg= mapper.createObjectNode();
		long update= System.currentTimeMillis() + updateTime;
		while(go) {
			if(System.currentTimeMillis() > update) {
				ArrayNode playerArrayNode= mapper.createArrayNode();
				synchronized(players){
					for(int i= 0; i< players.size(); i++) {
						ObjectNode player = mapper.createObjectNode();
						player.put("posX", players.get(i).getPosX());
						player.put("posY", players.get(i).getPosY());
						player.put("colorId", players.get(i).getColorId());
						player.put("direction", players.get(i).getDirection());
						playerArrayNode.addPOJO(player);
					}
					msg.putPOJO("player", playerArrayNode);
					msg.put("event", "UPDATE_GAMEMATCH");
					msg.put("blackHolePosition", blackHolePosition);
					msg.put("length", players.size());
					for(int i= 0; i< players.size(); i++) {
						msg.put("id", players.get(i).getPlayerId());
						msg.put("index",  i);
						players.get(i).WSSession().sendMessage(new TextMessage(msg.toString()));
					}
					update= System.currentTimeMillis() + updateTime;
				}
			}
		}
		
	}
	
	private void updateBlackHole() throws IOException {
		long updateBlackHolePosition= System.currentTimeMillis() + updateBlackHoleTime;
		while (go) {
			if(System.currentTimeMillis() > updateBlackHolePosition) {
				blackHolePosition--;
				updateBlackHolePosition= System.currentTimeMillis() + updateBlackHoleTime;
			}
		}
	}
	
}