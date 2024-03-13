import { useRef } from "react";

const AreaMessages = async ({mensagens, user}) => {
  if (!mensagens.trim() && !mensagens) return;

  const bottomRef = useRef()

  useEffect(()=>{
    scrollDown()
  }, [mensagens])

  const scrollDown = () => {
    bottomRef.current.scrollIntoView({behavior: 'smooth'})
  }

  return (
    <>
    {
      mensagens.map((message, i) => {
        if(message.user === user) {
          return (
            <div key={i} className={`message ${message.destinatary? "" : "you"}`}>
              <p>{message.hour}</p>
              <div className="message-body">{message.msg}</div>
            </div>
          )
        }
      })
    }
    </>
  )
}

export default AreaMessages;