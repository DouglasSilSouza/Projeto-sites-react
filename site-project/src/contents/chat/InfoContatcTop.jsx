import useStore from "../../store/Store"


const InfoContatcTop = () => {
  const [userSelect, socket] = useStore((state) => [state.userSelect, state.socket])

  const close_service = (selectedUser) => {
    socket.emit('close_service', selectedUser.id)
  };
  const open_service = (socketID, selectedUser) => {
    socket.emit(socketID, selectedUser)
  }

  return (
    <div id="contact">
      {userSelect.id &&
      <>
        <i className="ph ph-user"></i>
        <span>
            <strong>{userSelect.username}</strong>
            <p>{userSelect.number}</p>
            <p>{userSelect.id ? "Online" : ""}</p>
        </span>
        <button type="button" onClick={userSelect.statusroom === "open" ? open_service(socket.id, userSelect.id) : close_service(userSelect)}>
          {userSelect.statusroom === "open" ? <p>Abrir Atendimento</p> : <p>Encerrar Atendimento</p>}
        </button>
      </>
      }
    </div>
  )
}

export default InfoContatcTop
