function createUser(nickname) {
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
		success= false;
  })
  return success;
}

function checkServer() {
	var key= userId;
    $.ajax({
        method: 'PUT',
        url: 'http://'+ip+':8080/api/checkServer/' + key,
        processData: false,
        headers: {
            "Content-Type": "application/json"
        }
    }).done(function(returnedKey) {
        if(returnedKey!=-1){
        	userId= returnedKey;
        	success= true;
        }else{
    		success= false;
        }
    }).fail(function(xhr, status, error) {
        var errorMessage = xhr.status + ': ' + xhr.statusText;
		success= false;
  })
  return success;
}

function getRooms() {
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
	var serverState=checkServer();
	if(Date.now() > lastUpdateRest){
		if(serverState){
			getRooms();
			lastUpdateRest= Date.now() + rate;
		}else{
			lastUpdateRest= Date.now() + inactiveRate;
		}	
	}
	return serverState;
}

var rate= 100;
var inactiveRate= 1000;
var lastUpdateRest= Date.now() + rate;
var userId= -1;
var success= false;
var playersAndRooms;