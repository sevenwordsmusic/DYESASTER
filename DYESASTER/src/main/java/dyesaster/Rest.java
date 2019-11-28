package dyesaster;

import java.io.IOException;
import java.util.LinkedList;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api")
public class Rest {
	static Map<Long, User> userMap = new ConcurrentHashMap<>();
	static LinkedList<String> nicknameList = new LinkedList<>();
	private Thread tickThread;
	private ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
	private final long TICK_DELAY= 100;
	private final long GRACE_TIME= 150;
	
	@PostMapping("/createUser/{nickname}")
	@ResponseStatus(HttpStatus.CREATED)
	public long createUser(@PathVariable String nickname) {
		if(nicknameList.contains(nickname)) {
			return -1;
		}else {
			nicknameList.add(nickname);
			User currentUser= new User(nickname);
			userMap.put(currentUser.getUserId(), currentUser);
			this.start(currentUser.getUserId());
			return currentUser.getUserId();
		}
	}

	@PutMapping("/checkServer/{key}")
	public long checkServer(@PathVariable long key) {
		User currentUser;
		if(userMap.containsKey(key)) {
			userMap.get(key).setUserActive(true);
			userMap.get(key).setUserLastUpdate(System.currentTimeMillis());
			currentUser= userMap.get(key);
		}else {
			currentUser= new User();
			userMap.put(currentUser.getUserId(), currentUser);
		}
		return currentUser.getUserId();
	}
	

	@GetMapping("/getRooms")
	public ResponseEntity<Map<Long, User>> getRooms() {
		if (userMap != null) {
			return new ResponseEntity<>(userMap, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	private void tick(long key) throws IOException {
		if(userMap.get(key) != null) {
			if(userMap.get(key).getUserLastUpdate()+GRACE_TIME < System.currentTimeMillis()) {
				userMap.get(key).setUserActive(false);
			}
		}
	}
	
	public void start(long key) {
		tickThread = new Thread(() -> startRest(key));
		tickThread.start();
	}

	private void startRest(long key) {
		scheduler = Executors.newScheduledThreadPool(1);	
		scheduler.scheduleAtFixedRate(() -> {
			try {
				tick(key);
			} catch (IOException e) {
				e.printStackTrace();
			}
		}, TICK_DELAY, TICK_DELAY, TimeUnit.MILLISECONDS);
	}

}
