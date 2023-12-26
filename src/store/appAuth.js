import { auth, db } from "../firebase/firebaseInit";
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { ref, set } from "firebase/database";

const actions = {
  async login({ dispatch, commit }, { email, password }) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      commit("setError", e);
      throw e;
    }
  },
  async register({ dispatch, commit }, { email, password, username }) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const userId = userCredential.user.uid;
      const recordRef = ref(db, `/users/${userId}/info`);
      await set(recordRef, {
        bill: 10000,
        username,
      });
    } catch (e) {
      commit("setError", e);
      throw e;
    }
  },
  async logout({ commit }) {
    try {
      await signOut(auth);
      commit("clearInfo");
    } catch (e) {}
  },
};

export default { actions };
