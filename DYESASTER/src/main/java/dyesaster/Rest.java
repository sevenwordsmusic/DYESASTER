package dyesaster;


import java.util.LinkedList;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/room")
public class Rest {
	
	@GetMapping
	public static LinkedList<Gamematch> rooms() {
		return WebsocketGameHandler.getRooms();
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<Gamematch> getRoom(@PathVariable int id) {

		Gamematch savedRoom = WebsocketGameHandler.getRooms().get(id);

		if (savedRoom != null) {		
			return new ResponseEntity<>(savedRoom, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		
	}
	
}
