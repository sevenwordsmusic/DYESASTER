package dyesaster;

import java.io.IOException;
import java.util.LinkedList;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;


public class Bullet {
	private int posX;
	private int posY;
	private int dX=24; 
	private int dY=32;
	private int teamId = -1;
	private String direction;
	private Thread tickThread;
	private final int FIRE_SPEED= 24;
	private final int IDLE_SPEED= 16;
	private ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
	private final long TICK_DELAY= 1000/60;
	private LinkedList<Player> players= new LinkedList<Player>();
	private Player shooter;
	
	public Bullet(int x, int y, String dir, LinkedList<Player> players, Player player){
		this.setPosX(x);
		this.setPosY(y);
		this.setDirection(dir);
		this.setPlayers(players);
		this.setShooter(player);
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
	
	public int getTeamId() {
		return teamId;
	}
	
	public void setTeamId(int teamId) {
		this.teamId = teamId;
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
					if(players.get(i)!=shooter) {
						if(players.get(i).getPosX() > posX-dX && players.get(i).getPosX() < posX+dY) {
							if(players.get(i).getPosY() > posY-dY && players.get(i).getPosY() < posY+dY) {
								players.get(i).pushed(-1);
								this.posX=6144;
								players.get(teamId-1).updateBulletScore();
								stop();
							}
						}
					}
				}
				break;
			case "right":
				posX+=FIRE_SPEED;
				for(int i= 0; i< players.size(); i++) {
					if(players.get(i)!=shooter) {
						if(players.get(i).getPosX() > posX-dX && players.get(i).getPosX() < posX+dX) {
							if(players.get(i).getPosY() > posY-dY && players.get(i).getPosY() < posY+dY) {
								players.get(i).pushed(1);
								this.posX=6144;
								players.get(teamId-1).updateBulletScore();
								stop();
							}
						}
					}
				}
				break;
			case "idle":
				System.out.println("Idle");
				posX+=IDLE_SPEED;
				for(int i= 0; i< players.size(); i++) {
					if(players.get(i)!=shooter) {
						if(players.get(i).getPosX() > posX-dX && players.get(i).getPosX() < posX+dX) {
							if(players.get(i).getPosY() > posY-dY && players.get(i).getPosY() < posY+dY) {
								players.get(i).pushed(1);
								players.get(teamId-1).updateBulletScore();
								this.posX=6144;
								stop();	
							}
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


		public Player getShooter() {
			return shooter;
		}


		public void setShooter(Player shooter) {
			this.shooter = shooter;
		}
}
