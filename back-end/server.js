 
const app = require('express')()
const server = require('http').createServer(app);
const io = require('socket.io')(server,{cors: {origin: 'http://localhost:5173'}} );
// const cors = require('cors');

// app.use(app.json());

const horaAtual = new Date().toLocaleString('pt-BR', {
  hour: 'numeric',
  minute: 'numeric',
  hour12: false,
  omitZeroHour: true,
});

io.on('connection', (socket) => {
  console.log('Usuário conectado!', socket.id);

  socket.on('disconnect', reason => {
    console.log('Usuário desconectado!', socket.id);
    
    io.emit('desconnect_user', socket.id);
  });

  socket.on('set_username', (username) => {
    socket.data.username = username;
    const user = {
      id: socket.id,
      user: username,
      number: "+55 1191234-5678"
    };
    io.emit('connect_user', user);
  });

  socket.on('message', text => {
    console.log(text)
    io.emit('receive_message', {
      id: socket.id,
      msg: text,
      hour: horaAtual
    })
    
  })

  // socket.emit('receive_message', {
  //   text,
  //   authorId: socket.id,

  //   user: socket.data.username,
  // })

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

server.listen(3000, () => {
  console.log('listening on port 3000');
});
