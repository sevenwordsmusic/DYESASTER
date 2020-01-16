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
	private int indexOfRoom;
	
	private final Player CREATOR;
	private final Level LEVEL;
	private final double BLACKHOLE_SPEED= 0.2;
	private final long TICK_DELAY= 1000/120;
		
	private LinkedList<Player> players= new LinkedList<Player>();
	private ArrayList<Bullet> bullets= new ArrayList<Bullet>();
	private double blackHolePosition;
	private double maxHblackHole;
	private int puntuaciones[] = new int[8];
	private boolean lastAlive[] = new boolean[8];
	private ObjectMapper mapper = new ObjectMapper();
	private Thread tickThread;
	private ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
	private int typeOfGame;
	private int playersAlive;
	private int maxPlayers;
	private boolean running;
	
	public Gamematch(Player player){
		this.CREATOR= player;
		this.LEVEL= new Level();
		this.blackHolePosition= 96;
		this.typeOfGame=1;
		this.playersAlive=2;
		this.setMaxPlayers(2);
		this.running=false;
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
		playersAlive=players.size();
	}
	
	public void addPlayer(Player player){
		players.add(player);
		playersAlive=players.size();
	}

	public void stop() {
		running=false;
		WebsocketGameHandler.getRooms().remove(this);
		if (scheduler != null) {
			scheduler.shutdown();
		}
	}

	//ESTO
	public void waitingRoom() throws IOException {
		ObjectNode msg= mapper.createObjectNode();
		ArrayNode playerArrayNode= mapper.createArrayNode();
		msg.put("event", "WAITING_ROOM");
		for(int i= 0; i< players.size(); i++) {
			ObjectNode player = mapper.createObjectNode();
			player.put("nickname", players.get(i).getNickname());
			playerArrayNode.addPOJO(player);
		}
		msg.putPOJO("player", playerArrayNode);
		msg.put("length", players.size());
		msg.put("maxPlayers", maxPlayers);
		for(int i= 0; i< players.size(); i++) {
			try {
				players.get(i).WSSession().sendMessage(new TextMessage(msg.toString()));
			} catch (IOException e) {}
		}
	}

	public void countDown() throws IOException {
		for(int i= 4; i> 0; i--) {
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e1) {}
			ObjectNode msg= mapper.createObjectNode();
			ArrayNode playerArrayNode= mapper.createArrayNode();
			msg.put("event", "COUNTDOWN");
			for(int x= 0; x< players.size(); x++) {
				ObjectNode player = mapper.createObjectNode();
				player.put("nickname", players.get(x).getNickname());
				playerArrayNode.addPOJO(player);
			}
			msg.putPOJO("player", playerArrayNode);
			msg.put("length", players.size());		
			msg.put("countdown", i);
			if(typeOfGame==0) {
				try {
					CREATOR.WSSession().sendMessage(new TextMessage(msg.toString()));
				} catch (IOException e) {}	
			}else {
				for(int r= 0; r< players.size(); r++) {
					lastAlive[r]=true;
					try {
						players.get(r).WSSession().sendMessage(new TextMessage(msg.toString()));
					} catch (IOException e) {}
				}
			}
		}

	}	
	//
	
	private void tick() throws IOException {
		ObjectNode msg= mapper.createObjectNode();
		ArrayNode playerArrayNode= mapper.createArrayNode();
				synchronized(players) {
					if(blackHolePosition-BLACKHOLE_SPEED > maxHblackHole) {
						blackHolePosition-=BLACKHOLE_SPEED;
					}
					updateScores();
					for(int i= 0; i< players.size(); i++) {
						ObjectNode player = mapper.createObjectNode();
						player.put("nickname", players.get(i).getNickname());
						player.put("posX", players.get(i).getPosX());
						player.put("posY", players.get(i).getPosY());
						player.put("score", puntuaciones[i]);
						player.put("bulletScore", players.get(i).getBulletScore());
						player.put("colorId", players.get(i).getColorId());
						player.put("direction", players.get(i).getDirection());
						player.put("isJumping", players.get(i).isJumping());
						player.put("isGrounded", players.get(i).isGrounded());
						if(players.get(i).isAlive() && players.get(i).getPosY()+32>=(8976+blackHolePosition)) {
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
									setIndexOfRoom(players.get(i).getGameId());
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
								setIndexOfRoom(players.get(i).getGameId());
								stop();
							} else {
								msg.put("event", "UPDATE_GAMEMATCH");
							}
							
							msg.put("typeOfGame", typeOfGame);
							msg.put("id", players.get(i).getPlayerId());
							msg.put("index",  i);
							if(lastAlive[i]) {
								if(!players.get(i).isAlive()) {
									lastAlive[i]=false;
								}
								try {
									players.get(i).WSSession().sendMessage(new TextMessage(msg.toString()));
								} catch (IOException e) {}
							}
						}
					}
				}
	}
	
	private int[] updateScores(){
		for(int i = 0; i<players.size();i++) {
			puntuaciones[i]=(int) Math.max(8647-players.get(i).getPosY(), puntuaciones[i]);
		}
		return puntuaciones;
	}

	private ArrayNode updateBullets() {
		ArrayNode bulletArrayNode= mapper.createArrayNode();
					for(int i= 0; i< bullets.size(); i++) {
						if(bullets.get(i).getPosX()<1 || bullets.get(i).getPosX()>6143) {
							bullets.get(i).stop();
							bullets.remove(i);
						}else {
							nullControl();
							ObjectNode bullet = mapper.createObjectNode();
							bullet.put("posX", bullets.get(i).getPosX());
							bullet.put("posY", bullets.get(i).getPosY());
							bullet.put("direction", bullets.get(i).getDirection());
							bulletArrayNode.addPOJO(bullet);
						}
					}
		return bulletArrayNode;
	}
	
		public void start() throws IOException {
			running=true;
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
			this.maxHblackHole=-8976+((74-(maxPlayers*4))*96);
		}
		public void nullControl() {
			
			for(int i= 0; i< bullets.size(); i++) {	
				if(bullets.get(i).getDirection()==null) {
					bullets.get(i).setDirection("right");
				}
			}
		}

		public boolean isRunning() {
			return running;
		}

		public int getIndexOfRoom() {
			return indexOfRoom;
		}

		public void setIndexOfRoom(int indexOfRoom) {
			this.indexOfRoom = indexOfRoom;
		}

}