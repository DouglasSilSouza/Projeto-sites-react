import { useRef, useLayoutEffect  } from "react";
import useStore from "../../store/Store";

const AreaMessages = ({mensagens}) => {
  if (!mensagens || mensagens.length === 0) return;
  const [userSelect, webSocket] = useStore((state) => [state.userSelect, state.webSocket]);

  const bottomRef = useRef()

  useLayoutEffect (()=>{
    scrollDown()
  }, [mensagens])

  const scrollDown = () => {
    bottomRef.current.scrollIntoView({behavior: 'smooth'})
  }

  return (
    <>
    {
      mensagens.map((message, i) => {
        if (userSelect.id === message.id) {
          return (
            <div key={i} className={`message ${message.id !== webSocket.id ? "" : "you"}`}>
              <p>{message.hour}</p>
              <div className="message-body">{message.msg}</div>
            </div>
          )
        }
      })
    }
    <div ref={bottomRef} />
    </>
  )
}

export default AreaMessages;
