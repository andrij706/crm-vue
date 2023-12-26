import { createStore } from "vuex";
import appAuth from "./appAuth";
import appInfo from "./appInfo";
import appCategory from "./appCategory";
import appRecord from "./appRecord";

const store = createStore({
  state: {
    error: null,
  },
  mutations: {
    setError(state, error) {
      state.error = error;
    },
    clearError(state) {
      state.error = null;
    },
  },
  actions: {
    async fetchCurrency() {
      const key = import.meta.env.VITE_APP_FIXER;
      const res = await fetch(
        `http://data.fixer.io/api/latest?access_key=${key}&symbols=USD,EUR,UAH`,
      );
      return await res.json();
    },
  },
  getters: {
    error: (s) => s.error,
  },
  modules: {
    appAuth,
    appInfo,
    appCategory,
    appRecord,
  },
});

export default store;
