import useStore from "../../store/Store";
import { useShallow } from 'zustand/react/shallow'

const BarraContatos = () => {
  const [
    usersOnline,
    selectedUser,
    userSelect,
    socket,
  ] = useStore(useShallow ((state) => [
    state.usersOnline,
    state.selectedUser,
    state.userSelect,
    state.socket,
  ]))

  return (
    <ul>
      {
        usersOnline.map((contact) => {
          if (socket.id !== contact.id || usersOnline.statusroom === "open") {
            return (
              <li key={contact.id} onClick={() => selectedUser(contact)} className={contact.id === userSelect.id ? "select" : ""}>
                <i className="ph ph-user"></i>
                <span>
                  <strong>{contact.username ?? "Anonimo"}</strong>
                  <p>{contact.number}</p>
                </span>
              </li>
            );
          }
        })
      }
    </ul>
  );
};

export default BarraContatos;
