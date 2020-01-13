package dyesaster;

public class Item {

	private long id;
	private boolean success;

	public Item(long id, boolean success) {
		this.id=id;
		this.success=success;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public boolean isSuccess() {
		return success;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}


}
