// include the http module
/*
var http = require('http');

// create a webserver
http.createServer(function (req, res) {

    // respond to any incoming http request
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');

}).listen(1337, '127.0.0.1');
*/

var express = require('express'),
    http = require('http'),
    app = express(),
	router = express.Router(),
    server = http.createServer(app),
    sio = require('socket.io').listen(server),
    port = 8080,
    game_sockets = {},
    controller_sockets = {};

server.listen(port);
	// Serve static files under the /public directory
	
app.use('/', express.static(__dirname + '/'));
app.set('views', __dirname + '/views');

var game_socket, controller_socket;

sio.sockets.on('connection', function (socket) {
	
	console.log("got socket: " + socket.id);
	socket.on('game_connected', function (socketid) {
		console.log("game socket id: " + socketid);
		game_socket = socket;
	});
	socket.on('controller_connected', function (socketid) {
		console.log("controller_connected socket id: " + socketid);
		controller_socket = socket;
		
		controller_socket.on('controller_update', function(x,z,length)
		{
			//console.log('controller_socket', x, z, length);
			if(game_socket)
			{
				game_socket.emit('update_controller_state', x, z, length);
			}
		});
	});
	socket.emit('server_connected');
});



// Set up index
app.get('/', function (req, res) {

	if (req.headers['user-agent'].match(/\bmob/i)) 
	{
		res.sendFile(__dirname + '/unity/mobile_index.html');
	}
	else
	{
		res.sendFile(__dirname + '/unity/index.html');
	}
  

});

console.log("Server running on port: " + port);


