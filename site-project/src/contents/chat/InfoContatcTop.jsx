import useStore from "../../store/Store"

const InfoContatcTop = () => {
  const userSelect = useStore((state) => state.userSelect)

  return (
    <div id="contact">

      {userSelect.user ? <img src="https://static.vecteezy.com/ti/vetor-gratis/p1/14300061-icone-de-glifo-de-perfil-de-homem-anonimo-foto-para-documentos-ilustracaoial-vetor.jpg" alt="Anonimo" /> : ""}
        
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
