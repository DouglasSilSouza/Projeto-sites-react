import { create } from 'zustand';
const horaAtual = new Date().toLocaleString('pt-BR', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    omitZeroHour: true,
  });

const useStore = create((set) => {
    return {
        usersOnline: [],
        setUsersOnline: (newUser) => set((state) => ({ usersOnline: [...state.usersOnline.filter((user) => user.id !== newUser.id), newUser, ],})),

        removeUsersOnline: (id) => set((state) => ({ usersOnline: state.usersOnline.filter((setUsersOnline) => setUsersOnline.id!== id) })),

        userSelect: [],
        selectedUser: (user) => set((state) => ({userSelect: user})),

        horaAtual : horaAtual,

        socket: null,
        setSocket: (socket) => set((state) => ({ socket })),

        salas: {},
        setSalas: (salas) => set((state) => ({ salas: {...state.salas, ...salas } })),

        messages: [],
        setMessages: (data) => set((state) => {
            const updatedSalas = { ...state.salas };
          
            if (updatedSalas[data.idSala]) {
              updatedSalas[data.idSala].mensagens = [...updatedSalas[data.idSala].mensagens, {
                id: data.id,
                msg: data.msg,
                hour: data.hour,
                destinatary: data.destinatary
              }];
            } else {
              updatedSalas[data.idSala] = {
                id: data.idSala,
                mensagens: [{
                  id: data.id,
                  msg: data.msg,
                  hour: data.hour,
                  destinatary: data.destinatary
                }],
              };
            }
          
            return { salas: updatedSalas };
          }),
          
          

    }
});

export default useStore;
