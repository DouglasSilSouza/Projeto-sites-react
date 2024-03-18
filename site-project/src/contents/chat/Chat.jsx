import '../../assets/chat/chat.css'
import BarraContatos from './BarraContatos'
import AreaMessages from './AreaMessages'
import InfoContatcTop from './InfoContatcTop'
import { useEffect } from 'react'
import useStore from '../../store/Store'
import { useShallow } from 'zustand/react/shallow'

const Chat = () => {

  const [
    horaAtual,
    socket,
    setMessages
  ] = useStore( useShallow ((state) =>[
    state.horaAtual,
    state.socket,
    state.setMessages,
  ]));

  useEffect(() => {
    socket.on('receive_message', data => {
      setMessages({idSala: { id: data.id, msg: data.msg, hour: data.hour, destinatary: true}});
    });
  
    return () => socket.off('receive_message');
  }, [socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    const messageText = e.target.elements.message.value;
    setMessages({ id: socket.id, msg: messageText, hour: horaAtual, destinatary: false})
    socket.emit('message', messageText)
    e.target.elements.message.value = '';
  };

  return (
    <>
      <main id="container">
        <nav id="contacts">
            <BarraContatos />
        </nav>
        <section id="content">
          <InfoContatcTop />
          <div id="message-content">
            <AreaMessages />
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