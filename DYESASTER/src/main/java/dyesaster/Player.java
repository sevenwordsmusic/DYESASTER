package dyesaster;

import java.io.IOException;

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
	private final long updateJumpTime;
	private boolean onGround;
	private boolean onJump;
	private int gameId= 999999;
	private boolean go;
	private String direction;
	private final long updatePlayerTime;
	private int colorId;

	
	public Player(int playerId, WebSocketSession session) {
		this.playerId= playerId;
		this.session= session;
		this.isAlive= true;
		this.setPosX(200);
		this.setPosY(8400);
		this.updateJumpTime= 500;
		this.onGround= true;
		this.onJump= false;
		this.go= true;
		this.setDirection("");
		this.updatePlayerTime= 10;
		this.setColorId(0);
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

	public void move(String direction) {
		String newDirection="";
		switch (direction) {
			case "left":
				posX--;
				newDirection=direction;
				break;
			case "right":
				posX++;
				newDirection=direction;
				break;
			case "jump":
				if(onGround && !onJump) {
					updateJumpPosition= System.currentTimeMillis() + updateJumpTime;
					onJump= true;
				}
				newDirection=direction;
				break;
			default:
				break;
		}
		this.setDirection(newDirection);	
	}
	
	public void start() {
		new Thread(() -> {
			try {
				updatePhysics();
			} catch (IOException e) {}
		}).start();
	}

	private void updatePhysics() throws IOException {
		long updatePlayerPhysics= System.currentTimeMillis() + updatePlayerTime;
		while(go) {
			synchronized(this){
				if(System.currentTimeMillis() > updatePlayerPhysics) {
					if(System.currentTimeMillis() < updateJumpPosition) {
						posY--;
					}else {
						onJump=false;
						//posY+=4;
					}
					updatePlayerPhysics= System.currentTimeMillis() + updatePlayerTime;
				}
			}
		}
		
	}
	
	public int getGameId() {
		return gameId;
	}

	public void setGameId(int gameId) {
		this.gameId = gameId;
	}
	
	public void stop() {
		go=false;
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
	}
	
}
