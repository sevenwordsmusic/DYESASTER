package dyesaster;

public class Level {
	private int xLength;
	private int yLength;
	private int platformCount;

	public Level() {
		this.xLength=64;
		this.yLength=96;
		this.platformCount=(int) Math.floor(Math.random() * 5);
	}

	public String randomize() {
		String newTileMap="";
		int platformRange=8, platformLevel=0;
		for(int y=0; y < yLength; y++) {
				if(y < 94 ) {
					if((y+2)%3 == 0) {
						if(platformLevel < 3) {
							newTileMap+= generatePlatforms(platformRange);
							platformLevel++;
						}else {
							newTileMap+= generatePlatforms(platformRange);
							platformLevel=0;
							platformRange+=7;
						}						
					} else {
						newTileMap+= fullSpace(0);
					}
				} else {
					newTileMap+= fullSpace(1);
				}
				
		}
		return newTileMap;
	}

	private String generatePlatforms(int range) {
		String spaceLine="";
		int x= 0, rndMargin, reservedSpace= xLength-range, padding= (int)Math.floor(Math.random() * reservedSpace);
		while( x < padding) {
			spaceLine+= "0,";
			x++;
		}
		while( x < padding + range) {
			if((int)Math.floor(Math.random() * 3)>0) {
				if((x + 4) < (padding + range)) {
					spaceLine+= spacePlatform();
					x+=4;
				}
			}else {
				rndMargin= (int)Math.floor(Math.random() * 4) + 1;
				if((x + rndMargin) < (padding + range)) {
					for(int margin= 0; margin< rndMargin; margin++){
						spaceLine+= "0,";
					}
					x+=rndMargin;
				} else {
					spaceLine+= "0,";
					x++;
				}
			}
		}
		while( x < xLength) {
			spaceLine+= "0,";
			x++;
		}
		return spaceLine;
	}

	private String fullSpace(int type) {
		String spaceLine= "";
		for(int x=0; x < xLength; x++) {
			spaceLine+= type + ",";
		}
		return spaceLine;
	}

	private String spacePlatform() {
		String spaceLine= "";
		if(platformCount==0) {
			spaceLine+= "31,61,61,32,";
			platformCount++;
		}else if(platformCount==1) {
			spaceLine+= "31,76,76,32,";
			platformCount++;
		}else if(platformCount==2) {
			spaceLine+= "31,91,91,32,";
			platformCount++;
		}else if(platformCount==3) {
			spaceLine+= "31,106,106,32,";
			platformCount++;
		}else {
			spaceLine+= "46,";
			switch ((int)Math.random() * 4) {
				case 0:
					spaceLine+= "61,61,";
				break;
				case 1:
					spaceLine+= "76,76,";
				break;
				case 2:
					spaceLine+= "91,91,";
				break;
				case 3:
					spaceLine+= "106,106,";
				break;
				default :
				break;
			}
			spaceLine+= "47,";
			platformCount= 0;
		}
		return spaceLine;
	}
	
	
}
