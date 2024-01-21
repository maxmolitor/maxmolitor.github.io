var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

const socketIo = require('socket.io');
 
class EpochalServer {
  constructor(port) {
    this._port = port;
  }
 
  start() {
    this._initializeSocketIo();
 
    console.log('Server is up and running');
  }
 
  _initializeSocketIo() {
    this._io = socketIo(this._port);
 
    this._io.on('connection', socket => {
      console.log('connection')

      socket.emit('welcome','sup?')

      socket.on('update', update => socket.broadcast.emit('update', update));

      socket.on('update', console.log);

    });
  }
}
 
const server = new EpochalServer(8081);
server.start();