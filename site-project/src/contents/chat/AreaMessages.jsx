import { useRef, useEffect } from "react";
import useStore from "../../store/Store";
import { useShallow } from 'zustand/react/shallow'

const AreaMessages = () => {
  const bottomRef = useRef();
  const [messages, socket] = useStore(useShallow((state) => [state.messages, state.socket]));

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
      {messages && messages.length > 0 && (
        messages.map((message, i) => (
          <div
            key={i}
            className={`message ${message.id !== socket.id ? "" : "you"}`}
          >
            <p>{message.hour}</p>
            <div className="message-body">{message.msg}</div>
          </div>
        ))
      )}
      <div ref={bottomRef} />
    </>
  );
};

export default AreaMessages;
