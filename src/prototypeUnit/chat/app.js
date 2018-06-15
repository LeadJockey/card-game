const express = require('express');
const app = express();
const server = require('http').Server(app); // express 3/4 에서 사용
const io = require('socket.io')(server);
const morgan = require('morgan');
const path = require('path');

const msgPool = [];

// set
app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
// app.use( express.static( path.join( __dirname, '..', '..' ) ) );
console.log(path.join(__dirname, '..', 'module'));
app.use('/js', express.static(path.join(__dirname, '..', '..', 'prototypeUnit')));

// server
server.listen(app.get('port'), () =>{console.log(`server listening on port ${app.get('port')}`);});

// socket
app.get('/', (req, res) =>{
  res.render('index',{msgPool:msgPool});
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('to-server-msg', function(msg){
    io.emit('to-client-msg', msg);
    msgPool.push(msg);
    console.log(`message: ${msg.name}${msg.msg}`);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});



