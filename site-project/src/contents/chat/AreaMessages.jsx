import { useRef, useEffect } from "react";
import useStore from "../../store/Store";
import { useShallow } from 'zustand/react/shallow'

const AreaMessages = () => {
  const bottomRef = useRef();
  const [
    messages,
    socket,
    userSelect,
    setMessages,
    setUsersOnline,
  ] = useStore(useShallow((state) => [
    state.messages,
    state.socket,
    state.userSelect,
    state.setMessages,
    state.setUsersOnline,
  ]));

  useEffect(() => {
    if (messages && messages.length > 0) {
      scrollDown();
    }
  }, [messages]);

  const scrollDown = () => {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const div_css = {
    margin: "auto",
    backgroundColor: "#004052",
    padding: "1.5rem",
    width: "fit-content",
    borderRadius: "1.5rem",
  }

  const p_css = {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#DDD"
  }

  return (
    <>
      {
      userSelect.id ?
        messages && messages.length > 0 && (
            messages.map((message, i) => {
              if (!message) return;
              if (userSelect.id !== message.datamsg.id) {
                return ( messages ? 
                  <div key={i} className={`message ${message.datamsg.iduser !== socket.id ? "" : "you"}`}>
                  <p>{message.datamsg.hour}</p>
                  <div className="message-body">{message.datamsg.message}</div>
                </div> : <div>Carregando...</div>
                )
              }
            })
            )
      : <div style={div_css}><p style={p_css}>Selecione alguma conversa</p></div> 
      }
   <div ref={bottomRef} />
    </>
  );
};

export default AreaMessages;
