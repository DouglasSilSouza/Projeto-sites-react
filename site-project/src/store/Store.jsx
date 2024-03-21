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
        selectedUser: (user) => set(() => ({userSelect: user})),

        horaAtual : horaAtual,

        socket: null,
        setSocket: (socket) => set((state) => ({ socket })),

        salas: {},
        setSalas: (salas) => set((state) => ({ salas: {...state.salas, ...salas } })),

        messages: [],
        setMessages:(messages) => set((state) => ({messages: [...state.messages, messages]})),

    }
});

export default useStore;
