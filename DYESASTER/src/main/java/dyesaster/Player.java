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
	private int posX;
	private int posY;
	private long updateJumpPosition;
	private boolean onGround;
	private int gameId= 999999;
	private String direction;
	
	private final long UPDATE_DELAY= 1000/60;
	private final long UPDATE_LATENCY= 200;
	private long updatePlayerColor;
	private final int WALK_SPEED= 10;
	private final long JUMP_LAPSE= 800;
	private final int JUMP_SPEED= 14;
		
	private final int MAX_GRAVITY_SPEED= 12;
	private final double CONST_GRAVITY_ACC= 0.04;
	private int colorId;
	private Thread tickThread;
	private ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
	private Level level;
	private int[][] stateMap;
	
	private double angularTime;
	private boolean jump;
	
	public Player(int playerId, WebSocketSession session) {
		this.playerId= playerId;
		this.session= session;
		this.isAlive= true;
		this.jump= false;
		this.posX= 2880;
		this.posY= 8618;
		this.onGround= true;
		this.direction= "";
		this.colorId=0;
		this.updatePlayerColor= System.currentTimeMillis();
		this.angularTime=0.1;
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
		int aux;
					switch (this.direction) {
						case "left":
							if(posX>WALK_SPEED) {
								aux=stateMap[Math.floorDiv(posX-WALK_SPEED, 96)][Math.floorDiv(posY, 96)];
								if( (aux==0 || aux!=colorId+1 ) && aux!=5) {
									posX-=WALK_SPEED;
								}else {
									this.direction="idle";
								}
							}	
							break;
						case "right":
							if(posX<stateMap.length*96-WALK_SPEED) {
								aux=stateMap[Math.floorDiv(posX+WALK_SPEED, 96)][Math.floorDiv(posY, 96)];
								if( (aux==0 || aux!=colorId+1 ) && aux!=5) {
									posX+=WALK_SPEED;
								}else {
									this.direction="idle";
								}	
							}
							break;
						default:
							break;
					}
	
		if(jump) {
			aux=stateMap[Math.floorDiv(posX, 96)][Math.floorDiv(posY-JUMP_SPEED, 96)];
			if(onGround && (aux==0 || aux!=colorId+1 ) && aux!=5){
				posY-=JUMP_SPEED;
				updateJumpPosition= System.currentTimeMillis() + JUMP_LAPSE;
			}
		}
	}
	
	public void start(Level level) {
		this.level=level;
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
					stateMap=level.getStateMap();
					int auxA=stateMap[Math.floorDiv(posX, 96)][Math.floorDiv(posY-JUMP_SPEED, 96)],
						auxB=stateMap[Math.floorDiv( posX , 96 )][Math.floorDiv((int)Math.floor((MAX_GRAVITY_SPEED*angularTime)+posY+88) , 96 )];
					
					if(System.currentTimeMillis() < updateJumpPosition && (auxA==0 || auxA!=colorId+1 ) && auxA!=5) {
						posY-=Math.floor(JUMP_SPEED*((double)(updateJumpPosition-System.currentTimeMillis())/(double)JUMP_LAPSE));
						onGround=false;
						
					}else if( (auxB==0 || auxB!=colorId+1 ) && auxB!=5) {
						if(System.currentTimeMillis() < updateJumpPosition) {
							updateJumpPosition=System.currentTimeMillis();
						}
						posY+=Math.floor(MAX_GRAVITY_SPEED*angularTime);
						onGround=false;
						
						if(angularTime<1) {
							angularTime+=CONST_GRAVITY_ACC;
						}else {
							angularTime=1;
						}
						
					}else {
						onGround=true;
						angularTime=0.1;
						
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

	public void setPosX(int posX) {
		this.posX = posX;
	}

	public double getPosY() {
		return posY;
	}

	public void setPosY(int posY) {
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
		this.posX= this.posX+((this.index+1)*384);
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

	public void setJump(boolean jump) {
		this.jump = jump;
	}
}
