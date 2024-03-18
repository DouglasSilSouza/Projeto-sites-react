import React, { useRef, useEffect, useMemo } from 'react'
import io from 'socket.io-client'
import style from '../../assets/join/Join.module.css'
import { Input, Button } from '@mui/material'
import useStore from '../../store/Store'
import { useShallow } from 'zustand/react/shallow'

export default function Join({ setChatVisibility }) {
    const usernameRef = useRef()
    const socketRef = useRef()
    const [setUsersOnline, socket, setSocket] = useStore(useShallow((state) => [state.setUsersOnline, state.socket, state.setSocket]))

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io.connect('https://bird-live-ewe.ngrok-free.app');
            setSocket(socketRef.current)
            socketRef.current.on('connect_user', (usersOnline) => setUsersOnline(usersOnline));
        }
    }, [socketRef.current]);

    
    const handleSubmit = () => {
      const username = usernameRef.current.value
      setChatVisibility(true)
      socket.emit('set_username', username)
    }
    const memoizedHandleSubmit = useMemo(() => handleSubmit, [handleSubmit]);

    return (
        <div className={style['join-container']}>
            <h2>Chat em tempo real</h2>
            <Input inputRef={usernameRef} placeholder='Nome de usuário' />
            <Button sx={{ mt: 2 }} onClick={() => memoizedHandleSubmit()} variant="contained">Entrar</Button>
        </div>
    )
}
