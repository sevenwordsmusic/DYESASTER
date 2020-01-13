package dyesaster;

import java.io.IOException;
import java.util.ArrayList;
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
	private final double BLACKHOLE_SPEED= 0.75;
	private final long TICK_DELAY= 1000/60;
		
	private LinkedList<Player> players= new LinkedList<Player>();
	private ArrayList<Bullet> bullets= new ArrayList<Bullet>();
	private double blackHolePosition;
	private ObjectMapper mapper = new ObjectMapper();
	private Thread tickThread;
	private ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
	private int typeOfGame;
	private int playersAlive;
	private int maxPlayers;
	
	public Gamematch(Player player){
		this.CREATOR= player;
		this.LEVEL= new Level();
		this.blackHolePosition= 96;
		this.typeOfGame=1;
		this.playersAlive=2;
		this.setMaxPlayers(2);
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
						player.put("nickname", players.get(i).getNickname());
						player.put("posX", players.get(i).getPosX());
						player.put("posY", players.get(i).getPosY());
						player.put("colorId", players.get(i).getColorId());
						player.put("direction", players.get(i).getDirection());
						player.put("isJumping", players.get(i).isJumping());
						player.put("isGrounded", players.get(i).isGrounded());
						if(players.get(i).isAlive() && players.get(i).getPosY()>=(8976+blackHolePosition)) {
							players.get(i).setAlive(false);
							players.get(i).stop();
							playersAlive--;
						}
						player.put("isAlive", players.get(i).isAlive());
						playerArrayNode.addPOJO(player);
					}
					msg.putPOJO("player", playerArrayNode);
					msg.putPOJO("bullet", updateBullets());
					msg.put("bulletLength", bullets.size());
					msg.put("blackHolePosition", Math.floor(blackHolePosition));
					msg.put("length", players.size());
					if(typeOfGame==0)  {
						if(playersAlive<2) {
							msg.put("event", "GAME_OVER");	
							for(int i= 0; i< players.size(); i++) {
								if(players.get(i).isAlive()) {
									players.get(i).stop();
								}
							}
							stop();
						} else {
							msg.put("event", "UPDATE_GAMEMATCH");
						}
						msg.put("typeOfGame", typeOfGame);
						msg.put("index", 0);
						try {
							CREATOR.WSSession().sendMessage(new TextMessage(msg.toString()));
						} catch (IOException e) {}	
					}else {
						for(int i= 0; i< players.size(); i++) {
							if(playersAlive<2) {
								msg.put("event", "GAME_OVER");
									if(players.get(i).isAlive()) {
										players.get(i).stop();
									}
								stop();
							} else {
								msg.put("event", "UPDATE_GAMEMATCH");
							}
							
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


	private ArrayNode updateBullets() {
		ArrayNode bulletArrayNode= mapper.createArrayNode();
					for(int i= 0; i< bullets.size(); i++) {
						if(bullets.get(i).getPosX()<1 || bullets.get(i).getPosX()>6143) {
							bullets.get(i).stop();
							bullets.remove(i);
						}else {
							ObjectNode bullet = mapper.createObjectNode();
							bullet.put("posX", bullets.get(i).getPosX());
							bullet.put("posY", bullets.get(i).getPosY());
							bullet.put("direction", bullets.get(i).getDirection());
							bulletArrayNode.addPOJO(bullet);
						}
					}
		return bulletArrayNode;
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

		public ArrayList<Bullet> getBullets() {
			return bullets;
		}

		public void setBullets(ArrayList<Bullet> bullets) {
			this.bullets = bullets;
		}
		
		public void addBullet(Bullet bullet){
			bullets.add(bullet);
		}

		public int getMaxPlayers() {
			return maxPlayers;
		}

		public void setMaxPlayers(int maxPlayers) {
			this.maxPlayers = maxPlayers;
		}
}