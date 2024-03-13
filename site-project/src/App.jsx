import { useState } from 'react'
import './App.css'
import Chat from './contents/chat/Chat'
import Join from './contents/join/Join'


function App() {

  const [chatVisibility, setChatVisibility] = useState(false)
  const [socket, setSocket] = useState(null)

  return (
    <>
      {chatVisibility ? <Chat socket={socket} /> : <Join setSocket={setSocket} setChatVisibility={setChatVisibility} />}
    </>
  )
}

export default App
