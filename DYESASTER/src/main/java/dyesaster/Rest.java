package dyesaster;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.io.PrintStream;
import java.text.SimpleDateFormat;
import java.util.Collection;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;




@RestController
@RequestMapping("/api")
public class Rest {
	static Map<Long, User> userMap = new ConcurrentHashMap<>();
	static LinkedList<String> nicknameList = new LinkedList<>();
	private static Thread restRest;
	private static Thread fileThread;
	private static ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
	private static ScheduledExecutorService schedulerFiles = Executors.newScheduledThreadPool(1);
	private static final long TICK_DELAY= 200;
	private static final long GRACE_TIME= 2000;
	private static final long CLEAR_TIME= 20000;
	
	public static void startFileLog() {
		loadDATlog();
		crearFicheros();
		fileThread = new Thread(() -> fileThread());
		fileThread.start();
		restRest = new Thread(() -> restRest());
		restRest.start();
	}
	
	private static void fileThread(){
		schedulerFiles = Executors.newScheduledThreadPool(1);	
		schedulerFiles.scheduleAtFixedRate(() -> {
			saveTextLog();
			saveDATlog();
		}, TICK_DELAY, TICK_DELAY, TimeUnit.MILLISECONDS);
	}
	
	private static void restRest() {
		scheduler = Executors.newScheduledThreadPool(1);	
		scheduler.scheduleAtFixedRate(() -> {
				restUpdate();
		}, TICK_DELAY, TICK_DELAY, TimeUnit.MILLISECONDS);
	}
	
	@PostMapping("/createUser/{nickname}")
	@ResponseStatus(HttpStatus.CREATED)
	public Item createUser(@PathVariable String nickname, @RequestBody String password) {
		password=(password.substring(1, password.length()-1));
		synchronized(userMap){
			synchronized(nicknameList){
				if(nicknameList.contains(nickname)) {
					if(userMap.get(getKey(nickname)).getUserPassword().equals(password)) {
						System.out.println(nickname + " logged in to server.");
						return new Item(getKey(nickname), true);
					}else {
						System.out.println("Wrong login attempt.");
						return new Item(-1,false);
					}
				}else {
					nicknameList.add(nickname);
					User currentUser= new User(nickname, password);
					userMap.put(currentUser.getUserId(), currentUser);
					System.out.println(nickname + " signed in to server.");
					return new Item(getKey(nickname), true);
				}
			}
		}
	}

	@PutMapping("/checkServer/{key}")
	public Item checkServer(@PathVariable long key, @RequestBody String password) {
		password=(password.substring(1, password.length()-1));
		if(userMap.containsKey(key) && userMap.get(key).getUserPassword().equals(password)){
			userMap.get(key).setUserActive(true);
			userMap.get(key).setUserLastUpdate(System.currentTimeMillis());
			return new Item(key, true);
		}else {
			return new Item(-1,false);
		}
	}
	

