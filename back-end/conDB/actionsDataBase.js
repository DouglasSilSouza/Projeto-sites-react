const sql = require("./conDataBase");

const insertRoom = async (idUser, userName, number, statusRoom, agent) => {
    try {
      const result = await sql`
        INSERT INTO room (iduser, username, number, statusroom, agent)
        VALUES (${idUser}, ${userName}, ${number}, ${statusRoom}, ${agent})
        RETURNING *; `;
      console.log(`Registro inserido com sucesso: ${result[0]}`);
      return result[0];
    } catch (error) {
      console.error("Erro ao inserir dados:", error);
    }
  };
  
const insertMessages = async (idRoom, idMessage, message, hourMessage, date) => {
    try {
        const result = await sql`INSERT INTO messages (idroom, idmessage, message, hourmessage, date)
            VALUES (${idRoom}, ${idMessage}, ${message}, ${hourMessage}, ${date})
            RETURNING *;`;
        console.log(`Mensagem inserido com sucesso: ${result}`);
    } catch (error) {
    console.error("Erro ao inserir as mensagens:", error);
  }
}

const verificacionUser = async (idUser) => {
    try {
        const result = await sql`SELECT
        CASE WHEN iduser = ${idUser} AND statusroom = 'open' THEN true
          ELSE false
        END AS is_valid, iduser, id
      FROM room
      WHERE iduser = ${idUser} AND statusroom = 'open'
      `;
      console.log(`Realizando pesquisa de sala...`);
        return result;

    } catch (error) {
        console.error("Erro ao verificar o usuario:", error);
      }
};

const close_service = async (idUser) => {
    const close = await sql`UPDATE room SET statusroom = 'close' WHERE iduser = ${idUser};`
    return close;
};

const open_service = async (idAgent, idUser) => {
    const open = await sql`UPDATE room SET agent = '${idAgent}' WHERE iduser = ${idUser};`
    return open;
};

module.exports = [
    insertRoom,
    verificacionUser,
    close_service,
    open_service,
    insertMessages
];
