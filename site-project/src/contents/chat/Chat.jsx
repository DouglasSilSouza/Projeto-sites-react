import '../../assets/chat/chat.css'
import BarraContatos from './BarraContatos'
import AreaMessages from './AreaMessages'
import InfoContatcTop from './InfoContatcTop'
import { useState, useEffect } from 'react'

const contatos = [
  {
    id: 1,
    user: "rapaz",
    image: "https://igd-wp-uploads-pluginaws.s3.amazonaws.com/wp-content/uploads/2016/05/30105213/Qual-e%CC%81-o-Perfil-do-Empreendedor.jpg",
    title: "Nome do Rapaz",
    number: "+55 11 91234-5678"
  },
  {
    id: 2,
    user: "moça",
    image: "https://i.pinimg.com/564x/4f/73/3b/4f733b83724e86f43c759de191f7e9fc.jpg",
    title: "Nome da moça",
    number: "+55 11 98765-4321"
  },
]

const Chat = ({ socket }) => {
  const [selectedUserIndex, setSelectedUserIndex] = useState(1);

  const selectUsers = (i) => {
    setSelectedUserIndex(i);
  };

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const sendMessageEffect = async () => {
      try {
        await socket.emit('sendMessage', messages);

      } catch (error) {
        console.error('Erro ao enviar a mensagem:', error);
      }
    };

    sendMessageEffect();
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    const messageText = e.target.elements.message.value;
    setMessages((prevMessages) => [...prevMessages, { user: selectedUserIndex, destinatary: false, msg: messageText, hour: "23H49" }]);
    e.target.elements.message.value = '';
  };

  useEffect(() => {
    socket.on('receive_message', data => {
      console.log(data)
      setMessages((prevMessages) => [...prevMessages, data])
    })

    return () => socket.off('receive_message')
  }, [socket])

  return (
    <>
      <main id="container">
        <nav id="contacts">
          <ul>
            {contatos.map((contact) => {
              const isSelected = contact.id === selectedUserIndex;
              return (
                <li
                  key={contact.id}
                  onClick={() => selectUsers(contact.id)}
                  className={isSelected ? "select" : ""}
                >
                  <BarraContatos data={contact} />
                </li>
              );
            })}
          </ul>
        </nav>

        <section id="content">
          <InfoContatcTop data={contatos.filter((contact) => contact.id === selectedUserIndex)} />
          <div id="message-content">
            <AreaMessages mensagens={messages} user={selectedUserIndex} />
          </div>
          <div id="area-input">
            <form id="form" onSubmit={(e) => sendMessage(e)}>
              <input type="text" name="message" placeholder="Digite sua mensagem" />
              <button type="submit"><i className="ph ph-paper-plane-right"></i></button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
};


export default Chat;