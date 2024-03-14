import useStore from "../../store/Store";
import { useShallow } from 'zustand/react/shallow'


const BarraContatos = () => {
  const [
    usersOnline,
    selectedUser,
    userSelect,
    setSalas,
    socket,
  ] = useStore(useShallow ((state) => [
    state.usersOnline,
    state.selectedUser,
    state.userSelect,
    state.setSalas,
    state.socket,
  ]))

  const selecUser = (contact) => {
    selectedUser(contact)
    setSalas({id:`dest_${contact.id}_rem${socket.id}`})
  }

  return (
    <>
      <ul>
        {usersOnline.map((contact) => {
          return (
            <li key={contact.id} onClick={() => selecUser(contact)} className={contact.id === userSelect.id ? "select" : ""}>
              <i className="ph ph-user"></i>
              <span>
                <strong>{contact.user ?? "Anonimo"}</strong>
                <p>{contact.number}</p>
              </span>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default BarraContatos;
