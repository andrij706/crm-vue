import { auth, db } from "../firebase/firebaseInit";
import { ref, push, get, child, update } from "firebase/database";

export default {
  actions: {
    async createCategory({ commit }, { title, limit }) {
      try {
        const userID = auth.currentUser.uid;
        const recordsRef = ref(db, `/users/${userID}/categories`);
        const category = await push(recordsRef, { title, limit });
        return { title, limit, id: category.key };
      } catch (e) {
        commit("setError");
        throw e;
      }
    },
    async fetchCategories({ commit, dispatch }) {
      try {
        const userID = auth.currentUser.uid;
        const recordsRef = ref(db, `/users/${userID}/categories`);
        const snapshot = await get(recordsRef);
        const categories = snapshot.val() || {};

        return Object.keys(categories).map((key) => ({
          ...categories[key],
          id: key,
        }));
      } catch (error) {
        commit("setError", error);
        throw error;
      }
    },
    async updateCategory({ commit, dispatch }, { id, title, limit }) {
      try {
        const userID = auth.currentUser.uid;
        const recordsRef = ref(db, `/users/${userID}/categories`);
        const childRef = child(recordsRef, `${id}`);
        await update(childRef, { title, limit });
      } catch (e) {
        commit("setError");
        throw e;
      }
    },
    async fetchCategoryById({ commit, dispatch }, id) {
      try {
        const userID = auth.currentUser.uid;
        const recordRef = ref(db, `/users/${userID}/categories`);
        const childRef = child(recordRef, `${id}`)
        const snapshot = await get(childRef);
        const category = snapshot.val() || {};

        return {...category, id}
      } catch (error) {
        commit("setError", error);
        throw error;
      }
    },
  },
};
