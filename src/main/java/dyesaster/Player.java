package dyesaster;

import java.util.LinkedList;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;


public class Player {
	private final WebSocketSession session;
	private final int playerId;
	private String nickname;
	private int index;
	private boolean isAlive;
	private int posX;
	private int posY;
	private int score;
	private int bulletScore;
	private long updateJumpPosition;
	private boolean onGround;
	private int gameId;
	private String direction;
	private String lastDirection;
	private int pushed;
	private long lastPushed; 
	
	private final long UPDATE_DELAY= 1000/60;
	private final long UPDATE_LATENCY= 200;
	private final long SHOOT_LATENCY= 250;
	private final long PUSH_LAPSE= 500;
	private long updatePlayerColor;
	private long updateShoot;
	private final int WALK_SPEED= 10;
	private final long JUMP_LAPSE= 1500;
	private final int JUMP_SPEED= 12;
	private final int MAX_GRAVITY_SPEED= 16;
	private final int EFECTO_DEL_DISPARO_CUANDO_SALTAS=8;
	private final double CONST_GRAVITY_ACC= 0.02;
	private int colorId;
	private Thread tickThread;
	private ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
	private ScheduledExecutorService schedulerMovement = Executors.newScheduledThreadPool(1);
	private Level level;
	private int[][] stateMap;
	
	private double angularTime;
	private boolean jump;
	
	public Player(int playerId, WebSocketSession session) {
		this.playerId= playerId;
		this.nickname= "";
		this.session= session;
		this.isAlive= true;
		this.jump= false;
		this.posY= 8618;
		this.score = 0;
		this.bulletScore=0;
		this.onGround= true;
		this.direction= "idle";
		this.colorId=0;
		this.updatePlayerColor= System.currentTimeMillis();
		this.angularTime=0.1;
		this.pushed=0;
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
	
	public int getScore() {
		return score;
	}
	public void setScore(int score) {
		this.score=score;
	}
	
	public int getBulletScore() {
		return bulletScore;
	}
	public void updateBulletScore() {
		bulletScore+=100;
	}

	public void updateMovement() {
		int aux;
		if(pushed==0) {
						switch (this.direction) {
							case "left":
								lastDirection="left";
								if(posX>WALK_SPEED*2) {
									aux=stateMap[Math.floorDiv(posX-WALK_SPEED, 96)][Math.floorDiv(posY, 96)];
									if( (aux==0 || aux!=colorId+1 ) && aux!=5) {
										posX-=WALK_SPEED;
									}else {
										this.direction="idle";
									}
								}	
								break;
							case "right":
								lastDirection="right";
								if(posX<stateMap.length*96-WALK_SPEED*2) {
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
		}else {
			if(posX>WALK_SPEED*5 && posX<stateMap.length*96-WALK_SPEED*5) {
				posX+=WALK_SPEED*(pushed*angularTime*EFECTO_DEL_DISPARO_CUANDO_SALTAS);
			}
			if(lastPushed<System.currentTimeMillis() && pushed!=0) {
				lastPushed=System.currentTimeMillis() + SHOOT_LATENCY;
				if(pushed<0) {
					pushed+=1;
				}else {
					pushed-=1;
				}
			}
		}
	}
	
	public void start(Level level) {
		this.isAlive= true;
		this.jump= false;
		this.posX= (2880+(this.index*384))+(int)(Math.random()*129+1);
		this.posY= 8618;
		this.score = 0;
		this.bulletScore=0;
		this.onGround= true;
		this.direction= "idle";
		this.lastDirection= "right";
		this.colorId=0;
		this.updatePlayerColor= System.currentTimeMillis();
		this.angularTime=0.1;
		this.pushed=0;
		this.level=level;
		tickThread = new Thread(() -> startPhysicsLoop());
		tickThread.start();
	}

	private void startPhysicsLoop() {
		
		scheduler = Executors.newScheduledThreadPool(1);	
		scheduler.scheduleAtFixedRate(() -> {
			update();
		}, UPDATE_DELAY, UPDATE_DELAY, TimeUnit.MILLISECONDS);
		
		schedulerMovement = Executors.newScheduledThreadPool(1);	
		schedulerMovement.scheduleAtFixedRate(() -> {
			updateMovement();
		}, UPDATE_DELAY, UPDATE_DELAY, TimeUnit.MILLISECONDS);
	}	


	public void stop() {
		if (scheduler != null) {
			this.isAlive= false;
			schedulerMovement.shutdown();
			scheduler.shutdown();			
		}
	}
	
	private void update() {
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

	public boolean isGrounded() {
		return this.onGround;
	}
	

	public boolean isJumping() {
		return this.jump;
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

	public Bullet shoot(LinkedList<Player> players) {
		if(System.currentTimeMillis() > updateShoot) {
			Bullet newShoot= new Bullet(posX, posY, lastDirection, players, this);
			newShoot.start();
			updateShoot=System.currentTimeMillis() + SHOOT_LATENCY;
			return newShoot;
		}
		return null;
	}

	public void setJump(boolean jump) {
		this.jump = jump;
	}
	
	public void setNickname(String nickname) {
		this.nickname= nickname;
	}
	
	public String getNickname() {
		return nickname;
	}

	public int getPushed() {
		return pushed;
	}

	public void pushed(int pushed) {
		if(pushed>-4 && pushed<4) {
			this.pushed+=pushed;
			this.lastPushed=System.currentTimeMillis() + PUSH_LAPSE;
		}
	}
}
