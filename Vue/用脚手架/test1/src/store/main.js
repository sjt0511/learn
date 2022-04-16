export default {
    namespaced: true,
    state: {
        name: 'main',
        num: 0
    },
    getters: {
    },
    mutations: {
        ADD (state, value) {
            state.num += value
        }
    },
    actions: {}
}