package dyesaster;

import java.io.IOException;
import java.util.LinkedList;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;


public class Bullet {
	private int posX;
	private int posY;
	private String direction;
	private Thread tickThread;
	private final int FIRE_SPEED= 40;
	private final int IDLE_SPEED= 30;
	private ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
	private final long TICK_DELAY= 1000/60;
	private LinkedList<Player> players= new LinkedList<Player>();
	
	public Bullet(int x, int y, String dir, LinkedList<Player> players){
		this.setPosX(x);
		this.setPosY(y);
		this.setDirection(dir);
		this.setPlayers(players);
	}


	public int getPosX() {
		return posX;
	}

	public void setPosX(int posX) {
		this.posX = posX;
	}

	public int getPosY() {
		return posY;
	}

	public void setPosY(int posY) {
		this.posY = posY;
	}

	public String getDirection() {
		return direction;
	}

	public void setDirection(String direction) {
		this.direction = direction;
	}

	public void stop() {
		if (scheduler != null) {
			scheduler.shutdown();
		}
	}
	
	private void tick() throws IOException {
		switch (this.direction) {
			case "left":
				posX-=FIRE_SPEED;
				for(int i= 0; i< players.size(); i++) {
					if(players.get(i).getPosX() > posX-24 && players.get(i).getPosX() < posX+24) {
						if(players.get(i).getPosY() > posY-32 && players.get(i).getPosY() < posY+32) {
							players.get(i).setPosX((int)players.get(i).getPosX()-40);
							this.posX=6144;
						}
					}
				}
				break;
			case "right":
				posX+=FIRE_SPEED;
				for(int i= 0; i< players.size(); i++) {
					if(players.get(i).getPosX() > posX-24 && players.get(i).getPosX() < posX+24) {
						if(players.get(i).getPosY() > posY-32 && players.get(i).getPosY() < posY+32) {
							players.get(i).setPosX((int)players.get(i).getPosX()+40);
							this.posX=6144;
						}
					}
				}
				break;
			case "idle":
				posX+=IDLE_SPEED;
				for(int i= 0; i< players.size(); i++) {
					if(players.get(i).getPosX() > posX-24 && players.get(i).getPosX() < posX+24) {
						if(players.get(i).getPosY() > posY-32 && players.get(i).getPosY() < posY+32) {
							players.get(i).setPosX((int)players.get(i).getPosX()+40);
							this.posX=6144;
						}
					}
				}
				break;
			default:
				break;
		}

	}

		public void start() {
			tickThread = new Thread(() -> startBullets());
			tickThread.start();
		}

		private void startBullets() {
			scheduler = Executors.newScheduledThreadPool(1);	
			scheduler.scheduleAtFixedRate(() -> {
				try {
					tick();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}, TICK_DELAY, TICK_DELAY, TimeUnit.MILLISECONDS);
		}


		public LinkedList<Player> getPlayers() {
			return players;
		}


		public void setPlayers(LinkedList<Player> players) {
			this.players = players;
		}
}