	@GetMapping("/getRooms")
	public ResponseEntity<User[]> getRooms() {
		if (userMap != null) {
		    Collection<User> values = userMap.values();
		    User[] targetArray = values.toArray(new User[values.size()]);
			return new ResponseEntity<>(targetArray, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	public static void crearFicheros() {
		try {
			File userLogTXT = new File("userLog.txt");
			userLogTXT.createNewFile();
			File userLogDAT = new File("userLog.dat");
			userLogDAT.createNewFile();
		} catch(IOException ioe) {
			System.out.println("No se pudieron crear los archivos de log.");
		}
	}
	
	private static void restUpdate() {
		synchronized(userMap){
			synchronized(nicknameList){
				if(nicknameList.size() > 0) {
					Collection<User> values = userMap.values();
					User[] targetArray = values.toArray(new User[values.size()]);
					for(int i = 0; i < targetArray.length; i++) {
						if(targetArray[i].getUserLastUpdate() + CLEAR_TIME < System.currentTimeMillis()) {
							userMap.remove(targetArray[i].getUserId());
							nicknameList.remove(targetArray[i].getUserNickname());
							System.out.println(targetArray[i].getUserNickname() + " kicked out by server.");
						}else if(targetArray[i].getUserLastUpdate() + GRACE_TIME < System.currentTimeMillis()) {
							userMap.get(targetArray[i].getUserId()).setUserActive(false);
						} 
					}
				}
			}
		}
	}
	
	public static void saveTextLog() {
		synchronized(userMap){
			synchronized(nicknameList){
				if(nicknameList.size() > 0) {
					    Collection<User> values = userMap.values();
					    User[] targetArray = values.toArray(new User[values.size()]);
						try(PrintStream flujo = new PrintStream(new FileOutputStream("userLog.txt"))) {
							flujo.print("#DYESASTER: apirest users logfile:\r\n\r\n| NICKNAME \t| LAST REQUEST \t\t| USER ID \t| HASH CODE \t|\r\n");
							for(int i = 0; i < targetArray.length; i++) {
								flujo.print("| " + format(targetArray[i].getUserNickname(), 16) + " \t| " + getTimeStamp(targetArray[i].getUserLastUpdate()) + " \t| " + format(((Integer)(int)targetArray[i].getUserId()).toString(), 16) + " \t| " + userMap.get(targetArray[i].getUserId()).hashCode() + " \t|\r\n");
							}
						} catch(FileNotFoundException e) {
							System.out.println("Fichero 'userLog.txt' no encontrado.");
						}
				}
			}
		}
	}

	public static void saveDATlog() {
		synchronized(userMap){
			synchronized(nicknameList){
				if(nicknameList.size() > 0) {
				    Collection<User> values = userMap.values();
				    User[] targetArray = values.toArray(new User[values.size()]);
					try {
						FileOutputStream file = new FileOutputStream("userLog.dat");
						try(ObjectOutputStream flujo = new ObjectOutputStream(file)) {
							for(int i = 0; i < targetArray.length; i++) {
								flujo.writeObject(targetArray[i]);
							}
						}
					} catch(IOException exc) {
						System.out.println("Error desconocido guardando 'userLog.dat': " + exc);
					}
				}
			}
		}
	}

	
	public static void loadDATlog() {
	    LinkedList<User> targetList= new LinkedList<>();
		try {
			FileInputStream in = new FileInputStream("userLog.dat");
			try(ObjectInputStream flujo = new ObjectInputStream( in )) {
				while(flujo.readObject() != null) {
					targetList.add((User)flujo.readObject());
					targetList.getLast().setUserLastUpdate(System.currentTimeMillis());
					nicknameList.add(targetList.getLast().getUserNickname());
					userMap.put(targetList.getLast().getUserId(), targetList.getLast());
					if(targetList.getLast().getUserId() > User.getLastUserId()) {
						User.initialize(targetList.getLast().getUserId());
					}
				}
				flujo.close();
			}
		} catch(FileNotFoundException e) {
			System.out.println("Fichero 'userLog.dat' no encontrado.");
		} catch(IOException exc) {
			System.out.println("Fichero 'userLog.dat' cargado correctamente.");
		} catch(ClassNotFoundException e) {
			System.out.println("Clase no encontrada/error de conversión.");
		}
	}
	
	public static String format(String s, int chars) {
		return String.format("%1$-" + chars + "s", s).substring(0, chars);
	}
	
	public static String getTimeStamp(long timeStamp) {
	    SimpleDateFormat sdfDate = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
	    String strDate = sdfDate.format(timeStamp);
	    return strDate;
	}
	
	public void stop() {
		if (scheduler != null) {
			scheduler.shutdown();
		}
	}
	
	public long getKey(String value) {
	    for (java.util.Map.Entry<Long, User> entry : userMap.entrySet()) {
	        if (entry.getValue().getUserNickname().equals(value)) {
	            return entry.getKey();
	        }
	    }
	    return -1;
	}
	
}
