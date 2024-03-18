import useStore from "../../store/Store"

const InfoContatcTop = () => {
  const [userSelect, socket] = useStore((state) => [state.userSelect, state.socket])

  const close_service = () => {
    socket.emit('close_service', userSelect.id)
  };

  return (
    <div id="contact">
        {userSelect.user && <i classNameName="ph ph-user"></i>}
        <span>
            <strong>{userSelect.user}</strong>
            <p>{userSelect.number}</p>
            <p>{userSelect.user ? "Online" : ""}</p>
        </span>
        <button type="button" onClick={close_service()}>Encerrar</button>
    </div>
  )
}

export default InfoContatcTop
