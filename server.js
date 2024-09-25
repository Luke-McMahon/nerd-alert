const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

let ownerSocketId = null;

io.on('connection', (socket) => {
	console.log(`User connected: ${socket.id}`);

	socket.on('identify', (role) => {
		if (role === 'owner') {
			ownerSocketId = socket.id;
			console.log(`Owner ID'd: ${ownerSocketId}`);
		}
	});

	socket.on('play sound', (soundFile) => {
		const allowedSounds = ['this-guy-stinks', 'homer-simpson-nerd', 'regular-yawn', 'quit-boring-everyone'];
		if (allowedSounds.includes(soundFile)) {
			if (ownerSocketId) {
				console.log(`Play sound requested by ${socket.id}: ${soundFile}`);
				io.to(ownerSocketId).emit('play sound', soundFile);
			}
		} else {
			console.log(`Invalid sound file requested: ${soundFile}`);
		}
	});

	socket.on('disconnect', () => {
		console.log(`User disconnected: ${socket.id}`);
		if (socket.id === ownerSocketId) {
			ownerSocketId = null;
			console.log('Owner disconnected.');
		}
	});
});

http.listen(3000, () => {
	console.log('Server is running on port 3000');
});
