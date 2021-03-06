var callOptions={'iceServers': [
	{url: 'stun:95.xxx.xx.x9:3479',		
	username: "user",
	credential: "xxxxxxxxxx"},
	{ url: "turn:95.xxx.xx.x9:3478",		
	username: "user",
	credential: "xxxxxxxx"}]
}; 

peer = new Peer({
	config: callOptions
});

peer.on('open', function(peerID) {
	document.getElementById('myid').innerHTML=peerID;			
});

var peercall;

peer.on('call', function(call) {
	peercall=call;
	document.getElementById('callinfo').innerHTML="Входящий звонок <button onclick='callanswer()' >Принять</button><button onclick='callcancel()' >Отклонить</button>";
});

function callanswer() {
	navigator.mediaDevices.getUserMedia ({ audio: true, video: true }).then(function(mediaStream) {
	    var video = document.getElementById('myVideo');		    				  
	  	peercall.answer(mediaStream); // отвечаем на звонок и передаем свой медиапоток собеседнику
	  	//peercall.on ('close', onCallClose); //можно обработать закрытие-обрыв звонка
	  	video.srcObject = mediaStream; //помещаем собственный медиапоток в объект видео (чтоб видеть себя)
	  	document.getElementById('callinfo').innerHTML="Звонок начат... <button onclick='callclose()' >Завершить звонок</button>"; //информируем, что звонок начат, и выводим кнопку Завершить
	  	video.onloadedmetadata = function(e) {
			video.play(); //запускаем воспроизведение, когда объект загружен
	  	};
	  	setTimeout(function() {
	  		//входящий стрим помещаем в объект видео для отображения
			document.getElementById('remVideo').srcObject = peercall.remoteStream; 
			document.getElementById('remVideo').onloadedmetadata= function(e) {
				document.getElementById('remVideo').play();	// и запускаем воспроизведение когда объект загружен
			};
	  	},1500);			    
	}).catch(function(err) { console.log(err.name + ": " + err.message); });
}

function callToNode(peerId) {
  	navigator.mediaDevices.getUserMedia ({ audio: true, video: true }).then(function(mediaStream) {
		var video = document.getElementById('myVideo');				  
		peercall = peer.call(peerId,mediaStream); 
		peercall.on('stream', function (stream) { //нам ответили, получим стрим
			setTimeout(function() {
				document.getElementById('remVideo').srcObject = peercall.remoteStream;
			  	document.getElementById('remVideo').onloadedmetadata= function(e) {
					document.getElementById('remVideo').play();
			  	};
			},1500);	
		});
		//  peercall.on('close', onCallClose);				  
		video.srcObject = mediaStream;
		video.onloadedmetadata = function(e) {
			video.play();
		};
	}).catch(function(err) { console.log(err.name + ": " + err.message); });
}

function callclose() {
	// peercall.on('close', onCallClose);
	console.log(1);
}