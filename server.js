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

	socket.on('play sound', () => {
		if (ownerSocketId) {
			io.to(ownerSocketId).emit('play sound');
			console.log(`Sond play requested by ${socket.id}`);
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
