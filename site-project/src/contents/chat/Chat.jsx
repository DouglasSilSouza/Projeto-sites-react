import '../../assets/chat/chat.css'
import BarraContatos from './BarraContatos'
import AreaMessages from './AreaMessages'
import InfoContatcTop from './InfoContatcTop'
import { useEffect, useLayoutEffect, useRef } from 'react'
import useStore from '../../store/Store'
import { useShallow } from 'zustand/react/shallow'

const Chat = () => {

  const [
    horaAtual,
    socket,
    setMessages,
    setUsersOnline,
    userSelect,
  ] = useStore( useShallow ((state) =>[
    state.horaAtual,
    state.socket,
    state.setMessages,
    state.setUsersOnline,
    state.userSelect,
  ]));

  useEffect(() => {
    socket.on('receive_message', data => {
      console.log(data)
      setMessages({idroom: data.idroom, datamsg: { iduser: data.iduser, message: data.message, hour: data.hour}});
    });
  
    return () => socket.off('receive_message');
  }, [socket]);

  useEffect (() => {
    socket.on('connect_user', (usersOnline) => setUsersOnline(usersOnline));
    return () => socket.off('connect_user');
  }, [socket]);

  useLayoutEffect (() => {
    const handleLoad = async () => {
      try {
        await socket.emit('requestData'); 
        await socket.on('initialData', (rooms) => {
          setUsersOnline(JSON.parse(rooms));
        });
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    window.addEventListener('load', handleLoad());

    return () => {
      socket.off('initialData');
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  useEffect (() => {
    const handleLoad = async (idUser) => {
      try {
        await socket.emit('requestMessage', idUser); 
        await socket.on('initialDataMessage', (messages) => {
          messages.map((message) => {
            setMessages({idroom: message.idroom, datamsg: { iduser: message.idmessage, message: message.message, hour: message.hourmessage}});
          })
        });
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    if(userSelect.id !== undefined) handleLoad(userSelect.id);

    return () => {
      socket.off('initialDataMessage');
    };
  }, [userSelect]);

  const sendMessage = (e) => {
    e.preventDefault();
    const messageText = e.target.elements.message.value;
    setMessages({idroom: userSelect.id, datamsg: { iduser: socket.id, message: messageText, hour: horaAtual}})
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