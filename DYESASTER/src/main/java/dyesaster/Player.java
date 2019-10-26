package dyesaster;

import java.io.IOException;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;


public class Player {
	private final WebSocketSession session;
	private final int playerId;
	private int index;
	private boolean isAlive;
	private double posX;
	private double posY;
	private long updateJumpPosition;
	private boolean onGround;
	private boolean onJump;
	private int gameId= 999999;
	private String direction;
	
	private final long UPDATE_DELAY= 1000/60;
	private final long UPDATE_LATENCY= 200;
	private long updatePlayerColor;
	private final int WALK_SPEED= 8;
	private final long JUMP_LAPSE= 600;
	private final int JUMP_SPEED= 10;
		
	//private final int GRAVITY= 12;
	private int colorId;
	private Thread tickThread;
	private ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
	
	public Player(int playerId, WebSocketSession session) {
		this.playerId= playerId;
		this.session= session;
		this.isAlive= true;
		this.posX= 200;
		this.posY= 7000;
		this.onGround= true;
		this.onJump= false;
		this.direction= "";
		this.colorId=0;
		this.updatePlayerColor= System.currentTimeMillis();
	}

	public int getPlayerId() {
		return this.playerId;
	}

	public WebSocketSession WSSession() {
		return this.session;
	}

	public void sendMessage(String msg) throws Exception {
		this.session.sendMessage(new TextMessage(msg));
	}

	public boolean isAlive() {
		return isAlive;
	}

	public void setAlive(boolean isAlive) {
		this.isAlive = isAlive;
	}

	public void updateMovement() {
					switch (this.direction) {
						case "left":
								posX-=WALK_SPEED;
							break;
						case "right":
								posX+=WALK_SPEED;
							break;
						case "jump":
							if(onGround && !onJump) {
								posY-=JUMP_SPEED;
								onJump= true;
								updateJumpPosition= System.currentTimeMillis() + JUMP_LAPSE;
							}
							break;
						default:
							break;
					}
	}
	
	public void start() {
		tickThread = new Thread(() -> startPhysicsLoop());
		tickThread.start();
	}

	private void startPhysicsLoop() {
		scheduler = Executors.newScheduledThreadPool(1);	
		scheduler.scheduleAtFixedRate(() -> {
			try {
				update();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}, UPDATE_DELAY, UPDATE_DELAY, TimeUnit.MILLISECONDS);
	}	


	public void stop() {
		if (scheduler != null) {
			scheduler.shutdown();
		}
	}
	
	private void update() throws IOException {
					if(System.currentTimeMillis() < updateJumpPosition) {
						posY-=JUMP_SPEED;
					}else {
						onJump=false;
					}
					if(!onJump) {
						//posY+=GRAVITY;
					}
	}
	
	public int getGameId() {
		return gameId;
	}

	public void setGameId(int gameId) {
		this.gameId = gameId;
	}

	public double getPosX() {
		return posX;
	}

	public void setPosX(double posX) {
		this.posX = posX;
	}

	public double getPosY() {
		return posY;
	}

	public void setPosY(double posY) {
		this.posY = posY;
	}

	public int getColorId() {
		return colorId;
	}

	public void setColorId(int colorId) {
		this.colorId = colorId;
	}

	public String getDirection() {
		return direction;
	}

	public void setDirection(String direction) {
		this.direction = direction;
	}

	public int getIndex() {
		return index;
	}

	public void setIndex(int index) {
		this.index = index;
		this.posX= (this.index+1)*200;
	}

	public void changeColor() {
		if(System.currentTimeMillis() > updatePlayerColor) {
			if(colorId<=2) {
				colorId++;
			}else {
				colorId=0;
			}
			updatePlayerColor=System.currentTimeMillis() + UPDATE_LATENCY;
		}
	}
}
