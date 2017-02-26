var express = require('express');
var app     = express();
var port = process.env.PORT || 3000;
var server  = app.listen(port);
var io      = require('socket.io').listen(server);

app.use( express.static( __dirname + '/client' )); // client klasörünü gönderecek

app.use(function(req, res, next) { //  Bu method, gelecek olan HTTP isteklerinin neleri kabul edip etmeyeceğini tanımlamamıza yarıyor. Bu aynı zamanda NodeJS için middleware anlamına gelir
  	res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();  // bir sonraki middleware a geçiş yapmak için 
}); 


app.get('/',function(req,res){
	console.log("Someone entered main page");
	res.sendFile(  __dirname +'/client/client.html');
});


io.on('connection', function (socket) {
	console.log("Someone opened socket.io connection successfully");
  
  socket.emit('news', { hello: 'world' });
  
  socket.on('sendMessage',function (data) {
  	console.log("gelen mesaj = " + data.message);
    io.sockets.emit('cipherMessage',{name: data.name,message: data.message })
  });
});

