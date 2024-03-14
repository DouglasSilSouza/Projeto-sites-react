import '../../assets/chat/chat.css'
import BarraContatos from './BarraContatos'
import AreaMessages from './AreaMessages'
import InfoContatcTop from './InfoContatcTop'
import { useState, useEffect } from 'react'
import useStore from '../../store/Store'
import { useShallow } from 'zustand/react/shallow'

const Chat = () => {
  const [selectedUserID, setSelectedUserID] = useState();
  const [messages, setMessages] = useState([]);

  const [lista, selectedUser, horaAtual, webSocket] = useStore( useShallow ((state) =>[ state.lista, state.selectedUser, state.horaAtual, state.webSocket ]));

  const selectUsers = (user) => {
    setSelectedUserID(user.id);
    selectedUser(user)
  };

  useEffect(() => {
    webSocket.on('receive_message', data => {
      console.log(data);
      setMessages([...messages, data]);
    });
  
    return () => webSocket.off('receive_message');
  }, [messages]);
  

  const sendMessage = (e) => {
    e.preventDefault();
    const messageText = e.target.elements.message.value;
    setMessages((prevMessages) => [...prevMessages, { id: webSocket.id, msg: messageText, hour: horaAtual }]);
    webSocket.emit('message', messageText)
    e.target.elements.message.value = '';
  };

  return (
    <>
      <main id="container">
        <nav id="contacts">
          <ul>
            {lista.map((contact) => {
              if(contact.id === webSocket.id) return;
              return (
                <li
                  key={contact.id}
                  onClick={() => selectUsers(contact)}
                  className={contact.id === selectedUserID ? "select" : ""}
                >
                  <BarraContatos data={contact} />
                </li>
              );
            })}
          </ul>
        </nav>

        <section id="content">
          <InfoContatcTop />
          <div id="message-content">
            <AreaMessages mensagens={messages} />
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