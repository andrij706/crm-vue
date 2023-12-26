import { auth, db } from "../firebase/firebaseInit";
import { ref, push, get, child } from "firebase/database";

export default {
  actions: {
    async createRecord({ dispatch, commit }, record) {
      try {
        const userID = auth.currentUser.uid;
        const recordsRef = ref(db, `/users/${userID}/records`);
        return await push(recordsRef, record);
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async fetchRecords({ dispatch, commit }) {
      try {
        const userID = auth.currentUser.uid;
        const recordsRef = ref(db, `/users/${userID}/records`);
        const snapshot = await get(recordsRef);
        const records = snapshot.val() || {};
        const parseRecords = Object.keys(records).map((key) => ({
          ...records[key],
          id: key,
        }));
        return parseRecords;
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async fetchRecordById({ dispatch, commit }, id) {
      try {
        const userID = auth.currentUser.uid;
        const recordRef = ref(db, `/users/${userID}/records`);
        const childRef = child(recordRef, `${id}`)
        const snapshot = await get(childRef);
        const record = snapshot.val() || {};
        return {...record, id}
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
  },
};
