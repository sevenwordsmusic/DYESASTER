package dyesaster;

public class Gamematch{
	private final Player creator;
	private final Level level;
	
	public Gamematch(Player player){
		this.creator= player;
		this.level= new Level();
	}
	
	public Player getCreator() {
		return creator;
	}

	public Level getLevel() {
		return level;
	}
	
}
