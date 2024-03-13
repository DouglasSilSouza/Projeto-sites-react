
const InfoContatcTop = (data) => {
    const contact = data.data[0]

  return (
    <div id="contact">
        <img src={contact.image} alt="Mulher 1"></img>
        <span>
            <strong>{contact.title}</strong>
            <p>{contact.number}</p>
            <p>22:47</p>
        </span>
        <button type="button">Encerrar</button>
    </div>
  )
}

export default InfoContatcTop
