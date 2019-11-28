package dyesaster;

import java.util.concurrent.atomic.AtomicInteger;

public class User {
	private static AtomicInteger lastUserId = new AtomicInteger(0);
	private long userId;
	private String userNickname;
	private boolean userActive;
	private long userLastUpdate;
	
	User(){
		this.userId= lastUserId.incrementAndGet();
		this.userActive= true;
		this.userLastUpdate= System.currentTimeMillis();
		this.userNickname= "Player_" + this.userId;
	}

	User(String userNickname){
		this.userNickname= userNickname;
		this.userId= lastUserId.incrementAndGet();
		this.userActive= true;
		this.userLastUpdate= System.currentTimeMillis();
	}
	
	public boolean isUserActive() {
		return userActive;
	}
	public void setUserActive(boolean userActive) {
		this.userActive = userActive;
	}
	public long getUserLastUpdate() {
		return userLastUpdate;
	}
	public void setUserLastUpdate(long userLastUpdate) {
		this.userLastUpdate = userLastUpdate;
	}
	public long getUserId() {
		return userId;
	}
	public void setUserId(int userId) {
		this.userId = userId;
	}

	public String getUserNickname() {
		return userNickname;
	}

	public void setUserNickname(String userNickname) {
		this.userNickname = userNickname;
	}

}
