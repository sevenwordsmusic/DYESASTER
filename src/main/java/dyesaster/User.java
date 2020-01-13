package dyesaster;

import java.io.Serializable;
import java.util.concurrent.atomic.AtomicInteger;

@SuppressWarnings("serial")
public class User implements Serializable {
	private static AtomicInteger lastUserId = new AtomicInteger(0);
	private long userId;
	private String userNickname;
	private String userPassword;
	private boolean userActive;
	private long userLastUpdate;
	
	public static void initialize(long resetUserId) {
		lastUserId.lazySet((int)resetUserId);
	}
	
	public static long getLastUserId() {
		return lastUserId.get();
	}
	
	User(){
		this.userId= lastUserId.incrementAndGet();
		this.userActive= true;
		this.userLastUpdate= System.currentTimeMillis();
		this.userNickname= "Player_" + this.userId;
	}

	User(String userNickname, String userPassword){
		this.userNickname= userNickname;
		this.userPassword= userPassword;
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

	public String getUserPassword() {
		return userPassword;
	}

	public void setUserPassword(String userPassword) {
		this.userPassword = userPassword;
	}

}
