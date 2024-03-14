const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    "Access-Control-Allow-Origin": "http://localhost:5173",
  },
});
const axios = require('axios');

app.use(express.json());

const horaAtual = new Date().toLocaleString("pt-BR", {
  hour: "numeric",
  minute: "numeric",
  hour12: false,
  omitZeroHour: true,
});

function formatarHora(timestamp) {
  // Convertendo o timestamp para milissegundos
  const milissegundos = timestamp * 1000;

  // Criando um setUsersOnline Date com o timestamp em milissegundos
  const data = new Date(milissegundos);

  // Obtendo as horas e minutos
  const horas = data.getHours().toString().padStart(2, "0");
  const minutos = data.getMinutes().toString().padStart(2, "0");

  // Retornando a hora formatada
  return `${horas}:${minutos}`;
}

const socketConnections = new Map();

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
  socketConnections.set(socket.id, socket);

  socket.on("disconnect", (reason) => {
    console.log("Usuário desconectado!", socket.id);
    socketConnections.delete(socket.id);

    io.emit("desconnect_user", socket.id);
  });

  io.on("set_username", (username) => {
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
    const body = req.body.entry[0].changes[0].value;
    const text = body.messages[0].text.body;
    const wa_id = body.contacts[0].wa_id;
    const username = body.contacts[0].profile.name;
    const typeMsg = body.messages[0].type;
    const hora = body.messages[0].timestamp;

    const user = {
      id: wa_id,
      user: username,
      number: wa_id,
    };

    io.emit("connect_user", user);

    await io.emit("receive_message", {
      id: wa_id,
      msg: text,
      hour: formatarHora(hora),
    });
  } catch (e) {
    const body = req.body;

  }

  res.send("Teste");
});

server.listen(3000, () => {
  console.log("listening on port 3000");
});
