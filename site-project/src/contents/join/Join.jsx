import React, {useRef, useEffect} from 'react'
import io from 'socket.io-client'
import style from '../../assets/join/Join.module.css'
import {Input, Button} from '@mui/material'
import useStore from '../../store/Store'

export default function Join({setChatVisibility}) {

  const usernameRef = useRef()
  const socketRef = useRef(null);
  const [objeto, webSocket, addSocket] = useStore((state) => [state.adicionarObjeto, state.webSocket, state.addSocket])

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io.connect('http://localhost:3000');
      addSocket(socketRef.current)
      socketRef.current.on('connect_user', (usersOnline) => objeto(usersOnline));
    }
  }, []);
  
  const handleSubmit = () => {
    const username = usernameRef.current.value 
    setChatVisibility(true)
    webSocket.emit('set_username', username)
  }

  return (
    <div className={style['join-container']}>
      <h2>Chat em tempo real</h2>
      <Input inputRef={usernameRef} placeholder='Nome de usuário' />
      <Button sx={{mt:2}} onClick={()=>handleSubmit()} variant="contained">Entrar</Button>
    </div>
  )
}