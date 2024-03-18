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
    console.error('Error creating Redis client (setExistsChatUserAndOpen):', err);
  }
};

const setDataRoomAndUser = async (idRoom, dataUser) => {
  await client.set(idRoom, JSON.stringify({
    iduser: dataUser.iduser,
    username: dataUser.username,
    number: dataUser.number,
  }))
  .then((client) => {
        console.log('Redis Client:', client);
      })
      .catch((error) => {
        console.error('Error creating Redis client (setDataRoomAndUser):', error);
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
  return [`${dia}/${mes}/${ano}`, `${horas}:${minutos}`];
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

app.post("/webhook", async (req, res) => {
  try {
    const body = await req.body.entry[0].changes[0].value;
    const text = await body.messages[0].text.body;
    const wa_id = await body.contacts[0].wa_id;
    const username = await body.contacts[0].profile.name;
    const typeMsg = await body.messages[0].type;
    const hora = await body.messages[0].timestamp;

    // console.log(text)
    const resultRedis = JSON.parse(await client.get(wa_id));
    const dataHora = formatarDataHora(hora)

    if (resultRedis.is_valid) {
      await io.emit("receive_message", {
        id: wa_id,
        msg: text,
        hour: formatarHora(hora),
      });
      insertMessages(data.id, wa_id, text, dataHora[1], dataHora[0])
    } else {
      verificacionUser(+wa_id)
      .then(async (result) => {
        setExistsChatUserAndOpen(result)
        insertRoom(+wa_id, username, +wa_id, "open", null)
        .then((data) => {
          setDataRoomAndUser(data.id, data)
          insertMessages(data.id, wa_id, text, dataHora[1], dataHora[0])
          io.emit("connect_user", data);
        });
      });
    }
  } catch (e) {
    const body = req.body;
    // console.log(body);
  }

  res.send("Teste");
});

server.listen(3000, () => {
  console.log("listening on port 3000");
});
