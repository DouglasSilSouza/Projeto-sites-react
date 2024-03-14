import useStore from "../../store/Store"

const InfoContatcTop = () => {
  const userSelect = useStore((state) => state.userSelect)

  return (
    <div id="contact">
        {userSelect.user && <i className="ph ph-user"></i>}
        <span>
            <strong>{userSelect.user}</strong>
            <p>{userSelect.number}</p>
            <p>{userSelect.user ? "Online" : ""}</p>
        </span>
        <button type="button">Encerrar</button>
    </div>
  )
}

export default InfoContatcTop
