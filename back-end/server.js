const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {cors: {origin: "http://localhost:5173", methods: ["GET", "POST"], "Access-Control-Allow-Origin": "http://localhost:5173",},});
const axios = require('axios');
const redis = require('redis');

const [
  insertRoom,
  verificacionUser,
  close_service,
  open_service,
  insertMessages,
] = require('./conDB/actionsDataBase')

app.use(express.json());
const client = redis.createClient();

client.on('connect', () => {
  console.log('Connected to Redis');
});

client.on('error', (err) => {
    console.error('Redis Client Error:', err);
});
client.connect();

// client.flushAll();
const setExistsChatUserAndOpen = async (result) => {
  try {
    await client.set(result.iduser, JSON.stringify(result));
  } catch (err) {
    console.error('Erro para inserir a verificação da sala:', err);
  }
};

const setDataRoomAndUser = async (idRoom, dataUser) => {
  await client.set(idRoom.toString(), JSON.stringify(dataUser))
  .then((client) => {
    console.log('Inserido os dados da Sala e Usuario:', client);
  })
  .catch((error) => {
    console.error('Erro ao inserir os dados da Sala e do Usuario:', error);
  });
  // await client.disconnect();
}

function formatarDataHora(timestamp) {
  // Convertendo o timestamp para milissegundos
  const milissegundos = timestamp * 1000;

  // Criando um Date com o timestamp em milissegundos
  const data = new Date(milissegundos);

  // Obtendo as horas, minutos, segundos, dia, mês e ano
  const horas = data.getHours().toString().padStart(2, "0");
  const minutos = data.getMinutes().toString().padStart(2, "0");
  const segundos = data.getSeconds().toString().padStart(2, "0");
  const dia = data.getDate().toString().padStart(2, "0");
  const mes = (data.getMonth() + 1).toString().padStart(2, "0"); // Mês começa em 0
  const ano = data.getFullYear();

  // Retornando a data e hora formatada
  return [`${ano}-${mes}-${dia}`, `${horas}:${minutos}`];
}

const sendMessage = async (message) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.TOKEN_WHATSAPP}`
    };

    const data = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: "5511953869941",
      type: "text",
      text: {
        preview_url: false,
        body: message,
      },
    };

    const response = await axios.post("https://graph.facebook.com/v18.0/103394759172111/messages", data, { headers });

    console.log(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

io.on("connection", (socket) => {
  console.log("Usuário conectado!", socket.id);

  socket.on("disconnect", (reason) => {
    console.log("Usuário desconectado!", socket.id);

    io.emit("desconnect_user", socket.id);
  });

  socket.on("close_service", (idUser) => {
    close_service(idUser)
  });

  socket.on("open_service", (idAgent, idUser) => {
    open_service(idAgent, idUser)
  });

  socket.on("set_username", (username) => {
    socket.data.username = username;
    const user = {
      id: socket.id,
      user: username,
      number: "+55 1191234-5678",
    };
    io.emit("connect_user", user);
  });

  socket.on("message", (text) => {
    sendMessage(text);
  });

});

const receiveMessage = (wa_id ,message, hora) => {
  console.log("Mensagem enviada ao front-end!")
  io.emit("receive_message", {
    id: wa_id,
    msg: message,
    hour: hora
  });
};

app.post("/webhook", async (req, res) => {
  const body = await req.body.entry[0].changes[0].value;
  const text = await body.messages[0].text.body;
  const wa_id = await body.contacts[0].wa_id;
  const username = await body.contacts[0].profile.name;
  const typeMsg = await body.messages[0].type;
  const hora = await body.messages[0].timestamp;

  try {
    // console.log(text);
    const resultRedis = JSON.parse(await client.get(wa_id));
    const dataHora = formatarDataHora(hora)

    if (resultRedis && resultRedis.is_valid) {
      if (resultRedis.is_valid) {
        receiveMessage(wa_id, text, dataHora[1])
        insertMessages(resultRedis.id, wa_id, text, dataHora[1], dataHora[0])
      }
    } else {
      verificacionUser(+wa_id)
      .then(async (result) => {
        if (result.length > 0) {
          setExistsChatUserAndOpen(result[0])
        } else {
          insertRoom(+wa_id, username, +wa_id, "open", null)
          .then(async (data) => {
            console.log("Inserindo dados da sala e usuario...")
            console.log("Enviando mensagen ao front-end...")
            console.log(data)
            io.emit("connect_user", data);
            setDataRoomAndUser(data.id, data)
            insertMessages(data.id, wa_id, text, dataHora[1], dataHora[0])
            receiveMessage(wa_id, text, dataHora[1])
          });
        }
      });
    }

  } catch (e) {
    console.log(e);
    console.log(body);
  }

  res.sendStatus(200);
});

server.listen(3000, () => {
  console.log("listening on port 3000");
});
