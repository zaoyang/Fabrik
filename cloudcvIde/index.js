var socketio = require('socket.io')
var app = require('express')();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});
var http = require('http').Server(app);
var io = socketio.listen(http, {log:false, origins:'*:*'});
console.log(__dirname)

var child;

io.on('connection', function(socket){
  socket.on('startTraining', function(id){
    console.log("start training");

    child = require('child_process').spawn(
     'python',
     [__dirname+'/trainLenet.py'
     ,id]
     );


    child.stdout.on('data', function(data) {
        console.log('STDOUT!!!!!');

    });
    child.stderr.on('data', function(data) {
        socket.emit('result',data.toString());

    });
    child.on('close', function(code) {
        console.log('closing code: ' + code);
        //Here you can get the exit code of the script
    });
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  console.log("a user connected");
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
