import { useState } from 'react'
import './App.css'
import Chat from './contents/chat/Chat'
import Join from './contents/join/Join'


function App() {

  const [chatVisibility, setChatVisibility] = useState(false)
  return (
    <>
      {chatVisibility ? <Chat /> : <Join setChatVisibility={setChatVisibility} />}
    </>
  )
}

export default App
