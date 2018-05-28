const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const uuid4 = require('uuid/v4');

io.on('connection', (client) =>{
  client.on('event', (data) =>{});
  client.on('disconnect', () =>{});
});

app.get('/:msg', (req,res)=>{

  res.json({
    _id:uuid4(),
    msg:req.params.msg
  });

});

app.set('port', 3000);
app.listen(app.get('port'), () =>{console.log(`server listening on port ${app.get('port')}`);});

