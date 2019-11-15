package dyesaster;

public class Level {
	private final int xLength;
	private final int yLength;
	
	private int platformCount;
	private String tileMapString;
	private String[][] tileMap;
	private int[][] stateMap;
	
	public Level() {
		this.xLength=64;
		this.yLength=96;
		this.platformCount=(int) Math.floor(Math.random() * 6);
		this.tileMapString= "";
		this.tileMap= new String[xLength][yLength];
		this.stateMap= new int[xLength][yLength];
	}

	public String getTileMapString() {
		return tileMapString;
	}
	
		
		
	public String randomize() {
		int platformRange=8, platformLevel=0;
		for(int y=0; y < yLength; y++) {
				if(y < 91 ) {
					if((y+2)%3 == 0) {
						if(platformLevel < 3) {
							tileMapString+= generatePlatforms(platformRange);
							platformLevel++;
						}else {
							tileMapString+= generatePlatforms(platformRange);
							platformLevel=0;
							platformRange+=8;
							
						}						
					} else {
						tileMapString+= fullSpace(0);
					}
				} else {
					tileMapString+= fullSpace(15);
				}
				
		}
		String[] parts = tileMapString.split(",");
		int counter=0,aux=0;
		for(int y=0; y < yLength; y++) {
			for(int x=0; x < xLength; x++) {
				tileMap[x][y]=parts[counter];
				aux=Integer.parseInt(tileMap[x][y]);
				if(aux>0 && aux<6) {
					aux=1;
				}else if(aux>15 && aux<21) {
					aux=2;
				}else if(aux>30 && aux<36) {
					aux=3;
				}else if(aux>45 && aux<51) {
					aux=4;
				}else if((aux>60 && aux<66) || aux==15) {
					aux=5;
				}
				stateMap[x][y]=aux;
				counter++;
			}
		}

		return tileMapString;
	}

	private String generatePlatforms(int range) {
		String spaceLine="";
		int x= 0, rndMargin, reservedSpace= xLength-range, padding= (int)Math.floor(Math.random() * reservedSpace), largura=0;
		while( x < padding) {
			spaceLine+= "0,";
			x++;
		}
		while( x < padding + range) {
			if((int)Math.floor(Math.random() * 2) == 1) {
				largura=(int)Math.floor(Math.random() * 2)+5;
				if((x + largura) < (padding + range)) {
					spaceLine+= spacePlatform(largura);
					x+=largura;
				}
			}else {
				rndMargin= (int)Math.floor(Math.random() * 5) + 1;
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

	private String spacePlatform(int largura) {
		String spaceLine= "";
		if(largura==5) {
			if(platformCount==0) {
				spaceLine+= "1,2,3,4,5,";
				platformCount++;
			}else if(platformCount==1) {
				spaceLine+= "16,17,18,19,20,";
				platformCount++;
			}else if(platformCount==2){
					spaceLine+= "61,62,63,64,65,";
					platformCount++;
			}else if(platformCount==3) {
				spaceLine+= "31,32,33,34,35,";
				platformCount++;
			}else if(platformCount==4) {
				spaceLine+= "46,47,48,49,50,";
				platformCount++;
			}else {
					spaceLine+= "61,62,63,64,65,";
				platformCount= 0;
			}
		}else if(largura==6) {
			if(platformCount==0) {
				spaceLine+= "1,2,3,3,4,5,";
				platformCount++;
			}else if(platformCount==1) {
				spaceLine+= "16,17,18,18,19,20,";
				platformCount++;
			}else if(platformCount==2){
					spaceLine+= "61,62,63,63,64,65,";
					platformCount++;
			}else if(platformCount==3) {
				spaceLine+= "31,32,33,33,34,35,";
				platformCount++;
			}else if(platformCount==4) {
				spaceLine+= "46,47,48,48,49,50,";
				platformCount++;
			}else {
					spaceLine+= "61,62,63,63,64,65,";
				platformCount= 0;
			}
		}
		return spaceLine;
	}

	public String[][] getTileMap() {
		return tileMap;
	}

	public int[][] getStateMap() {
		return stateMap;
	}		
}
