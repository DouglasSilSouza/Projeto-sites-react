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

  const open_service = (socketID, contactID) => {
    socket.emit(socketID, contactID)
  }

  return (
    <>
      <ul>
        { 
          socket.id === usersOnline.id ||
          usersOnline.map((contact) => {
            console.log(contact)
            return (
              <li key={contact.id} onClick={() => selectedUser(contact)} classNameName={contact.id === userSelect.id ? "select" : ""}>
                <i classNameName="ph ph-user"></i>
                <span>
                  <strong>{contact.user ?? "Anonimo"}</strong>
                  <p>{contact.number}</p>
                </span>
                <button type="button" onClick={open_service(socket.id, contact.id)}><i className="ph ph-check"></i></button>
              </li>
            );
          })
        }
      </ul>
    </>
  );
};

export default BarraContatos;
