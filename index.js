var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var Traceroute = require('nodejs-traceroute');
var fs = require('fs');

app.use(express.static('public'));

app.get('/trace', function(req, res) {
	console.log('TRACE')
	res.sendFile(__dirname + '/public/trace.html');
});

app.get('*', function(req, res) {
	console.log('here')
	res.sendFile(__dirname + '/public/search.html');
});

io.on('connection', function(socket) {
	console.log('connection');
	let url = socket.handshake.query.url
	console.log('url', url)

	try {
    	const tracer = new Traceroute();
	    tracer
	        .on('pid', (pid) => {
	            console.log(`pid: ${pid}`);
	        })
	        .on('error', (error) => {
	            console.log(`error: ${error}`);
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
	 
	    tracer.trace(url);
	} catch (ex) {
	    console.log(ex);
	}
});

// http.listen(3000, function() {
// 	console.log('listening on *:3000');
// });

const PORT = process.env.PORT || 3000;
const host = '0.0.0.0';

http.listen(PORT, host, () => {
    console.log(`Our app is running on port ${ PORT }`);
});

process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}`
  );
});