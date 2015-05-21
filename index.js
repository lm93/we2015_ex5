
var express = require('express');
var app = express();
var http = require('http').Server(app);
// optional?
var io = require('socket.io')(http);
var sequence = 0; 


app.use(express.static('public'));

var n_remotes = 0;

function printStatus () {
    console.log(n_remotes + ' remotes connected.');
}

app.get('/', function(req, res){
    res.sendfile('index.html'); // <<-- sendfile MUST BE LOWER-CASE!!!
    //res.sendFile(__dirname + '/index.html');
});

/*
function refreshScreens() {
    sequence++;
    socket.broadcast.emit('clear screen', sequence);
    socket.broadcast.emit('resend to screen',sequence);
}
*/


io.on('connection', function(socket){
    console.log('(connect)');
    
    //SCREEN
    socket.on('screen connect', function(name){
        console.log(name + ' connected');
        io.emit('screen connect', name);
        socket.on('disconnect', function(){
            console.log(name + ' disconnected');
            io.emit('screen disconnect', name);
            //socket.$broadcast
            socket.broadcast.emit('are you there', name);
        });
    });
    
    //REMOTE
    socket.on('remote connect', function(msg){
        console.log('message: ' + msg);
        //todo send all screens
        //forall screens as name socket.emit('screen connect', name);
        io.emit('if youre a screen and you know it, clap your hands');
        
        n_remotes++;
        printStatus();
        
        socket.on('select', function(msg){
            console.log('select '+msg);
            io.emit('select '+msg[0], [msg[1],msg[2]]);
        });
        socket.on('disconnect', function(){
            console.log('remote disconnected');
            //refreshScreens();
            sequence++;
            socket.broadcast.emit('clear screen', sequence);
            socket.broadcast.emit('resend to screen',sequence);
            
            n_remotes--;
            printStatus();
        });
        
        socket.on('refresh screens', function() {
            //refreshScreens();
            console.log('refresh');
            sequence++;
            socket.broadcast.emit('clear screen', sequence);
            //socket.broadcast.emit('resend to screen',sequence);
            //bug here: didn't refresh self!
            io.emit('resend to screen',sequence);
        });
    });
    
    
    //Select image
    socket.on('disconnect', function(){
        console.log('(disconnect)');
    });
});


http.listen(8080, function(){
    console.log('listening on *:8080');
});

/*
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile('test.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
*/