import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { pluginMessage, pluginErrorMessage } from "./utils/message.plugin";
import { auth } from "./firebase/firebaseInit";
import { onAuthStateChanged } from "firebase/auth";
import store from "./store";
import Loader from "./components/app/Loader.vue";
import {useI18n} from 'vue-i18n'
import { i18n } from "./i18n";

let app;


onAuthStateChanged(auth, () => {
  if (!app) {
    let app = createApp(App, {
      setup() {
        const {t} = useI18n()
        return {t}
      }
    });
    app
      .use(router)
      .use(pluginMessage)
      .use(pluginErrorMessage)
      .use(store)
      .use(i18n)
      .component("Loader", Loader)
      .mount("#app");
  }
});
