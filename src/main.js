import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';

Vue.use(Vuex);

Vue.config.productionTip = false;

const store = new Vuex.Store({
  state: {
    computer: false,
    board: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""]
    ],
  },
  mutations: {
    reset (state) {
      state.board = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
      ];
    },
    set (state, payload) {
      state.board[payload.i][payload.j] = payload.val;
    },
    setComputer (state, newComputer) {
      state.computer = newComputer;
    }
  }
});

new Vue({
  render: h => h(App),
  store: store,
}).$mount('#app')
