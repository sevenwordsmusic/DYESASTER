function createUser(nickname) {	//CREA UN NUEVO USUARIO
    $.ajax({
        method: 'POST',
        url: 'http://'+ip+':8080/api/createUser/' + nickname,
        processData: false,
        headers: {
            "Content-Type": "application/json"
        }
    }).done(function(returnedKey) {
        if(returnedKey!=-1){
        	userId= returnedKey;
        	success= true;
        }
    }).fail(function(xhr, status, error) {
        var errorMessage = xhr.status + ': ' + xhr.statusText;
  })
  return success;
}

function checkServer() {	//COMPRUEBA QUE EL SERVIDOR ESTÁ ACTIVO Y MANTIENE CONECTADO AL USUARIO
	var key= userId;
    $.ajax({
        method: 'PUT',
        url: 'http://'+ip+':8080/api/checkServer/' + key,
        processData: false,
        headers: {
            "Content-Type": "application/json"
        }
    }).done(function(returnedKey) {
        userId= returnedKey;
    	success= true;
    }).fail(function(xhr, status, error) {
        var errorMessage = xhr.status + ': ' + xhr.statusText;
		success= false;
  })
  return success;
}

function getRooms() {	//COMPRUEBA QUE EL SERVIDOR ESTÁ ACTIVO Y MANTIENE CONECTADO AL USUARIO
    $.ajax({
        method: 'GET',
        url: 'http://'+ip+':8080/api/getRooms/',
        processData: false,
        headers: {
            "Content-Type": "application/json"
        }
    }).done(function(rooms) {
    	playersAndRooms= rooms;
    }).fail(function(xhr, status, error) {
        var errorMessage = xhr.status + ': ' + xhr.statusText;
  })
}


function apiRestRoutine(){
	if(Date.now() > lastUpdateRest){
		if(checkServer()){	//EL SERVIDOR ESTÁ ACTIVO:
			getRooms();
			lastUpdateRest= Date.now() + rate;
		}else{	//EL SERVIDOR ESTÁ INACTIVO:
			lastUpdateRest= Date.now() + inactiveRate;
		}	
	}
}

var rate= 50;
var inactiveRate= 200;
var lastUpdateRest= Date.now() + rate;
var userId= -1;
var success= false;
var playersAndRooms;