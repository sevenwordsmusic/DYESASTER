package dyesaster;

import java.io.IOException;
import java.util.LinkedList;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.web.socket.TextMessage;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class Gamematch{
	private final Player creator;
	private final Level level;
	private LinkedList<Player> players= new LinkedList<Player>();
	private final long TICK_DELAY= 1000/30;
	private double blackHolePosition;
	private final int BLACKHOLE_SPEED= 4;
	private ObjectMapper mapper = new ObjectMapper();
	private Thread tickThread;
	private ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
	
	public Gamematch(Player player){
		this.creator= player;
		this.level= new Level();
		this.blackHolePosition= 96;
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
		if (scheduler != null) {
			scheduler.shutdown();
		}
	}

	private void tick() throws IOException {
		ObjectNode msg= mapper.createObjectNode();
		ObjectNode player = mapper.createObjectNode();
		ArrayNode playerArrayNode= mapper.createArrayNode();
				synchronized(players) {
					blackHolePosition-=BLACKHOLE_SPEED;
					for(int i= 0; i< players.size(); i++) {
						players.get(i).updateMovement();
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
						try {
							players.get(i).WSSession().sendMessage(new TextMessage(msg.toString()));
						} catch (IOException e) {}
					}
				}
		
	}

		public void start() {
			tickThread = new Thread(() -> startGameLoop());
			tickThread.start();
		}

		private void startGameLoop() {
			scheduler = Executors.newScheduledThreadPool(1);	
			scheduler.scheduleAtFixedRate(() -> {
				try {
					tick();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}, TICK_DELAY, TICK_DELAY, TimeUnit.MILLISECONDS);
		}		

}