import { create } from 'zustand';
const horaAtual = new Date().toLocaleString('pt-BR', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
    omitZeroHour: true,
  });

const useStore = create((set) => {
    return {
        lista: [],
        adicionarObjeto: (objeto) => set((state) => ({ lista: [...state.lista, objeto] })),

        removerObjeto: (id) => set((state) => ({ lista: state.lista.filter((objeto) => objeto.id!== id) })),

        userSelect: [],
        selectedUser: (user) => set((state) => ({userSelect: user})),

        horaAtual : horaAtual,

        webSocket : [],
        addSocket : (socket) => set((state)=> ({webSocket: socket}))
    }
});

export default useStore;
