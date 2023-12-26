import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { pluginMessage, pluginErrorMessage } from "./utils/message.plugin";
import { auth } from "./firebase/firebaseInit";
import { onAuthStateChanged } from "firebase/auth";
import store from "./store";
import Loader from "./components/app/Loader.vue";

let app;

onAuthStateChanged(auth, () => {
  if (!app) {
    let app = createApp(App);
    app
      .use(router)
      .use(pluginMessage)
      .use(pluginErrorMessage)
      .use(store)
      .component("Loader", Loader)
      .mount("#app");
  }
});
