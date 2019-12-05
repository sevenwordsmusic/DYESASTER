//CAMBIOS
function createUser(item, callback) {
	game.global.incPas=false;
    $.ajax({
        method: "POST",
        url: 'http://'+ip+':8080/api/createUser/' + nickname.value,
        data: JSON.stringify(password.value),
        processData: false,
        headers: {
            "Content-Type": "application/json"
        }
    }).done(function (item) {
        if(item.success){
        	console.log("Usuario inició sesión/cuenta de usuario creada con éxito.");
        }else{
        	game.global.incPas=true;
        }
        callback(item);
    }).fail(function(xhr, status, error) {
    	var errorMessage = 'Fallo ' + xhr.status + ' ' + xhr.statusText + '.';
    	console.log(errorMessage);
    	callback(item);
    })
}

function checkServer(item, callback) {
    $.ajax({
        method: "PUT",
        url: 'http://'+ip+':8080/api/checkServer/' + item.id,
        data: JSON.stringify(password.value),
        processData: false,
        headers: {
            "Content-Type": "application/json"
        }
    }).done(function (item) {
        callback(item);
    }).fail(function(xhr, status, error) {
    	callback(item);
    })
}

function serverStatus() {
	waitingS++;
	if(waitingS>14){
		waitingS=0;
		$.ajax({
	        method: "GET",
	        url: 'http://'+ip+':8080/api/serverStatus/' ,
	        processData: false,
	        headers: {
	            "Content-Type": "application/json"
	        }
	    }).done(function () {
	        game.global.serStatus=true;
	    }).fail(function() {
	    	 var errorMessage = 'Servidor Offline.';
	    	 console.log(errorMessage);
	    	 game.global.serStatus=false;
	    })
	}
    
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
        var errorMessage = 'Fallo ' + xhr.status + ' ' + xhr.statusText + '.';
    	console.log(errorMessage);
  })
}



function sessionStart(itemWithId){
	if(itemWithId.success){
		success= true;
		userId= itemWithId.id;
	}
}

function apiRestRoutine(){
	waitingLog++;
	if(waitingLog>14){
		waitingLog=0;
        var item = {
                id: userId,
                success: false
        }
       
        checkServer(item, function (itemWithId) {
        	serverState=itemWithId.success;
    		if(serverState){
    			getRooms();
    		}
        });
       serverStatus();
       return game.global.serStatus;
	}
	
}


var success= false;
var waitingLog = 14;
var waitingS=14;
var userId= -1;
var userNickname;
var playersAndRooms;
var serverState=true;

//FIN CAMBIOS