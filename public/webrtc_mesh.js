/**
 * original source: https://github.com/nakkag/webrtc_mesh
 * Copyright (c) 2022 nakka
 * license under mit license
 */

let localVideo;
let roomId;
const socket = io();
let peers = new Map();


const peerConnectionConfig = {
	iceServers: [
		// GoogleのパブリックSTUNサーバーを指定しているが自前のSTUNサーバーがあれば変更する
		{urls: 'stun:stun.l.google.com:19302'},
		{urls: 'stun:stun1.l.google.com:19302'},
		{urls: 'stun:stun2.l.google.com:19302'},
		// TURNサーバーがあれば指定する
		//{urls: 'turn:turn_server', username:'', credential:''}
	]
};


socket.on("connect", () => {
	localVideo = document.getElementById('localVideo');
	while (!roomId) {
		roomId = window.prompt('Room ID', '');
	}
	startVideo();
})

function startVideo() {
	if (navigator.mediaDevices.getUserMedia) {
		if (window.stream) {
			// 既存のストリームを破棄
			try {
				window.stream.getTracks().forEach(track => {
					track.stop();
				});
			} catch(error) {
				console.error(error);
			}
			window.stream = null;
		}
		// カメラとマイクの開始
		const constraints = {
			audio: true,
			video: true
		};
		navigator.mediaDevices.getUserMedia(constraints).then(stream => {
			window.stream = stream;
			localVideo.srcObject = stream;
			startServerConnection();
		}).catch(e => {
			alert('Camera start error.\n\n' + e.name + ': ' + e.message);
		});
	} else {
		alert('Your browser does not support getUserMedia API');
	}
}

function startServerConnection() {
	socket.on("joinRoom",(response)=>{
		console.log("joinRoom",response)
		if (response.code !== 200) return;
		for (const user of response.users){
			startPeerConnection(user, 'offer')
		}
	})
	socket.emit("joinRoom",{roomId})

	socket.on("connecting",(response)=>{
		console.log("connecting",response)
		startPeerConnection(response.userId, 'answer');
	})

	socket.on("leave",(response) => {
		const pc = peers.get(response.userId);
		pc._stopPeerConnection();
	})

	const onMessage = (response)=>{
		console.log("onMessage",response)
		const pc = peers.get(response.src);
		if (!pc) {
			return;
		}
		// 以降はWebRTCのシグナリング処理
		if (response.sdp) {
			// SDP受信
			if (response.sdp.type === 'offer') {
				pc.setRemoteDescription(response.sdp).then(() => {
					// Answerの作成
					pc.createAnswer().then(pc._setDescription).catch(errorHandler);
				}).catch(errorHandler);
			} else if (response.sdp.type === 'answer') {
				pc.setRemoteDescription(response.sdp).catch(errorHandler);
			}
		}
		if (response.ice) {
			// ICE受信
			if (pc.remoteDescription) {
				pc.addIceCandidate(new RTCIceCandidate(response.ice)).catch(errorHandler);
			} else {
				// SDPが未処理のためキューに貯める
				pc._queue.push(response);
				return;
			}
		}
		if (pc._queue.length > 0 && pc.remoteDescription) {
			onMessage(pc._queue.shift())
		}
	}
	socket.on("message",onMessage)

}

function startPeerConnection(id, sdpType) {
	console.log("startPeerConnection",id,sdpType)
	if (peers.has(id)) {
		peers.get(id)._stopPeerConnection();
	}
	let pc = new RTCPeerConnection(peerConnectionConfig);
	// VIDEOタグの追加
	document.getElementById('remote').insertAdjacentHTML('beforeend', '<video id="' + id + '" playsinline autoplay></video>');
	pc._remoteVideo = document.getElementById(id);
	pc._queue = new Array();
	pc._setDescription = function(description) {
		if (pc) {
			pc.setLocalDescription(description).then(() => {
				console.log({sdp: pc.localDescription, src: socket.id})
				// SDP送信
				socket.emit("message",{
					type: "private",
					dest: id,
					data: {sdp: pc.localDescription, src: socket.id}
				})
			}).catch(errorHandler);
		}
	}
	pc.onicecandidate = function(event) {
		if (event.candidate) {
			// ICE送信
			console.log({ice: event.candidate, src: socket.id})
			socket.emit("message",{
				type: "private",
				dest: id,
				data: {ice: event.candidate, src: socket.id}
			})
		}
	};
	if (window.stream) {
		// Local側のストリームを設定
		window.stream.getTracks().forEach(track => pc.addTrack(track, window.stream));
	}
	pc.ontrack = function(event) {
		if (pc) {
			// Remote側のストリームを設定
			if (event.streams && event.streams[0]) {
				pc._remoteVideo.srcObject = event.streams[0];
			} else {
				pc._remoteVideo.srcObject = new MediaStream(event.track);
			}
		}
	};
	pc._stopPeerConnection = function() {
		if (!pc) {
			return;
		}
		if (pc._remoteVideo && pc._remoteVideo.srcObject) {
			try {
				pc._remoteVideo.srcObject.getTracks().forEach(track => {
					track.stop();
				});
			} catch(error) {
				console.error(error);
			}
			pc._remoteVideo.srcObject = null;
		}
		if (pc._remoteVideo) {
			// VIDEOタグの削除
			pc._remoteVideo.remove();
		}
		pc.close();
		pc = null;
		peers.delete(id);
	};
	peers.set(id, pc);
	if (sdpType === 'offer') {
		// Offerの作成
		pc.createOffer().then(pc._setDescription).catch(errorHandler);
	}
}

function errorHandler(error) {
	alert('Signaling error.\n\n' + error.name + ': ' + error.message);
}
