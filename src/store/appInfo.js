import { auth, db } from "../firebase/firebaseInit";
import { ref, get, update } from "firebase/database";

export default {
  state: {
    info: {},
  },
  mutations: {
    setInfo(state, info) {
      state.info = info;
    },
    clearInfo(state) {
      state.info = {};
    },
  },
  actions: {
    async fetchInfo({ dispatch, commit }) {
      try {
        const user = auth.currentUser;
        if (user) {
          const userID = user.uid;
          const snapshot = await get(ref(db, `/users/${userID}/info`));
          const info = snapshot.exists() ? snapshot.val() : null;
          commit("setInfo", info);
        }
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async updateInfo({ dispatch, commit, getters }, toUpdate) {
      try {
        const userID = auth.currentUser.uid;
        const recordsRef = ref(db, `/users/${userID}/info`);
        const newData = { ...getters.info, ...toUpdate };
        await update(recordsRef, newData);
        commit("setInfo", newData);
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
  },
  getters: {
    info: s => s.info,
  },
};
