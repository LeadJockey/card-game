const express = require('express');
const app = express();
const server = require('http').Server(app); // express 3/4 에서 사용
const io = require('socket.io')(server);
const morgan = require('morgan');
const path = require('path');

const msgContainer = [];
function getBeforeMsg(){
  let str = ``;
  msgContainer.forEach((msg)=>{
    str+=`<li><span class="txt_msg">${msg}</span></li>`;
  });
  return str;
}

// set
app.set('port', 3000);

// // middleware
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
  res.sendFile(__dirname + '/index.html');
    /* .replace(
       `<ul class="list_chat"><li><span class="txt_msg">글을 입력해 주세요</span></li></ul>`
       ,
       `<ul class="list_chat"><li><span class="txt_msg">글을 입력해 주세요</span></li>${getBeforeMsg()}</ul>`
     )*/
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('to-server-msg', function(msg){
    io.emit('to-client-msg', msg);
    msgContainer.push(msg);
    console.log('message: ' + msg);
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});



