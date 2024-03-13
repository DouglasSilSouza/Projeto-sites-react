// import { useState } from "react"

const BarraContatos = (data) => {
  const contacts = data.data;

  return (
    <>
      <img src={contacts.image} alt={contacts.user} />
      <span>
        <strong>{contacts.title}</strong>
        <p>{contacts.number}</p>
      </span>
    </>
  );
};

export default BarraContatos;
