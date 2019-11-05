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
	private final Player CREATOR;
	private final Level LEVEL;
	private final double BLACKHOLE_SPEED= 1;
	private final long TICK_DELAY= 1000/60;
	
	private LinkedList<Player> players= new LinkedList<Player>();
	private double blackHolePosition;
	private ObjectMapper mapper = new ObjectMapper();
	private Thread tickThread;
	private ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
	private int typeOfGame;
	private int playersAlive;
	
	public Gamematch(Player player){
		this.CREATOR= player;
		this.LEVEL= new Level();
		this.blackHolePosition= 96;
		this.typeOfGame=1;
		this.playersAlive=2;
	}
	
	public Player getCreator() {
		return CREATOR;
	}

	public Level getLevel() {
		return LEVEL;
	}

	public LinkedList<Player> getPlayers() {
		return players;
	}

	public Player getPlayer(int index) {
		return players.get(index);
	}
	
	public void setPlayers(LinkedList<Player> players) {
		this.players = players;
	}
	
	public void addPlayer(Player player){
		players.add(player);
	}

	public void stop() {
		if (scheduler != null) {
			scheduler.shutdown();
		}
	}

	private void tick() throws IOException {
		ObjectNode msg= mapper.createObjectNode();
		ArrayNode playerArrayNode= mapper.createArrayNode();
				synchronized(players) {
					blackHolePosition-=BLACKHOLE_SPEED;
					for(int i= 0; i< players.size(); i++) {
						ObjectNode player = mapper.createObjectNode();
						players.get(i).updateMovement();
						player.put("posX", players.get(i).getPosX());
						player.put("posY", players.get(i).getPosY());
						player.put("colorId", players.get(i).getColorId());
						player.put("direction", players.get(i).getDirection());
						if(players.get(i).isAlive() && players.get(i).getPosY()>=(8976+(int)blackHolePosition)) {
							players.get(i).setAlive(false);
							playersAlive--;
						}
						player.put("isAlive", players.get(i).isAlive());
						playerArrayNode.addPOJO(player);
					}
					msg.putPOJO("player", playerArrayNode);
					if(playersAlive==1) {
						msg.put("event", "GAME_OVER");
					}else {
						msg.put("event", "UPDATE_GAMEMATCH");
					}
					msg.put("blackHolePosition", blackHolePosition);
					msg.put("length", players.size());
					if(typeOfGame==0)  {
						msg.put("typeOfGame", typeOfGame);
						try {
							CREATOR.WSSession().sendMessage(new TextMessage(msg.toString()));
						} catch (IOException e) {}	
					}else {
						for(int i= 0; i< players.size(); i++) {
							msg.put("typeOfGame", typeOfGame);
							msg.put("id", players.get(i).getPlayerId());
							msg.put("index",  i);
							try {
								players.get(i).WSSession().sendMessage(new TextMessage(msg.toString()));
							} catch (IOException e) {}
						}
					}

				}
		
	}

		public void start() {
			tickThread = new Thread(() -> startGameLoop());
			tickThread.start();
			for(int i= 0; i< players.size(); i++) {
				players.get(i).start(LEVEL);
			}
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

		public void setTypeOfGame(int i) {
			this.typeOfGame=i;
		}		

		public int getTypeOfGame() {
			return this.typeOfGame;
		}
}