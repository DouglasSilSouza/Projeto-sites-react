 
const app = require('express')()
const server = require('http').createServer(app);
const io = require('socket.io')(server,{cors: {origin: 'http://localhost:5173'}} );
// const cors = require('cors');

// app.use(app.json());



io.on('connection', (socket) => {
  console.log('Usuário conectado!', socket.id);

  socket.on('disconnect', reason => {
    console.log('Usuário desconectado!', socket.id)
  })

  socket.on('set_username', username => {
    socket.data.username = username
  })

  socket.on('message', text => {
    io.emit('receive_message', {
      msg: text,
      authorId: socket.id,
      destinatary: true,
      hour: "23H49",
      user: none,
    })
  })

});

// app.post('/webhook', async (req, res) => {
//   const body = req.body;
//   console.log(body);
//   // const text = body.entry[0].changes[0].value.messages[0].text.body
//   // const typeMsg = body.entry[0].changes[0].value.messages[0].type
  
//   res.send(body)
// });

// app.get('/webhook', async (req, res) => {

//   res.send();
// });

server.listen(3000, () => console.log('listening on port 3000'));
