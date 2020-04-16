var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var Traceroute = require('nodejs-traceroute');

app.use(express.static('public'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + 'public/index.html');
});

io.on('connection', function(socket) {
	console.log('connection');

	try {
    	const tracer = new Traceroute();
	    tracer
	        .on('pid', (pid) => {
	            console.log(`pid: ${pid}`);
	        })
	        .on('destination', (destination) => {
	            console.log(`destination: ${destination}`);
	        })
	        .on('hop', (hop) => {
	            console.log(`hop: ${JSON.stringify(hop)}`);
	            io.emit('hop', hop);
	        })
	        .on('close', (code) => {
	            console.log(`close: code ${code}`);
	        });
	 
	    tracer.trace('art.yale.edu');
	} catch (ex) {
	    console.log(ex);
	}

});

http.listen(3000, function() {
	console.log('listening on *:3000');
});