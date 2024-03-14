// import { useState } from "react"

const BarraContatos = ({data}) => {

  return (
    <>
      <img src="https://static.vecteezy.com/ti/vetor-gratis/p1/14300061-icone-de-glifo-de-perfil-de-homem-anonimo-foto-para-documentos-ilustracaoial-vetor.jpg" alt="Anonimo" />
      <span>
        <strong>{data.user ?? "Anonimo" }</strong>
        <p>{data.number}</p>
      </span>
    </>
  );
};

export default BarraContatos;
