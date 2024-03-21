import { useRef, useEffect } from "react";
import useStore from "../../store/Store";
import { useShallow } from 'zustand/react/shallow'

const AreaMessages = () => {
  const bottomRef = useRef();
  const [messages, socket, userSelect] = useStore(useShallow((state) => [state.messages, state.socket, state.userSelect]));

  useEffect(() => {
    if (messages && messages.length > 0) {
      scrollDown();
    }
  }, [messages]);

  const scrollDown = () => {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  };
  
  return (
    <>
      {
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
      }
   <div ref={bottomRef} />
    </>
  );
};

export default AreaMessages;
