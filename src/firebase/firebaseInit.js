import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD9JZEQsu61KyhOt2ksb24kFmF73WPLS0c",
  authDomain: "crm-vue-1991d.firebaseapp.com",
  projectId: "crm-vue-1991d",
  storageBucket: "crm-vue-1991d.appspot.com",
  messagingSenderId: "65336388081",
  appId: "1:65336388081:web:858b56704e2779a11dfc50",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { app, auth, db };
